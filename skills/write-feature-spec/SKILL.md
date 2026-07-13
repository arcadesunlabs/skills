---
name: write-feature-spec
description: Create clear feature specifications with goals, scope, user flows, business rules, use cases, acceptance criteria, edge cases, and open questions. Use when the user wants to define, document, refine, or review a feature, product requirement, user story, use case, acceptance criteria, or implementation-ready specification.
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

Load [workflow-config](../workflow-config/SKILL.md) first. This skill is the **single source of truth** for spec structure. Settings below use config placeholders.

- **Location:** depends on documentation scope (see [workflow-config](../workflow-config/SKILL.md) decision tree):
  - **Vertical feature:** `{docsFeature}/01-spec.md` (`<domain>` and `<feature>` in kebab-case, mirroring `docs.domainMirror` or functional area).
  - **Capability:** `{docsCapability}/spec.md` (`<capability>` in kebab-case — name the domain concept, not a ticket or fix).
  - **Touchpoint:** `{docsTouchpoint}` — delta for how one surface consumes a capability.
- **No YAML frontmatter** in `docs/` feature files — start each file with a single `# Title`.
- **Spec flavors:**
  - **Product spec (vertical)** — a new feature / user-facing behavior being designed. Use the structure in _Draft the specification_ below. Pair with `{docsFeature}/02-context.md` for brownfield context.
  - **Flow/architecture spec (vertical)** — documenting how an existing vertical feature already works. Replace the design-oriented sections with: `## Overview`, `## Flow` (mermaid), `## Special cases / Important rules`, `## Key components` (table), `## Key files` (table).
  - **Capability spec** — cross-cutting domain rules consumed by multiple surfaces. Use the [capability template](#capability-spec-template) below. Optional `{docsCapability}/scenarios.md` for shared Gherkin scenarios.
  - **Touchpoint spec** — how one surface implements a capability. Use the [touchpoint template](#touchpoint-spec-template) below. Must link to `{docsCapability}/spec.md`. Full vertical product spec (if any) stays at `{docsFeature}/01-spec.md`.
- **`02-context.md`** (vertical features only, same folder as `01-spec.md`) — brownfield context for devs/agents, kept **diagram-first**: an intuitive mermaid flow diagram plus the list of files in that flow. No code snippets or written walkthroughs — those never go here or in `01-spec.md`. Create or update when implementation is defined (see the [02-context.md template](../write-plan/REFERENCE.md#02-contextmd-sections)). Capabilities use `spec.md` for shared contracts; touchpoints use `{docsTouchpoint}` for surface-specific code paths.

## Process

### 1. Gather context

Before writing the specification, identify what is already known and what is missing.

Ask only the most important questions when needed. If enough context exists, proceed with reasonable assumptions and list them clearly.

Useful questions:

- What problem does this feature solve?
- Who is the target user?
- What should the user be able to do?
- What is the expected business or product outcome?
- Are there any existing screens, APIs, systems, or rules involved?
- What should be explicitly out of scope?
- Are there known edge cases, permissions, limits, or validations?
- How will the team know this feature is complete?

### 2. Draft the specification

Create a concise feature specification using this structure:

```md
# Feature Specification: [Feature Name]

## 1. Context

Explain the current situation, problem, or opportunity.

## 2. Objective

Describe the expected outcome of the feature.

## 3. Target users

Describe who will use or be affected by this feature.

## 4. Scope

List what is included in this feature.

## 5. Out of scope

List what will not be handled in this version.

## 6. Proposed solution

Describe the solution at a high level.

## 7. User flow

Describe the main user journey step by step.

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
- [ ] Scope and out of scope are explicit.
- [ ] The main user flow is understandable.
- [ ] Use cases cover the main scenarios.
- [ ] Business rules are separated from acceptance criteria.
- [ ] Acceptance criteria are testable.
- [ ] Error states and edge cases are included.
- [ ] Dependencies are listed.
- [ ] Open questions are clearly documented.
- [ ] Assumptions are explicit.
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

## Scope

## Out of scope

## User flow

## Business rules

## Acceptance criteria

## Edge cases and error states

## Open questions

## Assumptions
```

## Capability spec template

Use for cross-cutting domain rules (`{docsCapability}/spec.md`):

```md
# [Capability Name] — Canonical rules

## Touchpoints

| Surface | Doc                        | Code path |
| ------- | -------------------------- | --------- |
| …       | link to `{docsTouchpoint}` | …         |

Shared scenarios: [scenarios.md](scenarios.md) (create when multiple surfaces share acceptance criteria).

## Domain rules

Canonical invariants, semantics tables, flags, and kernel contracts. No UI-specific layout.

## Kernel / shared contracts

Helpers, enums, options, or services that enforce the rules (paths allowed here).

## Tests

Regression commands or test files that lock the contract.
```

## Touchpoint spec template

Use for one surface (`{docsTouchpoint}`):

```md
# [Feature] — [Capability] touchpoint

Canonical rules: link to `{docsCapability}/spec.md`.

Full vertical spec (if any): link to `{docsFeature}/01-spec.md`.

## How this surface consumes the capability

Surface-specific behavior only — do not duplicate the capability spec table.

## Key files

Paths and components for this touchpoint.

## Tests

Commands or files for this surface.
```

## Example

For a complete, filled-in product spec (password reset), see [EXAMPLES.md](EXAMPLES.md).
