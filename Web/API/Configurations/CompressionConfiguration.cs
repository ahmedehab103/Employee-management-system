using System.IO.Compression;
using Microsoft.AspNetCore.ResponseCompression;

namespace API.Configurations
{
    public static class CompressionConfiguration
    {
        public static IServiceCollection AddCompression(this IServiceCollection services)
        {
            services
                .AddResponseCompression(options =>
                {
                    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[]
                    {
                        ContentTypes.WebP,
                        ContentTypes.Png,
                        ContentTypes.Jpeg,
                        ContentTypes.Svg,
                        ContentTypes.Icon
                    });

                    options.Providers.Add<BrotliCompressionProvider>();
                    options.Providers.Add<GzipCompressionProvider>();
                })
                .Configure<BrotliCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest)
                .Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest);
            return services;
        }

        public static class ContentTypes
        {
            /// <summary>Default content type.</summary>
            public const string DefaultContentType = "application/octet-stream";

            /// <summary>Icon content type.</summary>
            public const string Icon = "image/x-icon";

            /// <summary>Web Picture format (WebP) (.webp).</summary>
            public const string WebP = "image/webp";

            /// <summary>SVG image content type.</summary>
            public const string Svg = "image/svg+xml";

            /// <summary>Joint Photographic Expert Group (JPEG) image (.jpg, .jpeg, .jfif, .pjpeg, .pjp); Defined in RFC 2045 and RFC 2046.</summary>
            public const string Jpeg = "image/jpeg";

            /// <summary>Portable Network Graphics; Registered,[8] Defined in RFC 2083.</summary>
            public const string Png = "image/png";
        }
    }
}
