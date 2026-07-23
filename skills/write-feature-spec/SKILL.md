---
name: write-feature-spec
description: Create clear use-case specifications and actor definitions with goals, scope, flows, business rules, acceptance criteria, and edge cases. Use when the user wants to define, document, refine, or review a feature, product requirement, user story, use case, actor, user type, acceptance criteria, or implementation-ready specification.
---

# Write Feature Spec

## Purpose

Use this skill to create or improve feature specifications that are clear enough for product, design, development, QA, and stakeholders to understand what must be built and how to validate that it is done.

A good feature specification should answer:

- What problem are we solving?
- Why are we solving it?
- Who is affected?
- What is included?
- What is not included?
- How should the user flow work?
- What rules must the system follow?
- How do we know the feature is ready?
- What edge cases and errors must be handled?
- What is still undecided?

## Project conventions

Load [workflow-config](../workflow-config/SKILL.md) first, then read `docs.indexFile` for project-specific documentation taxonomy, conventions, and existing entry points. This skill is the **single source of truth** for spec structure. Settings below use config placeholders.

- **Location:** depends on documentation scope (see [workflow-config](../workflow-config/SKILL.md) decision tree):
  - **Use case:** `{specPath}` (`<domain>/<use-case>/<use-case>.spec.md`; name `<use-case>` as a kebab-case verb-object user goal).
  - **Actor:** `{docsActor}` (`actors/<actor>.md`; name `<actor>` from product language, not a code role identifier).
  - **Capability:** `{docsCapability}/rules.md` (`<capability>` in kebab-case; name the shared domain concept, not a ticket or fix).
