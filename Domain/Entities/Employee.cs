using System;
using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Domain.Entities
{
    public class Employee
    {
        public int        Id         { get; set; }
        public string     FullName   { get; set; }
        public string     Email      { get; set; }
        public string     Phone      { get; set; }
        public DateTime   HireDate   { get; set; }
        public decimal    Salary     { get; set; }
        public Department Department { get; set; }
        public bool       IsActive   { get; set; } = true;
        public bool       IsDeleted  { get; set; } = false;
    }
}
