---
name: write-feature-spec
description: Turn an idea into a concise behavior-first spec by closing unknowns, classifying documentation scope, and writing use-case specs, actor definitions, or shared rules. Use when brainstorming a feature, grilling a design, writing or reviewing a spec, user story, use case, actor, acceptance criteria, or documenting product behavior before implementation.
---

# Write Feature Spec

Do not write code. Do not invent product behavior. Inspect the project before
asking. Ask one question at a time and include a recommended answer. Behavior
lives in the spec; implementation lives in the paired context.

## Load project conventions

Read `skills.config.json` at the workspace root. If it is missing, create it
from [skills.config.example.json](../../../skills.config.example.json), or point
the user to `npx github:arcadesunlabs/skills skills-configure <project-path>`.
Required: `project.name`, `project.conventionsFile`, `docs.root`,
`docs.indexFile`. `docs.capabilitiesRoot` defaults to `capabilities`.

Then read `docs.indexFile`, `project.conventionsFile`, and
`{docs.root}/architecture/architecture.md` when present. If the index is
missing, create a short navigational index inside the workspace; do not
overwrite an existing one.

## Scope

Organize by user intent, not code folders. A **domain** is a product area
(`customers`, `orders`). A **use case** is a kebab-case verb-object goal
(`create-customer`). Distinct user goals get distinct specs even when they
share one component.

Actor, authorization role, and research persona are different concepts.

Paths are under `docs.root`. `{capabilitiesRoot}` is `docs.capabilitiesRoot`.

| Situation | Write |
| --------- | ----- |
| Observable user goal | `<domain>/<use-case>/<use-case>.spec.md` and `<use-case>.context.md` |
| Rules shared by use cases of **one** domain | `<domain>/<domain>.rules.md` |
| Rules shared **across** domains | `{capabilitiesRoot}/<capability>/<capability>.rules.md` |
| Reusable user type with distinct goals, responsibilities, or boundaries | `actors/<actor>.md` |
| Technical change with no behavior change | `codebase/<initiative>/context.md` |

Shared rules default to the domain hub. Promote to a capability only when
consumers span more than one domain. Link rules; do not copy them.

## Close understanding

Walk each decision branch and resolve dependencies before moving on. If the
codebase, `{docs.root}/architecture/architecture.md`, or conventions can answer,
inspect instead of asking.

Treat permissions, ownership, shared visibility, destructive impact, money,
privacy, compliance, retention, and notifications as material. If one is
unresolved and interaction is not possible, list it under `Open questions`.
Do not close a material decision as an Assumption.

For behavioral work, identify participating actors. Reuse `{docs.root}/actors/`.
Create or link an actor document only when the type is reusable or has distinct
goals, responsibilities, or boundaries; keep a generic user inline otherwise.

Do not proceed while a material flow or rule is unclear.

## Write

For **codebase context**, do not create a behavior spec. Record technical scope
and stop, or continue to [write-plan](../write-plan/SKILL.md) if implementing.

For an actor, domain rules, or capability, use the matching template in
[references/document-templates.md](references/document-templates.md).

For a use case:

```md
# [Verb-object user goal]

## Problem

## Objective

## Scope

## Out of scope

## User flow

## Business rules

## Acceptance criteria

## Edge cases and error states
```

Filled example: [references/examples.md](references/examples.md).

Add a section only when it contains material information:

| Optional section | Include when |
| ---------------- | ------------ |
| Actor | Participation or restrictions are not obvious from the problem |
| Use cases | Alternate scenarios are clearer in Given/When/Then |
| Visual flow | Navigation, lifecycle, or state transitions remain ambiguous in prose |
| Analytics and metrics | Product success metrics or privacy constraints are part of the requirement |
| Dependencies | An external dependency can block or change the delivered behavior |
| Open questions | A product decision is genuinely unresolved |
| Assumptions | A low-risk fact is useful but does not change product behavior |

Omit empty sections. Do not add `Proposed solution` by default.

Put a technical constraint in the spec only when it changes what the user can
do or observe (“The report requires internet”, not an HTTP client). Move
removed but still-relevant technical detail to `<use-case>.context.md`.

Give each section one job. Do not restate every business rule as a use case and
again as an acceptance criterion. When refining, drop resolved-question
history, rejected alternatives, and implementation detail.

Use Given/When/Then only when a behavior-heavy branch is clearer that way. Invoke
[document-with-mermaid](../document-with-mermaid/SKILL.md) only when a
product-facing journey, page connection, or state transition is materially
clearer as a diagram. Put service, database, API, and code-path diagrams in the
context.

Write objective acceptance criteria. Avoid “works well”, “looks good”, or
“is intuitive”:

```md
- [ ] The user cannot submit until all required fields are valid.
- [ ] A failed save preserves the previously displayed state.
```

Create or update `<use-case>.context.md` when implementation is known. Link to the
spec; do not duplicate it. Update `docs.indexFile` only when navigation changed.

## After the spec

Recommend a breakdown, then confirm with the user:

- **Single task** — one coherent, reviewable change
- **Micro-tasks** — small independent steps when risk or review size is high
- **Layer tasks** — separate UI, data, tests, or platform work when layers can be reviewed independently
- **Epic + slices** — multiple user-visible use cases; for capabilities, often one slice per affected use case

Write `tasks.md` only for epic or cross-cutting work, in the same folder as the
permanent artifact.
Skip it for a single task or when moving straight to planning.

If the user wants to implement now, invoke [write-plan](../write-plan/SKILL.md)
for the selected task or slice. Otherwise stop.
