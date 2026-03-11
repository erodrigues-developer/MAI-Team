# MAI Team

Open-source AI development team for GitHub + Jira.

MAI Team is a repo-native AI software factory starter that helps you run an AI-assisted delivery flow with specialized agents such as:

- PM
- Architect
- Dev
- QA

It is designed to work directly inside GitHub using GitHub Actions, with optional synchronization to Jira for Kanban visibility and workflow tracking.

---

## What this project does

MAI Team provides a foundation for an AI-assisted software delivery lifecycle:

1. A human creates and prepares a story
2. A Dev Agent can implement the story
3. A pull request is opened
4. AI review runs automatically
5. QA checks run automatically
6. Jira is updated based on PR lifecycle events
7. A human still approves the merge

This keeps human oversight while automating repetitive engineering work.

---

## Project structure

```text
.
├── .ai
│   ├── agents
│   │   ├── architect.md
│   │   ├── dev.md
│   │   ├── pm.md
│   │   └── qa.md
│   ├── bootstrap
│   │   ├── architecture-interview.md
│   │   ├── bootstrap-config.yml
│   │   └── labels.yml
│   ├── context
│   │   ├── architecture.md
│   │   ├── coding-style.md
│   │   ├── project-brief.md
│   │   ├── security.md
│   │   └── stack.md
│   └── policies
│       └── workflows.yml
├── .github
│   ├── scripts
│   │   └── resolve-ai-config.sh
│   └── workflows
│       ├── ai-dev.yml
│       ├── ai-review.yml
│       ├── architect-bootstrap.yml
│       ├── bootstrap-labels.yml
│       ├── jira-sync.yml
│       └── qa-agent.yml
├── docs
│   ├── adr
│   ├── architecture
│   └── requirements
├── src
└── tests
```

## How it works

GitHub Actions workflows are the automation engine of this project. GitHub Actions workflows are defined as YAML files in `.github/workflows`, and they can run on events such as issue labeling and pull request activity.

This project uses the following workflow model:

### `ai-dev.yml`

- triggered when an issue receives the label `dev:in_progress`
- runs the Dev Agent

### `ai-review.yml`

- triggered on pull request events
- runs AI review

### `qa-agent.yml`

- triggered on pull request events
- runs automated validation

### `jira-sync.yml`

- triggered on pull request events
- moves Jira issues to the appropriate status

### `bootstrap-labels.yml`

- triggered manually via `workflow_dispatch`
- creates/updates repository labels from `/.ai/bootstrap/labels.yml`
- controlled by `/.ai/bootstrap/bootstrap-config.yml`

### `architect-bootstrap.yml`

- triggered from issue bootstrap flow
- generates `.ai/context/*` from architect interview answers

---

## Recommended delivery model

The recommended merge gate is:

- 1 human approval
- AI review status check passed
- QA status check passed

GitHub branch protection rules support both required approving reviews and required status checks. Also, required status checks should use unique job names to avoid ambiguity.

---

## Prerequisites

Before running MAI Team, make sure you have:

- a GitHub repository with Actions enabled
- repository admin access
- a Jira Cloud project
- an Atlassian API token
- one AI provider configured:
  - Claude
  - GPT / Codex
  - Gemini
  - Grok

The workflows now resolve the provider from GitHub Actions variables, so the same repository can switch between Claude, GPT, Gemini, or Grok without changing workflow files.

---

## Step 1 - Add the workflow files

Create these files:

- `.github/workflows/ai-dev.yml`
- `.github/workflows/ai-review.yml`
- `.github/workflows/architect-bootstrap.yml`
- `.github/workflows/bootstrap-labels.yml`
- `.github/workflows/jira-sync.yml`
- `.github/workflows/qa-agent.yml`

Place in them the workflow definitions you chose for the project.

---

## Step 2 - Choose the AI provider and model

Go to:

`GitHub repository -> Settings -> Secrets and variables -> Actions`

Create these repository variables:

- `AI_PROVIDER`
- `AI_MODEL`
- `AI_MODEL_VERSION` (optional)
- `AI_MODEL_ID` (optional override)

### How model resolution works

The workflows resolve the effective model in this order:

