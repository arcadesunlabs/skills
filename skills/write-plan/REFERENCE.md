# Write Plan — Reference

Detailed tables, templates, and per-phase rules. Load when drafting artifacts or executing a specific phase.

Load [workflow-config](../workflow-config/SKILL.md) first. Paths use `{docs.root}`; ticket keys use `{cardKey}` from config.

> **Project-specific layers:** The architecture and file-path tables below are **examples** (React + Supabase). Replace with paths from `docs.domainMirror`, `code.appRoot`, and `project.conventionsFile` in your project.

---

## Architecture patterns

> Choose by the architecture the **touched files already use**, not by task type alone. See [SKILL.md Step 2](SKILL.md).

### hooks + queries (default)

Follow [web/CLAUDE.md](../../../web/CLAUDE.md).

```
web/src/
├── pages/<Feature>Page.tsx
├── components/<domain>/
│   ├── <Feature>Dialog.tsx
│   └── <Feature>Item.tsx
├── hooks/
│   └── use<Feature>.ts          # loading, mutations, reload
├── lib/queries/
│   └── <domain>.ts              # Supabase reads/writes
├── stores/                      # Zustand when global state needed
└── types/
```

| Situation              | Structure                                              |
| ---------------------- | ------------------------------------------------------ |
| Read-only screen data  | hook calls query fetch + local `useState`              |
| Mutations              | hook wraps query functions; exposes `pendingKeys`, errors |
| Shared UI              | `components/ui/` or cross-domain `components/layout/`  |
| Global timer/session   | `stores/` (e.g. `timerStore`)                          |

---

## Layer and location selection

| Situation                          | Location                                      |
| ---------------------------------- | --------------------------------------------- |
| Route-level page                   | `web/src/pages/`                              |
| Domain components                  | `web/src/components/<domain>/`                |
| Shared layout / auth UI            | `web/src/components/layout/`, `auth/`         |
| shadcn primitives                  | `web/src/components/ui/`                      |
| Orchestration hooks                | `web/src/hooks/`                              |
| Supabase queries                   | `web/src/lib/queries/`                        |
| Pure utilities                     | `web/src/lib/*.ts`                            |
| Supabase client                    | `web/src/lib/supabase.ts`                     |
| Postgres migrations                | `web/supabase/migrations/`                    |
| Generated DB types                 | `web/src/types/database.types.ts`             |
| Domain types / aliases             | `web/src/types/index.ts`                      |
| Global client state                | `web/src/stores/`                             |
| Route registration                 | `web/src/App.tsx` (lazy `Route`)              |
| User-facing strings                | `web/src/locales/pt-BR.json`, `en-US.json`    |

---

## Cross-cutting patterns

| Pattern           | Rule                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------- |
| **Data access**   | Components do not call Supabase directly — use hooks → `lib/queries/`                   |
| **Error handling**| Hooks catch errors, set localized messages (`mutationErrors`, `loadError`)              |
| **Pending state** | Use `pendingKeys` Set pattern in hooks for in-flight mutations                          |
| **Types**         | Prefer generated `database.types.ts`; aliases in `types/index.ts`                       |
| **Migrations**    | SQL files in `supabase/migrations/`; update `database.types.ts` after schema change     |
| **Routes**        | Lazy-load pages in `App.tsx`; protect with `ProtectedRoute` / `PublicOnlyRoute`         |
| **i18n**          | Both locales required for new user-facing strings                                       |

---

## Files example

```
CREATE  web/src/components/tasks/TaskFooDialog.tsx
CREATE  web/src/hooks/useTaskFoo.ts
CREATE  web/src/lib/queries/task-foo.ts
MODIFY  web/src/hooks/useTasks.ts
MODIFY  web/src/pages/DashboardPage.tsx
MODIFY  web/src/locales/pt-BR.json
MODIFY  web/src/locales/en-US.json
CREATE  web/supabase/migrations/20260619120000_add_task_foo.sql   # if schema change
CREATE  web/src/components/tasks/TaskFooDialog.test.tsx
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
Pattern:  hooks + queries (new) | Match existing files (fix/improvement)
Domain:   e.g. tasks, projects, friends
Ticket:   {cardKey}
Entry:    A (with spec) | B (direct)

Files:
  CREATE ...
  MODIFY ...

Implementation phases:
  1. Components
  2. Hooks
  ...

Skipped phases:
  8. Analytics — skip unless product explicitly requests tracking

Waiting for confirmation to start implementation.
```

---

## 03-plan.md template

Save to `{docs.root}/<domain>/<feature>/03-plan.md`. Remove after merge.

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Type:** New feature | Improvement | Bug fix
**Pattern:** hooks + queries | Match existing files
**Domain:** e.g. tasks, projects
**Entry path:** A (with spec) | B (direct)
**Ticket:** {cardKey}

## Files

CREATE ...
MODIFY ...

