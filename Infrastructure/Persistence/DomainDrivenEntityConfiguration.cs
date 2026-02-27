using EmployeeManagement.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeManagement.Infrastructure.Persistence
{
    public class DomainDrivenEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : class, IHasDomainEvent
    {
        public virtual void Configure(EntityTypeBuilder<T> entity) => entity.Ignore(e => e.DomainEvents);
    }
}
