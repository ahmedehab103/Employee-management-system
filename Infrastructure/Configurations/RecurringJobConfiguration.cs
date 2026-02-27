using System;
using System.Linq;
using EmployeeManagement.Application.Common.Interfaces;
using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeManagement.Infrastructure.Configurations
{
    public static class RecurringJobConfiguration
    {
        public static void FireAllEventsAndForget(
            this IApplicationBuilder app,
            IRecurringJobManager recurringJobManager,
            IServiceProvider serviceProvider)
        {
            var iBackgroundJob = typeof(IBackgroundJob);

            var types = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(s => s.GetTypes())
                .Where(c => iBackgroundJob.IsAssignableFrom(c) && c.IsClass);


            foreach (var type in types)
            {
                var handlerInstance = (IBackgroundJob) ActivatorUtilities.CreateInstance(serviceProvider, type);

                recurringJobManager.AddOrUpdate(type.Name, () => handlerInstance.Handle(), handlerInstance.CronRate());
            }
        }
    }
}
