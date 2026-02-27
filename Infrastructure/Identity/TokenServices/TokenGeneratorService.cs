using System;
using System.Threading.Tasks;
using EmployeeManagement.Application.Identity.Interfaces;
using EmployeeManagement.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagement.Infrastructure.Identity.TokenServices
{
    public class TokenGeneratorService(UserManager<User> userManager) : ITokenGeneratorService
    {
        public Task<string> GenerateEmailConfirmationTokenAsync(User user) =>
            userManager.GenerateEmailConfirmationTokenAsync(user);

        public Task<string> GenerateChangeEmailTokenAsync(User user, string newEmail) =>
            userManager.GenerateChangeEmailTokenAsync(user, newEmail);

        public Task<string> GeneratePasswordResetTokenAsync(User user) =>
            userManager.GeneratePasswordResetTokenAsync(user);

        public Task<string> GeneratePhoneNumberConfirmationTokenAsync(User user) =>
            Task.FromResult(Guid.NewGuid().ToString("N"));

        public Task<string> GenerateChangePhoneNumberTokenAsync(User user, string phoneNumber) =>
            userManager.GenerateChangePhoneNumberTokenAsync(user, phoneNumber);
    }
}
