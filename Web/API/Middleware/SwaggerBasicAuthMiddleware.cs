using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace API.Middleware
{
    public class SwaggerBasicAuthMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/docs"))
            {
                string authHeader = context.Request.Headers["Authorization"];
                if (authHeader is not null && authHeader.StartsWith("Basic "))
                {
                    // Get the credentials from request header
                    var header      = AuthenticationHeaderValue.Parse(authHeader);
                    var inBytes     = Convert.FromBase64String(header.Parameter!);
                    var credentials = Encoding.UTF8.GetString(inBytes).Split(':');
                    var username    = credentials[0];
                    var password    = credentials[1];
                    // validate credentials
                    if (username.Equals("swagger")
                        && password.Equals("swagger"))
                    {
                        await next.Invoke(context).ConfigureAwait(false);
                        return;
                    }
                }

                context.Response.Headers["WWW-Authenticate"] = "Basic";
                context.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
            }
            else
            {
                await next.Invoke(context).ConfigureAwait(false);
            }
        }
    }
}
