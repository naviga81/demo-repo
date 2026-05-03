# Testing Standards

These rules apply to all test code written by the Test Agent under
`demo-app/frontend/src/__tests__/` and `demo-app/backend/tests/`.

## Naming

- All test names follow the pattern: `MethodName_Scenario_ExpectedResult`
- Gherkin-derived tests follow: `Scenario_<ScenarioTitle>_<ExpectedOutcome>`

## Test Focus

- One assertion focus per test — test one behaviour, not multiple
- Tests must be deterministic — no time-dependent, order-dependent, or
  network-dependent behaviour without explicit mocking

## Per-Function Rule

For every new or modified function or method (frontend or backend), write:
1. One **happy path** test — verifies expected output for valid input
2. One **failure or edge case** test — verifies correct behaviour for invalid,
   null, or boundary input

## Per-API-Endpoint Rule

For every new or modified API endpoint, write one test per HTTP status code that
endpoint can return. Example: if an endpoint returns 200, 400, and 404, write three
tests — one for each code.

## Per-React-Component Rule

For every new React component, write exactly three tests:
1. **Render test** — the component renders without crashing given valid props
2. **Interaction test** — a user interaction (click, type, or select) produces
   the expected result
3. **Edge case test** — the component handles empty, null, or unexpected props
   without crashing

## Integration Test Rule

- Write at least one integration test per acceptance criterion in the structured spec
- Integration test definition: the frontend calls the actual backend API endpoint
  (not a mock) and receives the correct response shape and HTTP status code

## Gherkin Coverage

- Every Gherkin scenario defined in the ADO user stories must map to exactly one named test
- An untested Gherkin scenario is treated as a coverage gap regardless of line coverage %

## Coverage Threshold

- Minimum 70% line coverage on all changed files
- Coverage below 50% on any changed file is a blocking finding

## Test File Locations

| What | Where |
|---|---|
| Frontend component and hook tests | `demo-app/frontend/src/__tests__/` |
| Backend unit tests | `demo-app/backend/tests/Unit/` |
| Backend integration tests | `demo-app/backend/tests/Integration/` |

## Isolation

- Tests must clean up after themselves — no shared mutable state between tests
- Mock components must render an empty placeholder — never render prop values as
  text children, as this causes spurious `getByText` matches in other tests
- Do not modify application source code to make a test pass

## Self-Correction (Test Agent only)

The Test Agent runs two correction passes before reporting failure:

**Pass 1 — Build errors:** parses compiler error lines from stderr, maps each to the
affected test file, and asks Claude to fix only files under `tests/`. Up to 3 attempts.

**Pass 2 — Assertion failures:** after the build is clean, corrects failing xUnit test
cases one file at a time. Up to 3 attempts per file.

Source files are never modified during either correction pass.
