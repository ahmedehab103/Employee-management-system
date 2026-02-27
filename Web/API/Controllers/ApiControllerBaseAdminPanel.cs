using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/v{version:apiVersion}/AdminPanel/[controller]")]
    [ApiExplorerSettings(GroupName = "AdminPanel")]
    public abstract class ApiControllerBaseAdminPanel : ApiControllerBase
    {
    }
}
