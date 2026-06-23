---
name: workflow
description: Load or create per-project workflow settings (docs paths, implementation phases, optional task tracker). Use before design-feature, build-feature, or close-workflow; when skills.config.json is missing; or when mapping a delivery flow for the first time.
---

# Workflow

**Announce at start:** "I'm using the workflow skill."

Every workflow skill reads **`skills.config.json`** at the **workspace root** (the project where you code, not the skills repo).

## First step

1. Look for `skills.config.json` in the workspace root.
2. If **missing**, or if `implementation.phases` is empty:
   - Prefer: ask the user to run `npx github:arcadesunlabs/skills skills-configure .`
   - Or run [workflow discovery](references/discovery.md) in conversation and write the file
3. If **present**, read it and use its values for the rest of the session.

Example: [skills.config.example.json](../../../skills.config.example.json).

## Config fields

| Field                     | Used for                                                    |
| ------------------------- | ----------------------------------------------------------- |
| `project.name`            | Human-readable project label in plans and handoffs          |
| `project.conventionsFile` | Repo rules file (e.g. `CLAUDE.md`, `AGENTS.md`)             |
| `docs.root`               | Feature docs folder (empty = no structured docs)            |
| `docs.indexFile`          | Docs index path                                             |
| `docs.domainMirror`       | Code path that doc domains mirror                           |
| `implementation.preset`   | `minimal` \| `frontend-ui-first` \| `api-first` \| `custom` |
| `implementation.phases`   | **Your** ordered implementation checklist                   |
| `taskTracker.enabled`     | Whether work is tied to external cards/issues               |
| `taskTracker.provider`    | `trello` \| `jira` \| `linear` \| `github` \| `none`        |
| `code.appRoot`            | App root for lint/test commands                             |
| `code.lintCommand`        | Lint command for close-workflow validation                  |
| `code.testCommand`        | Test command for close-workflow validation                  |

Tracker-specific fields (`cardKeyPrefix`, `mcpServer`, `trello.*`, `jira.*`) apply only when `taskTracker.enabled` is true — see [build-feature references/tracker.md](../build-feature/references/tracker.md).

## Implementation phases

`implementation.phases` is the **source of truth** for [build-feature](../build-feature/SKILL.md) execution order.

| Field on phase | Rule                                                            |
| -------------- | --------------------------------------------------------------- |
| `name`         | Heading in `03-plan.md` and per-phase checklists                |
| `notes`        | Guidance while executing that phase                             |
| `optional`     | May skip when irrelevant — record reason in plan                |
| `alwaysLast`   | Run after all non-`alwaysLast` phases (typically finalize docs) |

Built-in presets (via `skills-configure` or discovery): `minimal`, `frontend-ui-first`, `api-first`, or `custom`.

## Derived values

| Symbol          | Rule                                        |
| --------------- | ------------------------------------------- |
| `{docsFeature}` | `{docs.root}/<domain>/<feature>/`           |
| `{handoffPath}` | `{docs.root}/<domain>/<feature>/handoff.md` |
| `{taskId}`      | When tracker enabled: `{cardKeyPrefix}-{n}` |

## Optional task tracker

When `taskTracker.enabled` is `false` or provider is `none`:

- Skip card/issue sync and branch-from-task rules
- Use feature branch names from the user
- Implement trivial fixes directly per `project.conventionsFile`

When enabled, provider setup and MCP tools: [build-feature references/tracker.md](../build-feature/references/tracker.md).

## Skill routing

| User intent                         | Skill                                        |
| ----------------------------------- | -------------------------------------------- |
| Brainstorm, spec, PRD, grill design | [design-feature](../design-feature/SKILL.md) |
| Plan and implement feature work     | [build-feature](../build-feature/SKILL.md)   |
| Handoff or finalize docs after ship | [close-workflow](../close-workflow/SKILL.md) |
| Create or improve agent skills      | [write-skill](../write-skill/SKILL.md)       |

**Always load this skill before the others** (or ensure they load config in step 0).
