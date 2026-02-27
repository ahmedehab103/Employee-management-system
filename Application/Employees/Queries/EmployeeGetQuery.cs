using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Application.Employees.Models;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Employees.Queries
{
    public class EmployeeGetQuery : IRequest<EmployeeDto>
    {
        public int Id { get; set; }

        public class Validator : AbstractValidator<EmployeeGetQuery>
        {
            public Validator()
            {
                RuleFor(c => c.Id).GreaterThan(0);
            }
        }

        public class Handler(IAppDbContext context) : IRequestHandler<EmployeeGetQuery, EmployeeDto>
        {
            public async Task<EmployeeDto> Handle(EmployeeGetQuery request, CancellationToken ct)
            {
                var employee = await context.Employees
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Id == request.Id && !e.IsDeleted, ct)
                    ?? throw new NotFoundException($"Employee {request.Id} was not found.");

                return EmployeeDto.FromEntity(employee);
            }
        }
    }
}
