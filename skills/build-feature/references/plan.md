# Write Plan — Reference

Detailed tables, templates, and per-phase rules. Load when drafting artifacts or executing a specific phase.

Load [workflow](../../workflow/SKILL.md) first. Paths use `{docs.root}`. Phase order comes from `implementation.phases` in config.

Before planning file paths or architecture, read `project.conventionsFile` and inspect the code under `docs.domainMirror` and `code.appRoot`. **Match what the touched area already uses** — do not import patterns from another stack.

---

## Architecture patterns

> Choose by the architecture the **touched files already use**, not by task type alone. See [SKILL.md](../SKILL.md).

| Situation                             | Approach                                                            |
| ------------------------------------- | ------------------------------------------------------------------- |
| New feature (greenfield in this area) | Follow the dominant pattern in `docs.domainMirror` / `code.appRoot` |
| Improvement or bug fix                | Match the files you modify — same layers, naming, and data flow     |
| Ambiguous                             | Inspect neighbors in the same domain folder; **ask the user**       |

Common layer shapes (labels vary by project — map them from conventions, do not assume):

| Layer                      | Typical responsibility                                           |
| -------------------------- | ---------------------------------------------------------------- |
| **Presentation**           | Screens, widgets, components — user-visible UI                   |
| **Orchestration**          | Hooks, controllers, blocs, view models — loading, errors, wiring |
| **Data access**            | Repositories, queries, API clients — persistence and network     |
| **Routing / navigation**   | Route tables, deep links, guards                                 |
| **Shared / cross-cutting** | Auth, layout, design system, utilities                           |
| **Schema / migrations**    | DB migrations, generated types, RPC definitions                  |

---

## Layer and location selection

Derive concrete paths from the project — never copy paths from another repo.

| Situation                    | How to decide                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| New UI in an existing domain | Same folder pattern as sibling features under `docs.domainMirror`                       |
| New data/API surface         | Same module as related features (client package, `lib/queries/`, `repositories/`, etc.) |
| Shared UI or infra           | Project's shared component or core package                                              |
| Routes / entry points        | Project router config (grep navigation targets from the spec)                           |
| User-facing copy             | Project i18n / l10n location from conventions                                           |
| Tests                        | Co-located or `test/` tree per project norm                                             |

If conventions are missing, explore the codebase and document assumptions in `02-context.md`.

---

## Cross-cutting patterns

| Pattern            | Rule                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Separation**     | UI does not call databases or HTTP clients directly when the project already uses an intermediate layer |
| **Errors**         | Handle and surface errors at the orchestration layer; keep components/widgets thin                      |
| **Pending state**  | Use the project's existing loading/mutation pattern (`pendingKeys`, `AsyncValue`, etc.)                 |
| **Types**          | Reuse generated or shared types; avoid duplicate domain models                                          |
| **Schema changes** | Migrations in the project's canonical migrations folder; update types after apply                       |
| **Navigation**     | Map every entry point from the spec — links, redirects, post-action navigation                          |
| **i18n**           | All required locales for new user-facing strings                                                        |

---

## Files example

Use CREATE/MODIFY lines with **real paths** from the target project:

```
CREATE  {code.appRoot}/<domain>/<feature>_screen.dart
CREATE  {code.appRoot}/<domain>/<feature>_controller.dart
MODIFY  {code.appRoot}/<domain>/index.dart
MODIFY  {code.appRoot}/router/app_router.dart
CREATE  backend/migrations/20260619120000_add_feature.sql   # if schema change
CREATE  {code.appRoot}/<domain>/<feature>_test.dart
```

---

## Increments

Group files into the **smallest independently deliverable increments**:

- Each increment must be a coherent, reviewable unit.
- Identify which increments can be built **in parallel**.
- Smaller increments reduce review friction and make bugs easier to isolate.

---

## Confirmation summary template

Present to the user before implementation:

```
Implementation plan

Type:     New feature | Improvement | Bug fix
Pattern:  {from touched files / conventions}
Domain:   e.g. expense-list, auth
Task:     {taskId if taskTracker.enabled, else branch name}
Entry:    A (with spec) | A′ (epic slice) | B (direct)

Files:
  CREATE ...
  MODIFY ...

Implementation phases (from config):
  1. {name} — {notes}
  2. …

Skipped phases:
  {name} — {reason}

Waiting for confirmation to start implementation.
```

---

## 03-plan.md template

Save to `{docs.root}/<domain>/<feature>/03-plan.md`. Removed by `close-workflow` after delivery.

