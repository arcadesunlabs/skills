# mode-brainstorm — Scope Sizing & Decomposition Reference

Use this reference during **Step 4 — Scope sizing** and when finalizing an epic.

## When to decompose

Score the request against these signals. **If 2 or more fire**, treat the work as an **epic** (multi-card), not a single implementation task.

| Signal                          | Threshold                                                    |
| ------------------------------- | ------------------------------------------------------------ |
| Files to create or modify       | > 8                                                          |
| Independent user-facing slices  | ≥ 2 (each could ship as its own PR)                          |
| `write-plan` phases anticipated | > 3 with weak coupling between them                          |
| Layers touched                  | web UI + Supabase migration/RPC in one task                  |
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
- **Depends on** column (other `PM-XXX` or "none")
- Target PR size: reviewable in one pass (~≤ 400 lines diff when possible)

## Decomposition proposal template

Present this table to the user **before** writing the full spec. Revise until approved.

| Order | Proposed title | Objective | Depends on | Out of scope (this slice) |
| ----- | -------------- | --------- | ---------- | ------------------------- |
| 1     | …              | …         | none       | …                         |
| 2     | …              | …         | PM-???     | …                         |

Ask explicitly:

> "O escopo parece grande para um único card/PR. Quer que eu trate `PM-{parent}` como épico e crie cards filhos no Trello com esta decomposição?"

**Never create Trello cards without user approval.**

## Epic vs single-slice outcomes

| Outcome          | Parent card (`PM-{parent}`)            | Child cards                               | Repo artifacts                         | Next step                                     |
| ---------------- | -------------------------------------- | ----------------------------------------- | -------------------------------------- | --------------------------------------------- |
| **Single slice** | Implementation card                    | —                                         | `01-spec.md` + `02-tech.md` only       | `write-plan` → `write-finalize-docs`          |
| **Epic**         | Tracker — spec, decisions, child links | One per slice in **A Fazer (Priorizado)** | `01-spec.md` (+ `02-tech.md` per slice)| **STOP** — pick child; then finalize per slice |

## Trello conventions (epic flow)

Board: [Pomar](https://trello.com/b/RMO2g1vS/pomar) — ID `6a35aaa5887da4dae7ce02d5`

| List                 | ID                         | Use                                |
| -------------------- | -------------------------- | ---------------------------------- |
| A Fazer (Priorizado) | `6a35aaa5887da4dae7ce02d2` | New child implementation cards     |
| Em Andamento         | `6a35aaa5887da4dae7ce02cf` | Parent epic while active           |
| Backlog              | `6a35aaa5887da4dae7ce02d1` | Optional — lower-priority children |

Follow [trello-workflow](../trello-workflow/SKILL.md) for MCP tool usage, card lookup, and branch rules.

### Parent card description (after children exist)

```markdown
## Epic

{one-paragraph summary}

## Spec

`docs/<domain>/<feature>/01-spec.md`

## Child cards

| PM      | Title   | Status  |
| ------- | ------- | ------- |
| PM-193  | {title} | backlog |
| PM-194  | {title} | backlog |

## Implementation order

1. PM-193 — {why first}
2. PM-194 — depends on PM-193
```

Update via `trello_update_card` using the parent `cardId` from search.

### Child card description template

```markdown
## Parent epic

PM-{parent} — {parent title}
{parent.url from API}

## Spec section

See `docs/<domain>/<feature>/01-spec.md` — slice "{slice name}"

## Scope

{objective}

## Acceptance criteria

- …
- …

## Out of scope

- …

## Depends on

PM-{other} or none
```

Create via `trello_add_card` on list `6a35aaa5887da4dae7ce02d2`. After creation, search the new card to obtain `idShort`, `url`, and `id` — never invent `PM-*` numbers.

## Starting implementation on a child

When the user picks a slice:

1. Invoke [trello-workflow](../trello-workflow/SKILL.md) for the **child** `PM-XXX` (branch + confirm card).
2. Read the child card description (scope + acceptance criteria) and epic `01-spec.md` for shared context.
3. Invoke [write-plan](../write-plan/SKILL.md) path A′ — scope is **that slice only**; do not re-spec the whole epic.
4. Parent branch may hold only spec/skills/docs commits; web code commits belong on child branches.