1. `AI_MODEL_ID`
2. `AI_MODEL` + `AI_MODEL_VERSION`
3. provider default

This lets you choose both a model family and a version, while still supporting providers that expose a single exact model identifier.

### Example combinations

```text
AI_PROVIDER=claude
AI_MODEL=claude-sonnet
AI_MODEL_VERSION=4-20250514
# resolved model_id => claude-sonnet-4-20250514

AI_PROVIDER=gpt
AI_MODEL=gpt-5
AI_MODEL_VERSION=mini
# resolved model_id => gpt-5-mini

AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-pro
AI_MODEL_VERSION=preview-03-25
# resolved model_id => gemini-2.5-pro-preview-03-25

AI_PROVIDER=grok
AI_MODEL=grok-code-fast
AI_MODEL_VERSION=1
# resolved model_id => grok-code-fast-1
```

If a provider uses a naming scheme that does not split cleanly into model + version, set the exact API identifier in `AI_MODEL_ID`.

---

## Step 3 - Create GitHub repository secrets

Go to:

`GitHub repository -> Settings -> Secrets and variables -> Actions`

Create the secrets required by the provider you selected.

### Claude

- `ANTHROPIC_API_KEY`
- or `CLAUDE_CODE_OAUTH_TOKEN`

### GPT / Codex

- `OPENAI_API_KEY`

### Gemini

- `GEMINI_API_KEY`

### Grok

- `XAI_API_KEY`

### Required for Jira sync

- `JIRA_BASE_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `JIRA_TRANSITION_ID_IN_REVIEW`
- `JIRA_TRANSITION_ID_TESTING`

### Example values

```text
AI_PROVIDER=claude
AI_MODEL=claude-sonnet
AI_MODEL_VERSION=4-20250514

JIRA_BASE_URL=https://your-company.atlassian.net
JIRA_EMAIL=you@company.com
JIRA_API_TOKEN=your_atlassian_api_token
JIRA_TRANSITION_ID_IN_REVIEW=31
JIRA_TRANSITION_ID_TESTING=41
```

The Jira Cloud REST API docs state that basic authentication for REST APIs uses an Atlassian account email address plus an API token, and REST URLs follow the form `https://<site-url>/rest/api/3/...`.

---

## Step 4 - Create your Atlassian API token

You need an API token for Jira Cloud REST API authentication.

### Basic flow

1. Sign in to your Atlassian account
2. Create an API token
3. Copy the token
4. Save it as `JIRA_API_TOKEN` in GitHub secrets

Jira Cloud API calls in this project use:

- e-mail: `JIRA_EMAIL`
- token: `JIRA_API_TOKEN`

Authentication is done through Basic Auth in the request.

---

## Step 5 - Discover Jira transition IDs

The workflow needs transition IDs to move a Jira issue across statuses such as:

- In Review
- Testing

These IDs are Jira-workflow-specific, so they are not universal.

### How to find them

Call the Jira transitions endpoint for one issue:

```bash
curl --request GET \
  --url "https://your-company.atlassian.net/rest/api/3/issue/PROJ-123/transitions" \
  --user "you@company.com:your_api_token" \
  --header "Accept: application/json"
```

Then inspect the response and find the transition IDs corresponding to:

- your review column
- your testing column

Save those IDs as:

- `JIRA_TRANSITION_ID_IN_REVIEW`
- `JIRA_TRANSITION_ID_TESTING`

The Jira REST API includes transitions under the issue API surface, and the docs for Jira Cloud REST v3 document issue and transition endpoints under `/rest/api/3`.

---

## Step 6 - Configure branch protection

This is one of the most important steps.

Go to:

`GitHub repository -> Settings -> Branches`

Create a branch protection rule for your main delivery branch, usually:

- `main`

or:

- `develop`

### Recommended settings

Enable:

- Require a pull request before merging
- Require approvals
- Require status checks to pass before merging

### Set required approvals

Set:

- Required approving reviews: `1`

### Add required status checks

After the workflows run at least once, add these checks as required:

- `ai-review`
- `qa-check`

GitHub requires that required status checks have completed successfully in the repository recently before they can be selected, and GitHub also recommends unique job names to avoid ambiguous check results.

### Final merge policy

This gives you the desired behavior:

