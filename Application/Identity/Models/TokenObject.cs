using System;
using EmployeeManagement.Application.Common.Enums;

namespace EmployeeManagement.Application.Identity.Models
{
    public class TokenObject
    {
        public Guid UserId { get; set; }

        public TokenType Type { get; set; }

        public string Token { get; set; }

        public string LongToken { get; set; }

        public int NumberOfTries { get; set; }

        public DateTimeOffset ExpiresAt { get; set; }

        public object ExtraData { get; set; }
    }
}
