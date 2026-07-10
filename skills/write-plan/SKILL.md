---
name: write-plan
description: Plan and implement non-trivial feature work using the project's configured workflow. Requires project conventions and architecture/workflow docs; it does not define phases or file patterns by itself. Use after brainstorm/spec or for direct implementation tasks.
---

# Write Plan

**Announce at start:** "I'm using the write-plan skill."

Plan **and** implement non-trivial feature work, but only as an orchestrator over the user's project workflow. This skill does not define architecture, phases, file locations, validation commands, or review rules by itself.

The result is only as good as the project's configuration. The user/team must describe how the project works in `skills.config.json` (`workflow.*` when present), `project.conventionsFile`, `{docs.root}/codebase/architecture.md`, or nearby project docs. If those sources are missing or too generic, this skill has no reliable workflow to execute: stop, explain what is missing, and ask the user to configure or confirm the needed decisions.

Two modes:

| Mode             | What it does                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Write**        | Map scope, architecture, files, workflow steps, artifacts, and validation from project configuration; save artifacts; get user confirmation |
| **Read/Execute** | Implement step by step from the confirmed project-specific plan                                                                             |

**Prerequisite:** Load [workflow-config](../workflow-config/SKILL.md). Then read `project.conventionsFile`, `{docs.root}/codebase/architecture.md` when present, and any linked local docs before choosing patterns, file paths, workflow order, validation, or documentation rules.

**Configuration contract:** before planning, verify that project docs answer the essentials below. If not, inspect the repo for local patterns and ask the user to confirm the missing pieces before saving `03-plan.md`.

- Architecture boundaries, naming conventions, and allowed patterns
- Where code, tests, routes, copy, schemas, generated files, and docs belong
- Preferred workflow order for the task type, including hard dependencies (`workflow.implementationFlow` when configured)
- Validation, review, and documentation expectations (`workflow.validationCommands`, `workflow.review`, `workflow.docsFinalization` when configured)
- Project-specific skills, agents, scripts, or external systems to invoke

**Artifacts:** depends on documentation scope (see [workflow-config](../workflow-config/SKILL.md)):

| Scope           | Plan location                                                                  | Permanent docs updated during delivery                        |
| --------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Vertical        | `{docsFeature}/03-plan.md` + `02-context.md`                                   | `01-spec.md`, `02-context.md`                                 |
| Capability      | `{docsCapability}/03-plan.md` + `spec.md`                                      | `spec.md`, `scenarios.md` (optional), each `{docsTouchpoint}` |
| Touchpoint-only | `{docs.root}/{touchpointsRoot}/<feature>/03-plan.md` or parent capability plan | `{docsTouchpoint}`                                            |

See `project.conventionsFile` in config for project-specific rules.

**Reference:** templates and optional examples → [REFERENCE.md](REFERENCE.md). The reference file is not the user's workflow; use it only to structure the project-specific decisions above.

---

## Entry paths

| Path   | When                                                                          | Input                                                         |
| ------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **A**  | After `mode-brainstorm` → `write-feature-spec` (vertical)                     | `01-spec.md`                                                  |
| **A′** | Epic child slice — after user picks a slice from `04-tasks.md` (when present) | `01-spec.md` + slice scope from `04-tasks.md` or conversation |
| **B**  | No spec — direct implementation task                                          | Conversation                                                  |
| **C**  | Cross-cutting capability spanning multiple surfaces                           | `{docsCapability}/spec.md` or conversation                    |

**Epic scoping (path A′):** Plan and implement **only** the selected slice — from `04-tasks.md` when it exists, otherwise from the agreed brainstorm breakdown. Reference the epic spec for shared context; do not plan phases for other slices.

**Capability scoping (path C):** Plan lives in `{docsCapability}/03-plan.md`. Update `{docsCapability}/spec.md` for shared rules; update each `{docsTouchpoint}` for surface-specific behavior. Link from affected `{docsFeature}/02-context.md` files — do not duplicate canonical rules there.

Skip this skill for trivial tasks (typo, single-line fix) — implement per `project.conventionsFile` in config.

---

## Mode Write — Plan before code

### Step 0 — Flow boundaries

Confirm entry point, exit point, user/system surfaces, and affected call paths. **Stop and ask** if unclear. Do not proceed until boundaries are defined.

### Step 1 — Classify the task

Use `AskQuestion`:

- `question`: "What type of task is this?"
- `header`: "Task type"
- `options`: New feature | Improvement / refactor | Bug fix

Then classify **documentation scope** (see [workflow-config](../workflow-config/SKILL.md)): vertical | capability | touchpoint-only.

Informs — but does not by itself decide — the architecture pattern (see Step 2).

### Step 2 — Architecture pattern

Task type is only the starting hint. The pattern is decided by the **architecture the touched code already uses** — read `{docs.root}/codebase/architecture.md` when present, then inspect the files you will modify before choosing:

