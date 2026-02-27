using System;

namespace EmployeeManagement.Domain.Entities
{
    public class Session
    {
        public Guid UserId { get; set; }

        public string Token { get; set; }

        public string RefreshToken { get; set; }

        public string MacAddress { get; set; }

        public DateTimeOffset LastLogin { get; set; }
    }
}
