using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Identity.Models;
using FluentValidation;

namespace EmployeeManagement.Application.Identity.Commands
{
    public class UserPostPutCommon
    {
        public string PhoneNumber { get; set; }

        public FullNameDto FullName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        public class UserPostCommonValidator<T> : AbstractValidator<T> where T : UserPostPutCommon
        {
            public UserPostCommonValidator()
            {
                RuleFor(c => c.FullName.FirstName).NotEmpty().MinimumLength(2);

                RuleFor(c => c.FullName.LastName).NotEmpty().MinimumLength(2);

                RuleFor(c => c.PhoneNumber).NotEmpty().PhoneNumber();

                RuleFor(c => c.Email).NotEmpty().EmailAddress();
            }
        }
    }
}
