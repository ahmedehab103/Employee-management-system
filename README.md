# Employee Management System

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4)
![Angular](https://img.shields.io/badge/Angular-19-DD0031)
![Version](https://img.shields.io/badge/Version-Beta-red)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-blue)

A full-stack Employee Management System with a .NET 10 backend and an Angular 19 frontend. It provides identity management with JWT authentication, role-based authorization, session management, and employee CRUD operations.

## Repository Structure

```
EmployeeManagementSystem.sln
├── Web/API/              # ASP.NET Core API entry point
├── Domain/               # Domain entities, enums, value objects
├── Application/          # Use cases (CQRS via MediatR)
├── Infrastructure/       # DbContext, Identity, external services
└── Client-app/           # Angular 19 SPA frontend
```

---

## Backend (.NET 10)

### Technologies

| Category | Technology |
|----------|------------|
| Framework | .NET 10, ASP.NET Core |
| ORM | Entity Framework Core 10 |
| Identity | ASP.NET Identity |
| CQRS | MediatR |
| Validation | FluentValidation |
| API Docs | Swashbuckle (Swagger/OpenAPI), Scalar |
| Logging | Serilog |
| Background Jobs | Hangfire |
| Storage | AWS S3, Local Storage |

### Architecture

Clean Architecture with 4 flat layers:

| Layer | Responsibility |
|-------|----------------|
| **Domain** | Entities, value objects, enums, domain events |
| **Application** | Commands, Queries, Validators (CQRS via MediatR) |
| **Infrastructure** | DbContext, Identity services, external integrations |
| **API** | Controllers, middleware, pipeline configuration |

### API Endpoints

**Base route:** `/api/v1/AdminPanel/`

#### Identity (`/Identity`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `GetPage` | Admin | Paginated user list |
| GET | `` | Authenticated | Current user profile |
| POST | `PostUser` | Admin | Create user |
| PUT | `PutUser` | Admin | Update user |
| PUT | `LogIn` | Anonymous | Login |
| PUT | `RefreshToken` | Anonymous | Refresh JWT |
| PUT | `PutUserPhoto` | Authenticated | Update profile photo |

#### Employee (`/Employee`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `GetDepartments` | Admin | List all departments |
| GET | `GetPage` | Admin | Paginated employee list |
| GET | `{id}` | Admin | Get employee by ID |
| POST | `PostEmployee` | Admin | Create employee |
| PUT | `PutEmployee` | Admin | Update employee |
| DELETE | `DeleteEmployee/{id}` | Admin | Soft-delete employee |

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- SQL Server (or configure for your preferred database)

### Build & Run

```bash
# Restore & build
dotnet restore
dotnet build EmployeeManagementSystem.sln

# Run the API
dotnet run --project Web/API/API.csproj

# Hot reload
dotnet watch run --project Web/API/API.csproj
```

The API will be available at `https://localhost:7274`.

### Database Migrations

```bash
# Add a migration
dotnet ef migrations add <MigrationName> --project Infrastructure --startup-project Web/API

# Apply migrations
dotnet ef database update --project Infrastructure --startup-project Web/API
```

### API Documentation

Scalar UI is available at `/scalar/AdminPanel` when the application is running.

---

## Frontend (Angular 19)

### Technologies

| Category | Technology |
|----------|------------|
| Framework | Angular 19 (standalone components) |
| UI Library | PrimeNG v19 (Aura theme) |
| Layout | Angular Material v19 (sidenav) |
| Styling | TailwindCSS v3.4 |
| Charts | Chart.js v4.4 |
| i18n | ngx-translate (English + Arabic/RTL) |
| HTTP | Angular HttpClient with JWT interceptor |

### Architecture

DDD-inspired 4-layer module pattern. Each feature under `src/Modules/` is split into:

```
src/Modules/{Feature}/
├── {Feature}.Domain/          # Interfaces, models, enums
├── {Feature}.Application/     # Abstract repository + use cases
├── {Feature}.Infrastructure/  # HttpClient-backed repository implementations
└── {feature}.presentation/    # Standalone Angular components
```

**Current modules:** `Identity` (auth & user management), `Employee` (employee CRUD), `Common` (shared base types).

### Features

- **Authentication** — JWT login, token storage, route guards
- **Admins List** — Paginated user table with create/update dialog
- **Employees List** — Paginated employee table with:
  - Filter by department (loaded from API)
  - Full-text search
  - Create / update dialog (date picker, salary input, department select)
  - Soft delete with confirmation
- **Analytics** — Dashboard
- **Localization** — English and Arabic (RTL) support

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Angular CLI](https://angular.dev/tools/cli) v19

### Build & Run

```bash
cd Client-app

# Install dependencies
npm install

# Start dev server (http://localhost:4200)
ng serve

# Production build
ng build
```

Update the API base URL in `src/environments/environment.ts` if needed:

```typescript
export const environment = {
  apiUrl: 'https://localhost:7274/api',
  // ...
};
```

---

## Documentation

- [CLAUDE.md](CLAUDE.md) — Backend developer guide
- [Client-app/CLAUDE.md](Client-app/CLAUDE.md) — Frontend developer guide

## License

Proprietary

## Support

For issues or questions, contact: Ahmedehap103@gmail.com
