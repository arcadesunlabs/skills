# Write Plan — Reference

Templates and optional workflow examples. Load when drafting `03-plan.md`, updating `02-context.md`, or finalizing docs.

Load [workflow-config](../workflow-config/SKILL.md) first. Paths use `{docs.root}` from config.

Before planning file paths, architecture, or workflow order, read `project.conventionsFile`, `{docs.root}/codebase/architecture.md` when present, and inspect the code under `docs.domainMirror` and `code.appRoot`. **Match what the project actually uses.**

This reference provides structure only. It does not define the user's architecture, phases, file layout, validation commands, or review rules.

---

## Configuration quality

A strong plan depends on a strong project configuration. Without it, `write-plan` is useful only for asking the missing questions; it should not invent a workflow from these examples.

The user/team should describe their real workflow in one of:

- `workflow.*` fields in `skills.config.json` for short machine-readable workflow settings
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

| Situation                       | Approach                                                           |
| ------------------------------- | ------------------------------------------------------------------ |
| New feature in an existing area | Follow sibling features under `docs.domainMirror` / `code.appRoot` |
| Improvement or bug fix          | Match the files you modify — same layers, naming, and data flow    |
| Ambiguous                       | Inspect neighbors in the same domain folder; **ask the user**      |

Common layer labels vary by project. Map them from conventions instead of assuming:

| Layer                      | Typical responsibility                                        |
| -------------------------- | ------------------------------------------------------------- |
| **Presentation**           | Screens, widgets, components, pages, CLI/API surface          |
| **Orchestration**          | Hooks, controllers, blocs, services — loading, errors, wiring |
| **Data access**            | Repositories, queries, API clients — persistence and network  |
| **Routing / entry points** | Routes, commands, jobs, deep links, guards                    |
| **Shared / cross-cutting** | Auth, layout, design system, utilities, observability         |
| **Contracts / schema**     | Migrations, generated types, RPC/API definitions              |

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

| Need               | How to decide                                             |
| ------------------ | --------------------------------------------------------- |
| New feature file   | Same folder pattern as sibling features                   |
| Shared code        | Project's shared/core package or module                   |
| Entry point        | Existing router, command registry, job scheduler, etc.    |
| User-facing copy   | Project i18n/l10n/copy convention, if one exists          |
| Tests              | Co-located or separate test tree per project norm         |
| Contracts / schema | Canonical migrations, generated types, or API schema path |

If conventions are missing, document assumptions in `03-plan.md` (or as `%% comment` notes inside the `02-context.md` flow diagram) — the context file itself stays diagram + files only.

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
Entry:    A (with spec) | A′ (epic slice) | B (direct) | C (capability)
Doc scope: vertical | capability | touchpoint-only

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

Save to the folder matching documentation scope. Removed after delivery by finalization.

- **Vertical:** `{docsFeature}/03-plan.md`
- **Capability:** `{docsCapability}/03-plan.md`
- **Touchpoint-only:** `{docs.root}/{touchpointsRoot}/<feature>/03-plan.md` (or under parent capability when part of path C)

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Type:** New feature | Improvement | Bug fix
**Pattern:** {architecture chosen from inspection}
**Workflow source:** project config | inferred from repo | custom for this task
**Domain:** {feature area}
**Entry path:** A | A′ | B | C
**Doc scope:** vertical | capability | touchpoint-only
**Slice:** {slice title if A′}
**Branch:** {branch name if known}

## Files

CREATE ...
MODIFY ...

## Skipped / intentionally omitted

- [Step] — [reason]

## Workflow steps

### Step 1 — [Project-specific step name]

> Skills: [only the skills actually used in this step; use `only if …` for conditional triggers or `none — <reason>`]

- [ ] ...

### Step 2 — [Project-specific step name]

> Skills: [skills actually used in this step]

- [ ] ...

### Final step — Finalize docs

