---
name: build-feature
description: Plan and implement non-trivial feature work — scoped planning, phased implementation from config, and code review. Use when starting a task, planning technical work, implementing a spec, or after design-feature.
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

| Path   | When                                     | Input                                           |
| ------ | ---------------------------------------- | ----------------------------------------------- |
| **A**  | After `design-feature`                   | `01-spec.md`                                    |
| **A′** | Epic child slice — user picked one slice | `01-spec.md` + slice scope (current slice only) |
| **B**  | No spec — direct implementation task     | Conversation                                    |

**Epic scoping (path A′):** When tracker is enabled, fetch the child work item per [tracker.md](references/tracker.md). Plan and implement **only** the current slice. Reference epic `01-spec.md` for shared context.

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

### Step 4 — Files and phases

List CREATE/MODIFY files, group into increments, and build the phase checklist in `03-plan.md` from **`implementation.phases`** in config (one `### Phase N — {name}` section per entry). See [references/plan.md](references/plan.md).

### Step 5 — Confirm

Save `03-plan.md` and `02-context.md`. Present confirmation summary. **Do not code before user confirms.**

---

## Phase Read/Execute — Implement after confirmation

Execute phases in **`implementation.phases`** order from `skills.config.json`.

| Rule            | Detail                                                                   |
| --------------- | ------------------------------------------------------------------------ |
| Order           | Array order; defer `alwaysLast: true` until other phases finish          |
| Optional phases | Skip when irrelevant; document under `## Skipped phases` in `03-plan.md` |
| Stack hints     | Use each phase's `notes`; match patterns from `project.conventionsFile`  |
| Details         | [references/plan.md](references/plan.md#implementation-phase-hints)      |

If `implementation.phases` is missing, stop and run [workflow discovery](../workflow/references/discovery.md).

---

## When to stop and ask

Flow boundaries unclear, architecture ambiguous, blocker, or user has not confirmed the plan.

---

## Completion

1. Update `03-plan.md` checkboxes and `02-context.md`.
2. Complete the phase with `alwaysLast: true` (typically **Finalize docs**) via [close-workflow](../close-workflow/SKILL.md).
3. Tell the user docs are finalized at `{docs.root}/<domain>/<feature>/` — only `01-spec.md` and `02-context.md` remain.
