using Microsoft.OpenApi.Models;

namespace API.Configurations.Swagger
{
    /// <summary>
    /// Configure swagger docs
    /// </summary>
    public static class SwaggerConfiguration
    {
        public static IServiceCollection AddSwaggerConfigurationServices(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer",
                    new OpenApiSecurityScheme
                    {
                        In = ParameterLocation.Header,
                        Description = "Please insert JWT with Bearer into field",
                        Name = "Authorization",
                        Type = SecuritySchemeType.ApiKey
                    });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id   = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });

                //options.SwaggerDoc("UserPortal", OpenApiDocs.ApiInfoUser);
                options.SwaggerDoc("AdminPanel", OpenApiDocs.ApiInfoAdmin);
                //options.SwaggerDoc("EndUserAndCmsV1", OpenApiDocs.ApiInfoUserAndCmsV1);
            });

            services.AddSwaggerGenNewtonsoftSupport();

            return services;
        }

        public static WebApplication AddSwaggerConfigurationApp(this WebApplication app)
        {
            //app.UseMiddleware<SwaggerBasicAuthMiddleware>();
            //app.UseSwaggerAuthorized();

            // Configure the HTTP request pipeline.

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.DocumentTitle = "Claro API";
                options.SwaggerEndpoint("/swagger/AdminPanel/swagger.json", "AdminPanel");
                //options.SwaggerEndpoint("/swagger/UserPortal/swagger.json", "UserPortal");
                //options.SwaggerEndpoint("/swagger/EndUserAndCmsV1/swagger.json", "EndUserAndCmsV1");
                options.RoutePrefix = "swagger";
            });


            return app;
        }
    }
}
