using System;
using System.Collections.Generic;
using EmployeeManagement.Domain.Enums;
using EmployeeManagement.Domain.Models;
using EmployeeManagement.Domain.ValueObjects;
using Microsoft.AspNetCore.Identity;

namespace EmployeeManagement.Domain.Entities
{
    public class User : IdentityUser<Guid>, IHasDomainEvent
    {
        public FullName Name { get; set; }

        public string PictureUri { get; set; }

        public Role Role { get; set; }

        public AccountStatus Status { get; set; }

        public Language Language { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public List<Company> Companies { get; set; }

        public List<DomainEvent> DomainEvents { get; } = new();
    }
}
