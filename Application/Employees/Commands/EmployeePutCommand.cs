using System;
using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Employees.Commands
{
    public class EmployeePutCommand : IRequest
    {
        public int        Id         { get; set; }
        public string     FullName   { get; set; }
        public string     Email      { get; set; }
        public string     Phone      { get; set; }
        public DateTime   HireDate   { get; set; }
        public decimal    Salary     { get; set; }
        public Department Department { get; set; }
        public bool       IsActive   { get; set; }

        public class Validator : AbstractValidator<EmployeePutCommand>
        {
            public Validator(IAppDbContext context)
            {
                RuleFor(c => c.Id).GreaterThan(0);
                RuleFor(c => c.FullName).NotEmpty().MaximumLength(100);
                RuleFor(c => c.Email).NotEmpty().MaximumLength(150).EmailAddress()
                    .MustAsync((cmd, email, ct) =>
                        context.Employees.AllAsync(e => e.Email != email || e.Id == cmd.Id, ct))
                    .WithMessage("Email is already in use.");
                RuleFor(c => c.Phone).MaximumLength(20);
                RuleFor(c => c.HireDate).NotEmpty();
                RuleFor(c => c.Salary).GreaterThan(0);
                RuleFor(c => c.Department).IsInEnum();
            }
        }

        public class Handler(IAppDbContext context) : IRequestHandler<EmployeePutCommand>
        {
            public async Task Handle(EmployeePutCommand request, CancellationToken ct)
            {
                var employee = await context.Employees
                    .FirstOrDefaultAsync(e => e.Id == request.Id, ct)
                    ?? throw new NotFoundException($"Employee {request.Id} was not found.");

                employee.FullName   = request.FullName;
                employee.Email      = request.Email;
                employee.Phone      = request.Phone;
                employee.HireDate   = request.HireDate;
                employee.Salary     = request.Salary;
                employee.Department = request.Department;
                employee.IsActive   = request.IsActive;

                await context.SaveChangesAsync(ct);
            }
        }
    }
}
