using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Application.Identity.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Identity.Queries
{
    public class UserGetQuery : IRequest<UserDto>
    {
        public class Handler(
            IAppDbContext context,
            IStorageLocationService storageLocation,
            ICurrentUserService userService)
            : IRequestHandler<UserGetQuery, UserDto>
        {
            public async Task<UserDto> Handle(UserGetQuery request, CancellationToken ct)
            {
                var user = await context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Email == userService.Email, ct);

                if (user is null)
                {
                    throw new NotFoundException();
                }

                return UserDto.Create(user, storageLocation);
            }
        }
    }
}