- [ ] Permanent docs updated per scope — see [Finalize docs](#finalize-docs)
- [ ] Deleted transient files (`03-plan.md`, `04-tasks.md`, `handoff.md`, etc.)
```

---

## 02-context.md sections

Keep `{docs.root}/<domain>/<feature>/02-context.md` **diagram-first**: an intuitive flow diagram plus the files that participate in that flow. No written walkthroughs, no contracts, no code — just the flow and its files. Revise the diagram and file list as implementation progresses:

```markdown
# {Feature Name} — Context

## Flow

{One or more mermaid diagrams showing the path of the flow — entry → steps → output.
Use `flowchart` or `sequenceDiagram`. Label each node by its responsibility, not by code.}

## Key files

{Table of every file that participates in the flow above and its role. From 03-plan.md Files section.}

| Arquivo | Papel no fluxo |
| ------- | -------------- |
| ...     | ...            |
```

**No code snippets** — represent the flow as a mermaid diagram; file paths live in `## Key files`. Neither belongs in `01-spec.md`.

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

| Step | Example workflow step | Notes                                                               |
| ---- | --------------------- | ------------------------------------------------------------------- |
| 1    | UI                    | Screens, pages, components, widgets; match existing domain patterns |
| 2    | Orchestration         | Controllers, hooks, view models, blocs; loading, errors, mutations  |
| 3    | UI ↔ orchestration    | Wire presentation to orchestration; keep presentation thin          |
| 4    | Data access           | Repositories, queries, API clients; generated types if applicable   |
| 5    | Routes / navigation   | Register routes and map every entry point from the spec             |
| 6    | Tests                 | Project test stack; purposeful behavior coverage                    |
| 7    | Internationalization  | Required locales only; reuse existing keys when possible            |
| 8    | Analytics             | Include only when product/project asks for tracking                 |
| 9    | Code review           | Inline review or `code-reviewer` for large/cross-layer changes      |
| 10   | Finalize docs         | Mandatory final step; see [Finalize docs](#finalize-docs)           |
| 11   | New skill needed?     | Optional; propose only for recurring gaps                           |

Do not force this on backend, CLI, data, infrastructure, content, or small maintenance work.

---

## Finalize docs

Mandatory final step for non-trivial planned work. Apply the checklist for the **documentation scope** of the task.

### Vertical feature folder (`{docsFeature}/`)

- Update `01-spec.md` per [write-feature-spec](../write-feature-spec/SKILL.md): present tense, shipped scope, testable acceptance criteria (`[x]` when met), no code snippets or file paths.
- Update `02-context.md`: refine the flow diagram(s) and merge the final file list from `03-plan.md` into `## Key files`. Do not merge validation, notes, status, or PR into the context — it stays diagram + files only.
- Delete `03-plan.md`, `04-tasks.md`, `handoff.md`, and any other transient file in the folder.
- Folder must end with only `01-spec.md` and `02-context.md`.

### Capability folder (`{docsCapability}/`)

- Update `spec.md` with shipped canonical rules and shared contracts.
- Update `scenarios.md` when shared acceptance scenarios exist.
- Update each affected `{docsTouchpoint}` with surface-specific behavior.
- In affected vertical `{docsFeature}/02-context.md` files, add or refresh **links** to the capability spec — do not duplicate canonical rules.
- Delete `03-plan.md`, `04-tasks.md`, `handoff.md`, and any other transient file in the capability folder.
- Folder must end with only `spec.md` and optional `scenarios.md`.

### Touchpoint folder (`{docs.root}/{touchpointsRoot}/<feature>/`)

- Update `spec.md` with shipped surface-specific behavior.
- Link to parent `{docsCapability}/spec.md` when applicable.
- Delete any transient `handoff.md` in the touchpoint folder.
- Folder must end with only `spec.md`.

**`01-spec.md` checklist (vertical only):**

- [ ] Context describes current product state, not pre-implementation pain only
- [ ] Scope = what shipped; out of scope = what was explicitly not built
- [ ] Acceptance criteria: `[x]` for delivered items; remove cancelled items
- [ ] Open questions: empty or only genuine follow-ups

**Merge map from transient files:**

| `03-plan.md` section | Destination in `02-context.md`     |
| -------------------- | ---------------------------------- |
| Files CREATE/MODIFY  | `## Key files`                     |
| Flow / steps         | Fold into the `## Flow` diagram(s) |
| Skipped steps        | Discard                            |
| Checkboxes           | Discard                            |
| Validation commands  | Discard — not kept in context      |

| `handoff.md` section | Destination                        |
| -------------------- | ---------------------------------- |
| Key files            | `## Key files` if missing          |
| PR / branch          | Discard — or update `01-spec.md`   |
| Next steps           | Discard                            |
| Current decisions    | Discard — or update `01-spec.md`   |
