---
name: write-handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when switching agents, ending a long session, or handing off unfinished work.
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

## Step 0 — Load config

Invoke [workflow-config](../workflow-config/SKILL.md) and read `skills.config.json`. Paths below use `{docs.root}` from config.

## Where to save

**Always save in the repo** under `{docs.root}/`, in the subdirectory that matches the work being handed off — never in the OS temp directory or outside the workspace.

| Work context                            | Path                                                                                            |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| User-facing behavior                    | `{docsUseCase}/handoff.md`                                                                      |
| Actor definitions                       | `{docsActors}/handoff.md`                                                                       |
| Cross-cutting capability                | `{docsCapability}/handoff.md`                                                                   |
| Architecture, navigation, or refactor   | `{docs.root}/codebase/<initiative>/handoff.md`                                                  |
| External integration or extension guide | `{docs.root}/integrations/<integration>/handoff.md`                                             |
| Dev setup, environment, or CI           | `{docs.root}/setup/<topic>/handoff.md`                                                          |
| Multiple use cases in one session       | One `handoff.md` per affected use case, or one in the primary use case with links to the others |

**Naming:** use `handoff.md`. Remove or replace an existing `handoff.md` in the same folder when writing a new handoff for the same slice of work.

Choose use-case folders from user intent, never code structure: `<domain>/<verb-object>/` in kebab-case (for example, `customers/create-customer/`). See `docs.indexFile` for project-specific conventions.

## What to include

- Current objective and active branch (if known)
- Affected actors and links to canonical `{docsActor}` files when handing off behavioral work
- What was done (commits, branches, key files)
- What is in progress or blocked
- Explicit next steps for the receiving agent
- **Suggested skills** — which skills the next agent should invoke and why
- Links to existing artifacts (`spec.md`, `context.md`, `rules.md`, `scenarios.md`, `plan.md`, PRs, branches) — do not duplicate their content

## Rules

- Do not duplicate content already captured in other artifacts (specs, tech docs, plans, issues, commits, diffs). Reference them by path or URL instead.
- Redact any sensitive information (API keys, passwords, PII).
- If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
- After writing, run Prettier on the handoff file if the project uses it.
