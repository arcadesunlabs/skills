---
name: write-plan
description: Plan and implement non-trivial feature work using the project's configured workflow — map scope, architecture, files, execution steps, validation, and review. Use after brainstorm/spec or for direct implementation tasks.
---

# Write Plan

**Announce at start:** "I'm using the write-plan skill."

Plan **and** implement non-trivial feature work. The result is only as good as the project's configuration: the user must describe how their project/team works in `project.conventionsFile`, `{docs.root}/codebase/architecture.md`, or nearby project docs. Do not treat this skill's examples as the user's workflow.

Two modes:

| Mode             | What it does                                                                  |
| ---------------- | ----------------------------------------------------------------------------- |
| **Write**        | Map scope, architecture, files, workflow steps; save artifacts; get user confirmation |
| **Read/Execute** | Implement step by step from the confirmed plan                                     |

**Prerequisite:** Load [workflow-config](../workflow-config/SKILL.md). Read `project.conventionsFile` and, when present, `{docs.root}/codebase/architecture.md` before choosing patterns or file paths.

**Artifacts:** `{docs.root}/<domain>/<feature>/03-plan.md` + updates to `02-context.md` (see `project.conventionsFile` in config)

**Reference:** templates and optional workflow examples → [REFERENCE.md](REFERENCE.md)

---

## Entry paths

| Path   | When                                                                                 | Input                                                      |
| ------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **A**  | After `mode-brainstorm` → `write-feature-spec`                                       | `01-spec.md`                                               |
| **A′** | Epic child slice — after user picks a slice from `04-tasks.md` (when present)         | `01-spec.md` + slice scope from `04-tasks.md` or conversation |
| **B**  | No spec — direct implementation task                                                 | Conversation                                               |

**Epic scoping (path A′):** Plan and implement **only** the selected slice — from `04-tasks.md` when it exists, otherwise from the agreed brainstorm breakdown. Reference the epic `01-spec.md` for shared context; do not plan phases for other slices.

Skip this skill for trivial tasks (typo, single-line fix) — implement per `project.conventionsFile` in config.

---

## Mode Write — Plan before code

### Step 0 — Flow boundaries

Confirm entry point, exit point, screens/pages, and routes. **Stop and ask** if unclear. Do not proceed until boundaries are defined.

### Step 1 — Classify the task

Use `AskQuestion`:

- `question`: "What type of task is this?"
- `header`: "Task type"
- `options`: New feature | Improvement / refactor | Bug fix

Informs — but does not by itself decide — the architecture pattern (see Step 2).

### Step 2 — Architecture pattern

Task type is only the starting hint. The pattern is decided by the **architecture the touched code already uses** — read `{docs.root}/codebase/architecture.md` when present, then inspect the files you will modify before choosing:

| Situation                                      | Pattern              | Reference                                                                     |
| ---------------------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| New feature (greenfield in this area)          | Match project stack  | `project.conventionsFile`, [REFERENCE.md](REFERENCE.md#architecture-patterns) |
| Improvement / bug fix on existing feature code | Match existing files | Inspect touched files first; same reference when extending                    |

> **Rule:** never introduce foreign patterns unless the touched area already uses them. Do not downgrade a screen/module to a simpler pattern just because the task is an "improvement". When ambiguous, inspect neighbors under `docs.domainMirror` and **ask the user**.

### Step 3 — Scope

- **Domain** — feature area under `docs.domainMirror` from config (e.g. `expense-list`, `auth`).
- **Module / package** — single app, monorepo package, or client + server? Confirm with user if unclear.
- **Layers** — see [layer table](REFERENCE.md#layer-and-location-selection).

### Step 4 — Files, workflow

1. List every **CREATE** / **MODIFY** file (see [files example](REFERENCE.md#files-example)).
2. Note project-specific atomic skills to invoke during execution, if the repo defines them.
3. Group into [increments](REFERENCE.md#increments).
4. Derive the implementation workflow from project configuration and the touched code. If no explicit workflow exists, propose a short workflow that fits the task and ask the user to confirm.
5. Add checklist items per agreed workflow step to `03-plan.md`. Document intentionally skipped or irrelevant steps only when that helps review.

### Step 5 — Confirm

1. Save `03-plan.md` and update `02-context.md` using [templates](REFERENCE.md#03-planmd-template).
2. Present [confirmation summary](REFERENCE.md#confirmation-summary-template).

**Do not write implementation code before user confirms.** Revise and re-confirm if requested.

---

## Mode Read/Execute — Implement after confirmation

Use the confirmed project workflow. There is no built-in default order.

### Execution flexibility

During implementation the agent may:

- **Run steps in parallel** when they have no dependency on each other.
- **Delegate to subagents** when it speeds up isolated work, such as exploration or code review.
- **Stay inline** when steps are tightly coupled, touch the same files, or need sequential validation.

Respect **hard dependencies** from the project workflow and code. Finalize docs is always the last required step before any optional follow-up skill creation.

Note parallel work or subagent use in `03-plan.md` when it helps traceability. Details: [REFERENCE.md — Execution strategy](REFERENCE.md#execution-strategy).

If useful, use [REFERENCE.md — Frontend workflow example](REFERENCE.md#frontend-workflow-example) as a starting point. It is only an example from one frontend/Flutter-style project; do not apply it when the user's project, team, or task suggests a different flow.

**Key rules:**

- Match existing patterns in the touched domain — **ask** if unclear.
- Use the project's configured workflow when it exists; otherwise derive one from the code and confirm it.
- Purposeful tests only — test behavior that matters.
- Use `code-reviewer` or inline review for large or cross-layer changes before finalizing docs.
- Finalize docs is **mandatory** — reflect shipped behavior in `01-spec.md` (no code), update `02-context.md` to match implementation; merge useful content from `03-plan.md`, `04-tasks.md`, `handoff.md`; delete those transient files. Folder must end with only `01-spec.md` + `02-context.md`. See [REFERENCE.md — Finalize docs](REFERENCE.md#finalize-docs).

For each workflow step: update `03-plan.md` checkboxes, invoke listed project skills when applicable, stop when blocked.

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
2. **Mandatory:** Finalize docs — update `01-spec.md` to shipped product truth; merge transient content into `02-context.md`; delete `03-plan.md`, `04-tasks.md`, `handoff.md`, and any other stray files. Folder must contain only `01-spec.md` and `02-context.md`. See [REFERENCE.md — Finalize docs](REFERENCE.md#finalize-docs).
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

- [ ] All agreed workflow steps completed
- [ ] Code review passed when appropriate
- [ ] Docs finalized — only `01-spec.md` + `02-context.md` in feature folder
