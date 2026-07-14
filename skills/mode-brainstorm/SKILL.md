---
name: mode-brainstorm
description: "Use before creative or behavioral work: new features, components, flows, product changes, architecture-impacting changes, or unclear requirements. Refines understanding, writes a feature spec, decides task breakdown, and optionally transitions to write-plan."
---

# Mode Brainstorm

Turn an idea into a closed, implementation-ready spec and task breakdown.

## Required setup

1. Invoke [workflow-config](../workflow-config/SKILL.md) and load `skills.config.json`.
2. Read `project.conventionsFile` and `{docs.root}/architecture/architecture.md` when present.
3. Use [mode-grill](../mode-grill/SKILL.md) behavior during clarification.

## Hard gates

- Do not write code, scaffold, or implement during this skill.
- Do not assume unclear flows, business rules, permissions, states, integrations, or architecture decisions.
- If a question can be answered from the codebase, `{docs.root}/architecture/architecture.md`, other project docs, or `project.conventionsFile`, inspect those first.
- Ask the user one question at a time. Include your recommended answer when useful.
- Continue questioning and refining until each decision point is fully closed.

## Process

### 1. Close understanding

Stress-test the request using `mode-grill`:

- Walk the decision tree one branch at a time.
- Resolve dependencies between decisions before moving forward.
- Validate the idea against the existing architecture/conventions from `project.conventionsFile` and `{docs.root}/architecture/architecture.md` when present.
- Check the codebase, `{docs.root}/architecture/architecture.md`, and other project docs when they can answer a question.
- Keep drilling until there are no material ambiguities left.

Do not proceed while any important flow or business rule is unclear.

### 2. Classify documentation scope

Before writing specs, decide where documentation lives (see [workflow-config](../workflow-config/SKILL.md) decision tree):

- **Vertical** — single product flow or screen with its own identity → `{docsFeature}/01-spec.md`.
- **Capability (+ touchpoints)** — domain rule consumed by 2+ surfaces → `{docsCapability}/spec.md` first, then `{docsTouchpoint}` per affected surface.
- **Touchpoint-only** — change on one surface that already consumes an existing capability → `{docsTouchpoint}` only; update capability spec if shared rules changed.

Ask the user or infer from scope. If **capability**, list all touchpoints (each surface that consumes the shared rule) before drafting.

### 3. Write the spec

When the understanding is closed, invoke [write-feature-spec](../write-feature-spec/SKILL.md).

The spec is the source of truth for:

- objective and context
- scope and out of scope
- user flows and use cases
- business rules
- acceptance criteria
- edge cases, dependencies, assumptions, and open questions

Follow `write-feature-spec` exactly. Do not invent a parallel spec structure here.

For **capability** scope: write `{docsCapability}/spec.md` (and `scenarios.md` when shared Gherkin helps), then draft or update each `{docsTouchpoint}`.

### 4. Decide task breakdown

After the spec is written, discuss the implementation breakdown with the user.

Analyze the actual case and recommend one of:

- **Single task**: one coherent, reviewable change.
- **Micro-tasks**: small independent steps when risk, uncertainty, or review size is high.
- **Layer tasks**: separate UI, orchestration, data, routing, tests, or platform work when layers can be owned or reviewed independently.
- **Epic + slices**: multiple user-visible slices or subsystems that should not be planned as one branch. For capabilities, slices are often **one per touchpoint** (each surface updated independently).

Explain the trade-off, recommend a breakdown, then ask the user to confirm or adjust it. Do not leave this step until the tasks are agreed.

Write `{docsCapability}/04-tasks.md` when the breakdown is cross-cutting and needs a durable artifact. For vertical features, use `{docsFeature}/04-tasks.md`. Skip `04-tasks.md` for a single task or when moving straight to `write-plan`.

### 5. Transition to plan

If the user decides to implement a task now, invoke [write-plan](../write-plan/SKILL.md) for the selected task/slice.

If the user does not want to implement now, stop after recording the agreed tasks and next step.
