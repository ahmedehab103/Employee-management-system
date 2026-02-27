using System.Security.Claims;
using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Domain;
using EmployeeManagement.Infrastructure.Identity.Models;
using static System.Enum;

namespace API.Services
{
    /// <summary>
    /// </summary>
    /// <param name="httpContextAccessor"></param>
    public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
    {
        private ClaimsPrincipal User => httpContextAccessor.HttpContext?.User;

        public IList<Role> Roles => User.Roles<Role>(AppClaims.Roles) ?? new List<Role>();

        public Role Role
            => IsAuthenticated ? (Role) Parse(typeof(Role), StringRole) : throw new UnauthorizedAccessException();

        private string StringRole => User?.FindFirstValue(AppClaims.Roles);

        public string Id => User?.FindFirstValue(AppClaims.Id);
        public string UserName => User?.FindFirstValue(AppClaims.UserName);
        public string Email => User?.FindFirstValue(AppClaims.Email);
        public bool IsAuthenticated => Id is not null;
        public bool IsAdmin => Roles.HasAny(Role.Admin);

        /// <summary>
        /// Get all ids of companies that user have
        /// </summary>
        public List<Guid> CompaniesIds => User.CompaniesIds(AppClaims.UserCompanies).ToList();
    }
}
