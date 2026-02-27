using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EmployeeManagement.Infrastructure.Services.SmsServices
{
    public class SmsEgService(
        IHttpClientFactory httpClientFactory,
        IOptions<SmsEgSettings> smsSettings,
        ILogger<SmsEgService> logger) : ISmsService
    {
        private readonly SmsEgSettings _smsEgSettings = smsSettings.Value;

        public async Task SendMessage(string phoneNumber, string message)
        {
            if (phoneNumber is null || message is null)
                return;

            try
            {
                await SendBySmsEg(phoneNumber, message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send SMS via SmsEg to {PhoneNumber}", phoneNumber);
            }
        }

        private async Task SendBySmsEg(string phoneNumber, string message)
        {
            if (phoneNumber.Length < 2)
                return;

            phoneNumber = phoneNumber.Remove(0, 1);

            var httpClient = httpClientFactory.CreateClient("SmsEg");

            await httpClient.PostAsJsonAsync(
                "sms/api/json",
                new
                {
                    username   = _smsEgSettings.UserName,
                    password   = _smsEgSettings.Password,
                    sendername = _smsEgSettings.SenderID,
                    mobiles    = phoneNumber,
                    message
                });
        }
    }

    public class SmsEgSettings
    {
        public string Uri { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string SenderID { get; set; }
    }
}
