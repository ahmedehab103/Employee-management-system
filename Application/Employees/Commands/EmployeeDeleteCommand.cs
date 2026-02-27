using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Employees.Commands
{
    public class EmployeeDeleteCommand : IRequest
    {
        public int Id { get; set; }

        public class Validator : AbstractValidator<EmployeeDeleteCommand>
        {
            public Validator()
            {
                RuleFor(c => c.Id).GreaterThan(0);
            }
        }

        public class Handler(IAppDbContext context) : IRequestHandler<EmployeeDeleteCommand>
        {
            public async Task Handle(EmployeeDeleteCommand request, CancellationToken ct)
            {
                var employee = await context.Employees
                    .FirstOrDefaultAsync(e => e.Id == request.Id, ct)
                    ?? throw new NotFoundException($"Employee {request.Id} was not found.");

                employee.IsDeleted = true;

                await context.SaveChangesAsync(ct);
            }
        }
    }
}
