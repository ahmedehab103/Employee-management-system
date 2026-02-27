using System.Security.Claims;
using EmployeeManagement.Application;
using EmployeeManagement.Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Http;

namespace EmployeeManagement.Infrastructure.Identity
{
    public class ApplicationUserService(IHttpContextAccessor httpContextAccessor) : IApplicationUserService
    {
        private ClaimsPrincipal User => httpContextAccessor.HttpContext?.User;
        public string Id => User?.FindFirstValue(AppClaims.Id);
        public string UserName => User?.FindFirstValue(AppClaims.UserName);
        public string Email => User?.FindFirstValue(AppClaims.Email);
    }
}
