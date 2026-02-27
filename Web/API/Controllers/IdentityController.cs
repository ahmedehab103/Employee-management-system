using API.Attributes;
using Asp.Versioning;
using EmployeeManagement.Application.Common.Models;
using EmployeeManagement.Application.Identity.Commands;
using EmployeeManagement.Application.Identity.Models;
using EmployeeManagement.Application.Identity.Queries;
using EmployeeManagement.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiVersion(1)]
    public class IdentityController : ApiControllerBaseAdminPanel
    {
        [HttpGet("[action]")]
        [RoleAuthorize(Role.Admin)]
        public Task<ActionResult<PaginatedList<UserDto>>> GetPage(
            [FromQuery] UsersGetPageQuery query,
            CancellationToken ct)
            => Execute(query, ct);

        [HttpGet]
        public Task<ActionResult<UserDto>> Get(CancellationToken ct)
            => Execute(new UserGetQuery(), ct);

        [HttpPost("[action]")]
        public Task<ActionResult<string>> PostUser(UserPostCommand command)
            => Execute(command);

        [HttpPut("[action]")]
        [RoleAuthorize(Role.Admin)]
        public Task<ActionResult> PutUser(UserPutCommand command)
            => Execute(command);

        [HttpPut("[action]")]
        [AllowAnonymous]
        public Task<ActionResult<AuthResponse>> LogIn(LoginCommand command, CancellationToken ct)
            => Execute(command, ct);

        [HttpPut("[action]")]
        [AllowAnonymous]
        public Task<ActionResult<AuthResponse>> RefreshToken(RefreshTokenCommand command, CancellationToken ct)
            => Execute(command, ct);

        [HttpPut("[action]")]
        public Task<ActionResult> PutUserPhoto([FromForm] UserPutPhotoCommand command, CancellationToken ct)
            => Execute(command);
    }
}
