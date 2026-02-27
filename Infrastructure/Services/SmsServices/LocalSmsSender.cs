using System;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Interfaces;
using Serilog;

namespace EmployeeManagement.Infrastructure.Services.SmsServices
{
    public class LocalSmsSender : ISmsService
    {
        public Task SendMessage(string phoneNumber, string message)
        {
            var fileName =
                $"{DateTime.Now:yy-MM-dd__HH-mm-ss-tt}-{Guid.NewGuid().ToString("N")[..4]}";

            using var smsLogger = new LoggerConfiguration()
                .WriteTo.File($"Logs/Sms/{fileName}.html")
                .CreateLogger();


            smsLogger.Information(message + "to" + phoneNumber);

            return Task.CompletedTask;
        }
    }
}
