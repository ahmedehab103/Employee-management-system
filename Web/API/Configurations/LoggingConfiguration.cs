using EmployeeManagement.Application.Common;
using Serilog;
using Serilog.Exceptions;

namespace API.Configurations
{
    /// <summary>
    /// </summary>
    public static class LoggingConfiguration
    {
        /// <summary>
        /// </summary>
        /// <param name="hostBuilder"></param>
        /// <returns></returns>
        public static IHostBuilder ConfigureLogging(this IHostBuilder hostBuilder)
        {
            var env = Environment.GetEnvironmentVariable(Constants.EnvironmentVariableName) ?? "Production";

            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false, true)
                .AddJsonFile($"appsettings.{env}.json", true)
                .AddEnvironmentVariables()
                .Build();

            Log.Logger = new LoggerConfiguration()
                .Enrich.WithProperty("Version", config["Version"])
                .Enrich.WithExceptionDetails()
                .ReadFrom.Configuration(config)
                .CreateLogger();

            Log.Information("::: Logging Started :::");

            return hostBuilder.UseSerilog((hostContext, services, configuration) =>
            {
                configuration.WriteTo.Console();
            });
        }
    }
}
