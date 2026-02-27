# Employee Management System - Project Guide

## Overview

Employee Management System is a .NET 10 backend built with traditional Clean Architecture. It manages user identity with support for localization. The project has 4 flat layers — no modules, no caching, no message broker.

## Tech Stack

- **.NET 10** - Target framework
- **ASP.NET Core** - Web API
- **Entity Framework Core 10** - ORM/Data access
- **ASP.NET Identity** - User management base
- **MediatR** - CQRS pattern implementation
- **FluentValidation** - Request validation
- **Serilog** - Logging
- **Hangfire** - Background jobs
- **Swashbuckle / Scalar** - OpenAPI/Swagger documentation

## Project Structure

```
EmployeeManagementSystem.sln
├── Web/API/                       # Main API entry point
│   ├── Controllers/
│   │   ├── ApiControllerBase.cs           # MediatR Execute() helpers
│   │   ├── ApiControllerBaseAdminPanel.cs # Route: /api/v{v}/AdminPanel/[controller]
│   │   ├── ApiControllerBaseUserPortal.cs # Route: /api/v{v}/UserPortal/[controller]
│   │   ├── IdentityController.cs
│   │   └── TestController.cs
│   ├── Attributes/RoleAuthorizeAttribute.cs
│   ├── Configurations/            # API pipeline config (no ModulesConfiguration)
│   ├── Filters/
│   ├── Services/CurrentUserService.cs
│   ├── Program.cs
│   ├── Startup.cs
│   └── appsettings.json
├── Domain/                        # ALL domain types
│   ├── Entities/
│   │   ├── User.cs                # IdentityUser<Guid>, IHasDomainEvent
│   │   ├── Session.cs
│   │   └── UserRole.cs            # IdentityUserRole<Guid>
│   ├── Enums/AccountStatus.cs
│   ├── ValueObjects/
│   │   ├── Company.cs
│   │   └── FullName.cs
│   ├── Models/AuditableEntity.cs
│   ├── Models/DomainEvent.cs
│   ├── Models/Language.cs
│   ├── LocalizedString.cs
│   ├── WeakLocalizedString.cs
│   ├── Role.cs                    # Enum: Admin, User
│   └── Exceptions/
├── Application/                   # ALL use cases
│   ├── IClaroDbContext.cs
│   ├── IIdentityDbContext.cs      # extends IClaroDbContext
│   ├── IApplicationUserService.cs
│   ├── DependencyInjection.cs
│   ├── Identity/
│   │   ├── Commands/
│   │   │   ├── LoginCommand.cs
│   │   │   ├── RefreshTokenCommand.cs
│   │   │   ├── UserPostCommand.cs
│   │   │   ├── UserPostPutCommon.cs
│   │   │   ├── UserPutCommand.cs
│   │   │   └── UserPutPhotoCommand.cs
│   │   ├── Queries/
│   │   │   ├── UserGetQuery.cs
│   │   │   └── UsersGetPageQuery.cs
│   │   ├── Interfaces/
│   │   │   ├── IIdentityManager.cs
│   │   │   ├── ITokenService.cs
│   │   │   ├── ITokenGeneratorService.cs
│   │   │   └── ITokenValidatorService.cs
│   │   ├── Models/
│   │   │   ├── AuthResponse.cs
│   │   │   ├── FullNameDto.cs
│   │   │   ├── TokenObject.cs
│   │   │   └── UserDto.cs
│   │   └── Resources/Accounts/AccountsRes.resx
│   └── Common/
│       ├── Behaviors/             # MediatR pipeline behaviors
│       ├── Enums/                 # FileType, PhoneNumberCode, TokenType
│       ├── Exceptions/            # BadRequest, Forbidden, NotFound, Validation
│       ├── Extensions/            # 15+ extension method classes
│       ├── Interfaces/            # ICurrentUserService, IStorageService, IRazorRendererService, etc.
│       └── Models/                # PaginatedList, PagingOptionsRequest, etc.
└── Infrastructure/                # ALL infrastructure
    ├── ClaroDbContext.cs          # IdentityDbContext<User,...>, IIdentityDbContext
    ├── DependencyInjection.cs
    ├── Identity/
    │   ├── ApplicationUserService.cs
    │   ├── IdentityManager.cs
    │   ├── Configurations/
    │   │   ├── UserConfiguration.cs
    │   │   └── SessionConfiguration.cs
    │   ├── Migrations/
    │   ├── Models/                # AppClaims, JwtConfig, IdentityOptions, etc.
    │   └── TokenServices/         # TokenService, TokenGeneratorService, TokenValidatorService
    ├── Configurations/            # Hangfire, MediatR, Storage
    ├── Middleware/DomainEventMiddleware.cs
    ├── Persistence/               # BaseConfigurations, DomainDrivenEntityConfiguration, Database
    └── Services/                  # DateTime, DomainEvent, SMS, Storage, Sender, RazorRenderer
```

## Architecture Patterns

### Clean Architecture Layers

