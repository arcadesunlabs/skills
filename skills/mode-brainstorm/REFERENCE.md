# mode-brainstorm — Scope Sizing & Decomposition Reference

Use this reference during **Step 4 — Scope sizing** and when finalizing an epic.

Load [workflow-config](../workflow-config/SKILL.md) first. Use `{cardKey}`, `{cardKeyPrefix}`, and `{docs.root}` from config below.

## When to decompose

Score the request against these signals. **If 2 or more fire**, treat the work as an **epic** (multi-card), not a single implementation task.

| Signal                          | Threshold                                                    |
| ------------------------------- | ------------------------------------------------------------ |
| Files to create or modify       | > 8                                                          |
| Independent user-facing slices  | ≥ 2 (each could ship as its own PR)                          |
| `write-plan` phases anticipated | > 3 with weak coupling between them                          |
| Layers touched                  | UI + data/schema migration in one task                      |
| Testable acceptance criteria    | > 8 independent scenarios                                    |
| Estimated agent session         | > 1 focused session (~2–3 h)                                 |

**Do not decompose** when slices are tightly coupled and splitting would block every PR (shared migration + all consumers in one atomic change). In that case, keep one card but split `write-plan` phases only.

## Granularity rules

Prefer **vertical slices** (deliverable user value), not horizontal layers.

| Avoid                                              | Prefer                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| Card 1: Hooks, Card 2: Queries, Card 3: UI         | Card 1: Metrics panel redesign, Card 2: Friends invite flow         |

Each slice must have:

- One-sentence objective
- 3–5 testable acceptance criteria
- Explicit **out of scope** for that slice
- **Depends on** column (other `{cardKey}` or "none")
- Target PR size: reviewable in one pass (~≤ 400 lines diff when possible)

## Decomposition proposal template

Present this table to the user **before** writing the full spec. Revise until approved.

| Order | Proposed title | Objective | Depends on | Out of scope (this slice) |
| ----- | -------------- | --------- | ---------- | ------------------------- |
| 1     | …              | …         | none       | …                         |
| 2     | …              | …         | {cardKey}? | …                         |

Ask explicitly (adapt tracker name from config):

> "The scope looks large for a single card/PR. Should I treat `{parentCardKey}` as an epic and create child cards on the task tracker with this decomposition?"

**Never create tracker cards without user approval.**

## Epic vs single-slice outcomes

| Outcome          | Parent card                    | Child cards                          | Repo artifacts                          | Next step                                     |
| ---------------- | ------------------------------ | ------------------------------------ | --------------------------------------- | --------------------------------------------- |
| **Single slice** | Implementation card            | —                                    | `01-spec.md` + `02-tech.md` only        | `write-plan` → `write-finalize-docs`          |
| **Epic**         | Tracker — spec, child links    | One per slice in **todo** list       | `01-spec.md` (+ `02-tech.md` per slice) | **STOP** — pick child; finalize per slice     |

## Tracker conventions (epic flow)

When `taskTracker.provider` is `trello`, use board and lists from `skills.config.json` → `taskTracker.trello`.

Follow [task-workflow](../task-workflow/SKILL.md) for MCP tool usage, card lookup, and branch rules.

### Parent card description (after children exist)

```markdown
## Epic

{one-paragraph summary}

## Spec

`{docs.root}/<domain>/<feature>/01-spec.md`

## Child cards

| Key     | Title   | Status  |
| ------- | ------- | ------- |
| {cardKey} | {title} | backlog |

## Implementation order

1. {cardKey} — {why first}
```

Update via tracker MCP (e.g. `trello_update_card`) using the parent `cardId` from search.

### Child card description template

```markdown
## Parent epic

{parentCardKey} — {parent title}
{parent.url from API}

## Spec section

See `{docs.root}/<domain>/<feature>/01-spec.md` — slice "{slice name}"

## Scope

{objective}

## Acceptance criteria

- …
- …

## Out of scope

- …

## Depends on

{otherCardKey} or none
```

Create via tracker MCP on the **todo** list ID from config. After creation, search the new card for real key, `url`, and `id` — never invent numbers.

## Starting implementation on a child

When the user picks a slice:

1. Invoke [task-workflow](../task-workflow/SKILL.md) for the **child** `{cardKey}` (branch + confirm card).
2. Read the child card description (scope + acceptance criteria) and epic `01-spec.md` for shared context.
3. Invoke [write-plan](../write-plan/SKILL.md) path A′ — scope is **that slice only**; do not re-spec the whole epic.
4. Parent branch may hold only spec/skills/docs commits; application code commits belong on child branches.
