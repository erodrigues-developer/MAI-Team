# Coding Style Context

## Naming and Project Structure Conventions

- **Files**: `camelCase` for modules (e.g., `taskService.ts`, `taskController.ts`)
- **Classes**: `PascalCase` (e.g., `TaskService`, `InMemoryTaskRepository`)
- **Interfaces**: `PascalCase` prefixed with `I` for repository/service contracts (e.g., `ITaskRepository`)
- **Types/DTOs**: `PascalCase` suffixed with `Dto` for input types (e.g., `CreateTaskDto`, `UpdateTaskDto`)
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Variables and functions**: `camelCase`
- **Route paths**: `kebab-case` (e.g., `/tasks`, `/tasks/:id`)

### Project structure

```
src/
  index.ts              # App entry point, server start
  app.ts                # Express app setup, middleware registration
  routes/
    taskRoutes.ts
  controllers/
    taskController.ts
  services/
    taskService.ts
  repositories/
    ITaskRepository.ts
    inMemoryTaskRepository.ts
  models/
    task.ts             # Task entity type
    taskDto.ts          # CreateTaskDto, UpdateTaskDto
  middleware/
    requestLogger.ts
    errorHandler.ts
tests/
  unit/
    taskService.test.ts
  integration/
    tasks.test.ts       # Supertest endpoint tests
```

## Error Handling and Logging Conventions

- All unhandled errors must be caught by the centralized Express error handler middleware.
- Error responses must never include stack traces. Use a sanitized message (e.g., `{ "error": "Internal server error" }`).
- Validation errors return HTTP 400 with a descriptive message identifying the invalid field.
- Not-found errors return HTTP 404 with a consistent `{ "error": "Task not found" }` shape.
- Console logging is acceptable. Log format: `[LEVEL] [timestamp] message` (e.g., `[INFO] 2026-03-06T00:00:00Z GET /tasks`).
- Log all incoming requests (method, path, status code) and all errors.

## API / Contract Conventions

- All responses are JSON (`Content-Type: application/json`).
- Successful create returns HTTP 201 with the created resource.
- Successful read/update returns HTTP 200 with the resource.
- Successful delete returns HTTP 204 with no body.
- Error responses always use the shape: `{ "error": "<message>" }`.
- IDs are strings (UUIDs preferred; `crypto.randomUUID()` is sufficient).

## Test Conventions

- **Unit tests**: Test `taskService.ts` in isolation. Mock `ITaskRepository` with a Jest mock or simple in-memory stub.
- **Endpoint tests**: Use `supertest` against the Express `app` instance (not a running server). Cover happy paths and key error cases (invalid input, not found).
- Test files live under `tests/` mirroring `src/` structure.
- Test naming: `describe('TaskService', () => { it('should create a task', ...) })`.
- Do not test implementation details. Test observable behavior (inputs/outputs, HTTP responses).
- Aim for meaningful coverage of business logic and endpoint contracts. Do not write tests for trivial pass-through code.

## Dependency and Abstraction Rules

- Do not introduce an abstraction unless it serves the current story.
- Repository interface (`ITaskRepository`) is the only mandatory abstraction at this stage.
- Do not wrap Express with a custom framework layer.
- Do not add a DI container. Constructor injection by hand is sufficient.
- Avoid utility libraries (lodash, etc.) unless there is a clear, repeated need.

## PR / Review Quality Expectations

- Each PR addresses a single story or fix.
- Code must compile (`tsc --noEmit`) without errors.
- All tests must pass before merge.
- No dead code, commented-out code, or `console.log` debug statements left in production paths.
- TypeScript `strict` mode must remain enabled; do not use `any` without justification.
