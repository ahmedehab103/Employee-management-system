# Employee Management System Backend

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4)
![Version](https://img.shields.io/badge/Version-Beta-red)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-blue)

Employee Management System is a .NET 10 backend built with Clean Architecture principles. It provides identity management with JWT authentication, role-based authorization, and session management.

## Technologies

| Category | Technology |
|----------|------------|
| Framework | .NET 10, ASP.NET Core |
| ORM | Entity Framework Core 10 |
| CQRS | MediatR |
| Validation | FluentValidation |
| API Docs | Swashbuckle (Swagger/OpenAPI), Scalar |
| Logging | Serilog |
| Storage | AWS S3, Local Storage |

## Project Structure

```
EmployeeManagementSystem.sln
├── Web/API/              # Main API entry point
├── Domain/               # Domain primitives
├── Application/          # Use cases (CQRS)
└── Infrastructure/       # Database, Identity, external services
```

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- SQL Server (or configure for your preferred database)

### Build & Run

```bash
# Restore dependencies
dotnet restore

# Build the solution
dotnet build EmployeeManagementSystem.sln

# Run the API
dotnet run --project Web/API/API.csproj

# Or with hot reload
dotnet watch run --project Web/API/API.csproj
```

The API will be available at `https://localhost:5001` (or the configured port).

### Database Configuration

1. Update the connection string in `Web/API/appsettings.json`
2. Apply migrations:

```bash
dotnet ef migrations add <MigrationName> --project Infrastructure --startup-project Web/API
dotnet ef database update --project Infrastructure --startup-project Web/API
```

## Architecture

This project follows **Clean Architecture** with 4 flat layers:

| Layer | Responsibility |
|-------|----------------|
| **Domain** | Entities, value objects, domain events |
| **Application** | Commands, Queries, Validators (CQRS via MediatR) |
| **Infrastructure** | DbContext, external services |
| **API** | Controllers, middleware, configuration |

## API Documentation

Scalar UI is available at `/scalar/AdminPanel` when running the application.

## Documentation

- [CLAUDE.md](CLAUDE.md) - Detailed project guide for developers
- [TECH_DEBT.md](TECH_DEBT.md) - Technical debt tracking

## License

Proprietary

## Support

For issues or questions, contact: Ahmedehap103@gmail.com
