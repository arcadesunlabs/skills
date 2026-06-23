# design-feature — Scope sizing and decomposition

Use this reference during **Step 3 — Scope sizing** and when finalizing an epic.

Load [workflow](../workflow/SKILL.md) first. Use `{docs.root}` from config. Tracker symbols (`{taskId}`, `{cardKeyPrefix}`) apply only when `taskTracker.enabled`.

## When to decompose

Score the request against these signals. **If 2 or more fire**, treat the work as an **epic** (multi-card), not a single implementation task.

| Signal                              | Threshold                              |
| ----------------------------------- | -------------------------------------- |
| Files to create or modify           | > 8                                    |
| Independent user-facing slices      | ≥ 2 (each could ship as its own PR)    |
| `implementation.phases` anticipated | > 3 with weak coupling between them    |
| Layers touched                      | UI + data/schema migration in one task |
| Testable acceptance criteria        | > 8 independent scenarios              |
| Estimated agent session             | > 1 focused session (~2–3 h)           |

**Do not decompose** when slices are tightly coupled and splitting would block every PR (shared migration + all consumers in one atomic change). In that case, keep one card but split `build-feature` phases only.

## Granularity rules

Prefer **vertical slices** (deliverable user value), not horizontal layers.

| Avoid                                      | Prefer                                                      |
| ------------------------------------------ | ----------------------------------------------------------- |
| Card 1: Hooks, Card 2: Queries, Card 3: UI | Card 1: Metrics panel redesign, Card 2: Friends invite flow |

Each slice must have:

- One-sentence objective
- 3–5 testable acceptance criteria
- Explicit **out of scope** for that slice
- **Depends on** column (other slice / task ID, or "none")
- Target PR size: reviewable in one pass (~≤ 400 lines diff when possible)

## Decomposition proposal template

Present this table to the user **before** writing the full spec. Revise until approved.

| Order | Proposed title | Objective | Depends on | Out of scope (this slice) |
| ----- | -------------- | --------- | ---------- | ------------------------- |
| 1     | …              | …         | none       | …                         |
| 2     | …              | …         | slice 1?   | …                         |

Ask explicitly when `taskTracker.enabled`:

> "The scope looks large for a single PR. Should I treat this as an epic and create child work items on your tracker with this decomposition?"

When tracker is disabled, ask whether to split into multiple delivery slices documented in the spec only.

**Never create tracker items without user approval.**

## Epic vs single-slice outcomes

| Outcome          | Parent card                 | Child cards                    | Repo artifacts                             | Next step                                 |
| ---------------- | --------------------------- | ------------------------------ | ------------------------------------------ | ----------------------------------------- |
| **Single slice** | Implementation card         | —                              | `01-spec.md` + `02-context.md` only        | `build-feature` → `close-workflow`        |
| **Epic**         | Tracker — spec, child links | One per slice in **todo** list | `01-spec.md` (+ `02-context.md` per slice) | **STOP** — pick child; finalize per slice |

## Tracker conventions (epic flow)

**Skip this section when `taskTracker.enabled` is false.** For provider-specific MCP tools and templates, see [build-feature references/tracker.md](../../build-feature/references/tracker.md).

### Parent card description (after children exist)

```markdown
## Epic

{one-paragraph summary}

## Spec

`{docs.root}/<domain>/<feature>/01-spec.md`

## Child cards

| Key       | Title   | Status  |
| --------- | ------- | ------- |
| {cardKey} | {title} | backlog |

## Implementation order

1. {cardKey} — {why first}
```

Update via tracker MCP (e.g. `trello_update_card` for Trello, or the Jira issue-update tool for Jira) using the parent `cardId` / issue key from search.

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

1. Invoke [build-feature](../../build-feature/SKILL.md) tracker steps for the **child slice** when tracker is enabled (branch + confirm work item).
2. Read the child card description (scope + acceptance criteria) and epic `01-spec.md` for shared context.
3. Invoke [build-feature](../../build-feature/SKILL.md) path A′ — scope is **that slice only**; do not re-spec the whole epic.
4. Parent branch may hold only spec/skills/docs commits; application code commits belong on child branches.
