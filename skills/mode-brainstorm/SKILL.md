---
name: mode-brainstorm
description: "Use before creative or behavioral work: new features, components, flows, product changes, architecture-impacting changes, or unclear requirements. Refines understanding, writes a feature spec, decides task breakdown, and optionally transitions to write-plan."
---

# Mode Brainstorm

Turn an idea into a closed, implementation-ready spec and task breakdown.

## Required setup

1. Invoke [workflow-config](../workflow-config/SKILL.md) and load `skills.config.json`.
2. Read `docs.indexFile`, `project.conventionsFile`, `{docs.root}/architecture/architecture.md`, and relevant files under `{docsActors}` when present.
3. Use [mode-grill](../mode-grill/SKILL.md) behavior during clarification.

## Hard gates

- Do not write code, scaffold, or implement during this skill.
- Do not assume unclear actors, flows, business rules, permissions, states, integrations, or architecture decisions.
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

- **Use case** — observable user goal → `{specPath}` and `{contextPath}`.
- **Capability** — rule consumed by multiple use cases → `{docsCapability}/<capability>.rules.md`, linked from affected specs.
- **Codebase context** — technical change with no behavior change → `{docs.root}/codebase/<initiative>/context.md`.

Identify the product/business domain and name each use case as a kebab-case verb-object goal before inspecting code. If **capability**, list the affected use cases and actors before drafting.

### 3. Identify actors

For **use-case** and **capability** work, identify every product user type participating in the behavior. Track indirect beneficiaries or stakeholders separately. Skip this gate for actorless codebase-context work.

- Reuse definitions from `{docsActors}` when they exist.
- Ask what each actor wants, is responsible for, and must not do.
- Separate product actors from technical authorization roles and research personas.
- Create or update `{docsActor}` when a user type appears across use cases or has materially distinct goals, responsibilities, or boundaries.
- Keep a generic user inline when no meaningful distinction exists.

For behavioral work, do not proceed until actor-specific behavior and restrictions are clear.

### 4. Write the spec

When understanding is closed for a **use case** or **capability**, invoke [write-feature-spec](../write-feature-spec/SKILL.md). For **codebase context**, do not create a behavior spec; record the agreed technical scope and continue to planning.

The spec is the source of truth for:

- objective and context
- scope and out of scope
- user flows and use cases
- business rules
- acceptance criteria
- edge cases, dependencies, assumptions, and open questions

Follow `write-feature-spec` exactly when writing behavior or capability rules. Do not invent a parallel spec structure here.

For **capability** scope: write `{docsCapability}/<capability>.rules.md` (and `<capability>.scenarios.md` when shared Gherkin helps), then link it from every affected use-case spec.

Update `docs.indexFile` when this work adds or changes a domain, use case, actor, capability, or other documentation entry point. Add links only; keep canonical details in their own documents.

### 5. Decide task breakdown

After the spec is written, discuss the implementation breakdown with the user.

Analyze the actual case and recommend one of:

- **Single task**: one coherent, reviewable change.
- **Micro-tasks**: small independent steps when risk, uncertainty, or review size is high.
- **Layer tasks**: separate UI, orchestration, data, routing, tests, or platform work when layers can be owned or reviewed independently.
- **Epic + slices**: multiple user-visible use cases or subsystems that should not be planned as one branch. For capabilities, slices are often one per affected use case.

Explain the trade-off, recommend a breakdown, then ask the user to confirm or adjust it. Do not leave this step until the tasks are agreed.

Write `{docsCapability}/tasks.md` when the breakdown is cross-cutting and needs a durable artifact. For a use case, use `{docsUseCase}/tasks.md`. For codebase context, use `{docs.root}/codebase/<initiative>/tasks.md`. Skip `tasks.md` for a single task or when moving straight to `write-plan`.

### 6. Transition to plan

If the user decides to implement a task now, invoke [write-plan](../write-plan/SKILL.md) for the selected task/slice.

If the user does not want to implement now, stop after recording the agreed tasks and next step.
