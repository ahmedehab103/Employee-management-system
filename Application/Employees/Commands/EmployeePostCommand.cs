using System;
using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Employees.Commands
{
    public class EmployeePostCommand : IRequest<int>
    {
        public string     FullName   { get; set; }
        public string     Email      { get; set; }
        public string     Phone      { get; set; }
        public DateTime   HireDate   { get; set; }
        public decimal    Salary     { get; set; }
        public Department Department { get; set; }

        public class Validator : AbstractValidator<EmployeePostCommand>
        {
            public Validator(IAppDbContext context)
            {
                RuleFor(c => c.FullName).NotEmpty().MaximumLength(100);
                RuleFor(c => c.Email).NotEmpty().MaximumLength(150).EmailAddress()
                    .MustAsync((email, ct) => context.Employees.AllAsync(e => e.Email != email, ct))
                    .WithMessage("Email is already in use.");
                RuleFor(c => c.Phone).MaximumLength(20);
                RuleFor(c => c.HireDate).NotEmpty();
                RuleFor(c => c.Salary).GreaterThan(0);
                RuleFor(c => c.Department).IsInEnum();
            }
        }

        public class Handler(IAppDbContext context) : IRequestHandler<EmployeePostCommand, int>
        {
            public async Task<int> Handle(EmployeePostCommand request, CancellationToken ct)
            {
                var employee = new Employee
                {
                    FullName   = request.FullName,
                    Email      = request.Email,
                    Phone      = request.Phone,
                    HireDate   = request.HireDate,
                    Salary     = request.Salary,
                    Department = request.Department,
                    IsActive   = true,
                    IsDeleted  = false
                };

                context.Employees.Add(employee);
                await context.SaveChangesAsync(ct);

                return employee.Id;
            }
        }
    }
}
