using Scalar.AspNetCore;

namespace API.Configurations.Swagger
{
    /// <summary>
    /// Configure Scalar API documentation
    /// </summary>
    public static class ScalarConfiguration
    {
        /// <summary>
        /// Add Scalar documentation endpoint
        /// </summary>
        public static WebApplication AddScalarConfigurationApp(this WebApplication app)
        {
            app.MapScalarApiReference("/scalar/AdminPanel", options =>
            {
                options
                    .WithTitle("Employee Management System API")
                    .WithTheme(ScalarTheme.BluePlanet)
                    .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient)
                    .WithOpenApiRoutePattern("/swagger/AdminPanel/swagger.json");
            });

            return app;
        }
    }
}
