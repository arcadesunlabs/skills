---
name: write-handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when switching agents, ending a long session, or handing off unfinished work.
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

## Where to save

**Always save in the repo** under `.docs/`, in the subdirectory that matches the work being handed off — never in the OS temp directory or outside the workspace.

| Work context                              | Path                                                                                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Feature with subfolder in code            | `.docs/<domain>/<feature>/handoff.md`                                                                            |
| Flat domain (e.g. `calendar/`, `splash/`) | `.docs/<domain>/handoff.md`                                                                                      |
| Architecture, navigation, refactors       | `.docs/codebase/handoff.md`                                                                                      |
| External integration or extension guide   | `.docs/integrations/handoff.md`                                                                                  |
| Dev setup, env, CI                        | `.docs/setup/handoff.md`                                                                                         |
| Multiple features in one session          | One `handoff.md` per affected feature folder, or a single handoff in the primary folder with links to the others |

**Naming:** use `handoff.md` (not numbered `01`–`04` — those are spec/tech/plan/tasks). Remove or replace an existing `handoff.md` in the same folder when writing a new handoff for the same slice of work.

Folder names mirror `apps/revelio/lib/app/features/` in kebab-case (`expense_list` → `expense-list`). See [`.docs/index.md`](../../../.docs/index.md) for the index and conventions.

## What to include

- Current objective and Trello card (`REV-XXX`) if any
- What was done (commits, branches, key files)
- What is in progress or blocked
- Explicit next steps for the receiving agent
- **Suggested skills** — which skills the next agent should invoke and why
- Links to existing artifacts (`01-spec.md`, `02-tech.md`, `03-plan.md`, PRs, branches) — do not duplicate their content

## Rules

- Do not duplicate content already captured in other artifacts (specs, tech docs, plans, issues, commits, diffs). Reference them by path or URL instead.
- Redact any sensitive information (API keys, passwords, PII).
- If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
- After writing, run Prettier: `npx prettier --write "path/to/handoff.md"`.