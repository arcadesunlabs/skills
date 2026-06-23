# Grill — clarify intent and align with the domain

Interview the user relentlessly until you reach shared understanding of what to build and how it fits the existing product. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one.

Use this step during brainstorm **and** as a standalone mode when the user wants to stress-test an existing plan.

## What to resolve (one question at a time)

- **Purpose** — what problem, for whom, what success looks like
- **Constraints** — time, tech, dependencies, non-negotiables
- **Domain alignment** — terminology, entities, and boundaries that match the codebase and docs; flag mismatches before proposing solutions
- **Ambiguity** — any requirement that could be read two ways

For each question, provide your recommended answer.

## Rules

- Ask **one question per message** — if a topic needs depth, split into follow-ups
- Prefer multiple choice when it speeds up answers
- If a question can be answered by exploring the codebase, **explore first** (files, docs, `docs.domainMirror`, recent commits) — then ask only what remains unclear
- Do not propose approaches or write specs until this step is complete and the user confirms shared understanding

## Exit criteria

Move to scope sizing when you can state in 2–3 sentences: what we're building, what we're not, and how it maps to the existing domain model — and the user agrees.
