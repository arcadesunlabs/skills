---
name: write-feature-spec
description: Create or refine concise, behavior-first use-case specifications and actor definitions with explicit scope, business rules, testable acceptance criteria, and edge cases. Use when defining or reviewing a feature, product requirement, user story, use case, actor, user type, or acceptance criteria, especially when separating product behavior from implementation context.
---

# Write Feature Spec

## Goal

Create the smallest specification that makes the expected product behavior clear
to product, design, development, and QA.

A use-case spec must explain:

- the problem and intended outcome;
- what is included and excluded;
- what the user does and observes;
- which rules must always hold;
- how completion is verified;
- which failures or edge cases affect behavior.

Do not turn the spec into an implementation map, decision log, test plan, or
retrospective.

## Load project conventions

1. Load [workflow-config](../workflow-config/SKILL.md).
2. Read `skills.config.json` and `docs.indexFile`.
3. Follow the project's documentation conventions, including frontmatter,
   naming, paths, and index requirements. Do not impose a generic frontmatter
   policy over an explicit project convention.

Use the configured documentation taxonomy:

| Document           | Location                                 |
| ------------------ | ---------------------------------------- |
| Use-case spec      | `{docsUseCase}/<use-case>.spec.md`       |
| Technical context  | `{docsUseCase}/<use-case>.context.md`    |
| Actor              | `{docsActors}/<actor>.md`                |
| Domain rules       | `{docsDomain}/<domain>.rules.md`         |
| Cross-domain rules | `{docsCapability}/<capability>.rules.md` |

Organize use cases by user intent. Name a use case as a kebab-case verb-object
goal. Keep distinct user goals in separate specs even when they share one
implementation component.

## Choose the canonical home

Keep each fact in one canonical document:

| Content                                                                 | Canonical home |
| ----------------------------------------------------------------------- | -------------- |
| User-visible behavior, scope, product rules, acceptance, error states   | Use-case spec  |
| APIs, schemas, code paths, persistence mechanism, architecture, tests   | Context        |
| Rules shared by use cases in one domain                                 | Domain rules   |
| Rules shared by use cases across more than one domain                   | Capability     |
| Reusable user type with distinct goals, responsibilities, or boundaries | Actor          |

Technical constraints may appear in a spec only when they change what the user
can do or observe. Describe the observable constraint, not its implementation.
For example, write “The report requires internet” instead of naming an HTTP
client or endpoint.

When removing a still-relevant technical detail from a spec, preserve it in the
paired context instead of losing it.

## Workflow

### 1. Gather only missing decisions

Determine:

- problem and outcome;
- affected actor;
- scope and explicit exclusions;
- main flow;
- business rules;
- important errors and edge cases;
- unresolved product decisions.

Inspect existing specs, rules, actors, and context before asking questions. Ask
only what materially changes behavior or scope. If enough is known, proceed and
record only consequential assumptions.

Do not invent product behavior. Treat permissions, ownership, shared visibility,
destructive impact, money, privacy, compliance, retention, and user
notifications as material decisions. Ask when one is unresolved. If interaction
is not possible, list it under `Open questions` instead of turning it into a
business rule or assumption.

Create or link an actor document only when the user type is reusable or has
distinct goals, responsibilities, or boundaries. Keep a generic user inline
otherwise. Treat actor, authorization role, and research persona as different
concepts.

### 2. Draft the lean specification

Start with this core:

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

Add a section only when it contains material information:

| Optional section      | Include when                                                               |
| --------------------- | -------------------------------------------------------------------------- |
| Actor                 | Participation or restrictions are not obvious from the problem             |
| Use cases             | Alternate scenarios are clearer in Given/When/Then                         |
| Visual flow           | Navigation, lifecycle, or state transitions remain ambiguous in prose      |
| Analytics and metrics | Product success metrics or privacy constraints are part of the requirement |
| Dependencies          | An external dependency can block or change the delivered behavior          |
| Open questions        | A product decision is genuinely unresolved                                 |
| Assumptions           | A low-risk fact is useful but does not change product behavior             |

Omit empty sections. Do not add `Proposed solution` by default. If a product
approach needs explanation, describe it briefly without code, services, schemas,
or component names.

### 3. Prevent duplication

Give each section one job:

- **User flow:** sequence of user actions and visible outcomes.
- **Business rules:** invariants, permissions, validation, and state behavior.
- **Acceptance criteria:** a concise verification set for the delivered
  outcomes.
- **Edge cases:** meaningful deviations from the main flow.

Do not restate every business rule as a use case and again as an acceptance
criterion. Acceptance criteria should prove the feature works, not mirror the
document line by line.

Remove:

- resolved-question history;
- implementation alternatives and rejected architecture;
- code paths, class names, payload fields, database tables, and HTTP details;
- test file names or mandatory test inventory;
- empty sections and generic boilerplate;
- diagrams that merely repeat prose;
- assumptions already confirmed as decisions.

Do not use `Assumptions` to silently close a material product decision.

### 4. Make acceptance criteria testable

Write objective outcomes:

```md
- [ ] The user cannot submit until all required fields are valid.
- [ ] A failed save preserves the previously displayed state.
```

Avoid subjective language such as “works well”, “looks good”, or “is
intuitive”. Cover the behavior with the fewest criteria that still demonstrate
scope completion.

### 5. Use scenarios and diagrams selectively

Use Given/When/Then only when it makes a behavior-heavy branch easier to
understand. Do not create a scenario for every rule.

Invoke [document-with-mermaid](../document-with-mermaid/SKILL.md) only when a
product-facing journey, page connection, or state transition is materially
clearer as a diagram. Put service, database, API, and code-path diagrams in the
context.

### 6. Keep implementation context aligned

Create or update `<use-case>.context.md` when implementation is known. It should
link to the spec and own:

- current routes and components;
- API and schema contracts;
- persistence and data flow;
- implementation decisions and dependencies;
- code and test locations;
- telemetry event shape and other technical constraints.

Do not duplicate the spec in the context. Link back to behavior instead.

### 7. Review for signal

Before finishing, verify:

- [ ] The problem and objective are clear.
- [ ] Scope and out of scope are explicit.
- [ ] The main flow is understandable.
- [ ] Business rules describe behavior rather than implementation.
- [ ] Acceptance criteria are objective and non-duplicative.
- [ ] Important error and empty states are covered.
- [ ] Empty or speculative sections are absent.
- [ ] Code paths, API contracts, architecture, and test topology live in context.
- [ ] Removed technical details were preserved in context when still relevant.
- [ ] Material product decisions are confirmed or explicit open questions, not
      hidden assumptions.
- [ ] The actor and shared-rule documents are used only when their scope warrants
      them.
- [ ] `docs.indexFile` is updated only when navigation changed.
- [ ] The document is concise enough to scan and discuss.

## Other document types

When the request targets an actor, domain rules, or a capability rather than a
use case, read
[references/document-templates.md](references/document-templates.md) and use
only the matching template.

For a concise filled example, read
[references/examples.md](references/examples.md).
