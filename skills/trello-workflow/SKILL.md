---
name: trello-workflow
description: Start work on a Trello card — confirm card, create PM-XXXX branch, and keep card metadata in sync. Use when picking up a card, starting an epic child slice, or before write-plan on a tracked task.
---

# Trello Workflow

**Announce at start:** "I'm using the trello-workflow skill."

Board and list IDs are defined in [CLAUDE.md](../../../CLAUDE.md). Use MCP server `user-trello`.

## Board (Pomar)

| Field | Value |
|-------|-------|
| Board URL | https://trello.com/b/RMO2g1vS/pomar |
| Board ID | `6a35aaa5887da4dae7ce02d5` |
| Card prefix | `PM-XXXX` |
| Branch name | Same as card key (e.g. `PM-42`) |

## Lists

| Purpose | List name | List ID |
|---------|-----------|---------|
| New implementation cards (children) | A Fazer (Priorizado) | `6a35aaa5887da4dae7ce02d2` |
| Active epic / work in progress | Em Andamento | `6a35aaa5887da4dae7ce02cf` |
| Lower-priority backlog | Backlog | `6a35aaa5887da4dae7ce02d1` |
| Done | Concluído | `6a35aaa5887da4dae7ce02d0` |

## MCP tools

| Action | Tool |
|--------|------|
| Find board/card | `trello_search_all_boards` (query: card title or `"pomar"`) |
| List board lists | `trello_get_lists` |
| Create card | `trello_add_card` |
| Update description | `trello_update_card` |
| Cards in a list | `trello_get_cards_by_list` |

Read each tool schema in the MCP folder before calling.

## Rules

1. **Never invent `PM-*` numbers.** After `trello_add_card`, search again to get real `idShort`, `url`, and `id`.
2. **Branch = card key.** Example: card `PM-42` → `git checkout -b PM-42`.
3. **One card, one branch, one reviewable slice.** Epic parent tracks spec and child links; code commits go on child branches.
4. **Confirm with user** when the card title, scope, or branch name is ambiguous.

## Starting work on an existing card

1. Search for the card (by `PM-XXX` or title).
2. Read description: scope, acceptance criteria, parent epic link.
3. Create or checkout branch named after the card key.
4. Tell the user: card URL, branch name, and spec path under `docs/` if present.
5. Proceed to `write-plan` (path A or A′) or implement if trivial.

## Creating cards (epic flow)

**Child implementation card** → list **A Fazer (Priorizado)** (`6a35aaa5887da4dae7ce02d2`).

**Parent epic while active** → move or keep in **Em Andamento** (`6a35aaa5887da4dae7ce02cf`).

Use templates from [mode-brainstorm/REFERENCE.md](../mode-brainstorm/REFERENCE.md).

## When to skip

- Typo or one-line fix with no Trello card — implement directly per [CLAUDE.md](../../../CLAUDE.md).
- User explicitly says not to use Trello for this task.
