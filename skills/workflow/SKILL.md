---
name: workflow
description: Load or create per-project workflow settings (task tracker, docs paths, branch naming). Use before design-feature, build-feature, or close-workflow; when skills.config.json is missing; or when configuring a new project.
---

# Workflow

**Announce at start:** "I'm using the workflow skill."

Every workflow skill reads **`skills.config.json`** at the **workspace root** (the project where you code, not the skills repo).

## First step

1. Look for `skills.config.json` in the workspace root.
2. If **missing**, ask the user to run:

   ```bash
   npx github:arcadesunlabs/skills skills-configure .
   ```

   Or collect values below with `AskQuestion` / conversation and write the file.

3. If **present**, read it and use its values for the rest of the session.

Example: [skills.config.example.json](../../../skills.config.example.json).

## Config fields

| Field                              | Used for                                           |
| ---------------------------------- | -------------------------------------------------- |
| `project.name`                     | Human-readable project label in plans and handoffs |
| `project.conventionsFile`          | Repo rules file (e.g. `CLAUDE.md`, `AGENTS.md`)  |
| `docs.root`                        | Feature docs folder (empty = no structured docs) |
| `docs.indexFile`                   | Docs index path                                    |
| `docs.domainMirror`                | Code path that doc domains mirror                  |
| `taskTracker.provider`             | `trello` \| `jira` \| `linear` \| `github` \| `none` |
| `taskTracker.enabled`              | Whether tracked work uses cards/issues             |
| `taskTracker.cardKeyPrefix`        | Card key prefix (e.g. `REV`, `PM`)                 |
| `taskTracker.branchMatchesCardKey` | Branch name equals card key when true              |
| `taskTracker.mcpServer`            | MCP server for the tracker (Trello/Jira)           |
| `taskTracker.trello.*`             | Board URL, ID, list names/IDs (Trello only)        |
| `taskTracker.jira.*`               | Site URL, project key, board, issue types, statuses (Jira only) |
| `code.appRoot`                     | App root for lint/test commands                    |
| `code.lintCommand`                 | Lint command for close-workflow validation         |
| `code.testCommand`                 | Test command for close-workflow validation         |

## Derived values

| Symbol             | Rule                                        |
| ------------------ | ------------------------------------------- |
| `{cardKey}`        | `{cardKeyPrefix}-{number}` — e.g. `REV-42`  |
| `{cardKeyPattern}` | `{cardKeyPrefix}-XXXX`                      |
| `{docsFeature}`    | `{docs.root}/<domain>/<feature>/`           |
| `{handoffPath}`    | `{docs.root}/<domain>/<feature>/handoff.md` |

## Provider notes

| Provider | MCP / API                                                                    | Branch rule                                 |
| -------- | ---------------------------------------------------------------------------- | ------------------------------------------- |
| `trello` | Use `taskTracker.mcpServer` — see [build-feature references/tracker.md](../build-feature/references/tracker.md) | `{cardKey}` when `branchMatchesCardKey` |
| `jira`   | Use `taskTracker.mcpServer` (default `user-jira`) or Jira REST/CLI if no MCP | `{cardKey}` when `branchMatchesCardKey`     |
| `linear` | Linear MCP if available; else ask user for issue URL/ID                      | Issue ID or team prefix per user preference |
| `github` | `gh issue` or GitHub MCP                                                     | `issue-{number}` or user-defined            |
| `none`   | Skip card lookup; use feature branch names from user                         | User chooses branch name                    |

When `taskTracker.enabled` is `false` or provider is `none`, skip card/issue sync; implement trivial fixes directly per `project.conventionsFile`.

## Skill routing

| User intent                          | Skill                                              |
| ------------------------------------ | -------------------------------------------------- |
| Brainstorm, spec, PRD, grill design  | [design-feature](../design-feature/SKILL.md)       |
| Pick up card, plan, implement        | [build-feature](../build-feature/SKILL.md)         |
| Handoff or finalize docs after ship  | [close-workflow](../close-workflow/SKILL.md)       |
| Create or improve agent skills       | [write-skill](../write-skill/SKILL.md)             |

**Always load this skill before the others** (or ensure they load config in step 0).
