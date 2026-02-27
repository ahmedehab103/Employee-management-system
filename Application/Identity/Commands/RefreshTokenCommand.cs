using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Application.Identity.Interfaces;
using EmployeeManagement.Application.Identity.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Identity.Commands
{
    public class RefreshTokenCommand : IRequest<AuthResponse>
    {
        public string RefreshToken { get; set; }

        public class Handler(
            IAppDbContext context,
            ITokenService tokenService)
            : IRequestHandler<RefreshTokenCommand, AuthResponse>
        {
            public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken ct)
            {
                var session = await context.Sessions.AsNoTracking()
                    .FirstOrDefaultAsync(s => s.RefreshToken == request.RefreshToken, ct);

                if (session is null)
                {
                    throw new ForbiddenAccessException();
                }

                var user = await context.Users.FindAsync(session.UserId, ct);

                if (user is null)
                {
                    throw new ForbiddenAccessException();
                }

                return await tokenService.GenerateAuthJwtToken(user, ct);
            }
        }
    }
}
