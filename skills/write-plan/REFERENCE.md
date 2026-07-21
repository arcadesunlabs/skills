# Write Plan — Reference

Templates and optional workflow examples. Load when drafting `plan.md`, updating `context.md`, or finalizing docs.

Load [workflow-config](../workflow-config/SKILL.md) first. Paths use `{docs.root}` from config.

Before planning file paths, architecture, or workflow order, read `project.conventionsFile`, `{docs.root}/architecture/architecture.md` when present, and inspect relevant code under `code.searchRoots` and `code.appRoot`. **Match what the project actually uses.**

This reference provides structure only. It does not define the user's architecture, phases, file layout, validation commands, or review rules.

---

## Configuration quality

A strong plan depends on a strong project configuration. Without it, `write-plan` is useful only for asking the missing questions; it should not invent a workflow from these examples.

The user/team should describe their real workflow in one of:

- `workflow.*` fields in `skills.config.json` for short machine-readable workflow settings
- `project.conventionsFile`
- `{docs.root}/architecture/architecture.md`
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

| Situation                       | Approach                                                        |
| ------------------------------- | --------------------------------------------------------------- |
| New feature in an existing area | Follow sibling code under `code.searchRoots` / `code.appRoot`   |
| Improvement or bug fix          | Match the files you modify — same layers, naming, and data flow |
| Ambiguous                       | Inspect neighbors in the same domain folder; **ask the user**   |

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

If conventions are missing, document assumptions in `plan.md` and ask the user to confirm them before implementation.

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
Business domain: {product area}
Use case: {verb-object user goal, when applicable}
Slice:    {slice title if path A′}
Branch:   {branch name if known}
Entry:    A (with spec) | A′ (epic slice) | B (direct) | C (capability)
Doc scope: use case | capability | codebase context

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

## plan.md template

Save to the folder matching documentation scope. Removed after delivery by finalization.

- **Use case:** `{docsUseCase}/plan.md`
- **Capability:** `{docsCapability}/plan.md`
- **Codebase context:** `{docs.root}/codebase/<initiative>/plan.md`

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Type:** New feature | Improvement | Bug fix
**Pattern:** {architecture chosen from inspection}
**Workflow source:** project config | inferred from repo | custom for this task
**Business domain:** {product area}
**Use case:** {verb-object user goal, when applicable}
**Entry path:** A | A′ | B | C
**Doc scope:** use case | capability | codebase context
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
- [ ] Deleted transient files (`plan.md`, `tasks.md`, `handoff.md`, etc.)
```

---

## context.md sections

Keep `{contextPath}` focused on how the current system realizes the behavior in `spec.md`. Link to the spec, show the flow, and map every participating technical responsibility to current code. For codebase context without user-visible behavior, omit the spec link and describe the technical scope in the opening sentence. Revise it as implementation changes:

```markdown
# {Use Case or Technical Initiative} Context

{For use cases only: Behavior: [spec.md](spec.md)}

{For codebase context only: one sentence defining the technical scope.}

## Flow

{One or more mermaid diagrams showing the path of the flow — entry → steps → output.
Use `flowchart` or `sequenceDiagram`. Label each node by its responsibility, not by code.}

## Implementation map

{Table of every route, component, API, schema, persistence path, and test that participates in the flow. From the plan.md Files section and final implementation.}

| Responsibility | Path | Role in flow |
| -------------- | ---- | ------------ |
| ...            | ...  | ...          |

## Decisions and dependencies

{Only durable current decisions and dependencies needed to understand the implementation. No task status, temporary notes, or proposed changes.}
```

**No code snippets** — represent behavior in `spec.md`, flow in Mermaid, and code locations in `## Implementation map`.

---

## Execution strategy

Use the confirmed workflow from `plan.md`.

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

### Use-case folder (`{docsUseCase}/`)

- Update `spec.md` per [write-feature-spec](../write-feature-spec/SKILL.md): present tense, shipped scope, testable acceptance criteria (`[x]` when met), no code snippets or file paths.
- Update `context.md`: link to `spec.md`, refine the flow, and merge the final implementation map and durable decisions from `plan.md`.
- Delete `plan.md`, `tasks.md`, `handoff.md`, and any other transient file in the folder.
- Folder must end with `spec.md` and `context.md`.

### Capability folder (`{docsCapability}/`)

- Update `rules.md` with shipped canonical rules and shared contracts.
- Update `scenarios.md` when shared acceptance scenarios exist.
- Link affected use-case specs to the capability rules instead of duplicating them.
- Update each affected use-case `context.md` with its implementation map.
- Delete `plan.md`, `tasks.md`, `handoff.md`, and any other transient file in the capability folder.
- Folder must end with only `rules.md` and optional `scenarios.md`.

### Codebase context folder (`{docs.root}/codebase/<initiative>/`)

- Update `context.md` with current architecture, flow, implementation map, and durable decisions.
- Delete `plan.md`, `tasks.md`, `handoff.md`, and other transient files.
- Do not create a behavior spec when user-visible behavior did not change.

**`spec.md` checklist (use cases only):**

- [ ] Context describes current product state, not pre-implementation pain only
- [ ] Scope = what shipped; out of scope = what was explicitly not built
- [ ] Acceptance criteria: `[x]` for delivered items; remove cancelled items
- [ ] Open questions: empty or only genuine follow-ups

**Merge map from transient files:**

| `plan.md` section   | Destination in `context.md`               |
| ------------------- | ----------------------------------------- |
| Files CREATE/MODIFY | `## Implementation map`                   |
| Flow / steps        | Fold into the `## Flow` diagram(s)        |
| Durable decisions   | `## Decisions and dependencies`           |
| Skipped steps       | Discard                                   |
| Checkboxes          | Discard                                   |
| Validation commands | Discard unless needed to understand tests |

| `handoff.md` section | Destination                        |
| -------------------- | ---------------------------------- |
| Key files            | `## Implementation map` if missing |
| PR / branch          | Discard                            |
| Next steps           | Discard                            |
| Durable decisions    | `## Decisions and dependencies`    |
