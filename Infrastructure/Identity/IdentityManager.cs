using System;
using EmployeeManagement.Application.Identity.Interfaces;
using EmployeeManagement.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagement.Infrastructure.Identity
{
    public class IdentityManager(
        SignInManager<User> singInManager,
        UserManager<User> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        ITokenGeneratorService tokenGenerator,
        ITokenValidatorService tokenValidator)
        : IIdentityManager
    {
        public SignInManager<User> SignInManager { get; } = singInManager;
        public UserManager<User> UserManager { get; } = userManager;
        public RoleManager<IdentityRole<Guid>> RoleManager { get; } = roleManager;
        public ITokenGeneratorService TokenGenerator { get; } = tokenGenerator;
        public ITokenValidatorService TokenValidator { get; } = tokenValidator;
    }
}