| Situation                                      | Pattern              | Reference                                                                     |
| ---------------------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| New feature (greenfield in this area)          | Match project stack  | `project.conventionsFile`, [REFERENCE.md](REFERENCE.md#architecture-patterns) |
| Improvement / bug fix on existing feature code | Match existing files | Inspect touched files first; same reference when extending                    |

> **Rule:** never introduce foreign patterns unless the touched area already uses them. Do not downgrade an area to a simpler pattern just because the task is an "improvement". When ambiguous, inspect neighbors under `docs.domainMirror` and **ask the user**.

### Step 3 — Scope

- **Domain** — feature area under `docs.domainMirror` from config (e.g. `expense-list`, `auth`).
- **Module / package** — single app, monorepo package, or client + server? Confirm with user if unclear.
- **Layers** — see [layer table](REFERENCE.md#layer-and-location-selection).

### Step 4 — Files, workflow

1. List every **CREATE** / **MODIFY** file (see [files example](REFERENCE.md#files-example)).
2. For each workflow step, list the project-specific skills to invoke during execution (from `workflow.implementationFlow[].skills` when configured, cross-checked against the step's actual work). Every step in `03-plan.md` gets a `> Skills:` line — including conditional skills ("only if …") and "none" with a short reason when no skill applies.
3. Group into [increments](REFERENCE.md#increments).
4. Derive the implementation workflow from project configuration and the touched code. Do not import phases from examples unless the project docs or user explicitly choose them.
5. If no explicit workflow exists, propose a short workflow that fits the task and ask the user to confirm it before saving the plan.
6. Add checklist items per agreed workflow step to `03-plan.md`. Document intentionally skipped or irrelevant steps only when that helps review.

### Step 5 — Confirm

1. Save `03-plan.md` to the folder matching documentation scope and update the relevant permanent docs (`02-context.md` for vertical, `spec.md` for capability) using [templates](REFERENCE.md#03-planmd-template).
2. Present [confirmation summary](REFERENCE.md#confirmation-summary-template).

**Do not write implementation code before user confirms.** Revise and re-confirm if requested.

---

## Mode Read/Execute — Implement after confirmation

Use the confirmed project workflow from `03-plan.md`. There is no built-in default order, phase table, architecture pattern, validation command, or review rule in this skill.

If the plan lacks the information needed to execute safely, pause and get the missing project-specific decision from the user instead of filling the gap from generic examples.

### Execution flexibility

During implementation the agent may:

- **Run steps in parallel** when they have no dependency on each other.
- **Delegate to subagents** when it speeds up isolated work, such as exploration or code review.
- **Stay inline** when steps are tightly coupled, touch the same files, or need sequential validation.

Respect **hard dependencies** from the project workflow and code. Finalize docs is always the last required step before any optional follow-up skill creation.

Note parallel work or subagent use in `03-plan.md` when it helps traceability. Details: [REFERENCE.md — Execution strategy](REFERENCE.md#execution-strategy).

If useful, use [REFERENCE.md — Frontend workflow example](REFERENCE.md#frontend-workflow-example) only as a checklist of questions to ask. Do not apply it as an implementation order unless the user's project config or explicit confirmation says it matches.

**Key rules:**

- Match existing patterns in the touched domain — **ask** if unclear.
- Use the project's configured workflow when it exists; otherwise derive one from the code and confirm it.
- Purposeful tests only — test behavior that matters.
- Use `code-reviewer` or inline review for large or cross-layer changes before finalizing docs.
- Finalize docs is **mandatory** — scope determines which folders to update. See [REFERENCE.md — Finalize docs](REFERENCE.md#finalize-docs).

For each workflow step: update `03-plan.md` checkboxes, invoke listed project skills when applicable, stop when blocked.

---

## When to stop and ask

- Flow boundaries, surfaces, or call paths unclear
- Architecture pattern ambiguous for touched files
- Blocker (missing dependency, failing verification, unclear requirement)
- User has not confirmed the plan (Write phase)

**Ask rather than guess.**

---

## Completion

1. Update `03-plan.md` checkboxes and the relevant permanent docs (Known Behavior, validation checklist).
2. **Mandatory:** Finalize docs per scope. See [REFERENCE.md — Finalize docs](REFERENCE.md#finalize-docs).
3. Tell the user (adjust path to scope):

> Implementation complete. Docs finalized — vertical: `{docsFeature}/` (`01-spec.md` + `02-context.md`); capability: `{docsCapability}/` (`spec.md` + optional `scenarios.md`) and touchpoints updated; touchpoint-only: `{docsTouchpoint}` updated.

---

## Output checklist

**After Write (before code):**

- [ ] Plan saved to the folder matching documentation scope
- [ ] Architecture pattern chosen and justified
- [ ] File list identified
- [ ] User confirmed

**After Read/Execute:**

- [ ] All agreed workflow steps completed
- [ ] Code review passed when appropriate
- [ ] Docs finalized per scope — see [REFERENCE.md — Finalize docs](REFERENCE.md#finalize-docs)
