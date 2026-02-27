using Amazon.Runtime;
using Amazon.S3;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Infrastructure.Services.StorageServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeManagement.Infrastructure.Configurations
{
    public static class StorageConfiguration
    {
        public static void ConfigureCloudlareStorage(this IServiceCollection services, IConfiguration configuration)
        {
            var s3Client = new AmazonS3Client(
                new BasicAWSCredentials(configuration["S3:AccessKey"], configuration["S3:SecretKey"]),
                new AmazonS3Config { ServiceURL = $"https://{configuration["S3:AccountId"]}.r2.cloudflarestorage.com" }
            );

            services.AddSingleton<IAmazonS3>(s3Client);

            services.AddScoped<IStorageService, S3StorageManager>();

            services.AddScoped<IStorageLocationService, S3LocationService>();
        }
    }
}
