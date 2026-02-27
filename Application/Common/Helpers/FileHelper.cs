using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Enums;
using Microsoft.AspNetCore.Http;

namespace EmployeeManagement.Application.Common.Helpers
{
    internal record FileContent(IEnumerable<byte> Bytes, string Extension, string ContentType)
    {
        public bool Equals(byte[] file) => file.Take(Bytes.Count()).SequenceEqual(Bytes);
    }

    public static class FileHelper
    {
        private static readonly List<FileContent> FileContents = new()
        {
            new FileContent(new byte[] { 0x42, 0x4D }, "bmp", "image/bmp"),
            new FileContent(new byte[] { 0, 0, 1, 0 }, "ico", "image/ico"),
            new FileContent(new byte[] { 0xFF, 0xD8, 0xFF }, "jpg", "image/jpg"),
            new FileContent(new byte[] { 0x89, 0x50, 0x4E, 0x47 }, "png", "image/png"),
            new FileContent(new byte[] { 0x25, 0x50, 0x44, 0x46 }, "pdf", "file/pdf")
        };

        public static async Task<bool> ValidateFile(this IFormFile file, FileType fileType)
        {
            var isValid = ValidateType(fileType, Path.GetExtension(file.FileName).ToLower());

            var bytes = await file.GetBytesAsync();

            if (bytes.Length == 0)
                return isValid;

            var type = GetFileType(bytes[..4]);

            return ValidateType(fileType, type.extension);
        }

        public static async Task<bool> ValidateFile(this IFormFile file, int maxSize)
        {
            var bytes = await file.GetBytesAsync();

            if (bytes.Length == 0)
                return true;

            return FileSize(bytes) < maxSize;
        }

        public static (string extension, string contentType) GetFileType(byte[] file)
        {
            var fileContent = FileContents.FirstOrDefault(c => c.Equals(file));

            return fileContent is not null ? (fileContent.Extension, fileContent.ContentType) : (null, null);
        }

        public static async Task<byte[]> GetBytesAsync(this IFormFile formFile)
        {
            using var memoryStream = new MemoryStream();

            await formFile.CopyToAsync(memoryStream);

            return memoryStream.ToArray();
        }

        private static float FileSize(IReadOnlyCollection<byte> file) => (float) file.Count / 1024 / 1024;

        private static bool ValidateType(FileType type, string extension) => type switch
        {
            FileType.Picture => extension is "jpg" or "png" or "jpeg",
            FileType.Pdf => extension == "pdf",
            _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
        };
    }
}
