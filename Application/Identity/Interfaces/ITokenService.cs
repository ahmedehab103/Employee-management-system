using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Identity.Models;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Identity.Interfaces
{
    public interface ITokenService
    {
        /// <summary>
        /// Generates jwt token for an authenticated user.
        /// </summary>
        Task<AuthResponse> GenerateAuthJwtToken(User user, CancellationToken ct);
    }
}
