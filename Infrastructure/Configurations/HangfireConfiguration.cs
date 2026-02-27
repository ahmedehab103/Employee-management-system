using System;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Infrastructure.Services;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace EmployeeManagement.Infrastructure.Configurations
{
    public static class HangfireConfiguration
    {
        public static void ConfigureHangfire(this IServiceCollection services, IConfiguration configuration)
        {
            var storageOptions = new SqlServerStorageOptions
            {
                CommandBatchMaxTimeout       = TimeSpan.FromMinutes(5),
                SlidingInvisibilityTimeout   = TimeSpan.FromMinutes(5),
                QueuePollInterval            = TimeSpan.Zero,
                UseRecommendedIsolationLevel = true,
                UsePageLocksOnDequeue        = true,
                DisableGlobalLocks           = true
            };

            // Add Hangfire services.
            services.AddHangfire(globalConfiguration => globalConfiguration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseSerializerSettings(new JsonSerializerSettings
                { ReferenceLoopHandling = ReferenceLoopHandling.Ignore })
                .UseSqlServerStorage(configuration.GetConnectionString("DefaultConnection"), storageOptions));

            // Add the processing server as IHostedService
            services.AddHangfireServer();

            services.AddTransient<IBackgroundJobService, BackgroundJobService>();
        }
    }
}
