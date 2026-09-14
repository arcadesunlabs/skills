---
name: triage
description: Entry point for every new task. Classify the request, choose the mode (guided, review, autonomous) and the skill path (brainstorm, write-spec, split-tasks, write-plan, write-flows), then start it. Use when the user starts a new task, reports a bug, asks for a feature or change, or changes topic.
---

# Triage

Decide the path and the mode, announce them, then start the first skill. Do
not write code or docs here.

## When to run

Run once per demand. Do not triage again when the user answers a question,
approves a step, or continues the current demand. Run again when the user
starts a different demand.

## 1. Classify

Read the request. Inspect `.docs/` and the code only as much as needed to
classify.

| Request | Path |
| ------- | ---- |
| Trivial change (typo, one line) | implement directly |
| Question about the code | answer directly |
| Bug with a clear expected behavior | `write-plan` |
| Bug with an unclear expected behavior | `brainstorm`, `write-plan` |
| Technical change with no behavior change | `split-tasks`, `write-plan` |
| Feature or improvement with open decisions | `brainstorm`, `write-spec`, `split-tasks`, `write-plan` |
| Feature or improvement with decided behavior | `write-spec`, `split-tasks`, `write-plan` |
| Document an existing feature | `write-flows` |

When unsure between two paths, choose the one with more steps.

## 2. Choose the mode

Use the mode the user names. Otherwise use `guided` for features and
improvements, and `review` for bugs and technical changes.

| Mode | Decisions | Approvals |
| ---- | --------- | --------- |
| `guided` | The agent asks one question at a time and the user answers | Task breakdown and plan |
| `review` | The agent decides and lists each question, decision, and reason at the end of brainstorm | Brainstorm decisions, and plan with the task breakdown |
| `autonomous` | The agent decides | None |

The mode applies to every skill in the path. In `autonomous`, limits and
confirmations come only from the agent's own configuration (permissions,
`AGENTS.md`, `CLAUDE.md`). These skills add none.

The user can change the mode at any time. Apply the new mode from the next
step.

## 3. Announce and start

State the decision in one line, then invoke the first skill:

```text
Triage: Bug fix · mode review · write-plan
```

Pass the mode to each skill in the path. When one skill ends, start the next
one. Stop the path when the user asks.

Without triage, skills use `guided`.
