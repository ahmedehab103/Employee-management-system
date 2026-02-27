using System.Reflection;
using EmployeeManagement.Application.Common.Behaviors;
using FluentValidation;
using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeManagement.Application
{
    public static class DependencyInjection
    {
        public static void AddApplication(this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            services.ConfigureMediatR(Assembly.GetExecutingAssembly());

            services.AddTransient(typeof(IRequestPostProcessor<,>), typeof(LoggingBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
        }

        private static void ConfigureMediatR(this IServiceCollection services, Assembly mediatRExecutingAssembly) => services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(mediatRExecutingAssembly));
    }
}
