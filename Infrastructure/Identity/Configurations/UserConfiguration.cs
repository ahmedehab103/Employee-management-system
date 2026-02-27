using EmployeeManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static EmployeeManagement.Application.Common.Constants;
using EmployeeManagement.Infrastructure.Persistence;

namespace EmployeeManagement.Infrastructure.Identity.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> entity)
        {

            entity.Ignore(c => c.DomainEvents);

            entity.Property(u => u.Id).HasMaxLength(IdMaxLength);
            entity.Property(u => u.UserName).HasMaxLength(MaxUserName);
            entity.Property(u => u.NormalizedUserName).HasMaxLength(MaxUserName);
            entity.Property(u => u.PhoneNumber).HasMaxLength(MaxPhoneNumber);

            entity.Property(u => u.CreatedAt).HasColumnType(Database.DateTimeOffset);

            entity.HasIndex(c => c.PhoneNumber).IsUnique();

            entity.HasIndex(c => c.Email);

            entity.OwnsOne(c => c.Name, b => b.ToJson());

            entity.OwnsMany(c => c.Companies,
                builder =>
                {
                    builder.ToJson();

                    builder.OwnsLocalizedString(c => c.Name);
                });

            entity.HasOne<Session>()
                .WithOne()
                .HasForeignKey<Session>(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
