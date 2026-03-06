# Stack Context

## Primary Language / Runtime / Framework

- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js (LTS)
- **Web framework**: Express 4.x
- **Entry point**: `src/index.ts`

## Database and Persistence Strategy

- **Current**: In-memory store (plain TypeScript `Map` or array in `InMemoryTaskRepository`)
- **Interface**: `ITaskRepository` defines the data access contract
- **Migration path**: Implement a `PostgresTaskRepository` satisfying `ITaskRepository` to swap persistence without touching service logic
- **No ORM** required for the current phase; add only when migrating to PostgreSQL

## Messaging / Cache

None. Not required for this phase.

## Package / Dependency Management Policy

- Package manager: `npm`
- **Allowed runtime dependencies**: `express`, and only additional packages with a clear, justified need
- **Allowed dev dependencies**: `typescript`, `ts-node` or `tsx`, `jest`, `ts-jest`, `@types/*`, `supertest`
- Do not add a dependency if the standard library or an already-approved package covers the need
- All dependencies must be actively maintained and have a clear purpose

## Build / Test / Tooling Stack

| Tool | Purpose |
|---|---|
| `tsc` | TypeScript compilation |
| `tsx` or `ts-node` | Local dev execution |
| `jest` + `ts-jest` | Unit and endpoint tests |
| `supertest` | HTTP endpoint testing against Express app |
| `eslint` | Linting (TBD: add config if linting is required by pipeline) |

### Scripts (recommended `package.json` entries)

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsx src/index.ts",
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```

## Deployment / Runtime Targets

- **Target**: Local development environment only
- **No containerization required** for this phase
- **No CI/CD deployment pipeline** — GitHub Actions runs tests only
- TypeScript compiled to `dist/` for production start; `tsx` for local dev
