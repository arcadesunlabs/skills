---
name: document-with-mermaid
description: Add clear, purposeful Mermaid diagrams to product specifications, technical context, and architecture documentation. Use when a flow, interaction, state model, data relationship, system boundary, or page connection is easier to understand visually than in prose.
---

# Document With Mermaid

Use the smallest diagram that removes a real ambiguity. Do not add Mermaid merely to decorate a document.

## Choose the document

- **Use-case spec** — optionally show a user journey, page/navigation flow, or meaningful state transition. Keep it product-facing; do not include code paths.
- **Use-case or codebase context** — show how the current technical implementation realizes behavior: components, services, persistence, integrations, and boundaries.
- **Architecture document** — show stable, cross-cutting system boundaries. Link to it from narrower contexts instead of copying the whole diagram.

If a short paragraph or table is clearer, omit the diagram. One focused diagram is preferable to several overlapping ones.

## Select the diagram

| Question to answer                                       | Mermaid type                                                                   | Use it for                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| What is the path, decision, or navigation between pages? | `flowchart`                                                                    | User flows, page connections, processing paths, branching decisions  |
| Who calls whom, in what order, and what comes back?      | `sequenceDiagram`                                                              | UI/API/service/database interactions, webhooks, retries              |
| Which lifecycle states and transitions exist?            | `stateDiagram-v2`                                                              | Orders, jobs, imports, authentication, approval workflows            |
| Which domain objects relate to one another?              | `classDiagram`                                                                 | Conceptual domain models and service responsibilities                |
| How is data persisted and related?                       | `erDiagram`                                                                    | Tables, entities, cardinalities, ownership                           |
| Which systems and boundaries participate?                | `C4Context` / `C4Container`, or `flowchart` when renderer support is uncertain | Applications, external services, queues, databases, trust boundaries |
| What does the person experience across a journey?        | `journey`                                                                      | Product discovery, onboarding, multi-step UX                         |

Do not use planning or reporting diagrams (`gantt`, `kanban`, charts, Git graphs) for permanent product or technical documentation unless that artifact specifically needs them.

For minimal, adaptable patterns for the supported types, read [references/diagram-patterns.md](references/diagram-patterns.md). Use it when writing a diagram from scratch or when Mermaid syntax would otherwise distract from documenting the system.

## Compose the diagram

1. Start from the question the reader needs answered; inspect the current implementation before documenting it as fact.
2. Include only participants and transitions relevant to that question. Represent responsibility, domain concept, or system boundary — not every class or file.
3. Use readable, product or architectural labels. Add code paths only in the implementation map below or beside the diagram.
4. For technical flows, make failure, retry, asynchronous, and persistence paths explicit when they materially change behavior.
5. Add one sentence before or after the diagram explaining the boundary or decision it makes clear.
6. Keep Mermaid syntax valid and render it when the documentation environment provides a renderer. Prefer simple syntax and avoid custom styling unless it increases clarity.

## Placement conventions

### In a spec

Place an optional `## Visual flow` after `## Proposed solution` or `## User flow`. Use a flowchart, journey, or state diagram only when it clarifies behavior better than the written flow.

### In a context document

Use `## Diagrams and flow`. Start with the most useful view; add a second diagram only when it answers a different question, such as a sequence alongside an ER diagram. Follow it with `## Implementation map` linking each durable responsibility to current code.

### In architecture documentation

Use a boundary-oriented context or container view. Keep use-case contexts to their relevant slice and link back to this canonical view.

## Quality check

- [ ] The diagram answers a named question that prose did not answer as clearly.
- [ ] Its labels describe responsibilities, concepts, or systems rather than implementation trivia.
- [ ] It matches current behavior and does not invent undecided architecture.
- [ ] It has no secrets, credentials, personal data, or sensitive payloads.
- [ ] It does not duplicate a broader canonical architecture diagram without adding a focused view.
