using System.Linq;
using System.Linq.Dynamic;
using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Common.Models;
using EmployeeManagement.Application.Employees.Models;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Employees.Queries
{
    public class EmployeesGetPageQuery : PagingOptionsRequest, IRequest<PaginatedList<EmployeeDto>>
    {
        public Department? Department { get; set; }

        public class Validator : PagingOptionsValidator<EmployeesGetPageQuery> { }

        public class Handler(IAppDbContext context) : IRequestHandler<EmployeesGetPageQuery, PaginatedList<EmployeeDto>>
        {
            public Task<PaginatedList<EmployeeDto>> Handle(EmployeesGetPageQuery request, CancellationToken ct)
                => context.Employees
                    .AsNoTracking()
                    .WhereIf(request.Department.HasValue, e => e.Department == request.Department!.Value)
                    .Where(e => !e.IsDeleted)
                    .Search(request, e => e.FullName, e => e.Email)
                    .OrderByDescending(e => e.Id)
                    .ToPaginatedListAsync(request, ct)
                    .ProjectTo<EmployeeDto, Employee>();
        }
    }
}