1. **Domain** - Entities, value objects, domain events, interfaces
2. **Application** - Commands, Queries, Validators, Handlers (CQRS via MediatR)
3. **Infrastructure** - `ClaroDbContext`, Identity services, external service implementations
4. **API** - Controllers, route configuration

### CQRS Pattern

Commands and Queries live in `Application/Identity/` with nested validators and handlers:

```csharp
public class EntityPostCommand : IRequest<string>
{
    // Properties from request body

    public class Validator : AbstractValidator<EntityPostCommand>
    {
        public Validator(IIdentityDbContext context) { }
    }

    public class Handler(IIdentityDbContext context) : IRequestHandler<EntityPostCommand, string>
    {
        public async Task<string> Handle(EntityPostCommand request, CancellationToken ct)
        {
            var entity = new Entity { /* map properties */ };
            await context.SaveChangesAsync(ct);
            return entity.Id.ToString();
        }
    }
}
```

### MediatR Pipeline Behaviors (execution order)

1. `UnhandledExceptionBehavior` - catches unhandled exceptions
2. `LoggingBehavior` - logs request/response
3. `PerformanceBehavior` - tracks slow queries
4. `ValidationBehavior` - runs FluentValidation

### Naming Conventions

- **Commands**: `{Entity}{Action}Command.cs` (e.g., `UserPostCommand`, `UserPutCommand`)
- **Queries**: `{Entity}Get{Type}Query.cs` (e.g., `UsersGetPageQuery`, `UserGetQuery`)
- **Controllers**: `{Entity}Controller.cs`
- **DbContext Interface**: `IIdentityDbContext` (extends `IClaroDbContext`)
- **DbContext Implementation**: `ClaroDbContext`

### Entity Base Classes

- Standard entities: inherit `AuditableEntity<TId>` and implement `IHasDomainEvent`
- Identity entities: inherit from ASP.NET Identity base classes (`IdentityUser<Guid>`, `IdentityUserRole<Guid>`)

### Localization

Use `LocalizedString` value object for multi-language text fields:
```csharp
public LocalizedString Name { get; set; }
// Convert with: request.Name.ToLocalizedString()
```

## Identity Feature

### Implemented
- **User management** - Create, update, paginated list, profile photo upload
- **Authentication** - Login with email/password, JWT tokens, refresh tokens
- **Session management** - Token/RefreshToken stored in Sessions table
- **Role-based authorization** - Admin and User roles via `Role` enum

### ClaroDbContext

`ClaroDbContext` inherits from `IdentityDbContext<User, IdentityRole<Guid>, Guid, ...>` and implements `IIdentityDbContext`. It includes:
- Audit field tracking (Created, CreatedBy, LastModified, etc.)
- Soft-delete via `VRemove()`
- Domain event dispatching via `DomainEventMiddleware`
- Transaction support

### Endpoints (`IdentityController` at `/api/v1/AdminPanel/Identity`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `GetPage` | Admin | Paginated user list |
| GET | (root) | Authenticated | Current user profile |
| POST | `PostUser` | Admin | Create user |
| PUT | `PutUser` | Admin | Update user |
| PUT | `LogIn` | Anonymous | Login |
| PUT | `RefreshToken` | Anonymous | Refresh JWT |
| PUT | `PutUserPhoto` | Authenticated | Update profile photo |

## Build & Run

```bash
# Build solution
dotnet build EmployeeManagementSystem.sln

# Run API
dotnet run --project Web/API/API.csproj

# Run with watch
dotnet watch run --project Web/API/API.csproj
```

## Database Migrations

```bash
# Add migration
dotnet ef migrations add <MigrationName> --project Infrastructure --startup-project Web/API

# Apply migrations
dotnet ef database update --project Infrastructure --startup-project Web/API
```

## API Conventions

### Controller Base Classes
- `ApiControllerBaseAdminPanel` - Admin panel endpoints (`/api/v{v}/AdminPanel/[controller]`)
- `ApiControllerBaseUserPortal` - User portal endpoints (`/api/v{v}/UserPortal/[controller]`)
- `ApiControllerBase` - General endpoints (`/api/v{v}/[controller]`)

### Authorization
- `[Authorize]` - Requires authentication
- `[RoleAuthorize(Role.Admin)]` - Admin-only endpoints

### Response Types
- Paginated results: `PaginatedList<TDto>`
- Create operations return: `string` (ID of created entity)

## Adding a New Entity

1. Create entity in `Domain/Entities/`
2. Add DbSet to `IIdentityDbContext` and `ClaroDbContext`
3. Create Commands in `Application/Identity/Commands/`
4. Create Queries in `Application/Identity/Queries/`
5. Create Controller in `Web/API/Controllers/`
6. Add EF configuration in `Infrastructure/Identity/Configurations/`
7. Create and apply migration

## Configuration

- Main configuration in `Web/API/appsettings.json`
- JWT settings: `Jwt:Key`, `Jwt:Issuer` in appsettings
- Storage: local or S3 (via `StorageConfiguration`)
- Background jobs: Hangfire (via `HangfireConfiguration`)
