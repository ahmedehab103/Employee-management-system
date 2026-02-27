using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EmployeeManagement.Infrastructure.Services.SmsServices
{
    public class SmsService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<SmsService> logger) : ISmsService
    {
        public async Task SendMessage(string phoneNumber, string message)
        {
            if (phoneNumber is null || message is null)
                return;

            try
            {
                await SendByCequens(phoneNumber, message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send SMS via Cequens to {PhoneNumber}", phoneNumber);
            }
        }

        private async Task SendByCequens(string phoneNumber, string message)
        {
            var httpClient = httpClientFactory.CreateClient("Cequens");

            await httpClient.PostAsJsonAsync(
                "sms/v1/messages",
                new
                {
                    senderName      = configuration["Cequens:SenderName"],
                    messageType     = "text",
                    acknowledgement = 0,
                    flashing        = 0,
                    messageText     = message,
                    recipients      = phoneNumber
                });
        }
    }

    public class CequensAuthResponse
    {
        public DataResponse Data { get; set; }

        public class DataResponse
        {
            public string AccessToken { get; set; }
        }
    }
}
