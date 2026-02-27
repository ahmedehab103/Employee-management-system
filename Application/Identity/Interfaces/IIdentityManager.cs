using System;
using EmployeeManagement.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagement.Application.Identity.Interfaces
{
    public interface IIdentityManager
    {
        public SignInManager<User> SignInManager { get; }
        public UserManager<User> UserManager { get; }
        public RoleManager<IdentityRole<Guid>> RoleManager { get; }
        public ITokenGeneratorService TokenGenerator { get; }
        public ITokenValidatorService TokenValidator { get; }
    }
}
