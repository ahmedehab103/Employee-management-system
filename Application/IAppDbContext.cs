using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application
{
    public interface IAppDbContext
    {
        DbSet<User> Users { get; }
        DbSet<Session> Sessions { get; }
        DbSet<UserRole> UserRoles { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);

        void TriggerDomainEventHandlers(params DomainEvent[] domainEvents);

        Task BeginTransactionAsync();

        Task CommitTransactionAsync();

        void RollbackTransaction();

        void VRemove(AuditableEntity entity);
    }
}
