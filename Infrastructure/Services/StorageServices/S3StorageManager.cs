using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace EmployeeManagement.Infrastructure.Services.StorageServices
{
    internal sealed class S3StorageManager(IAmazonS3 s3, IConfiguration configuration) : IStorageService
    {
        private readonly string _bucketName = configuration["S3:BucketsName"];

        public Task<string> SaveAsync(string directory, byte[] file, string fileName = null) => throw new NotImplementedException();

        public async Task<(string saveName, string displayName)> SaveAsync(string directory, IFormFile formFile)
        {
            var untrustedFileName = Path.GetFileName(formFile.Name);
            var ext               = $"{Path.GetExtension(formFile.FileName).ToLower()}";

            if (string.IsNullOrWhiteSpace(untrustedFileName) || formFile.Length == 0)
            {
                throw new ArgumentException();
            }

            // Don't trust the file name sent by the client. To display
            // the file name, HTML-encode the value.
            var trustedFileNameForDisplay = WebUtility.HtmlEncode(formFile.FileName) + ext;

            var saveName = Guid.NewGuid().ToString("N") + ext;

            var success = await PutObject(directory, saveName, formFile);

            if (!success)
            {
                throw new BadRequestException($"Failed to upload the file {untrustedFileName}");
            }

            return (saveName, trustedFileNameForDisplay);
        }

        public Task DeleteAsync(string directory, string fileName) => DeleteIfExistsAsync(directory, fileName);

        public async Task<bool> DeleteIfExistsAsync(string directory, string fileName)
        {
            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key        = $"{directory}/{fileName}"
                };

                _ = await s3.DeleteObjectAsync(deleteRequest);

                return true;
            }
            catch
            {
                return true;
            }
        }

        public async Task<byte[]> DownloadAsync(string directory, string fileName)
        {
            var requestObject = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key        = $"{directory}/{fileName}"
            };

            using var response = await s3.GetObjectAsync(requestObject);

            if (response.HttpStatusCode != HttpStatusCode.OK)
            {
                throw new FileNotFoundException();
            }

            var memoryStream = new MemoryStream();
            await response.ResponseStream.CopyToAsync(memoryStream);

            return memoryStream.ToArray();
        }

        private async Task<bool> PutObject(string directory, string fileName, IFormFile file)
        {
            var request = new PutObjectRequest
            {
                BucketName            = _bucketName,
                Key                   = $"{directory}/{fileName}",
                InputStream           = file.OpenReadStream(),
                Metadata              = { ["Content-Type"] = file.ContentType },
                DisablePayloadSigning = true
            };

            var response = await s3.PutObjectAsync(request);

            return response.HttpStatusCode is HttpStatusCode.OK;
        }
    }
}
