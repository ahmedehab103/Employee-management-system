using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Domain;
using Hangfire.Dashboard;
using EmployeeManagement.Infrastructure.Identity.Models;

namespace API.Filters
{
    public class HangfireDashboardAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context) => context.GetHttpContext()?.User.Roles<Role>(AppClaims.Roles).HasAny(Role.Admin) ?? false;
    }
}
