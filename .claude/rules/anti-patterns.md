# Anti-Patterns — What Never To Do

These are hard prohibitions enforced by the Audit Agent. Any violation is a finding.
CRITICAL or HIGH severity findings block the merge regardless of composite score.

## Secrets and Configuration

- Never hardcode secrets, API keys, PATs, tokens, or credentials anywhere in the codebase
- All environment-specific configuration must come from environment variables
- Never commit `.env` — use `.env.example` as the committed template

## Code Quality

- No commented-out dead code committed to the repository
- No unused imports, unused variables, or unreachable code blocks
- No magic numbers or magic strings — every literal must be a named constant
- No logic duplicated across more than one file — extract shared logic before committing
- No implicit `any` in TypeScript; no untyped parameters in C#
- No function or method longer than 50 lines — split it

## Error Handling

- No silent catch blocks — errors must be logged and re-thrown or returned as structured responses
- Never swallow exceptions in .NET — use `throw` or return a structured error DTO

## React / Frontend

- No class components — functional components only
- No inline styles — Tailwind utility classes only
- No literal UI text inside JSX logic — all strings go in `utils/strings.ts`
- Never import an entire library when only one function is needed
  (`import _ from 'lodash'` is wrong; `import debounce from 'lodash/debounce'` is right)
- No unversioned API URLs — every backend call must use a `/api/v1/` prefixed constant

## .NET / Backend

- Never return entity objects directly from API endpoints — use DTOs
- Never use `.Result` or `.Wait()` — use `async`/`await`
- Never instantiate a service directly — use constructor injection through an interface
- Never remove `GlobalUsings.cs` from `src/` or `tests/` — it prevents namespace ambiguity
- No unversioned API endpoints — minimum prefix is `/api/v1/`

## Testing

- Never modify application source code to make a failing test pass
- No tests that depend on external network calls without explicit mocking
- No tests that depend on execution order or shared mutable state
- Mock components must render an empty placeholder — never render prop values as text
  children (causes spurious `getByText` matches in unrelated tests)
- Never mark a test as passing by removing its assertions

## Pipeline / Agent Behaviour

- Agents must not pass free-form text to each other — all inter-agent communication
  uses structured JSON contracts defined in `pipeline/contracts/`
- No agent may perform work outside its defined file boundary
- The Orchestrator is the only agent that calls other agents
- Agents must not make product or scope decisions — they implement the spec, not change it