- 1 human approval
- AI review check passed
- QA check passed

---

## Step 7 - Prepare the AI agent files

You should define at least:

- `.ai/agents/architect.md`
- `.ai/agents/dev.md`
- `.ai/agents/pm.md`
- `.ai/agents/qa.md`
- `.ai/policies/workflows.yml`
- `.ai/bootstrap/architecture-interview.md`
- `.ai/bootstrap/bootstrap-config.yml`
- `.ai/bootstrap/labels.yml`

These files act as the behavioral contract for the agents.

Recommended next files:

- `.ai/context/project-brief.md`
- `.ai/context/architecture.md`
- `.ai/context/stack.md`
- `.ai/context/coding-style.md`
- `.ai/context/security.md`

If your template is intended to stay generic, you can generate these during project bootstrap instead of hardcoding them.

---

## Step 8 - First repository bootstrap

Before using the flows in a real project, run the architectural bootstrap flow:

1. Architect runs the initial interview in `.ai/bootstrap/architecture-interview.md`
2. Architect generates context files in `.ai/context/*`
3. Run `bootstrap-labels.yml` to create/update operational labels
4. Project is ready for delivery flow

If you are not running a fully automated interview yet, add minimal seed content so the agents have context.

Recommended minimum:

### `.ai/context/project-brief.md`

Describe:

- product purpose
- target users
- core problem
- scope
- out of scope
- key features

### `.ai/context/architecture.md`

Describe:

- current architecture direction
- allowed patterns
- constraints
- anti-patterns to avoid

### `docs/requirements/`

Add at least one sample requirement or story spec.

### `docs/architecture/`

Add architecture notes if available.

This helps the agents avoid inventing requirements or applying the wrong patterns.

---

## Step 8.1 - Run labels bootstrap

After context generation, run:

- GitHub repository -> Actions -> `Bootstrap Labels` -> Run workflow

This workflow:

- reads labels from `.ai/bootstrap/labels.yml`
- checks `.ai/bootstrap/bootstrap-config.yml`
- creates labels when missing
- updates labels when already present

---

## Step 9 - How to run the project

There is no single `npm start` or central backend service required for the first version of MAI Team.

The project runs through GitHub events.

### Daily usage flow

1. Create a Jira story

Example:

`MAI-12 - Add AI review workflow`

2. Create a matching GitHub issue

Recommended title format:

`MAI-12 - Add AI review workflow`

Recommended issue body:

```md
## Context
We need an automated AI review workflow for pull requests.

## Acceptance Criteria
- workflow exists in `.github/workflows/ai-review.yml`
- runs on PR open/reopen/sync
- publishes a required status check

## Notes
Follow existing project conventions.
```

3. Add the label

Apply:

`dev:in_progress`

This triggers the `ai-dev.yml` workflow.

4. Let the AI Dev Agent work

The agent should:

- inspect the issue
- read the repository context
- implement the scoped change
- open a pull request

5. AI Review runs on the pull request

The `ai-review.yml` workflow runs automatically.

6. QA runs on the pull request

The `qa-agent.yml` workflow runs automatically.

7. Jira sync runs

The `jira-sync.yml` workflow should:

- move to In Review when the PR opens
- move to Testing when the PR is merged

8. Human approves and merges

A human reviewer approves the PR.

If branch protection is configured correctly, the PR can only merge after:

- 1 human approval
- `ai-review` passed
- `qa-check` passed

---

## Local development

If your repo also contains application code, local development depends on the stack you chose.

Example for a Node.js project:

```bash
npm install
npm test
```

If you later add scripts such as:

```json
{
  "scripts": {
    "dev": "your-dev-command",
    "lint": "your-lint-command",
    "test": "your-test-command"
  }
}
```

then `qa-agent.yml` can run those automatically.

For the MAI Team template itself, the core automation is GitHub-native and event-driven, so most validation happens via GitHub Actions rather than a local runtime. GitHub Actions workflows are built around repository events and YAML-defined jobs.

---

## Suggested labels

Recommended labels are managed in `.ai/bootstrap/labels.yml` and provisioned by `bootstrap-labels.yml`.

Default set:

