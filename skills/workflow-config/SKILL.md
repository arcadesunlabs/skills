---
name: workflow-config
description: Load or create per-user workflow settings (task tracker, card prefix, branch naming, docs paths). Use before task-workflow, write-plan, mode-brainstorm, write-feature-spec, write-handoff, or when skills.config.json is missing or unclear.
---

# Workflow Config

**Announce at start:** "I'm using the workflow-config skill."

Every workflow skill in this repo reads settings from **`skills.config.json`** at the **workspace root** (the project where you are working, not necessarily the skills repo).

## First step

1. Look for `skills.config.json` in the workspace root.
2. If **missing**, ask the user to run `npm run configure` in that project **or** collect the values below with `AskQuestion` / conversation and write the file.
3. If **present**, read it and use its values for the rest of the session.

Example file: [skills.config.example.json](../../../skills.config.example.json) (in the skills repo).

## Config fields

| Field | Used for |
|-------|----------|
| `project.name` | Human-readable project label in plans and handoffs |
| `project.conventionsFile` | Repo rules file (e.g. `CLAUDE.md`) |
| `docs.root` | Feature docs folder (e.g. `.docs` or `docs`) |
| `docs.indexFile` | Docs index path |
| `docs.domainMirror` | Code path that doc domains mirror |
| `taskTracker.provider` | `trello` \| `linear` \| `github` \| `none` |
| `taskTracker.enabled` | Whether tracked work uses cards/issues |
| `taskTracker.cardKeyPrefix` | Card key prefix (e.g. `REV`, `PM`) |
| `taskTracker.branchMatchesCardKey` | Branch name equals card key when true |
| `taskTracker.mcpServer` | MCP server for the tracker (Trello: `user-trello`) |
| `taskTracker.trello.*` | Board URL, ID, list names/IDs (Trello only) |
| `code.appRoot` | App root for lint/test commands |
| `code.lintCommand` | Lint command for finalize-docs validation |
| `code.testCommand` | Test command for finalize-docs validation |

## Derived values

Compute these from config — do not hardcode project-specific prefixes:

| Symbol | Rule |
|--------|------|
| `{cardKey}` | `{cardKeyPrefix}-{number}` — e.g. `REV-42` |
| `{cardKeyPattern}` | `{cardKeyPrefix}-XXXX` |
| `{docsFeature}` | `{docs.root}/<domain>/<feature>/` |
| `{handoffPath}` | `{docs.root}/<domain>/<feature>/handoff.md` |

## Interactive setup (no file yet)

If the user has not run `npm run configure`, gather at minimum:

1. Project name and conventions file
2. Docs root and domain mirror path
3. Task tracker: provider, enabled?, card key prefix, branch = card key?
4. If Trello: board URL/ID, list IDs for todo / in progress / backlog / done

Write `skills.config.json` to the workspace root, then continue.

## Provider notes

| Provider | MCP / API | Branch rule |
|----------|-----------|-------------|
| `trello` | Use `taskTracker.mcpServer` — see [task-workflow](../task-workflow/SKILL.md) | `{cardKey}` when `branchMatchesCardKey` |
| `linear` | Linear MCP if available; else ask user for issue URL/ID | Issue ID or team prefix per user preference |
| `github` | `gh issue` or GitHub MCP | `issue-{number}` or user-defined |
| `none` | Skip card lookup; use feature branch names from user | User chooses branch name |

When `taskTracker.enabled` is `false` or provider is `none`, skip card/issue sync; implement trivial fixes directly per `project.conventionsFile`.

## Skills that depend on this config

- [task-workflow](../task-workflow/SKILL.md) — card/issue + branch
- [write-plan](../write-plan/SKILL.md) — docs paths, card prerequisite
- [write-feature-spec](../write-feature-spec/SKILL.md) — spec location, card link
- [write-finalize-docs](../write-finalize-docs/SKILL.md) — docs paths, validation commands
- [write-handoff](../write-handoff/SKILL.md) — handoff paths, card key
- [mode-brainstorm](../mode-brainstorm/SKILL.md) — epic decomposition, tracker artifacts

**Always load config before invoking those skills** (or ensure they load it in step 1).
