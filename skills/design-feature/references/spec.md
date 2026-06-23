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

Load [workflow](../workflow/SKILL.md) first. This skill is the **single source of truth** for spec structure. Settings below use config placeholders.

- **Location:** save specs to `{docs.root}/<domain>/<feature>/01-spec.md` (`<domain>` and `<feature>` in kebab-case, mirroring `docs.domainMirror` or functional area). User preferences for spec location override this default.
- **Tracker link:** include the card key (e.g. `{cardKey}`) when `taskTracker.enabled`. Branch name follows `taskTracker.branchMatchesCardKey` in config.
- **No YAML frontmatter** in `docs/` feature files — start each file with a single `# Title`.
- **Two spec flavors:**
  - **Product spec** (default) — a new feature / user-facing behavior being designed. Use the structure in _Draft the specification_ below.
  - **Flow/architecture spec** — documenting how an existing feature already works. Replace the design-oriented sections with: `## Overview`, `## Flow` (mermaid), `## Special cases / Important rules`, `## Key components` (table), `## Key files` (table).
- **`02-context.md`** (same folder) — brownfield context for devs/agents. Create or update when implementation is defined; code snippets and class names go here, never in `01-spec.md`.
- **`04-tasks.md`** — epic decomposition into slices (order, dependencies, scope, out of scope per slice). Create at brainstorm time for epic-sized work; each slice should map to a child tracker card when applicable. **Transient** — removed by [`close-workflow`](../close-workflow/SKILL.md) after delivery.
- **`03-plan.md`** — phased implementation checklist from [`build-feature`](../build-feature/SKILL.md), scoped to the active slice/branch. **Transient** — removed by `close-workflow` after delivery.
- Infra/process docs (CI/CD, logging, internal sync) are not feature specs — they live under `docs/archived/`, or top-level files like `docs/web-backlog.md`.

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

## Example

For a complete, filled-in product spec (password reset), see [spec-example.md](spec-example.md).