- `backlog`
- `ready`
- `requirements:approved`
- `ui:approved`
- `dev:in_progress`
- `pr:opened`
- `testing`
- `ready_for_publish`

For the MVP, `dev:in_progress` is the minimum required trigger label.

---

## Suggested branch naming

Recommended pattern:

`feature/MAI-12-issue-34`

This makes Jira extraction much easier for automation.

Recommended PR title format:

`[MAI-12] Add AI review workflow`

---

## Suggested GitHub issue template

Recommended issue title format:

`<JIRA_KEY> - <short title>`

Example:

`MAI-12 - Add AI review workflow`

Recommended required sections in the issue body:

- Context
- Acceptance Criteria
- Notes
- Out of Scope

---

## Suggested Jira workflow mapping

Recommended Jira transitions for the MVP:

- PR opened -> In Review
- PR merged -> Testing
- manual validation or release gate -> Ready for Publish

This keeps the first version simple and reliable.

---

## Troubleshooting

### AI review check does not appear in branch protection

GitHub only lets you require checks that have run successfully in the repository recently. Run the workflow at least once first, then go back to branch protection and select it.

### PR cannot merge because checks are ambiguous

Make sure job names are unique across workflows. GitHub warns that duplicate job names can create ambiguous status check results and block merging.

### Jira sync fails with 401

Check:

- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `JIRA_BASE_URL`

Jira Cloud REST authentication for personal scripts and bots uses email + API token.

### Jira sync fails with transition error

Most likely the transition ID is wrong for your Jira workflow. Query the transitions endpoint for the issue again and update:

- `JIRA_TRANSITION_ID_IN_REVIEW`
- `JIRA_TRANSITION_ID_TESTING`

### AI workflow fails immediately

Check:

- `AI_PROVIDER` matches the configured secret
- `AI_MODEL`, `AI_MODEL_VERSION`, or `AI_MODEL_ID` resolves to a valid provider model
- repository Actions permissions are enabled
- required provider secret exists:
  - Claude: `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN`
  - GPT: `OPENAI_API_KEY`
  - Gemini: `GEMINI_API_KEY`
  - Grok: `XAI_API_KEY`

If you are using Claude, also confirm the Claude GitHub App is installed when your chosen auth flow requires it.

---

## Recommended setup order

If you are starting from zero, do it in this order:

1. create repository structure
2. create agent files
3. create bootstrap files (`.ai/bootstrap/*`)
4. create workflow files
5. choose AI provider + model variables
6. create provider and Jira secrets
7. create Jira API token
8. discover Jira transition IDs
9. run architect bootstrap interview and generate context files
10. run `bootstrap-labels.yml`
11. configure branch protection
12. run one test issue + PR cycle
13. refine prompts, policies, and workflows

---

## Minimal MVP checklist

Use this checklist to know when MAI Team is operational:

- [ ] repo created
- [ ] `.github/workflows/*.yml` files added
- [ ] `bootstrap-labels.yml` workflow added
- [ ] `AI_PROVIDER` configured
- [ ] `AI_MODEL` or `AI_MODEL_ID` configured
- [ ] provider secret created
- [ ] Jira secrets created
- [ ] transition IDs discovered
- [ ] branch protection configured
- [ ] architect bootstrap interview completed
- [ ] `.ai/context/*` generated
- [ ] Bootstrap Labels workflow executed
- [ ] one test issue created
- [ ] label `dev:in_progress` applied
- [ ] PR automatically reviewed by AI
- [ ] QA check executed
- [ ] Jira issue moved automatically

---

## Future improvements

Planned improvements you may add later:

- PR templates and issue templates
- release workflow
- deployment workflow
- automatic move to Ready for Publish
- automatic backlog generation from bugs, logs, and metrics

---

## References

- GitHub Actions workflow syntax: GitHub Docs
- GitHub branch protection rules: GitHub Docs
- GitHub status checks: GitHub Docs
- Anthropic Claude Code Action official repository and setup docs
- OpenAI Codex GitHub Action official repository and setup docs
- Google Gemini CLI GitHub Action official repository and setup docs
- xAI API reference
- Jira Cloud REST API v3 and basic auth docs

These official references describe the workflow YAML model, branch protection behavior, status checks, multi-provider AI setup, and Jira Cloud API authentication.
