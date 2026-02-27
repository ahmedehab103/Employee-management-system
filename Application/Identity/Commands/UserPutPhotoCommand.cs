using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Enums;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Application.Common.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Identity.Commands
{
    public class UserPutPhotoCommand : IRequest
    {
        public string Email { get; set; }
        public IFormFile Photo { get; set; }

        public class Validator : AbstractValidator<UserPutPhotoCommand>
        {
            public Validator() => RuleFor(c => c.Photo).NotNull();
        }

        public class Handler(IAppDbContext context, IStorageService storageService)
            : IRequestHandler<UserPutPhotoCommand>
        {
            public async Task Handle(UserPutPhotoCommand request, CancellationToken ct)
            {
                var user = await context.Users
                    .FirstOrDefaultAsync(c => c.Email == request.Email, ct);

                if (user is null)
                {
                    throw new NotFoundException();
                }

                if (request.Photo is not null)
                {
                    var photoUrl = await storageService.SaveAsync(FileType.Picture.ToString(), request.Photo);
                    user.PictureUri = photoUrl.saveName;
                }

                await context.SaveChangesAsync(ct);
            }
        }
    }
}
