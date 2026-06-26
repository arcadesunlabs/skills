---
name: mode-brainstorm
description: "Use before creative or behavioral work: new features, components, flows, product changes, architecture-impacting changes, or unclear requirements. Refines understanding, writes a feature spec, decides task breakdown, and optionally transitions to write-plan."
---

# Mode Brainstorm

Turn an idea into a closed, implementation-ready spec and task breakdown.

## Required setup

1. Invoke [workflow-config](../workflow-config/SKILL.md) and load `skills.config.json`.
2. Read `project.conventionsFile` and `{docs.root}/codebase/architecture.md` when present.
3. Use [mode-grill](../mode-grill/SKILL.md) behavior during clarification.

## Hard gates

- Do not write code, scaffold, or implement during this skill.
- Do not assume unclear flows, business rules, permissions, states, integrations, or architecture decisions.
- If a question can be answered from the codebase, `{docs.root}/codebase/architecture.md`, other project docs, or `project.conventionsFile`, inspect those first.
- Ask the user one question at a time. Include your recommended answer when useful.
- Continue questioning and refining until each decision point is fully closed.

## Process

### 1. Close understanding

Stress-test the request using `mode-grill`:

- Walk the decision tree one branch at a time.
- Resolve dependencies between decisions before moving forward.
- Validate the idea against the existing architecture/conventions from `project.conventionsFile` and `{docs.root}/codebase/architecture.md` when present.
- Check the codebase, `{docs.root}/codebase/architecture.md`, and other project docs when they can answer a question.
- Keep drilling until there are no material ambiguities left.

Do not proceed while any important flow or business rule is unclear.

### 2. Write the spec

When the understanding is closed, invoke [write-feature-spec](../write-feature-spec/SKILL.md).

The spec is the source of truth for:

- objective and context
- scope and out of scope
- user flows and use cases
- business rules
- acceptance criteria
- edge cases, dependencies, assumptions, and open questions

Follow `write-feature-spec` exactly. Do not invent a parallel spec structure here.

### 3. Decide task breakdown

After the spec is written, discuss the implementation breakdown with the user.

Analyze the actual case and recommend one of:

- **Single task**: one coherent, reviewable change.
- **Micro-tasks**: small independent steps when risk, uncertainty, or review size is high.
- **Layer tasks**: separate UI, orchestration, data, routing, tests, or platform work when layers can be owned or reviewed independently.
- **Epic + slices**: multiple user-visible slices or subsystems that should not be planned as one branch.

Explain the trade-off, recommend a breakdown, then ask the user to confirm or adjust it. Do not leave this step until the tasks are agreed.

Write `{docs.root}/<domain>/<feature>/04-tasks.md` only when the agreed breakdown needs a durable task artifact, such as epic slices, multiple micro-tasks, layer-owned tasks, tracker/card creation, or a user request to record the breakdown. For a single task or a breakdown that will immediately become a `write-plan`, keep the task agreement in the conversation/spec context and skip `04-tasks.md`.

### 4. Transition to plan

If the user decides to implement a task now, invoke [write-plan](../write-plan/SKILL.md) for the selected task/slice.

If the user does not want to implement now, stop after recording the agreed tasks and next step.
