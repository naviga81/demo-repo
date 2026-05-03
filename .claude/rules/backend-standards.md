# Backend Coding Standards — .NET / C#

These standards apply to all code written under `demo-app/backend/`. The Audit Agent
scores compliance against these rules in the Standards Compliance category.

## Naming and Conventions

- Follow Microsoft's official C# coding conventions and naming guidelines
- Controllers, services, and models must be in their designated folders under `src/`

## Architecture

- Controllers must be thin — business logic belongs in Services, not Controllers
- Services must be injected via interfaces (Dependency Injection); never instantiate a
  service directly inside a controller or another service
- All database operations must go through the repository pattern
- Entities must not be returned directly from API endpoints — always use DTOs

## Documentation

- All public methods must have XML doc comments (`/// <summary>`)

## Async

- Use `async`/`await` throughout — never use `.Result` or `.Wait()` blocking calls

## HTTP Semantics

- HTTP status codes must be semantically correct:
  - 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 409 Conflict, 500 Server Error
- All new API endpoints must be under a versioned path prefix — minimum `/api/v1/`
- Unversioned endpoints (e.g. `/api/tasks`) are a standards violation

## Error Handling

- Never swallow exceptions — log and re-throw, or return a structured error response
- Silent catch blocks are a violation

## Namespace Ambiguity

- `src/GlobalUsings.cs` and `tests/GlobalUsings.cs` both contain:
  `global using Task = System.Threading.Tasks.Task;`
- Never remove these files — they prevent CS0104 errors when `DemoApp.Api.Models` is in scope
- If a new model class shares a name with a BCL type, add a corresponding global using
  alias rather than using a per-file alias

## Code Quality

- Maximum function length: 50 lines — split if longer
- Functions must do one thing (Single Responsibility Principle)
- No magic numbers or magic strings — use named constants from `Common/TaskConstants.cs`
  or a new constants file in `Common/`
- No unused imports, no unused variables
- No commented-out dead code committed to the repository
- No logic duplicated across more than one file — extract to a shared service or utility

## File Boundary

- Backend Agent may only write files under `demo-app/backend/`
- Frontend code, test files, and CI configuration are out of scope
- New NuGet packages must be flagged in the change summary with justification
