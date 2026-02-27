using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Enums;
using EmployeeManagement.Application.Identity.Models;

namespace EmployeeManagement.Application.Identity.Interfaces
{
    public interface ITokenValidatorService
    {
        Task<bool> Verify(TokenType type, string userId, string token);
        Task<TokenObject> Validate(TokenType type, string userId, string token);
    }
}
