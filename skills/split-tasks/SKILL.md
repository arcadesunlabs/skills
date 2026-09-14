---
name: split-tasks
description: Decide whether a demand is one task or several, and write tasks.md when it is split. Use after brainstorm or write-spec and before write-plan, or when the user asks how to break down a feature, epic, or technical change.
---

# Split Tasks

Choose the smallest set of reviewable tasks for the demand. Do not plan files
or write code here.

## Inputs

Read the spec, rules, notes, or brainstorm summary for the demand. Inspect the
touched code only enough to judge size, layers, and risk.

Tags and doc locations: see [write-spec — Scope](../write-spec/SKILL.md#scope).

## Choose

| Breakdown | Use when |
| --------- | -------- |
| Single task | One coherent, reviewable change |
| Micro-tasks | Risk, uncertainty, or review size is high |
| Layer tasks | UI, data, tests, or platform can be reviewed separately |
| Epic + slices | Several user-visible use cases; often one slice per use case |

Prefer a single task. Split only when a task would be hard to review or risky
to ship at once. Every task must leave the product working.

## Mode

The mode comes from [triage](../triage/SKILL.md#3-choose-the-mode). Without
triage, use `guided`.

| Mode | Behavior |
| ---- | -------- |
| `guided` | Propose the breakdown with the reason. Always wait for user approval before continuing. |
| `review` | Decide and continue. Show the breakdown and reason in the plan confirmation of `write-plan`. |
| `autonomous` | Decide and continue. |

## Write

For a single task, write nothing and continue to
[write-plan](../write-plan/SKILL.md).

Otherwise write `tasks.md` beside the spec, rules, or notes of the demand:

```md
# [Demand] Tasks

**Breakdown:** micro-tasks | layer tasks | epic + slices
**Mode:** guided | review | autonomous

- [ ] 1. [Task title]
- [ ] 2. [Task title] (after 1)
- [ ] 3. [Task title] (parallel with 2)
```

Then run [write-plan](../write-plan/SKILL.md) for the first task. Check the box
when a task is done. `write-plan` deletes `tasks.md` after the last task.
