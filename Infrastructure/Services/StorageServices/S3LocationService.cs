using EmployeeManagement.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace EmployeeManagement.Infrastructure.Services.StorageServices
{
    public sealed class S3LocationService : IStorageLocationService
    {
        private readonly string _baseUrl;

        //public S3LocationService(IConfiguration configuration) => _baseUrl = configuration["S3:Url"];
        public S3LocationService(IConfiguration configuration) => _baseUrl = "";

        public string GetPath(string type) => _baseUrl + type + "/";

        public string GetUrl(string type) => _baseUrl + type + "/";

        public string GetUrl(string type, string uri) => GetUrl(type) + uri;
    }
}