**Generate one `### Phase N — {name}` section per entry in `implementation.phases`.** Use each phase's `notes` for checklist hints. Phases with `alwaysLast: true` are numbered last in the plan even if listed at the end of the config array.

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Type:** New feature | Improvement | Bug fix
**Pattern:** {architecture chosen from inspection}
**Domain:** e.g. expense-list, auth
**Entry path:** A | A′ | B
**Tracked task:** {taskId or n/a}

## Files

CREATE ...
MODIFY ...

## Skipped phases

- {phase name} — [reason]

## Implementation phases

### Phase 1 — {name from config}

- [ ] …

### Phase 2 — {name from config}

- [ ] …

### Phase N — Finalize docs (when in config)

- [ ] Invoked `close-workflow`
- [ ] `01-spec.md` updated to shipped product truth (no code)
- [ ] `02-context.md` updated to match implementation
- [ ] Deleted `03-plan.md`, `04-tasks.md`, `handoff.md` (and any other stray files)
```

Mark optional phases skipped under `## Skipped phases` instead of leaving empty checklists.

---

## 02-context.md sections (during implementation)

Update `{docs.root}/<domain>/<feature>/02-context.md` with technical detail. Append or revise these sections as implementation progresses:

```markdown
# {Feature Name} — Context

## Feature Snapshot

- Feature: {short description}
- Status: In progress
- Tracked task: {taskId if applicable}
- Entry point: {screen, page, or trigger}
- Route / deep link: {path if applicable}
- Domain: {e.g. expense-list, auth}

## API / data contracts

{From spec if path A; otherwise from exploration.}

## Main implementation files

{From 03-plan.md Files section.}

## Known behavior

TBD — fill as implementation progresses.

## Manual validation checklist

{Convert each acceptance criterion from spec into a checklist item.}

- [ ] {AC 1}
- [ ] {AC 2}
```

Code snippets and file paths **belong here**, never in `01-spec.md`.

---

## Execution strategy

`implementation.phases` defines order; dependencies still matter within and across phases.

### When to parallelize

| Example                               | Phases                | Why                                      |
| ------------------------------------- | --------------------- | ---------------------------------------- |
| Tests while scaffolding orchestration | Tests ∥ Orchestration | Different files, no shared mutable state |
| i18n keys while data layer            | i18n ∥ Data layer     | Independent files                        |
| Route wiring while UI scaffold        | Routes ∥ UI           | Only if page API is already stable       |

### When to stay sequential

- **UI ↔ orchestration** — props/callbacks depend on both sides existing.
- **Data layer before orchestration** — when hooks/controllers need repository functions first.
- **Stable code before broad tests** — unless doing deliberate TDD on an isolated unit.
- **Code review before Finalize docs** — when both are in the config.
- **`alwaysLast` phases** — run after all other planned work.

### Subagents

| Agent                   | Typical use                                      |
| ----------------------- | ------------------------------------------------ |
| `code-reviewer`         | Code review phase on large or cross-layer diffs  |
| `explore`               | Find patterns and navigation before routes phase |
| `Task` (generalPurpose) | Isolated research while UI work stays inline     |

---

## Implementation phase hints

Match hints by **phase name** (case-insensitive). Use `notes` from config when present. Skip optional phases and record under `## Skipped phases`.

### UI / Components / Presentation

- Follow existing patterns in the touched domain folder.
- Keep presentation thin — no direct DB/HTTP calls if the project uses an intermediate layer.
- If the correct pattern is unclear, **ask the user** and wait.

### Orchestration

- Match sibling features: loading state, reload, mutation helpers.
- Call data-access functions — not raw clients when a module already exists.

### UI ↔ Orchestration / Wiring

- Wire props/callbacks; show pending/disabled state from the project's mutation pattern.

### Data layer / API

- Reads/writes in the project's query/repository/API module.
- Schema changes: migrations in the canonical folder; update generated types if applicable.

### Routes / navigation

- Register routes per project router.
- Map **every** navigation entry point from the spec.
- If entry points are unclear, **ask the user**.

### Tests

- Co-locate or place tests per project convention.
- Tests must have a **clear purpose** — not coverage for its own sake.

### Internationalization / i18n

- Add keys to all required locales; skip when single-locale — document in Skipped phases.

### Analytics

- Skip unless product explicitly requests tracking.

### Code review

- Run inline review or delegate to `code-reviewer` for large diffs.

### Finalize docs

- **Mandatory** when in config — invoke [close-workflow](../../close-workflow/SKILL.md).
- Folder must end with only `01-spec.md` and `02-context.md`.

### Implementation (minimal preset)

- Deliver the slice's core behavior in one pass; split files per increments section above.

### Custom phase names

- Follow the phase `notes` from config and `project.conventionsFile`.
- **Ask the user** when the intent of a custom phase is unclear.
