using System.Threading.Tasks;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Identity.Interfaces
{
    public interface ITokenGeneratorService
    {
        Task<string> GenerateEmailConfirmationTokenAsync(User user);
        Task<string> GenerateChangeEmailTokenAsync(User user, string newEmail);
        Task<string> GeneratePasswordResetTokenAsync(User user);
        Task<string> GeneratePhoneNumberConfirmationTokenAsync(User user);
        Task<string> GenerateChangePhoneNumberTokenAsync(User user, string phoneNumber);
    }
}
