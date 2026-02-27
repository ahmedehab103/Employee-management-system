using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application;
using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Models;
using EmployeeManagement.Infrastructure.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

namespace EmployeeManagement.Infrastructure
{
    public class AppDbContext(
        DbContextOptions<AppDbContext> options,
        IHttpContextAccessor httpContextAccessor,
        IApplicationUserService currentUserService,
        IDateTime dateTime,
        ILogger<AppDbContext> logger)
        : IdentityDbContext<User, IdentityRole<Guid>, Guid, IdentityUserClaim<Guid>, UserRole, IdentityUserLogin<Guid>,
                IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>(options),
            IAppDbContext
    {
        private IDbContextTransaction ContextTransaction { get; set; }

        public DbSet<Session> Sessions => Set<Session>();

        public DbSet<Employee> Employees => Set<Employee>();

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedBy = currentUserService.Id;
                        entry.Entity.Created = dateTime.Now;
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastModifiedBy = currentUserService.Id;
                        entry.Entity.LastModified = dateTime.Now;
                        break;

                    case EntityState.Detached:
                    case EntityState.Unchanged:
                    case EntityState.Deleted:
                        break;

                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            var result = await base.SaveChangesAsync(cancellationToken);

            TriggerDomainEventHandlers();

            return result;
        }

        public void TriggerDomainEventHandlers(params DomainEvent[] domainEvents)
        {
            try
            {
                var events = ChangeTracker
                    .Entries<IHasDomainEvent>()
                    .Select(e => e.Entity.DomainEvents)
                    .SelectMany(e => e)
                    .Where(domainEvent => !domainEvent.IsPublished)
                    .ToList();

                if (domainEvents.Any())
                {
                    events.AddRange(domainEvents);
                }

                if (httpContextAccessor.HttpContext is { } ctx)
                {
                    if (ctx.Items.TryGetValue(DomainEventMiddleware.DomainEventsKey, out var value) &&
                        value is List<DomainEvent> exDomainEvents)
                        events.AddRange(exDomainEvents);

                    ctx.Items[DomainEventMiddleware.DomainEventsKey] = events;
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to collect domain events");
            }
        }

        public async Task BeginTransactionAsync()
        {
            if (ContextTransaction is not null)
            {
                return;
            }

            ContextTransaction = await base.Database
                .BeginTransactionAsync(IsolationLevel.ReadCommitted)
                .ConfigureAwait(false);
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await SaveChangesAsync().ConfigureAwait(false);

                var task = ContextTransaction?.CommitAsync();

                if (task is not null)
                {
                    await task;
                }
            }
            catch
            {
                RollbackTransaction();
                throw;
            }
            finally
            {
                if (ContextTransaction is not null)
                {
                    ContextTransaction.Dispose();
                    ContextTransaction = null;
                }
            }
        }

        public void RollbackTransaction()
        {
            try
            {
                ContextTransaction?.Rollback();
            }
            finally
            {
                if (ContextTransaction is not null)
                {
                    ContextTransaction.Dispose();
                    ContextTransaction = null;
                }
            }
        }

        public void VRemove(AuditableEntity entity)
        {
            entity.Deleted = true;
            entity.DeletedBy = currentUserService.Id;
            entity.DeletedAt = dateTime.Now;
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var entityTypes = builder.Model.GetEntityTypes()
                .Where(c => typeof(AuditableEntity).IsAssignableFrom(c.ClrType)).ToList();

            foreach (var type in entityTypes)
            {
                var parameter = Expression.Parameter(type.ClrType);

                var deletedCheck =
                    Expression.Lambda(Expression.Equal(Expression.Property(parameter, nameof(AuditableEntity.Deleted)),
                            Expression.Constant(false)),
                        parameter);

                type.SetQueryFilter(deletedCheck);
            }

            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            builder.ApplySeedsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
