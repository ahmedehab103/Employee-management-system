using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Identity.Interfaces;
using EmployeeManagement.Application.Identity.Resources.Accounts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Identity.Commands
{
    public class UserPutCommand : UserPostPutCommon, IRequest
    {
        public class Validator : UserPostCommonValidator<UserPutCommand>
        {
            public Validator()
            {
                RuleFor(c => c.Email).NotEmpty().EmailAddress();

                When(c => c.Password is not null,
                    () =>
                    {
                        RuleFor(c => c.ConfirmPassword)
                            .Must((m, confirm) => m.Password == confirm)
                            .WithMessage(string.Format(AccountsRes.ConfirmPassword));
                    });
            }
        }

        public class Handler(IAppDbContext context, IIdentityManager identityManager)
            : IRequestHandler<UserPutCommand>
        {
            public async Task Handle(UserPutCommand request, CancellationToken ct)
            {
                var user = await context.Users
                    .FirstOrDefaultAsync(c => c.Email == request.Email, ct);

                if (user is null)
                {
                    throw new NotFoundException();
                }

                user.Name = request.FullName.ToFullName();
                user.PhoneNumber = request.PhoneNumber;

                if (request.Password is not null)
                {
                    var hashedNewPassword =
                        identityManager.UserManager.PasswordHasher.HashPassword(user, request.Password);

                    user.PasswordHash = hashedNewPassword;
                }

                await context.SaveChangesAsync(ct);
            }
        }
    }
}
