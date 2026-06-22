# Write Plan — Reference

Detailed tables, templates, and per-phase rules. Load when drafting artifacts or executing a specific phase.

Load [workflow-config](../workflow-config/SKILL.md) first. Paths use `{docs.root}`; ticket keys use `{cardKey}` from config.

Before planning file paths or architecture, read `project.conventionsFile` and inspect the code under `docs.domainMirror` and `code.appRoot`. **Match what the touched area already uses** — do not import patterns from another stack.

---

## Architecture patterns

> Choose by the architecture the **touched files already use**, not by task type alone. See [SKILL.md Step 2](SKILL.md).

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
Ticket:   {cardKey}
Entry:    A (with spec) | A′ (epic slice) | B (direct)

Files:
  CREATE ...
  MODIFY ...

Implementation phases:
  1. …
  2. …

Skipped phases:
  N. {phase} — {reason}

Waiting for confirmation to start implementation.
```

---

## 03-plan.md template

Save to `{docs.root}/<domain>/<feature>/03-plan.md`. Removed by `write-finalize-docs` after delivery.

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Type:** New feature | Improvement | Bug fix
**Pattern:** {architecture chosen from inspection}
**Domain:** e.g. expense-list, auth
**Entry path:** A | A′ | B
**Ticket:** {cardKey}

## Files

CREATE ...
MODIFY ...

## Skipped phases

- Phase N — [reason]

## Implementation phases

### Phase 1 — Components / UI

- [ ] ...

### Phase 2 — Orchestration (hooks, controllers, etc.)

- [ ] ...

### Phase 3 — UI ↔ orchestration

- [ ] ...

### Phase 4 — Data layer

- [ ] ...

### Phase 5 — Routes / navigation

- [ ] ...

### Phase 6 — Tests

- [ ] ...

### Phase 7 — Internationalization

- [ ] ...

### Phase 8 — Analytics

- [ ] ...

### Phase 9 — Code review

- [ ] ...

### Phase 10 — Finalize docs

- [ ] Invoked `write-finalize-docs`
- [ ] `01-spec.md` updated to shipped product truth (no code)
- [ ] `02-context.md` updated to match implementation
- [ ] Deleted `03-plan.md`, `04-tasks.md`, `handoff.md` (and any other stray files)

### Phase 11 — New skill needed?

- [ ] Evaluated — no new skill required | new skill proposed
```

Adapt phase names to the stack (e.g. skip i18n if the app is single-locale). Document omissions under `## Skipped phases`.

---

## 02-context.md sections (during implementation)

Update `{docs.root}/<domain>/<feature>/02-context.md` with technical detail. Append or revise these sections as implementation progresses:

```markdown
# {Feature Name} — Context

## Feature Snapshot

- Feature: {short description}
- Status: In progress ({cardKey})
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

The default phase order in [SKILL.md](SKILL.md) is a **guide**, not a rigid script.

### When to parallelize

| Example                               | Phases | Why                                      |
| ------------------------------------- | ------ | ---------------------------------------- |
| Tests while scaffolding orchestration | 6 ∥ 2  | Different files, no shared mutable state |
| i18n keys while data layer            | 7 ∥ 4  | Independent files                        |
| Route wiring while UI scaffold        | 5 ∥ 1  | Only if page API is already stable       |

### When to stay sequential

- **UI ↔ orchestration** — props/callbacks depend on both sides existing.
- **Data layer before orchestration** — hooks/controllers need query/repository functions.
- **Stable code before broad tests** — unless doing deliberate TDD on an isolated unit.
- **9 → 10** — code review, then finalize docs.
- **10 → 11** — docs finalized, then evaluate new skill.

### Subagents

| Agent                   | Typical use                                  |
| ----------------------- | -------------------------------------------- |
| `code-reviewer`         | Phase 9 on large or cross-layer diffs        |
| `explore`               | Find patterns and navigation before Phase 5  |
| `Task` (generalPurpose) | Isolated research while UI work stays inline |

---

## Implementation phases (detailed)

Default order is **UI-first**. Omit phases that do not apply; record them in `## Skipped phases`.

### Phase 1 — Components / UI

- Follow existing patterns in the touched domain folder.
- Keep presentation thin — no direct DB/HTTP calls if the project uses an intermediate layer.
- If the correct pattern is unclear, **ask the user** and wait.

### Phase 2 — Orchestration

- Match sibling features: loading state, reload, mutation helpers.
- Call data-access functions — not raw clients when a module already exists.

### Phase 3 — UI ↔ orchestration

- Wire props/callbacks; show pending/disabled state from the project's mutation pattern.

### Phase 4 — Data layer

- Reads/writes in the project's query/repository/API module.
- Schema changes: migrations in the canonical folder; update generated types if applicable.

### Phase 5 — Routes / navigation

- Register routes per project router.
- Map **every** navigation entry point from the spec.
- If entry points are unclear, **ask the user**.

### Phase 6 — Tests

- Co-locate or place tests per project convention.
- Use the project's test stack (unit, widget, integration).
- Tests must have a **clear purpose** — not coverage for its own sake.
- Mock at the repository/query boundary when testing UI behavior.

### Phase 7 — Internationalization

- Add keys to all required locales.
- Reuse existing keys when the string already exists.
- Skip if the project is single-locale — document in Skipped phases.

### Phase 8 — Analytics

- Skip unless product explicitly requests tracking.

### Phase 9 — Code review

- Run inline review or delegate to `code-reviewer` for large diffs.
- Check: layer boundaries respected, locales updated, migrations safe, tests meaningful.

### Phase 10 — Finalize docs

- **Mandatory** — invoke [write-finalize-docs](../write-finalize-docs/SKILL.md).
- Folder must end with only `01-spec.md` and `02-context.md`.

### Phase 11 — New skill needed?

- If a recurring gap appears across tasks, propose a new atomic skill via `write-skill`.
- Do not create overlapping orchestrators — extend this skill or REFERENCE instead.
