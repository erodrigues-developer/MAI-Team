# Project Brief

This file is the product source of truth for all agents (`pm`, `architect`, `dev`, `qa`).

## Purpose

A simple REST API for task management, built to validate the MAI Team AI-driven development workflow end-to-end. It exists as a controlled sandbox domain — simple enough to avoid implementation complexity while providing enough surface area to exercise the full automation pipeline.

## Target Users

Developers evaluating or testing the MAI Team AI-driven development workflow. Their primary need is a predictable, well-structured codebase that exercises the pipeline reliably.

## Core Problem

The MAI Team automation pipeline needs a real repository with real work items to prove that it can autonomously move an issue to a pull request with AI review and QA automation. Without a concrete target project, the pipeline cannot be validated end-to-end.

## Value Proposition

Provides a minimal but realistic software project that allows the MAI Team pipeline to be exercised and verified without introducing unnecessary domain or infrastructure complexity. The task domain is universally understood, keeping cognitive overhead low for reviewers.

## Product Scope

- CRUD REST API for task management (create, read, update, delete tasks)
- In-memory task storage with a design that supports future migration to PostgreSQL
- Input validation and basic error handling
- Console logging for requests and errors

## Out of Scope

- Production deployment or cloud infrastructure
- Authentication and authorization
- Persistent storage (no database in this phase)
- Frontend or UI
- Advanced observability (metrics, tracing, alerting)
- Multi-user or multi-tenant support

## Key Features

- `POST /tasks` — create a task
- `GET /tasks` — list all tasks
- `GET /tasks/:id` — get a single task by ID
- `PUT /tasks/:id` — update a task
- `DELETE /tasks/:id` — delete a task
- Input validation with clear error responses
- No stack traces exposed in error responses

## High Level Workflow

1. Developer or agent creates an issue describing a feature or fix.
2. MAI Team pipeline picks up the issue and generates implementation.
3. A pull request is created and reviewed by AI agents.
4. QA automation runs tests against the implementation.
5. PR is merged or feedback is returned.

## Product Principles

- Simplicity over completeness
- Minimize moving parts
- Prefer conventions over configuration
- Keep the domain boring so the pipeline is the focus

## Success Metrics

- MAI Team pipeline completes a full issue-to-PR cycle without manual intervention
- All core endpoint behaviors are covered by tests
- The codebase is readable and consistent enough to serve as a reliable test target

## Project Stage

Experimental / Workflow Validation

## Future Vision

If the pipeline validation succeeds, this project may be replaced or extended with a more complex domain. The in-memory storage layer is intentionally designed to be swapped for PostgreSQL when persistence is needed.

## Update Rule

Update this file only when there is a significant product direction change, target audience change, strategic change, or scope redefinition. Do not update for every story.
