using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeManagement.Infrastructure.Configurations
{
    public static class MediatRConfiguration
    {
        public static void ConfigureMediatR(this IServiceCollection services) => services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
    }
}
