# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
ng serve                        # Start dev server (localhost:4200)
ng build                        # Production build
ng build --watch --configuration development  # Watch mode
ng test                         # Run tests (Karma/Jasmine)
ng lint                         # Lint code
```

## Architecture

Angular 19 standalone SPA using a **DDD-inspired layered module pattern**. Each feature module under `src/Modules/` is split into four sub-layers:

```
src/Modules/{Feature}/
├── {Feature}.Domain/          # Interfaces, models, value objects
├── {Feature}.Application/     # Abstract repository interfaces + use cases
├── {Feature}.Infrastructure/  # Concrete HTTP implementations of repositories
└── {feature}.presentation/    # Standalone components
```

**Current modules:** `Identity` (auth & user management), `Common` (shared domain/application base types).

### Data Flow

```
Component → inject(UseCase) → UseCase.execute() → Repository (abstract)
                                                        ↓
                                              HttpClient → API → map via Mapper
```

Use cases are injected directly into components. Repositories are abstract classes provided as tokens with Infrastructure implementations.

### Routing

All routes are lazy-loaded in `src/app/app.routes.ts`. Protected routes use `authGuard` (checks `localStorage.getItem('authToken')`). `/login` uses `NoAuthGuard` to redirect authenticated users away.

## Key Patterns & Conventions

### HTTP Interceptors (`src/app/interceptors/`)
- **token.interceptor.ts** – Adds `Authorization: Bearer`, `Accept-Language`, and handles 401/403/404/500 by routing to error pages or login. Skip `Content-Type` injection by setting header `Skip-Content-Type`.
- **logging.interceptor.ts** – Logs request URLs.

### Localization
- Supports English (LTR) and Arabic (RTL) via `ngx-translate` + `TranslationService`.
- Translation files: `src/assets/i18n/en.json` and `ar.json`.
- `LocalizedString` value object: `{ ar: string, en: string }`. Use `LocalizedString.getString(text)` to get the current-language string.
- Language change triggers `window.location.reload()` (known TODO).

### API Integration
- Base URL from `src/environments/environment.ts`: `apiUrl`
- Endpoint pattern: `/api/v1/AdminPanel/{Module}/{Action}` or `/api/v1/UserPortal/{Module}/{Action}`
- Auth token stored in `localStorage` as `authToken`

### UI Stack
- **PrimeNG v19** (Aura theme) – primary component library
- **Angular Material v19** – used for `MatSidenav` layout shell
- **TailwindCSS v3.4** – utility styling; custom CSS vars from PrimeNG theme (`--bg-color`, `--text-color`, etc.)
- **Chart.js v4.4** – dashboard charts

### Adding a New Feature Module

1. Create `src/Modules/{Feature}/{Feature}.Domain/` with models and repository interfaces.
2. Create `src/Modules/{Feature}/{Feature}.Application/` with use case classes implementing `UseCase<Input, Output>`.
3. Create `src/Modules/{Feature}/{Feature}.Infrastructure/` with `HttpClient`-backed repository implementations.
4. Create `src/Modules/{Feature}/{feature}.presentation/` with standalone components.
5. Register repository provider in `app.config.ts` (abstract token → infrastructure class).
6. Add lazy-loaded routes to `src/app/app.routes.ts` with `authGuard`.

## Environment

- Dev API: Azure-hosted backend (see `environment.ts`)
- Service Worker (`ngsw-config.json`) is enabled only in production builds
- Strict TypeScript mode enabled (`strict`, `strictTemplates`, `noImplicitReturns`)
