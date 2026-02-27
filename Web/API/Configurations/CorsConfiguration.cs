namespace API.Configurations
{
    public static class CorsConfiguration
    {
        public static void AddApiCors(this IServiceCollection services, IConfiguration configuration)
        {
            var strOrigins = configuration.GetSection("Origins").Value;

            if (string.IsNullOrEmpty(strOrigins))
            {
                return;
            }

            var origins = configuration.GetSection("Origins").Value?.Split(";");

            if (origins is null)
            {
                return;
            }

            services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigin",
                    builder =>
                    {
                        builder.WithOrigins(origins)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });

                //options.CorsOrigins = Configuration.GetSection("Origins").AsEnumerable();
            });
        }
    }
}
