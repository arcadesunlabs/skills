# Write Plan — Reference

Templates and optional workflow examples. Load when drafting `03-plan.md`, updating `02-context.md`, or finalizing docs.

Load [workflow-config](../workflow-config/SKILL.md) first. Paths use `{docs.root}` from config.

Before planning file paths, architecture, or workflow order, read `project.conventionsFile`, `{docs.root}/codebase/architecture.md` when present, and inspect the code under `docs.domainMirror` and `code.appRoot`. **Match what the project actually uses.**

---

## Configuration quality

A strong plan depends on a strong project configuration.

The user/team should describe their real workflow in one of:

- `project.conventionsFile`
- `{docs.root}/codebase/architecture.md`
- nearby project docs referenced by those files

Good configuration explains:

- architecture boundaries and naming conventions
- where new code, tests, routes, copy, schemas, and generated files belong
- preferred implementation order for common task types
- review, validation, and documentation expectations
- project-specific skills or agents to invoke

If this configuration is missing or too generic, inspect the codebase and ask the user before freezing the workflow. Do not pretend this reference file defines the user's process.

---

## Architecture patterns

Choose by the architecture the **touched files already use**, not by task type alone.

| Situation                             | Approach                                                            |
| ------------------------------------- | ------------------------------------------------------------------- |
| New feature in an existing area       | Follow sibling features under `docs.domainMirror` / `code.appRoot`  |
| Improvement or bug fix                | Match the files you modify — same layers, naming, and data flow     |
| Ambiguous                             | Inspect neighbors in the same domain folder; **ask the user**       |

Common layer labels vary by project. Map them from conventions instead of assuming:

| Layer                      | Typical responsibility                                           |
| -------------------------- | ---------------------------------------------------------------- |
| **Presentation**           | Screens, widgets, components, pages, CLI/API surface             |
| **Orchestration**          | Hooks, controllers, blocs, services — loading, errors, wiring    |
| **Data access**            | Repositories, queries, API clients — persistence and network     |
| **Routing / entry points** | Routes, commands, jobs, deep links, guards                       |
| **Shared / cross-cutting** | Auth, layout, design system, utilities, observability            |
| **Contracts / schema**     | Migrations, generated types, RPC/API definitions                 |

---

## Files example

Use CREATE/MODIFY lines with **real paths** from the target project. These are placeholders, not a prescribed structure:

```text
CREATE  {code.appRoot}/<domain>/<feature>/<new-file>
MODIFY  {code.appRoot}/<domain>/<existing-file>
MODIFY  {code.appRoot}/<entry-point-or-router>
CREATE  {code.appRoot}/<domain>/<feature>/<test-file>
```

Derive concrete paths from the repo:

| Need                         | How to decide                                             |
| ---------------------------- | --------------------------------------------------------- |
| New feature file             | Same folder pattern as sibling features                   |
| Shared code                  | Project's shared/core package or module                   |
| Entry point                  | Existing router, command registry, job scheduler, etc.    |
| User-facing copy             | Project i18n/l10n/copy convention, if one exists          |
| Tests                        | Co-located or separate test tree per project norm         |
| Contracts / schema           | Canonical migrations, generated types, or API schema path |

If conventions are missing, document assumptions in `02-context.md`.

---

## Increments

Group files into the **smallest independently deliverable increments**:

- Each increment must be a coherent, reviewable unit.
- Identify which increments can be built in parallel.
- Smaller increments reduce review friction and make bugs easier to isolate.

---

## Confirmation summary template

Present to the user before implementation:

```text
Implementation plan

Type:     New feature | Improvement | Bug fix
Pattern:  {from touched files / conventions}
Workflow: {from project config | inferred and confirmed | custom for this task}
Domain:   {feature area}
Slice:    {slice title if path A′}
Branch:   {branch name if known}
Entry:    A (with spec) | A′ (epic slice) | B (direct)

Files:
  CREATE ...
  MODIFY ...

Workflow steps:
  1. ...
  2. ...

Skipped / intentionally omitted:
  - {step} — {reason}

Waiting for confirmation to start implementation.
```

---

## 03-plan.md template

Save to `{docs.root}/<domain>/<feature>/03-plan.md`. Removed after delivery by finalization.

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Type:** New feature | Improvement | Bug fix
**Pattern:** {architecture chosen from inspection}
**Workflow source:** project config | inferred from repo | custom for this task
**Domain:** {feature area}
**Entry path:** A | A′ | B
**Slice:** {slice title if A′}
**Branch:** {branch name if known}

## Files

CREATE ...
MODIFY ...

## Skipped / intentionally omitted

- [Step] — [reason]

## Workflow steps

### Step 1 — [Project-specific step name]

- [ ] ...

### Step 2 — [Project-specific step name]

