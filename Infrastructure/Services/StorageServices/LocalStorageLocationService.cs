using System.IO;
using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.Common.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace EmployeeManagement.Infrastructure.Services.StorageServices
{
    public class LocalStorageLocationService : IStorageLocationService
    {
        private readonly string              _baseUrl;
        private readonly IWebHostEnvironment _env;

        public LocalStorageLocationService(IWebHostEnvironment env, IHttpContextAccessor accessor)
        {
            _env = env;

            var request = accessor.HttpContext?.Request;
            _baseUrl = $"{request?.Scheme}://{request?.Host}";
        }

        public string GetPath(string type) => Path.Combine(_env.WebRootPath, type);

        public string GetUrl(string type) => Url.Combine(_baseUrl, type);

        public string GetUrl(string type, string uri) => Url.Combine(_baseUrl, type, uri);
    }
}
