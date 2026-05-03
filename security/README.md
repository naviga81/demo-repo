# Security Documentation

This folder documents all security considerations for the AI-Powered SDLC Pipeline.

## Contents

| File | What it covers |
|---|---|
| [secrets-management.md](secrets-management.md) | API keys, PATs, and tokens — how they are stored and kept out of code |
| [agent-boundaries.md](agent-boundaries.md) | What each agent is and is not allowed to access or modify |
| [input-validation.md](input-validation.md) | How ADO work item inputs are validated before entering the pipeline |

## Security Principles

1. **No credentials in code.** All secrets live in `.env` and are never committed.
2. **Least privilege.** Each agent operates within a strict file boundary; no agent
   has access to resources outside its defined scope.
3. **Validated inputs.** Every work item entering the pipeline is scored and structured
   before any code is generated.
4. **Audit trail.** Every agent call logs its full input and output to the pipeline run
   record in `runs/`. Run records are gitignored in production.
5. **Read-only agents.** The Audit Agent and Spec Agent never write application code.
   The Clarification Agent never touches ADO state (read and comment only).

## Reporting Security Issues

If you discover a security issue in the pipeline (e.g. a prompt that leaks credentials,
an agent boundary that can be bypassed, or an injection vector in work item input),
open an ADO work item with the tag `security-finding` and assign it to the pipeline owner.
Do not log security findings in public GitHub issues.
