---
name: build-feature
description: Pick up a tracked task, plan, and implement feature work — card/issue sync, branch creation, phased implementation, and code review. Use when starting a card, planning technical work, implementing a spec, or after design-feature.
---

# Build Feature

**Announce at start:** "I'm using the build-feature skill."

Plan **and** implement non-trivial feature work. Two modes:

| Mode             | What it does                                                                  |
| ---------------- | ----------------------------------------------------------------------------- |
| **Write**        | Map scope, architecture, files, phases; save artifacts; get user confirmation |
| **Read/Execute** | Implement phase by phase from the saved plan                                  |

**Step 0:** Invoke [workflow](../workflow/SKILL.md). When `taskTracker.enabled`, run [tracker steps](references/tracker.md) first.

**Artifacts:** `{docs.root}/<domain>/<feature>/03-plan.md` + updates to `02-context.md`

**Detailed reference:** [references/plan.md](references/plan.md)

---

## Entry paths

| Path   | When                                                                                 | Input                                                      |
| ------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **A**  | After `design-feature`                                                               | `01-spec.md`                                               |
| **A′** | Epic child slice — user picked child `{cardKey}`                                     | `01-spec.md` + child card description (current slice only) |
| **B**  | No spec — direct implementation task                                                 | Conversation                                               |

**Epic scoping (path A′):** Fetch child card via tracker MCP/CLI. Plan and implement **only** the current slice. Reference epic `01-spec.md` for shared context.

Skip for trivial tasks (typo, single-line fix) — implement per `project.conventionsFile`.

---

## Phase Write — Plan before code

### Step 0 — Flow boundaries

Confirm entry point, exit point, screens/pages, and routes. **Stop and ask** if unclear.

### Step 1 — Classify the task

Ask: New feature | Improvement / refactor | Bug fix

### Step 2 — Architecture pattern

Inspect touched files before choosing. Match what the code already uses — see [references/plan.md](references/plan.md#architecture-patterns).

### Step 3 — Scope

Domain under `docs.domainMirror`, module/package, layers — confirm with user if unclear.

### Step 4 — Files, phases

List CREATE/MODIFY files, group into increments, add phase checklist to `03-plan.md`. See [references/plan.md](references/plan.md).

### Step 5 — Confirm

Save `03-plan.md` and `02-context.md`. Present confirmation summary. **Do not code before user confirms.**

---

## Phase Read/Execute — Implement after confirmation

Default order: **UI-first**. Omit irrelevant phases; document skips in `03-plan.md`.

| #   | Phase                | Notes                                                |
| --- | -------------------- | ---------------------------------------------------- |
| 1   | UI                   | Match existing domain patterns                       |
| 2   | Orchestration        | Loading, errors, mutations                           |
| 3   | UI ↔ Orchestration   | Wire presentation to orchestration                   |
| 4   | Data layer           | Repositories, queries, migrations                    |
| 5   | Routes / navigation  | Every entry point from spec                          |
| 6   | Tests                | Purposeful coverage only                             |
| 7   | Internationalization | All required locales                                 |
| 8   | Analytics            | Skip unless product asks                             |
| 9   | Code review          | Inline or `code-reviewer` subagent                   |
| 10  | Finalize docs        | **Mandatory** — [close-workflow](../close-workflow/SKILL.md) |
| 11  | New skill needed?    | `write-skill` if approved                            |

Per-phase details: [references/plan.md](references/plan.md#implementation-phases-detailed).

**Hard dependencies:** Phase 10 always last before optional Phase 11.

---

## When to stop and ask

Flow boundaries unclear, architecture ambiguous, blocker, or user has not confirmed the plan.

---

## Completion

1. Update `03-plan.md` checkboxes and `02-context.md`.
2. **Mandatory:** Invoke [close-workflow](../close-workflow/SKILL.md).
3. Tell the user docs are finalized at `{docs.root}/<domain>/<feature>/` — only `01-spec.md` and `02-context.md` remain.
