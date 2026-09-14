---
name: brainstorm
description: Explore an idea and interview the user one question at a time until every material decision is closed. Use before writing a spec or plan, when requirements are unclear, when the user wants to brainstorm a feature, stress-test a design, or says "grill me".
---

# Brainstorm

Reach shared understanding before anything is written. Do not write code or
documentation files.

## Before asking

Read what already answers questions:

- `AGENTS.md` or `CLAUDE.md` at the workspace root
- `.docs/index.md`
- `.docs/architecture/architecture.md`
- related specs, rules, actors, and flows under `.docs/`
- the code the idea touches

Paths are fixed. Edit this file to change them.

If the code or docs can answer a question, inspect them instead of asking.

## Interview

- Ask one question at a time. Include your recommended answer.
- Walk each branch of the decision tree. Resolve dependencies before moving on.
- Challenge the idea against current architecture, conventions, and behavior.
- Separate actors (product user types) from technical roles and personas.
- Treat permissions, ownership, destructive impact, money, privacy,
  compliance, retention, and notifications as material. Never close one as an
  assumption.

Stop only when no material flow, rule, or boundary is unclear.

## Close

Summarize in a short list:

- goal and actors
- decided flows and rules
- out of scope
- open questions, if any remain

Then recommend the next step: [write-spec](../write-spec/SKILL.md) for behavior
changes, or [write-plan](../write-plan/SKILL.md) for technical work with no
behavior change.
