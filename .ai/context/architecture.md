# Architecture Context

## Project Type and Scope

REST API — task management service. Small-scale, single-process Node.js application. Scope is limited to CRUD operations on tasks with in-memory persistence. No external integrations required in this phase.

## Architecture Style

Layered architecture with three explicit layers:

```
src/
  routes/        # HTTP route definitions and request/response handling
  controllers/   # Request parsing, input validation, response formatting
  services/      # Business logic and orchestration
  models/        # Domain types and interfaces (Task, CreateTaskDto, etc.)
  repositories/  # Data access abstraction (in-memory implementation)
  middleware/    # Express middleware (logging, error handling)
```

Controllers delegate to services. Services depend on repositories via interfaces. No layer may skip a layer boundary.

## Core Modules and Responsibilities

| Module | Responsibility |
|---|---|
| `routes/` | Register Express routes, map HTTP verbs to controller methods |
| `controllers/` | Parse and validate request input, call service methods, format HTTP responses |
| `services/` | Enforce business rules, coordinate repository calls |
| `repositories/` | Abstract data access; `InMemoryTaskRepository` implements `ITaskRepository` |
| `models/` | Define `Task` entity, DTOs (`CreateTaskDto`, `UpdateTaskDto`), and response types |
| `middleware/` | Request logging, centralized error handler (no stack trace exposure) |

## Data Flow Overview

```
HTTP Request
  -> Express Router
  -> Controller (validate input)
  -> Service (business logic)
  -> Repository (read/write in-memory store)
  -> Service (map to response model)
  -> Controller (send HTTP response)
```

Error path: unhandled errors propagate to the centralized error middleware, which returns a sanitized error response.

## Integration Boundaries

- **Inbound**: HTTP only (Express). No message queues, no WebSocket.
- **Outbound**: None. The in-memory store is internal.
- **Future boundary**: `ITaskRepository` interface is the seam for replacing in-memory storage with a PostgreSQL adapter without changing service logic.

## Scalability and Operability Notes

- Single process, no clustering required at this scale.
- In-memory store is ephemeral — restarting the process clears all data. This is acceptable for the validation phase.
- Console logging only. No log aggregation or structured logging required.

## Known Constraints and Tradeoffs

| Constraint | Tradeoff |
|---|---|
| In-memory storage | No persistence across restarts; acceptable for sandbox use |
| No authentication | Appropriate for local dev only; not suitable for shared/production use |
| Single process | Cannot scale horizontally; acceptable at this scale |
| Layered (not hexagonal) | Simpler to navigate for a small service; repository interface provides the key abstraction point |
