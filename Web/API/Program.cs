using API;
using API.Configurations;
using EmployeeManagement.Infrastructure;
using EmployeeManagement.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Host.ConfigureLogging();

builder.Services.ConfigureServices(builder.Configuration, builder.Environment);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

await DataSeeder.SeedAsync(app.Services);

app.ConfigureTheApp(builder.Configuration, builder.Environment);

app.Run();