- **No YAML frontmatter** in `docs/` feature files — start each file with a single `# Title`.
- **Spec flavors:**
  - **Use-case spec** — a user-facing behavior being designed or documented. Use the structure in _Draft the specification_ below. Pair with `{contextPath}` for implementation context.
  - **Actor definition** — a reusable product user type. Use the [actor document template](#actor-document-template), update `{docsActors}/index.md`, and stop unless a use-case or capability document was also requested.
  - **Capability rules** — cross-cutting domain rules consumed by multiple use cases. Use the [capability template](#capability-rules-template) below. Optional `{docsCapability}/scenarios.md` for shared Gherkin scenarios.
- **`<use-case>.context.md`** (same folder as `<use-case>.spec.md`) — implementation context for developers and agents. It links to the spec and maps the current flow, routes, components, APIs, schemas, persistence, tests, decisions, dependencies, and code paths. Create or update when implementation is known (see the [context template](../write-plan/REFERENCE.md#use-case-context-sections)).
- `<use-case>.spec.md` must remain useful without code paths. Distinct user goals get separate use-case specs even when they share one component.

## Process

### 1. Gather context

Before writing the specification, identify what is already known and what is missing.

Ask only the most important questions when needed. If enough context exists, proceed with reasonable assumptions and list them clearly.

Useful questions:

- What problem does this feature solve?
- Which actors participate, and what does each one want?
- What should the user be able to do?
- What is the expected business or product outcome?
- Are there any existing screens, APIs, systems, or rules involved?
- What should be explicitly out of scope?
- Are there known edge cases, permissions, limits, or validations?
- How will the team know this feature is complete?

Resolve actors before drafting the use-case spec:

- Reuse and link existing `{docsActor}` files.
- Create an actor document when the user type appears in multiple use cases or has distinct goals, responsibilities, or boundaries.
- Keep a generic `user` inline when no meaningful distinction exists.
- Treat actor as product meaning, role as technical authorization, and persona as a research archetype. Do not use these terms interchangeably.

For an actor-only request, create or update `{docsActor}` and `{docsActors}/index.md` using the template below. Do not invent a use case, acceptance criteria, or implementation context unless the user also requested behavioral work.

### 2. Draft the specification

Create a concise feature specification using this structure:

```md
# Feature Specification: [Feature Name]

## 1. Context

Explain the current situation, problem, or opportunity.

## 2. Objective

Describe the expected outcome of the feature.

## 3. Actors

Link affected actor documents and describe actor-specific participation in this use case. Keep a generic user inline when no canonical actor document is needed.

## 4. Scope

List what is included in this feature.

## 5. Out of scope

List what will not be handled in this version.

## 6. Proposed solution

Describe the solution at a high level.

## 7. User flow

Describe the main user journey step by step.

{Optional: add `## Visual flow` when a page connection, journey, or state transition is materially easier to understand visually. Invoke [document-with-mermaid](../document-with-mermaid/SKILL.md) to select the smallest useful diagram. Keep this view product-facing; technical implementation belongs in `{contextPath}`.}

## 8. Use cases

Describe the main scenarios the feature must support.

## 9. Business rules

List product, domain, permission, validation, or system behavior rules.

## 10. Acceptance criteria

Use a checklist format. Each item should be testable.

## 11. Edge cases and error states

List important alternative scenarios, failures, empty states, and validations.

## 12. Analytics and metrics

List events or metrics that should be tracked, if applicable.

## 13. Dependencies

List technical, design, product, API, legal, or operational dependencies.

## 14. Open questions

List decisions that still need to be made.

## 15. Assumptions

List assumptions made while writing the specification.
```

### 3. Make acceptance criteria testable

Acceptance criteria must be objective and verifiable.

Prefer:

```md
- [ ] The user can submit the form only when all required fields are valid.
- [ ] The system shows an error message when the request fails.
- [ ] The system prevents users without permission from accessing the feature.
```

Avoid vague criteria:

```md
- [ ] The feature works well.
- [ ] The page is beautiful.
- [ ] The flow is intuitive.
```

### 4. Use Given/When/Then when useful

For behavior-heavy features, write use cases or acceptance criteria using Given/When/Then.

Example:

```md
### Use case: Submit a valid request

Given the user has filled all required fields
When the user submits the form
Then the system should save the request
And show a success message
```

Use Given/When/Then when it makes behavior easier to understand. Do not force it for every item if a checklist is clearer.

### 4a. Add a visual flow when it clarifies behavior

Mermaid is optional in a spec. Invoke [document-with-mermaid](../document-with-mermaid/SKILL.md) when a user journey, page navigation, or lifecycle state would otherwise be ambiguous. Do not use technical service, database, or code-path diagrams here; place those in `{contextPath}` or the architecture documentation.

### 5. Separate business rules from acceptance criteria

Business rules describe how the product or domain must behave.

Example:

```md
- Only administrators can approve requests.
- A request cannot be edited after approval.
- The maximum upload size is 10 MB.
```

Acceptance criteria describe how to validate that the implementation is complete.

Example:

```md
- [ ] Users without administrator permission cannot see the approve button.
- [ ] Approved requests display the edit action as disabled.
- [ ] Files larger than 10 MB show a validation error.
```

### 6. Keep scope explicit

Always include both `Scope` and `Out of scope`.

This prevents misunderstandings and protects the team from hidden expectations.

Good out-of-scope examples:

```md
- Bulk editing will not be supported in this version.
- Email notifications will be handled in a separate feature.
- Historical data migration is not part of this implementation.
```

### 7. Include error and empty states

Do not document only the happy path.

Consider:

- Empty data
- Loading state
- Network error
- Permission denied
- Invalid input
- Partial success
- Duplicated action
- Timeout
- External service failure
- User cancellation
- Unsupported file or format
- Conflicting data
- Retry behavior

### 8. Review and refine

After drafting, review the specification using this checklist:

- [ ] The problem is clear.
- [ ] The objective is clear.
- [ ] Every meaningful canonical actor is identified and linked; generic inline users do not require actor documents.
- [ ] Actor-specific behavior and restrictions are explicit.
- [ ] Scope and out of scope are explicit.
- [ ] The main user flow is understandable.
- [ ] Use cases cover the main scenarios.
- [ ] Business rules are separated from acceptance criteria.
- [ ] Acceptance criteria are testable.
- [ ] Error states and edge cases are included.
- [ ] Dependencies are listed.
- [ ] Open questions are clearly documented.
- [ ] Assumptions are explicit.
- [ ] `docs.indexFile` reflects any added, moved, renamed, or removed domain, use case, actor, or capability without duplicating its content.
- [ ] The document is concise enough to be useful.

## Output style

When creating a specification, prefer clear markdown with practical wording.

Avoid excessive jargon.

If the user is technical, include implementation-relevant details.
If the user is non-technical, keep the language product-focused and easy to understand.

When information is missing, do not block unnecessarily. Continue with assumptions and add them to the `Assumptions` section.

## Minimal template

Use this shorter version when the user wants something lightweight:

```md
# Feature: [Name]

## Problem

## Objective

## Actors

## Scope

## Out of scope

## User flow

## Business rules

## Acceptance criteria

## Edge cases and error states

## Open questions

## Assumptions
```

## Actor document template

Use for a product user type with distinct goals, responsibilities, or boundaries (`{docsActor}`):

```md
# [Actor Name]

## Definition

Describe who this actor is in product or business language.

## Goals

List outcomes this actor seeks across the product.

## Responsibilities

List duties this actor is expected to perform.

## Boundaries

List actions or decisions outside this actor's responsibility.

## Technical roles

List authorization identifiers only when useful, and link to canonical access-control rules. This section is not the source of truth for permissions.

## Related use cases

Link use-case specs involving this actor.
```

Maintain `{docsActors}/index.md` as a short catalog linking every canonical actor. Keep actor-specific behavior in each use-case spec and canonical authorization matrices in a capability such as `access-control/rules.md`.

```md
# Actors

| Actor                   | Definition                     | Technical roles |
| ----------------------- | ------------------------------ | --------------- |
| [Operator](operator.md) | Handles daily operational work | `operator`      |
```

## Capability rules template

Use for cross-cutting domain rules (`{docsCapability}/rules.md`):

```md
# [Capability Name] — Canonical rules

## Affected use cases

| Use case | Spec                 |
| -------- | -------------------- |
| …        | link to `{specPath}` |

Shared scenarios: [scenarios.md](scenarios.md) (create when multiple use cases share acceptance criteria).

## Affected actors

Link canonical `{docsActor}` files when rules differ by actor. Keep permission matrices here when this capability owns authorization.

## Domain rules

Canonical invariants, semantics tables, flags, and kernel contracts. No UI-specific layout.
```

## Example

For a complete, filled-in product spec (password reset), see [EXAMPLES.md](EXAMPLES.md).
