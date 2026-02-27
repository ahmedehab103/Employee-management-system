using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public abstract class ApiControllerBase : ControllerBase
    {
        private ISender _sender;

        protected ISender Sender => _sender ??= HttpContext.RequestServices.GetRequiredService<ISender>();

        protected async Task<ActionResult<T>> Execute<T>(IRequest<T> request, CancellationToken ct = default)
        {
            var result = await Sender.Send(request, ct);
            return Ok(result);
        }

        protected async Task<ActionResult> Execute(IRequest request, CancellationToken ct = default)
        {
            await Sender.Send(request, ct);
            return NoContent();
        }
    }
}
