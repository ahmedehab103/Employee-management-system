using System;
using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Application.Identity.Interfaces;
using EmployeeManagement.Application.Identity.Models;
using EmployeeManagement.Application.Identity.Resources.Accounts;
using EmployeeManagement.Domain.Enums;
using FluentValidation;
using MediatR;
using static EmployeeManagement.Application.Common.Constants;

namespace EmployeeManagement.Application.Identity.Commands
{
    public class LoginCommand : IRequest<AuthResponse>
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public class Validator : AbstractValidator<LoginCommand>
        {
            public Validator()
            {
                RuleFor(c => c.Email)
                    .NotEmpty()
                    .EmailAddress();

                RuleFor(c => c.Password)
                    .NotEmpty()
                    .Length(MinPassword, MaxPassword);
            }
        }

        public class Handler(
            IIdentityManager identityManager,
            ITokenService tokenService)
            : IRequestHandler<LoginCommand, AuthResponse>
        {
            public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken ct)
            {
                var user = await identityManager.UserManager.FindByEmailAsync(request.Email);

                if (user is null)
                {
                    throw new BadRequestException(AccountsRes.FailedToLoginError);
                }

                var result = await identityManager.SignInManager.PasswordSignInAsync(
                    user,
                    request.Password,
                    false,
                    true);

                if (result.IsNotAllowed)
                {
                    throw new UnauthorizedAccessException();
                }

                if (result.IsLockedOut)
                {
                    throw new BadRequestException(AccountsRes.AccountIsLockedOutError);
                }

                if (!result.Succeeded)
                {
                    throw new BadRequestException(AccountsRes.FailedToLoginError);
                }

                if (user.Status is AccountStatus.Banned or AccountStatus.Deleted)
                {
                    throw new BadRequestException(AccountsRes.DeactivatedError);
                }

                return await tokenService.GenerateAuthJwtToken(user, ct);
            }
        }
    }
}
