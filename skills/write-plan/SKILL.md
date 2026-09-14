---
name: write-plan
description: Plan and implement non-trivial work with a fixed workflow - explore, plan, confirm, implement, validate, review, update docs. Use after write-spec, for direct implementation tasks, bug fixes, or refactors that need a plan.
---

# Write Plan

Plan, confirm, then implement. Skip this skill for trivial changes (typo,
single-line fix).

## Paths

Paths are fixed. Edit this file to change them or the workflow.

- Conventions: `AGENTS.md` or `CLAUDE.md` at the workspace root
- Index: `.docs/index.md`
- Architecture: `.docs/architecture/architecture.md`
- Doc locations and tags (`<domain>`, `<use-case>`, ...): see
  [write-spec — Scope](../write-spec/SKILL.md#scope)
- `plan.md`: beside the permanent artifact (use-case spec, domain rules,
  capability rules, or `codebase/<initiative>/notes.md`)

## Workflow

| #   | Step      | Done when                                                                  |
| --- | --------- | -------------------------------------------------------------------------- |
| 1   | Explore   | Scope, touched code, and patterns are known                                |
| 2   | Plan      | `plan.md` is saved                                                         |
| 3   | Confirm   | User approved the plan (skipped in `autonomous`)                           |
| 4   | Implement | Every plan step is checked                                                 |
| 5   | Validate  | Tests, lint, and typecheck pass                                            |
| 6   | Review    | Diff reviewed                                                              |
| 7   | Docs      | Spec, flows, changelog, and index are updated; transient files are deleted |

Never write implementation code before step 3.

The mode comes from [triage](../triage/SKILL.md#2-choose-the-mode). Without
triage, use `guided`.

### 1. Explore

Read the conventions, architecture, index, the spec or rules for this work, the
related actors, and the existing `.flows.md`. Then inspect the code the work
touches.

- Confirm entry point, exit point, and affected call paths.
- Match the patterns the touched code already uses. Never introduce a foreign
  pattern. Ask when ambiguous.
- When `tasks.md` exists, plan only the next open task.

### 2. Plan

Save `plan.md` with [the template](REFERENCE.md#plan-template). List every
CREATE and MODIFY file with real paths. Group files into small, reviewable
steps. Mark steps that can run in parallel.

### 3. Confirm

| Mode | Behavior |
| ---- | -------- |
| `guided`, `review` | Present [the summary](REFERENCE.md#confirmation-summary) and wait. In `review`, include the task breakdown from `split-tasks`. Revise and re-confirm when asked. |
| `autonomous` | Show the summary and continue without waiting. |

### 4. Implement

Follow `plan.md` step by step and check boxes as you go. Run independent steps
in parallel or in subagents when that is faster. Stay sequential when steps
share files or contracts. Stop and ask when blocked.

### 5. Validate

Take commands from the conventions file or the project manifest
(`package.json`, `Makefile`, `pubspec.yaml`, etc.). Test behavior that matters.

### 6. Review

Review the diff inline. Use a review agent for large or cross-layer changes
when one is available.

### 7. Docs

Always last:

1. Update the spec or rules when shipped behavior differs from them.
2. Run [write-flows](../write-flows/SKILL.md) for the affected use case,
   capability, or initiative.
3. Add one line to `changelog.md` beside the permanent artifact (see
   [Changelog](REFERENCE.md#changelog)).
4. Update actor docs when goals, responsibilities, or boundaries changed.
5. Update `.docs/index.md` when navigation changed.
6. Delete `plan.md`. Check the task in `tasks.md`; delete `tasks.md` after the
   last task. In a path from triage, continue with the next open task.

## Stop and ask

- Boundaries or call paths are unclear.
- The pattern for touched files is ambiguous.
- A dependency, validation, or requirement blocks progress.
- The user has not confirmed the plan (`guided`, `review`).
