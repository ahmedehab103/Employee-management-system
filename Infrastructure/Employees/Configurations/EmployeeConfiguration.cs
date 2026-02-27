using EmployeeManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static EmployeeManagement.Infrastructure.Persistence.Database;

namespace EmployeeManagement.Infrastructure.Employees.Configurations
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> entity)
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(150);

            entity.HasIndex(e => e.Email).IsUnique();

            entity.Property(e => e.Phone)
                .HasMaxLength(20);

            entity.Property(e => e.HireDate)
                .HasColumnType(Date);

            entity.Property(e => e.Salary)
                .HasPrecision(18, 2);

            entity.Property(e => e.Department)
                .HasConversion<int>();

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            entity.HasQueryFilter(e => !e.IsDeleted);
        }
    }
}
