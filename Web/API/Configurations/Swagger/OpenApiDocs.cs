using Microsoft.OpenApi.Models;

namespace API.Configurations.Swagger
{
    /// <summary>
    /// Api docs for swagger (admin - user)
    /// </summary>
    public static class OpenApiDocs
    {
        /// <summary>
        /// Api docs for user
        /// </summary>
        public static readonly OpenApiInfo ApiInfoUser = new()
        {
            Version        = "v1",
            Title          = "Employee Management System User",
            Description    = "An ASP.NET Core Web API for managing ToDo items",
            TermsOfService = new Uri("https://example.com/terms"),
            Contact = new OpenApiContact
            {
                Name = "Example Contact",
                Url  = new Uri("https://example.com/contact")
            },
            License = new OpenApiLicense
            {
                Name = "Example License",
                Url  = new Uri("https://example.com/license")
            }
        };

        /// <summary>
        /// Api docs for Admin
        /// </summary>
        public static readonly OpenApiInfo ApiInfoAdmin = new()
        {
            Version        = "v1",
            Title          = "Employee Management System Admin",
            Description    = "An ASP.NET Core Web API for managing ToDo items",
            TermsOfService = new Uri("https://example.com/terms"),
            Contact = new OpenApiContact
            {
                Name = "Example Contact",
                Url  = new Uri("https://example.com/contact")
            },
            License = new OpenApiLicense
            {
                Name = "Example License",
                Url  = new Uri("https://example.com/license")
            }
        };
    }
}
