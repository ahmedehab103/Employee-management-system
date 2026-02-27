using API.Configurations;
using API.Configurations.Swagger;
using API.Filters;
using API.Services;
using EmployeeManagement.Application;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Infrastructure;
using EmployeeManagement.Infrastructure.Middleware;
using Hangfire;
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Net.Http.Headers;

namespace API
{
    public static class Startup
    {
        public static void Cache(StaticFileResponseContext context)
        {
            var headers = context.Context.Response.GetTypedHeaders();

            headers.CacheControl = new CacheControlHeaderValue
            {
                Public = true,
                MaxAge = TimeSpan.FromDays(value: 10)
            };
        }

        public static IServiceCollection ConfigureServices(
            this IServiceCollection services,
            IConfiguration configuration,
            IHostEnvironment env)
        {
            services.AddAuthorization();

            services.AddSwaggerConfigurationServices();

            services.AddCompression();

            services.AddHttpContextAccessor();
            services.RateLimiter();

            services.AddApplication();

            services.AddInfrastructure(configuration, env);

            services.AddApiCors(configuration);
            services.ConfigureLocalization();
            services.ConfigureMvcApi();

            services.AddVersioning();

            services.AddHealthChecks();

            services.AddScoped<ICurrentUserService, CurrentUserService>();

            return services;
        }

        public static WebApplication ConfigureTheApp(
            this WebApplication app,
            IConfiguration configuration,
            IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            if (env.IsProduction())
            {
                app.UseCors("AllowOrigin");
            }
            else
            {
                app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            }

            app.AddSwaggerConfigurationApp();
            app.AddScalarConfigurationApp();

            app.UseResponseCompression();

            app.UseMiddleware<DomainEventMiddleware>();

            app.UseStaticFiles(new StaticFileOptions { OnPrepareResponse = Cache });

            app.UseSerilog();

            app.UseRouting();

            app.UseRequestLocalization();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseRateLimiter();

            app.UseHealthChecks("/health");

            app.Use((context, next) =>
            {
                context.Features.Get<IHttpMaxRequestBodySizeFeature>()!.MaxRequestBodySize = 134_217_728L;
                return next.Invoke();
            });

            if (!env.IsProduction())
            {
                app.UseHangfireDashboard("/Hangfire");
            }

            app.MapEndpoints(() => new[] { new HangfireDashboardAuthorizationFilter() });

            return app;
        }

        public static void MapEndpoints(
            this IApplicationBuilder app,
            Func<IEnumerable<IDashboardAuthorizationFilter>> hangfireAuthorizationFilters)
            => app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                endpoints.MapHealthChecks("/api/Health");

                endpoints.MapHangfireDashboard(
                    "/api/BackgroundJobs",
                    new DashboardOptions
                    {
                        DashboardTitle = "Background Jobs",
                        Authorization = hangfireAuthorizationFilters()
                    }
                );
            });
    }
}