## Skipped phases

- Phase N — [reason]

## Implementation phases

### Phase 1 — Components

- [ ] ...

### Phase 2 — Hooks

- [ ] ...

### Phase 3 — Components ↔ Hooks

- [ ] ...

### Phase 4 — Data layer

- [ ] ...

### Phase 5 — Routes

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
- [ ] `02-tech.md` updated to match implementation
- [ ] Deleted `03-plan.md`, `04-tasks.md`, `handoff.md` (and any other stray files)

### Phase 11 — New skill needed?

- [ ] Evaluated — no new skill required | new skill proposed
```

---

## 02-tech.md sections (during implementation)

Update `{docs.root}/<domain>/<feature>/02-tech.md` with technical detail. Append or revise these sections as implementation progresses:

```markdown
# {Feature Name} — Context

## Feature Snapshot

- Feature: {short description}
- Status: In progress ({cardKey})
- Entry point: {page or trigger}
- Route: {path}
- Domain: {e.g. tasks, projects}

## API Contracts

{From spec if path A; otherwise TBD or from exploration.}

## Main Implementation Files

{From 03-plan.md Files section.}

## Known Behavior

TBD — to be filled after implementation.

## Manual Validation Checklist

{Convert each Acceptance Criterion from spec into a checklist item.}

- [ ] {AC 1}
- [ ] {AC 2}
```

---

## Execution strategy

The UI-first phase order is the **default sequence**, not a mandatory lockstep.

### When to parallelize

| Example                                | Phases | Why                                    |
| -------------------------------------- | ------ | -------------------------------------- |
| Component tests while hook scaffold    | 6 ∥ 2  | Different files                        |
| i18n keys while query functions        | 7 ∥ 4  | Independent files                      |
| Route wiring while components scaffold | 5 ∥ 1  | Only if page API is stable             |

### When to stay sequential

- **1 → 2 → 3** — component props depend on hook surface.
- **4 before 2 completes** — hook needs query functions for mutations.
- **1–5 before 6** — tests target stable code unless doing TDD on an isolated unit.
- **9 → 10** — code review, then finalize docs.
- **10 → 11** — docs finalized, then evaluate new skill.

### Subagents

| Agent                   | Typical use                                    |
| ----------------------- | ---------------------------------------------- |
| `code-reviewer`         | Phase 9 on large or cross-layer diffs          |
| `explore`               | Find patterns and navigation before Phase 5    |
| `Task` (generalPurpose) | Isolated research while UI is inline           |

---

## Implementation phases (detailed)

Default order is **UI-first**. Omit phases that do not apply; record them in `## Skipped phases`.

### Phase 1 — Components

- Follow existing shadcn/Tailwind patterns in the touched domain folder.
- Keep components presentational where possible — no Supabase imports.
- If the correct pattern is unclear, **ask the user** and wait.

### Phase 2 — Hooks

- New features: custom hook with `loading`, `reload`, mutation helpers.
- Follow patterns in `useTasks`, `useProjects`, `useFriends`.
- Call functions from `lib/queries/` — not Supabase client directly in hooks when a query module exists.

### Phase 3 — Components ↔ Hooks

- Pages and components consume hook return values via props or direct hook calls at page level.
- Pass callbacks for mutations; show pending/disabled state from `pendingKeys`.

### Phase 4 — Data layer

**Queries (`lib/queries/`):**

- Read aggregators and mutation functions using typed Supabase client.
- Keep SELECT strings and row mapping in the query module.

**Schema changes:**

- Add migration SQL under `web/supabase/migrations/`.
- Update RLS policies when adding tables or columns with user data.
- Regenerate or update `database.types.ts` after applying migration.

### Phase 5 — Routes

- Add lazy import and `Route` in `App.tsx`.
- Use `ProtectedRoute` or `PublicOnlyRoute` as appropriate.
- Map **every** navigation entry point (links, redirects, post-mutation navigation).
- If entry points are unclear, **ask the user**.

### Phase 6 — Tests

- Co-locate `*.test.ts(x)` next to source.
- Use Vitest + Testing Library for components; unit tests for pure `lib/` functions.
- Tests must have a **clear purpose** — not coverage for its own sake.
- Mock Supabase at the query or hook boundary when testing UI behavior.

### Phase 7 — Internationalization

- Add keys to both `pt-BR.json` and `en-US.json`.
- Reuse existing keys when the string already exists.

### Phase 8 — Analytics

- Skip analytics unless product explicitly requests tracking.

### Phase 9 — Code review

- Run inline review or delegate to `code-reviewer` agent for large diffs.
- Check: no Supabase in components, both locales updated, migrations safe, tests meaningful.

### Phase 10 — New skill needed?

- If a recurring gap appears across tasks, propose a new atomic skill via `write-skill`.
- Do not create overlapping orchestrators — extend this skill or REFERENCE instead.
