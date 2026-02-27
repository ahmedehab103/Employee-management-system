using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagement.Application.Common.Exceptions
{
    public class BadRequestException : Exception
    {
        public BadRequestException(IdentityResult identityResult) :
            base(identityResult.Errors.FirstOrDefault()?.Description)
        { }

        public BadRequestException(string error) => Error = error;

        public string Error { get; }
    }
}
