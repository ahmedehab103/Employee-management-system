using System;

namespace EmployeeManagement.Domain.ValueObjects
{
    public class Company
    {
        public Guid Id { get; set; }

        public LocalizedString Name { get; set; }
    }
}
