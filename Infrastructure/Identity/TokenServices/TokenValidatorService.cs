using System;
using System.Threading.Tasks;
using EmployeeManagement.Application;
using EmployeeManagement.Application.Common.Enums;
using EmployeeManagement.Application.Identity.Interfaces;
using EmployeeManagement.Application.Identity.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Identity.TokenServices
{
    public class TokenValidatorService(IAppDbContext context) : ITokenValidatorService
    {
        public async Task<bool> Verify(TokenType type, string userId, string token)
        {
            if (!Guid.TryParse(userId, out var userGuid))
                return false;

            return await context.Sessions
                .AsNoTracking()
                .AnyAsync(s => s.UserId == userGuid && s.Token == token);
        }

        public async Task<TokenObject> Validate(TokenType type, string userId, string token)
        {
            if (!Guid.TryParse(userId, out var userGuid))
                return null;

            var session = await context.Sessions
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.UserId == userGuid && s.Token == token);

            if (session is null)
                return null;

            return new TokenObject
            {
                UserId = session.UserId,
                Type   = type,
                Token  = session.Token
            };
        }
    }
}
