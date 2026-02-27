using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/v{version:apiVersion}/UserPortal/[controller]")]
    public abstract class ApiControllerBaseUserPortal : ApiControllerBase
    {
    }
}
