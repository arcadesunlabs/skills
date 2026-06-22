---
name: write-plan
description: Plan and implement non-trivial feature work — map flow, architecture, files, execute in phased order, and review. Use after task inception or after brainstorm/spec.
---

# Write Plan

**Announce at start:** "I'm using the write-plan skill."

Plan **and** implement non-trivial feature work. Two modes:

| Mode             | What it does                                                                  |
| ---------------- | ----------------------------------------------------------------------------- |
| **Write**        | Map scope, architecture, files, phases; save artifacts; get user confirmation |
| **Read/Execute** | Implement phase by phase from the saved plan                                  |

**Prerequisite:** Load [workflow-config](../workflow-config/SKILL.md). When `taskTracker.enabled`, use tracked card `{cardKeyPattern}` and branch per config — run [task-workflow](../task-workflow/SKILL.md) first.

**Artifacts:** `{docs.root}/<domain>/<feature>/03-plan.md` + updates to `02-context.md` (see `project.conventionsFile` in config)

**Reference:** templates, tables, and per-phase details → [REFERENCE.md](REFERENCE.md)

---

## Entry paths

| Path   | When                                                                                 | Input                                                      |
| ------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **A**  | After `mode-brainstorm` → `write-feature-spec`                                       | `01-spec.md`                                               |
| **A′** | Epic child slice — after user picks a child `{cardKey}` from the parent tracker card | `01-spec.md` + child card description (current slice only) |
| **B**  | No spec — direct implementation task                                                 | Conversation                                               |

**Epic scoping (path A′):** Fetch the child card via task tracker MCP/CLI. Plan and implement **only** the slice matching the current branch's `{cardKey}`, using the child card description for scope and acceptance criteria. Reference the epic `01-spec.md` for shared context; do not plan phases for other slices.

Skip this skill for trivial tasks (typo, single-line fix) — implement per `project.conventionsFile` in config.

---

## Phase Write — Plan before code

### Step 0 — Flow boundaries

Confirm entry point, exit point, screens/pages, and routes. **Stop and ask** if unclear. Do not proceed until boundaries are defined.

### Step 1 — Classify the task

Use `AskQuestion`:

- `question`: "What type of task is this?"
- `header`: "Task type"
- `options`: New feature | Improvement / refactor | Bug fix

Informs — but does not by itself decide — the architecture pattern (see Step 2).

### Step 2 — Architecture pattern

Task type is only the starting hint. The pattern is decided by the **architecture the touched code already uses** — inspect the files you will modify before choosing:

