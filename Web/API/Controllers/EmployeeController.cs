using API.Attributes;
using Asp.Versioning;
using EmployeeManagement.Application.Common.Models;
using EmployeeManagement.Application.Employees.Commands;
using EmployeeManagement.Application.Employees.Models;
using EmployeeManagement.Application.Employees.Queries;
using EmployeeManagement.Domain;
using EmployeeManagement.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiVersion(1)]
    public class EmployeeController : ApiControllerBaseAdminPanel
    {
        [HttpGet("[action]")]
        [RoleAuthorize(Role.Admin)]
        public ActionResult<IEnumerable<object>> GetDepartments()
        {
            var departments = Enum.GetValues<Department>()
                .Select(d => new { value = (int)d, name = d.ToString() });

            return Ok(departments);
        }

        [HttpGet("[action]")]
        [RoleAuthorize(Role.Admin)]
        public Task<ActionResult<PaginatedList<EmployeeDto>>> GetPage(
            [FromQuery] EmployeesGetPageQuery query,
            CancellationToken ct)
            => Execute(query, ct);

        [HttpGet("{id:int}")]
        [RoleAuthorize(Role.Admin)]
        public Task<ActionResult<EmployeeDto>> Get(int id, CancellationToken ct)
            => Execute(new EmployeeGetQuery { Id = id }, ct);

        [HttpPost("[action]")]
        [RoleAuthorize(Role.Admin)]
        public Task<ActionResult<int>> PostEmployee(EmployeePostCommand command)
            => Execute(command);

        [HttpPut("[action]")]
        [RoleAuthorize(Role.Admin)]
        public Task<ActionResult> PutEmployee(EmployeePutCommand command)
            => Execute(command);

        [HttpDelete("[action]/{id:int}")]
        [RoleAuthorize(Role.Admin)]
        public Task<ActionResult> DeleteEmployee(int id, CancellationToken ct)
            => Execute(new EmployeeDeleteCommand { Id = id }, ct);
    }
}
