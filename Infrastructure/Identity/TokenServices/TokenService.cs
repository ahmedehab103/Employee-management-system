using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EmployeeManagement.Application;
using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Identity.Interfaces;
using EmployeeManagement.Application.Identity.Models;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Infrastructure.Identity.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeManagement.Infrastructure.Identity.TokenServices
{
    public class TokenService(
        IAppDbContext context,
        IIdentityManager identityManager,
        IOptionsMonitor<JwtConfig> config)
        : ITokenService
    {
        private readonly JwtConfig _jwtConfig = config.CurrentValue;

        public async Task<AuthResponse> GenerateAuthJwtToken(User user, CancellationToken ct)
        {
            var (token, refreshToken) = await UpdateUserSessionAsync(user.Id, ct);

            var claims = await GetUserClaims(user, token);

            var expires = DateTime.UtcNow.AddDays(_jwtConfig.ExpirationPeriod);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Issuer  = _jwtConfig.Issuer,
                Expires = expires,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key)),
                    SecurityAlgorithms.HmacSha512Signature)
            };

            var jwtToken = tokenHandler.CreateJwtSecurityToken(tokenDescriptor);

            return new AuthResponse
            {
                Token = tokenHandler.WriteToken(jwtToken),
                RefreshToken = refreshToken
            };
        }

        private async Task<(string token, string refreshToken)> UpdateUserSessionAsync(
            Guid userId,
            CancellationToken ct)
        {
            var session = await context.Sessions.FindByKeyAsync(userId, ct);

            var token        = Guid.NewGuid().ToString("N");
            var refreshToken = GenerateRefreshToken();

            if (session is null)
            {
                session = new Session { UserId = userId };
                await context.Sessions.AddAsync(session, ct);
            }

            session.Token = token;
            session.RefreshToken = refreshToken;
            session.LastLogin = DateTimeOffset.Now;

            await context.SaveChangesAsync(ct);

            string GenerateRefreshToken()
            {
                var randomBytes = new byte[64];
                using var rng = RandomNumberGenerator.Create();
                rng.GetBytes(randomBytes);
                return Convert.ToBase64String(randomBytes);
            }

            return (token, refreshToken);
        }

        private async Task<IList<Claim>> GetUserClaims(User user, string token)
        {
            var claims = (await identityManager.UserManager.GetRolesAsync(user))
                .Select(r => new Claim(AppClaims.Roles, r.ToString())).ToList();

            claims.Add(new Claim(AppClaims.Created,
                user.CreatedAt.ToString(CultureInfo.InvariantCulture),
                ClaimValueTypes.DateTime));

            if (user.Companies is not null)
            {
                claims.AddRange(user.Companies
                    .Select(company => new Claim(AppClaims.UserCompanies, company.Id.ToString())).ToList());
            }

            claims.Add(new Claim(AppClaims.Id, user.Id.ToString()));
            claims.Add(new Claim(AppClaims.UserName, user.UserName!));
            claims.Add(new Claim(AppClaims.Email, user.Email!));
            claims.Add(new Claim(AppClaims.Token, token));

            return claims;
        }
    }
}
