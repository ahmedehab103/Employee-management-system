using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace API.Configurations
{
    public static class ConfigureRateLimiter
    {
        public static IServiceCollection RateLimiter(this IServiceCollection services)
        {
            services.AddRateLimiter(options =>
            {
                var limiterPolicy = new RateLimiterPolicy();

                options.GlobalLimiter =
                    PartitionedRateLimiter.Create<HttpContext, string>(context => limiterPolicy.GetPartition(context));

                options.OnRejected = (context, token) => limiterPolicy.OnRejected(context, token);
            });

            return services;
        }
    }

    public class RateLimiterPolicy : IRateLimiterPolicy<string>
    {
        public RateLimitPartition<string> GetPartition(HttpContext httpContext)
        {
            var isAuthenticated = httpContext.User.Identity?.IsAuthenticated == true;

            if (isAuthenticated)
            {
                return RateLimitPartition.GetFixedWindowLimiter(httpContext.User.Identity?.Name!,
                    _ => new FixedWindowRateLimiterOptions
                    {
                        AutoReplenishment = true,
                        PermitLimit = 100,
                        QueueLimit = 10,
                        Window = TimeSpan.FromMinutes(1)
                    });
            }


            return RateLimitPartition.GetFixedWindowLimiter(
                httpContext.Connection.RemoteIpAddress?.ToString(),
                _ => new FixedWindowRateLimiterOptions
                {
                    AutoReplenishment = true,
                    PermitLimit = 100,
                    QueueLimit = 100,
                    Window = TimeSpan.FromSeconds(60)
                });
        }

        public Func<OnRejectedContext, CancellationToken, ValueTask> OnRejected
            => async (context, _) =>
            {
                context.HttpContext.Response.StatusCode = 418;

                await context.HttpContext.Response.WriteAsync("Too many requests. Please try again later.");
            };
    }
}
