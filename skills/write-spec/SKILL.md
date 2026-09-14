---
name: write-spec
description: Write a concise behavior-first spec for a use case, actor, domain rules, or cross-domain capability under .docs/. Use when writing or reviewing a spec, user story, use case, actor, business rules, or acceptance criteria before implementation.
---

# Write Spec

Do not write code. Do not invent product behavior. If material decisions are
still open, run [brainstorm](../brainstorm/SKILL.md) first.

## Paths

Paths are fixed. Edit this file to change them.

- Conventions: `AGENTS.md` or `CLAUDE.md` at the workspace root
- Docs root: `.docs/`
- Index: `.docs/index.md`
- Architecture: `.docs/architecture/architecture.md`

Read the conventions, index, and architecture when present. If the index is
missing, create a short navigational index. Never overwrite an existing one.

## Scope

Organize by user intent, not code folders. Path tags are kebab-case:

- `<domain>`: product area users recognize (`customers`, `orders`). Never a
  component, route, package, or folder name (`forms`, `screens`).
- `<use-case>`: verb-object user goal (`create-customer`). Distinct goals get
  distinct specs even when they share one component.
- `<capability>`: rules used by more than one domain (`access-control`).
- `<actor>`: product user type (`operator`). Not a technical role
  (`sales_manager`) or a research persona.
- `<initiative>`: technical work with no behavior change
  (`migrate-to-postgres`).

| Situation                                            | Write                                                   |
| ---------------------------------------------------- | ------------------------------------------------------- |
| Observable user goal                                 | `.docs/<domain>/<use-case>/<use-case>.spec.md`          |
| Rules shared by use cases of **one** domain          | `.docs/<domain>/<domain>.rules.md`                      |
| Rules shared **across** domains                      | `.docs/capabilities/<capability>/<capability>.rules.md` |
| Reusable user type with distinct goals or boundaries | `.docs/actors/<actor>.md`                               |
| Technical change with no behavior change             | `.docs/codebase/<initiative>/notes.md`                  |

Shared rules default to the domain hub. Promote to a capability only when
consumers span more than one domain. Link rules; do not copy them.

Reuse `.docs/actors/`. Create an actor document only when the type is reusable
or has distinct goals, responsibilities, or boundaries.

## Write

For codebase work, record technical scope in `notes.md` and stop.

For an actor, domain rules, or capability, use the matching template in
[references/document-templates.md](references/document-templates.md).

For a use case:

```md
# [Verb-object user goal]

## Goal

## Scope

## Out of scope

## User flow

## Rules
```

Filled example: [references/examples.md](references/examples.md).

Add a section only when it holds material information:

| Optional section | Include when                                           |
| ---------------- | ------------------------------------------------------ |
| Actor            | Participation or restrictions are not obvious          |
| Use cases        | Alternate scenarios are clearer in Given/When/Then     |
| Dependencies     | An external dependency can block or change behavior    |
| Open questions   | A product decision is genuinely unresolved             |
| Assumptions      | A low-risk fact is useful but does not change behavior |

Omit empty sections.

Rules:

- `Goal` states the problem and the outcome in one or two sentences.
- `Rules` are the acceptance criteria: one checkbox per testable rule,
  including edge cases and error states. Do not repeat a rule elsewhere.
- Put a technical constraint in the spec only when the user can observe it.
- No routes, components, APIs, file paths, or diagrams. Diagrams live in
  `<use-case>.flows.md` ([write-flows](../write-flows/SKILL.md)).
- Write objective rules. Avoid "works well" or "is intuitive":

```md
- [ ] The user cannot submit until all required fields are valid.
- [ ] A failed save preserves the previously displayed state.
```

Update `.docs/index.md` only when navigation changed.

## After the spec

Recommend a breakdown and confirm with the user:

- **Single task**: one coherent, reviewable change
- **Micro-tasks**: small steps when risk or review size is high
- **Layer tasks**: UI, data, tests, or platform reviewed separately
- **Epic + slices**: several user-visible use cases

Write `tasks.md` beside the spec only for epic or cross-cutting work.

If the user wants to implement now, invoke [write-plan](../write-plan/SKILL.md)
for the selected task or slice. Otherwise stop.
