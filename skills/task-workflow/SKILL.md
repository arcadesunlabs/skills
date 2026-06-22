---
name: task-workflow
description: Start work on a tracked task — confirm card/issue, create branch from config (card key prefix), sync tracker metadata. Use when picking up a card, starting an epic child slice, or before write-plan on tracked work.
---

# Task Workflow

**Announce at start:** "I'm using the task-workflow skill."

## Step 0 — Load config

Invoke [workflow-config](../workflow-config/SKILL.md) and read `skills.config.json`. All board names, prefixes, and paths come from config — never assume a specific project.

If `taskTracker.enabled` is `false` or `provider` is `none`, stop this skill and proceed without card sync (user provides branch name if needed).

## Rules (all providers)

1. **Never invent card/issue numbers.** After creating a card, fetch again for real ID, URL, and key.
2. **Branch naming:** when `branchMatchesCardKey` is true, branch = `{cardKey}` (e.g. `REV-42` → `git checkout -b REV-42`).
3. **One card, one branch, one reviewable slice.** Epic parent tracks spec and child links; code commits go on child branches.
4. **Confirm with user** when title, scope, or branch name is ambiguous.

## Trello (`provider: trello`)

Use MCP server from `taskTracker.mcpServer` (default `user-trello`). Board and lists: `taskTracker.trello` in config.

| Action | Tool |
|--------|------|
| Find board/card | `trello_search_all_boards` |
| List board lists | `trello_get_lists` |
| Create card | `trello_add_card` |
| Update description | `trello_update_card` |
| Cards in a list | `trello_get_cards_by_list` |

Read each tool schema in the MCP folder before calling.

**Lists** (from config `taskTracker.trello.lists`):

| Purpose | Config key |
|---------|------------|
| New implementation cards (children) | `todo` |
| Active epic / work in progress | `inProgress` |
| Lower-priority backlog | `backlog` |
| Done | `done` |

### Starting work on an existing card

1. Search for the card (by `{cardKey}` or title).
2. Read description: scope, acceptance criteria, parent epic link.
3. Create or checkout branch per config branch rule.
4. Tell the user: card URL, branch name, and spec path under `{docs.root}/` if present.
5. Proceed to `write-plan` (path A or A′) or implement if trivial.

### Creating cards (epic flow)

- **Child implementation card** → `todo` list
- **Parent epic while active** → `inProgress` list

Use templates from [mode-brainstorm/REFERENCE.md](../mode-brainstorm/REFERENCE.md).

## Linear / GitHub

Provider-specific steps are not bundled yet. Use available MCP or CLI:

- **Linear:** search issue by identifier; branch = `{cardKey}` or team convention from user.
- **GitHub:** `gh issue view {number}`; branch per user preference in config or conversation.

Ask the user for board/repo and list/column mapping if not in config.

## When to skip

- Typo or one-line fix with no tracker card — implement directly per `project.conventionsFile`.
- User explicitly says not to use the task tracker for this task.