- [ ] ...

### Final step — Finalize docs

- [ ] `01-spec.md` updated to shipped product truth (no code)
- [ ] `02-context.md` updated to match implementation
- [ ] Deleted `03-plan.md`, `04-tasks.md`, `handoff.md`, and any other transient files
```

---

## 02-context.md sections

Update `{docs.root}/<domain>/<feature>/02-context.md` with technical detail. Append or revise these sections as implementation progresses:

```markdown
# {Feature Name} — Context

## Feature Snapshot

- Feature: {short description}
- Status: In progress ({slice title or branch if known})
- Entry point: {screen, route, command, job, API, or trigger}
- Domain: {feature area}

## API / data contracts

{From spec if path A; otherwise from exploration.}

## Key files

{From 03-plan.md Files section.}

## Known behavior

TBD — fill as implementation progresses.

## Validation

{Commands, manual checks, and acceptance-criteria checks.}
```

Code snippets and file paths **belong here**, never in `01-spec.md`.

---

## Execution strategy

Use the confirmed workflow from `03-plan.md`.

### When to parallelize

- Different files and no shared mutable state.
- Independent validation while implementation continues.
- Independent copy/i18n/config work when interfaces are stable.

### When to stay sequential

- One step depends on APIs, props, contracts, migrations, or generated files from another.
- Two steps touch the same files heavily.
- The implementation is unstable and broad tests would create noisy failures.
- Finalize docs must run after implementation and review are stable.

### Subagents

Use subagents only when they reduce risk or speed up isolated work:

| Agent / role      | Typical use                                       |
| ----------------- | ------------------------------------------------- |
| `code-reviewer`   | Large or cross-layer diffs before finalizing docs |
| explore/research  | Find patterns, call sites, routes, or conventions |
| specialized skill | Project-defined atomic work from config/docs      |

---

## Frontend workflow example

This is an optional example from a frontend workflow. Use it only if it matches the user's project or the user chooses it. Rename, remove, split, or reorder steps freely.

| Step | Example workflow step       | Notes                                                                  |
| ---- | --------------------------- | ---------------------------------------------------------------------- |
| 1    | UI                          | Screens, pages, components, widgets; match existing domain patterns    |
| 2    | Orchestration               | Controllers, hooks, view models, blocs; loading, errors, mutations     |
| 3    | UI ↔ orchestration          | Wire presentation to orchestration; keep presentation thin             |
| 4    | Data access                 | Repositories, queries, API clients; generated types if applicable      |
| 5    | Routes / navigation         | Register routes and map every entry point from the spec                |
| 6    | Tests                       | Project test stack; purposeful behavior coverage                       |
| 7    | Internationalization        | Required locales only; reuse existing keys when possible               |
| 8    | Analytics                   | Include only when product/project asks for tracking                    |
| 9    | Code review                 | Inline review or `code-reviewer` for large/cross-layer changes         |
| 10   | Finalize docs               | Mandatory final step; see [Finalize docs](#finalize-docs)              |
| 11   | New skill needed?           | Optional; propose only for recurring gaps                              |

Do not force this on backend, CLI, data, infrastructure, content, or small maintenance work.

---

## Finalize docs

Mandatory final step for non-trivial planned work.

- Update `01-spec.md` per [write-feature-spec](../write-feature-spec/SKILL.md): present tense, shipped scope, testable acceptance criteria (`[x]` when met), no code snippets or file paths.
- Update `02-context.md`: merge final file list, architecture decisions, validation checks, and useful notes from `03-plan.md`; merge status/PR from `handoff.md` if present; discard handoff next steps.
- Delete `03-plan.md`, `04-tasks.md`, `handoff.md`, and any other file in the feature folder except `01-spec.md` and `02-context.md`.
- Folder must end with only `01-spec.md` and `02-context.md`.

**`01-spec.md` checklist:**

- [ ] Context describes current product state, not pre-implementation pain only
- [ ] Scope = what shipped; out of scope = what was explicitly not built
- [ ] Acceptance criteria: `[x]` for delivered items; remove cancelled items
- [ ] Open questions: empty or only genuine follow-ups

**Merge map from transient files:**

| `03-plan.md` section | Destination in `02-context.md`    |
| -------------------- | --------------------------------- |
| Files CREATE/MODIFY  | `## Key files`                    |
| Skipped steps        | `## Behavior notes` if relevant   |
| Checkboxes           | Delete — do not copy verbatim     |
| Validation commands  | `## Validation`                   |

| `handoff.md` section | Destination                                |
| -------------------- | ------------------------------------------ |
| Key files            | `## Key files` if missing                  |
| PR / branch          | `## Status`                                |
| Next steps           | Discard                                    |
| Current decisions    | `## Behavior notes` or update `01-spec.md` |
