using EmployeeManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static EmployeeManagement.Application.Common.Constants;
using EmployeeManagement.Infrastructure.Persistence;

namespace EmployeeManagement.Infrastructure.Identity.Configurations
{
    public class SessionConfiguration : IEntityTypeConfiguration<Session>
    {
        public void Configure(EntityTypeBuilder<Session> entity)
        {
            entity.HasKey(s => s.UserId);

            entity.Property(s => s.Token).HasMaxLength(UriMaxLength);
            entity.Property(s => s.MacAddress).HasMaxLength(MacMaxLength);

            entity.Property(s => s.LastLogin).HasColumnType(Database.DateTimeOffset);
        }
    }
}
