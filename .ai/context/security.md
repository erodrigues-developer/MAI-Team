# Security Context

## Authentication and Authorization Baseline

- **No authentication required** for this phase. The service is local development only with no network exposure beyond localhost.
- If the deployment target changes to a shared or networked environment, add authentication before exposing any endpoint.

## Input Validation and Data Protection Rules

- Validate all request bodies before processing. Reject requests with missing required fields (HTTP 400).
- Validate field types and lengths. Do not pass unvalidated user input directly to internal models.
- Use an allowlist approach: explicitly define which fields are accepted in `CreateTaskDto` and `UpdateTaskDto`. Ignore unknown fields.
- Do not reflect raw user input back in error messages in a way that enables XSS or injection.
- Do not store or log sensitive data (none expected in task domain, but apply as a general rule).

## Secret Management Approach

- No secrets required for this phase (no database, no external services).
- If secrets are introduced (e.g., database connection string), load them from environment variables. Never hardcode secrets in source code.
- Do not commit `.env` files. Use `.env.example` to document required variables.

## Auditability / Logging Requirements

- Log all inbound HTTP requests: method, path, response status code.
- Log all errors with sufficient context to diagnose issues (without exposing stack traces in HTTP responses).
- Console logging to stdout is sufficient for this phase.
- No audit trail for data mutations is required at this scale.

## Abuse / Threat Scenarios and Controls

| Scenario | Control |
|---|---|
| Malformed JSON body | Express `json()` middleware rejects malformed payloads automatically (HTTP 400) |
| Oversized request body | Set `express.json({ limit: '10kb' })` to limit body size |
| Invalid field types | Controller-level validation rejects before service layer |
| Stack trace leakage | Centralized error handler returns sanitized messages only |
| Unexpected fields in body | Allowlist field extraction in DTOs; ignore unknown keys |

## Security Posture Summary

Basic secure defaults appropriate for a local demo service:
- Input validation at the controller layer
- No stack traces in HTTP responses
- Body size limit on JSON payloads
- Environment variables for any future secrets
- No authentication needed while deployment is local only

Posture is intentionally minimal. Escalate to production-grade controls before any shared or networked deployment.
