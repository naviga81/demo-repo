# Frontend Coding Standards — React / TypeScript

These standards apply to all code written under `demo-app/frontend/`. The Audit Agent
scores compliance against these rules in the Standards Compliance category.

## Component Rules

- Functional components only — no class components
- One component per file; file must be named after the component (`PascalCase.tsx`)
- Props must have an explicit TypeScript interface — never use an inline object type on
  the component signature
- TypeScript strict mode must be satisfied — no `any` types without explicit justification
  documented in the change summary

## Hooks

- Follow the Rules of Hooks — no conditional hook calls
- `useEffect` dependencies array must be complete and correct
- State shared across more than two components must use Context or a state manager

## Styling

- No inline styles — Tailwind utility classes only

## Strings and Constants

- All user-facing strings must be externalized to `utils/strings.ts` — no literal UI
  text inside JSX logic
- No magic numbers or magic strings — use named constants

## Accessibility

- All interactive elements must have an `aria-label` or visible label text

## Bundle Size

- Import only what is used from any library — never import an entire library when a
  single function is needed
- Wrong: `import _ from 'lodash'`
- Right: `import debounce from 'lodash/debounce'`

## API URLs

- All backend API URL constants must use the versioned prefix `/api/v1/`
- Unversioned paths (e.g. `/api/tasks`) are a standards violation
- URL constants belong in `utils/constants.ts`

## Code Quality

- Maximum function length: 50 lines — split if longer
- Functions must do one thing (Single Responsibility Principle)
- No unused imports, no unused variables
- No commented-out dead code committed to the repository
- No logic duplicated across more than one file — extract to a shared hook or utility

## File Boundary

- Frontend Agent may only write files under `demo-app/frontend/`
- Backend code, test files, and CI configuration are out of scope