| Situation                                      | Pattern              | Reference                                                                     |
| ---------------------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| New feature (greenfield in this area)          | Match project stack  | `project.conventionsFile`, [REFERENCE.md](REFERENCE.md#architecture-patterns) |
| Improvement / bug fix on existing feature code | Match existing files | Inspect touched files first; same reference when extending                    |

> **Rule:** never introduce foreign patterns unless the touched area already uses them. Do not downgrade a screen/module to a simpler pattern just because the task is an "improvement". When ambiguous, inspect neighbors under `docs.domainMirror` and **ask the user**.

### Step 3 — Scope

- **Domain** — feature area under `docs.domainMirror` from config (e.g. `expense-list`, `auth`).
- **Module / package** — single app, monorepo package, or client + server? Confirm with user if unclear.
- **Layers** — see [layer table](REFERENCE.md#layer-and-location-selection).

### Step 4 — Files, phases

1. List every **CREATE** / **MODIFY** file (see [files example](REFERENCE.md#files-example)).
2. Note project-specific atomic skills to invoke during execution, if the repo defines them.
3. Group into [increments](REFERENCE.md#increments).
4. Add checklist items per applicable implementation phase to `03-plan.md`. Document omitted phases under `## Skipped phases`.

### Step 5 — Confirm

1. Save `03-plan.md` and update `02-context.md` using [templates](REFERENCE.md#03-planmd-template).
2. Present [confirmation summary](REFERENCE.md#confirmation-summary-template).

**Do not write implementation code before user confirms.** Revise and re-confirm if requested.

---

## Phase Read/Execute — Implement after confirmation

Default order: **UI-first**. Omit irrelevant phases; document skips in `03-plan.md`.

### Execution flexibility

The phase table is a **guide**, not a rigid script. During implementation the agent may:

- **Run phases in parallel** when they have no dependency on each other (e.g. tests while i18n keys are drafted).
- **Delegate to subagents** when it speeds up isolated work — e.g. `code-reviewer` for Phase 9, explore agents for navigation call sites.
- **Stay inline** when phases are tightly coupled, touch the same files, or need sequential validation.

Respect **hard dependencies**: do not wire UI ↔ orchestration (Phase 3) before both exist; do not run Phase 9 before implementation is stable; **Phase 10 (finalize docs) always last** before optional Phase 11.

Note parallel work or subagent use in `03-plan.md` when it helps traceability. Details: [REFERENCE.md — Execution strategy](REFERENCE.md#execution-strategy).

| #   | Phase                | Notes                                                                         |
| --- | -------------------- | ----------------------------------------------------------------------------- |
| 1   | UI                   | Screens, pages, components, widgets — match existing domain patterns          |
| 2   | Orchestration        | Controllers, hooks, view models, blocs — loading, errors, mutations           |
| 3   | UI ↔ Orchestration   | Wire presentation to orchestration; keep UI thin                              |
| 4   | Data layer           | Repositories, queries, API clients; migrations if schema changes              |
| 5   | Routes / navigation  | Register routes; map **every** entry point from the spec                      |
| 6   | Tests                | Project test stack; co-locate per convention; purposeful coverage only        |
| 7   | Internationalization | All required locales; reuse existing keys when possible                       |
| 8   | Analytics            | Skip unless product asks — document in Skipped phases                         |
| 9   | Code review          | Agent `code-reviewer` or inline review                                        |
| 10  | Finalize docs        | **Mandatory** — invoke [write-finalize-docs](../write-finalize-docs/SKILL.md) |
| 11  | New skill needed?    | `write-skill` if approved                                                     |

Per-phase rules: [REFERENCE.md — Implementation phases](REFERENCE.md#implementation-phases-detailed).

**Key rules:**

- Phase 1: match existing UI patterns in the touched domain — **ask** if unclear.
- Phases 2–3: orchestration calls data-access functions; UI receives data and callbacks.
- Phase 4: persistence/network in the project's data module; schema changes in the canonical migrations folder.
- Phase 5: map **every** navigation entry point — **ask** if unclear.
- Phase 6: purposeful tests only — test behavior that matters.
- Phase 9: use `code-reviewer` for large or cross-layer changes; run before Phase 10.
- Phase 10: **mandatory** — invoke `write-finalize-docs`; folder must end with only `01-spec.md` + `02-context.md`.
- Phase 7: reuse existing i18n/l10n keys when possible.

For each phase: update `03-plan.md` checkboxes, invoke listed project skills when applicable, stop when blocked.

---

## When to stop and ask

- Flow boundaries, routes, or call sites unclear
- Architecture pattern ambiguous for touched files
- Blocker (missing dependency, failing verification, unclear requirement)
- User has not confirmed the plan (Write phase)

**Ask rather than guess.**

---

## Completion

1. Update `03-plan.md` checkboxes and `02-context.md` (Known Behavior, validation checklist).
2. **Mandatory:** Invoke [write-finalize-docs](../write-finalize-docs/SKILL.md) — merge transient docs, delete `03-plan.md`, `04-tasks.md`, `handoff.md`; folder must contain only `01-spec.md` and `02-context.md`.
3. Tell the user:

> Implementation complete. Docs finalized at `{docs.root}/<domain>/<feature>/` — only `01-spec.md` and `02-context.md` remain.

---

## Output checklist

**After Write (before code):**

- [ ] Plan saved to `{docs.root}/<domain>/<feature>/03-plan.md`
- [ ] Architecture pattern chosen and justified
- [ ] File list identified
- [ ] User confirmed

**After Read/Execute:**

- [ ] All applicable phases completed
- [ ] Code review passed (Phase 9)
- [ ] `write-finalize-docs` completed (Phase 10) — only `01-spec.md` + `02-context.md` in feature folder
