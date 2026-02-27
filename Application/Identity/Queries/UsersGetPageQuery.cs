using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Application.Common.Models;
using EmployeeManagement.Application.Identity.Models;
using EmployeeManagement.Domain;
using EmployeeManagement.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Identity.Queries
{
    /// <summary>
    /// Get Query for all users type list
    /// </summary>
    public class UsersGetPageQuery : PagingOptionsRequest, IRequest<PaginatedList<UserDto>>
    {
        public Role Role { get; set; }

        public class Validator : PagingOptionsValidator<UsersGetPageQuery> { }

        public class Handler(IAppDbContext context, IStorageLocationService storageLocation)
            : IRequestHandler<UsersGetPageQuery, PaginatedList<UserDto>>
        {
            public Task<PaginatedList<UserDto>> Handle(UsersGetPageQuery request, CancellationToken ct) => context.Users
                .AsNoTracking()
                .Where(c => c.Role == request.Role)
                .Search(request,
                    c => c.Name,
                    c => c.PhoneNumber,
                    c => c.Email)
                .OrderByDescending(a => a.CreatedAt)
                .ToPaginatedListAsync(request, ct)
                .ProjectTo<UserDto, User>(storageLocation);
        }
    }
}
