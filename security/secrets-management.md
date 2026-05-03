# Secrets Management

## What Counts as a Secret

- Azure DevOps Personal Access Token (`ADO_PAT`)
- Any API key (Anthropic API key, third-party services)
- Database connection strings
- OAuth tokens or session secrets
- Any value that grants access to a system or service

## Storage Rules

### `.env` file (local development)

All secrets are stored in a local `.env` file at the repository root. This file is
listed in `.gitignore` and must never be committed.

```
# .env — never commit this file
ADO_ORG_URL=https://dev.azure.com/<your-org>
ADO_PROJECT=<your-project>
ADO_PAT=<your-personal-access-token>
ADO_WORK_ITEM_POLL_INTERVAL_SECONDS=60
ADO_TRIGGER_TAG=ai-pipeline-trigger
ANTHROPIC_API_KEY=<your-api-key>
```

### `.env.example` (committed template)

A sanitized template with placeholder values lives at `.env.example`. It documents
every required variable with a description but contains no real values.

### CI/CD environments

In CI or hosted environments, secrets are injected as environment variables via the
platform's secret store (e.g. GitHub Actions secrets, Azure DevOps variable groups).
They are never written to disk or echoed to logs.

## What Must Never Happen

- No secret value in any source file, prompt file, test file, or documentation file
- No secret value in any ADO work item comment or description
- No secret value in any git commit message or PR description
- No logging of secret values — even at DEBUG level
- No passing secrets as function arguments in plain strings (use environment variable
  lookup at call time)

## Pipeline Agent Rules

- Agents load the Anthropic API key via `os.environ["ANTHROPIC_API_KEY"]` — the key
  is never passed through the JSON inter-agent contract
- The ADO PAT is read once by the MCP server (`pipeline/mcp-servers/ado-mcp/`) at
  startup — it is not passed to or stored by any downstream agent
- Prompt files in `pipeline/prompts/` must not contain any credentials or token values

## Rotation

If a PAT or API key is accidentally committed:
1. Revoke it immediately at the source (ADO, Anthropic dashboard)
2. Generate a new credential
3. Update `.env` locally and the CI secret store
4. Remove the exposed value from git history using `git filter-repo` or BFG Repo Cleaner
5. Force-push the cleaned history and notify all contributors to re-clone
