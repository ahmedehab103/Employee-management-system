using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Application.Identity.Interfaces;
using EmployeeManagement.Application.Identity.Models;
using EmployeeManagement.Application.Identity.Resources.Accounts;
using EmployeeManagement.Domain;
using EmployeeManagement.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Identity.Commands
{
    /// <summary>
    /// Add User from Dashboard
    /// </summary>
    public class UserPostCommand : UserPostPutCommon, IRequest<string>
    {
        public Role Role { get; set; }

        public class Validator : UserPostCommonValidator<UserPostCommand>
        {
            public Validator(IAppDbContext context)
            {
                RuleFor(c => c.PhoneNumber).MustAsync(PhoneIsUnique).WithMessage(AccountsRes.PhoneNumber);

                RuleFor(c => c.Email).MustAsync(EmailIsUnique).WithMessage(AccountsRes.ExistingEmail);

                RuleFor(c => c.Role).IsInEnum();

                RuleFor(c => c.Password)
                    .NotEmpty()
                    .Length(Constants.MinPassword, Constants.MaxPassword)
                    .WithMessage(string.Format(AccountsRes.Password,
                        Constants.MinPassword,
                        Constants.MaxPassword));

                RuleFor(c => c.ConfirmPassword)
                    .Must((m, confirm) => m.Password == confirm)
                    .WithMessage(string.Format(AccountsRes.ConfirmPassword));

                Task<bool> PhoneIsUnique(string phone, CancellationToken ct)
                {
                    return context.Users.AllAsync(c => c.PhoneNumber != phone, ct);
                }

                Task<bool> EmailIsUnique(string email, CancellationToken ct)
                {
                    return context.Users.AllAsync(c => c.Email != email, ct);
                }
            }
        }

        public class Handler(IIdentityManager identityManager, IDateTime dateTime)
            : IRequestHandler<UserPostCommand, string>
        {
            public async Task<string> Handle(UserPostCommand request, CancellationToken ct)
            {
                var user = new User
                {
                    Name           = request.FullName.ToFullName(),
                    UserName       = request.Email.GenerateUsername(),
                    Email          = request.Email,
                    PhoneNumber    = request.PhoneNumber,
                    CreatedAt      = dateTime.Now,
                    EmailConfirmed = true,
                    Role           = request.Role,
                    Companies      = null
                };

                var result = await identityManager.UserManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    throw new BadRequestException(result);
                }

                var addRole = await identityManager.UserManager.AddToRoleAsync(user, request.Role.ToString());

                if (!addRole.Succeeded)
                {
                    throw new BadRequestException(addRole);
                }

                return user.Id.ToString();
            }
        }
    }
}
