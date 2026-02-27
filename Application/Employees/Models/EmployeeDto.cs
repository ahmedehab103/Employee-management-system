using System;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.Employees.Models
{
    public class EmployeeDto
    {
        public int        Id         { get; set; }
        public string     FullName   { get; set; }
        public string     Email      { get; set; }
        public string     Phone      { get; set; }
        public DateTime   HireDate   { get; set; }
        public decimal    Salary     { get; set; }
        public Department Department { get; set; }
        public bool       IsActive   { get; set; }

        public static EmployeeDto FromEntity(Employee e) => new()
        {
            Id         = e.Id,
            FullName   = e.FullName,
            Email      = e.Email,
            Phone      = e.Phone,
            HireDate   = e.HireDate,
            Salary     = e.Salary,
            Department = e.Department,
            IsActive   = e.IsActive
        };
    }
}
