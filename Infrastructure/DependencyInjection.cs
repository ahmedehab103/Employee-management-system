using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using EmployeeManagement.Application;
using EmployeeManagement.Application.Common.Enums;
using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Application.Identity.Interfaces;
using EmployeeManagement.Domain;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Infrastructure.Configurations;
using EmployeeManagement.Infrastructure.Identity;
using EmployeeManagement.Infrastructure.Identity.Models;
using EmployeeManagement.Infrastructure.Identity.TokenServices;
using EmployeeManagement.Infrastructure.Services;
using EmployeeManagement.Infrastructure.Services.SmsServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeManagement.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration,
            IHostEnvironment env)
        {
            services.ConfigureHangfire(configuration);

            services.ConfigureCloudlareStorage(configuration);

            services.ConfigureServices(configuration);

            services.AddApplicationInsights(configuration, env);

            services.ConfigureMediatR();

            services.ConfigureIdentity(configuration, env);

            return services;
        }

        public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<DomainEventService>();
            services.AddScoped<IRazorRendererService, RazorRendererService>();
            services.AddScoped<IDomainEventService, DomainEventService>();
            services.AddTransient<IDateTime, DateTimeService>();
            services.AddScoped<IClaroSender, Sender>();
            services.AddScoped<ISmsService, SmsService>();

            services.AddHttpClient("Cequens", (_, client) =>
            {
                var uri = configuration["Cequens:Uri"];
                if (!string.IsNullOrEmpty(uri))
                    client.BaseAddress = new Uri(uri);

                var token = configuration["Cequens:Token"];
                if (!string.IsNullOrEmpty(token))
                    client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);
            });

            services.AddHttpClient("SmsEg", (_, client) =>
            {
                var uri = configuration["SmsEg:Uri"];
                if (!string.IsNullOrEmpty(uri))
                    client.BaseAddress = new Uri(uri);
            });
        }

        public static void ConfigureIdentity(this IServiceCollection services, IConfiguration configuration, IHostEnvironment env)
        {
            JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            services.AddDbContext<AppDbContext>(ops =>
            {
                ops.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"),
                    o => o.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName));

                if (env.IsDevelopment())
                {
                    ops.EnableSensitiveDataLogging();
                }
            });

            services.AddScoped<IAppDbContext, AppDbContext>();

            services.AddIdentity<User, IdentityRole<Guid>>(opts =>
                {
                    opts.ClaimsIdentity.UserIdClaimType = AppClaims.Id;
                    opts.ClaimsIdentity.RoleClaimType = AppClaims.Roles;
                    opts.ClaimsIdentity.UserNameClaimType = AppClaims.UserName;
                    opts.SignIn.RequireConfirmedEmail = false;
                    opts.SignIn.RequireConfirmedPhoneNumber = false;
                    opts.User.RequireUniqueEmail = true;
                    opts.Password.RequiredLength = 8;
                    opts.Password.RequireNonAlphanumeric = false;
                    opts.Password.RequireLowercase = false;
                    opts.Password.RequireUppercase = false;
                    opts.Password.RequireDigit = false;
                    opts.Lockout.MaxFailedAccessAttempts = configuration.GetValue<int>("Identity:MaxFailedAttempts", 5);
                    opts.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(
                        configuration.GetValue<int>("Identity:LockoutMinutes", 5));
                })
                .AddRoles<IdentityRole<Guid>>()
                .AddErrorDescriber<LocalizedIdentityErrorDescriber>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(opts =>
                {
                    opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(opts =>
                {
                    opts.RequireHttpsMetadata = false;
                    opts.SaveToken = true;
                    opts.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = AppClaims.UserName,
                        RoleClaimType = AppClaims.Roles,
                        ValidateIssuer = configuration["Jwt:Issuer"] is not null,
                        ValidIssuer = configuration["Jwt:Issuer"],
                        ValidateAudience = false,
                        ClockSkew = TimeSpan.Zero,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                            configuration["Jwt:Key"]
                            ?? throw new InvalidOperationException("Jwt key can not be null")))
                    };
                    opts.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                path.StartsWithSegments("/Hub", StringComparison.OrdinalIgnoreCase))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization();

            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ITokenGeneratorService, TokenGeneratorService>();
            services.AddScoped<ITokenValidatorService, TokenValidatorService>();
            services.AddScoped<IIdentityManager, IdentityManager>();
            services.AddScoped<IApplicationUserService, ApplicationUserService>();

            services.Configure<Identity.Models.IdentityOptions>(config =>
            {
                config.RestrictSingleLogin = false;
                config.LogoutOnNewLogin = false;
                config.RestrictSingleDevice = false;
                config.NumericVerificationToken = true;
                config.NumericTokenLength = 4;
                config.SessionExpirationPeriod = configuration.GetValue<int>("Identity:SessionExpirationPeriod", 1);
                config.TokenExpirationPeriod = configuration.GetValue<int>("Identity:TokenExpirationPeriod", 1);
                config.TokenResetPeriod = configuration.GetValue<int>("Identity:TokenResetPeriod", 1);
                config.AcceptedCodes = EnumExtensions.ToArray<PhoneNumberCode>();
            });

            services.Configure<JwtConfig>(config =>
            {
                config.Key = configuration["Jwt:Key"];
                config.Issuer = configuration["Jwt:Issuer"];
                config.ExpirationPeriod = configuration.GetValue<int>("Jwt:ExpireDays", 1);
            });
        }

        public static void AddApplicationInsights(
            this IServiceCollection services,
            IConfiguration configuration,
            IHostEnvironment env)
        {
            if (env.IsProduction())
            {
                services.AddApplicationInsightsTelemetry(ops =>
                {
                    ops.DeveloperMode = false;
                    ops.ApplicationVersion = "1.0";
                    ops.InstrumentationKey = configuration["ApplicationInsights:InstrumentationKey"];
                });
            }
        }
    }
}
