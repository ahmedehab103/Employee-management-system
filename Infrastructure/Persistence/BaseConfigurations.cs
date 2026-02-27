using EmployeeManagement.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static EmployeeManagement.Application.Common.Constants;

namespace EmployeeManagement.Infrastructure.Persistence
{
    public class AuditableEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : AuditableEntity
    {
        public virtual void Configure(EntityTypeBuilder<T> entity)
        {
            entity.Property(e => e.Created).HasColumnType(Database.DateTimeOffset);
            entity.Property(e => e.CreatedBy).HasMaxLength(IdMaxLength);

            entity.Property(e => e.LastModified).HasColumnType(Database.DateTimeOffset);
            entity.Property(e => e.LastModifiedBy).HasMaxLength(IdMaxLength);

            entity.Property(e => e.DeletedAt).HasColumnType(Database.DateTimeOffset);
            entity.Property(e => e.DeletedBy).HasMaxLength(IdMaxLength);
        }
    }

    public class DomainDrivenAuditableEntityConfiguration<T> : IEntityTypeConfiguration<T>
        where T : AuditableEntity, IHasDomainEvent
    {
        public virtual void Configure(EntityTypeBuilder<T> entity)
        {
            entity.Ignore(e => e.DomainEvents);

            entity.Property(e => e.Created).HasColumnType(Database.DateTimeOffset);
            entity.Property(e => e.CreatedBy).HasMaxLength(IdMaxLength);

            entity.Property(e => e.LastModified).HasColumnType(Database.DateTimeOffset);
            entity.Property(e => e.LastModifiedBy).HasMaxLength(IdMaxLength);

            entity.Property(e => e.DeletedAt).HasColumnType(Database.DateTimeOffset);
            entity.Property(e => e.DeletedBy).HasMaxLength(IdMaxLength);
        }
    }
}
