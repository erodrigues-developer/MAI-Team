# Architecture Bootstrap Interview

Use this interview during project bootstrap to establish architecture context.

## Objective
Collect the minimum decisions needed to generate:
- `/.ai/context/architecture.md`
- `/.ai/context/stack.md`
- `/.ai/context/security.md`
- `/.ai/context/coding-style.md`
- `/.ai/context/project-brief.md`

## Interview Rules
- Ask 8 to 12 questions.
- Start with the 10 default questions below.
- Add up to 2 extra questions only if critical context is still missing.
- Keep questions short and answer-oriented.
- Confirm uncertain answers as `TBD` with a recommended default.

## Default Questions
1. What type of system is this?
   - web application, backend API, CLI tool, library, microservice, SaaS platform, other
2. Which primary language and framework should be used?
3. What is the primary data store?
   - PostgreSQL, MySQL, MongoDB, Redis, no database yet, other
4. Preferred architecture style?
   - modular monolith, layered, hexagonal, clean architecture, microservices, undecided
5. Testing strategy preference?
   - unit+integration, unit+integration+e2e, minimal tests
6. How strict should dependency management be?
   - minimal dependencies, pragmatic, flexible
7. Security posture?
   - basic, production-grade, high security requirements
8. Expected scale of the system?
   - small internal tool, moderate SaaS, high-scale system, unknown
9. Deployment/runtime target?
   - cloud provider, container strategy, environment model
10. Observability and operations expectations?
    - logs, metrics, tracing, alerting, incident response
11. Who are the primary target users and their top needs?
12. What is the core product problem and expected value proposition?

## Interview Output
After the interview, produce:
- A concise decision summary.
- List of open decisions and recommended defaults.
- Generated context files under `/.ai/context`.
- Trigger operational bootstrap for labels via `.github/workflows/bootstrap-labels.yml`.
