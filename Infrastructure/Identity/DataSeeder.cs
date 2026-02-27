using System;
using System.Linq;
using System.Threading.Tasks;
using EmployeeManagement.Domain;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using EmployeeManagement.Domain.ValueObjects;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EmployeeManagement.Infrastructure.Identity
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var sp            = scope.ServiceProvider;
            var userManager   = sp.GetRequiredService<UserManager<User>>();
            var roleManager   = sp.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var configuration = sp.GetRequiredService<IConfiguration>();
            var logger        = sp.GetRequiredService<ILoggerFactory>().CreateLogger(nameof(DataSeeder));

            // Ensure all roles exist
            foreach (var roleName in Enum.GetNames<Role>())
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                    await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }

            // Seed default admin user
            var email    = configuration["DefaultAdmin:Email"]    ?? "admin@system.com";
            var password = configuration["DefaultAdmin:Password"] ?? "Admin@12345";

            if (await userManager.FindByEmailAsync(email) is not null)
                return;

            var admin = new User
            {
                Email          = email,
                UserName       = email,
                EmailConfirmed = true,
                Role           = Role.Admin,
                Status         = AccountStatus.Live,
                CreatedAt      = DateTimeOffset.UtcNow,
                Name           = (FullName)("Admin", "User"),
            };

            var result = await userManager.CreateAsync(admin, password);

            if (!result.Succeeded)
            {
                logger.LogError("Failed to seed default admin user: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
                return;
            }

            await userManager.AddToRoleAsync(admin, Role.Admin.ToString());

            logger.LogInformation("Default admin user seeded: {Email}", email);
        }
    }
}
