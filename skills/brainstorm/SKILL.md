---
name: brainstorm
description: Explore an idea and close every material decision in guided, review, or autonomous mode. Use before writing a spec or plan, when requirements are unclear, when the user wants to brainstorm a feature, stress-test a design, or says "grill me".
---

# Brainstorm

Reach a closed set of decisions before anything is written. Do not write code
or documentation files.

## Before deciding

Read what already answers questions:

- `AGENTS.md` or `CLAUDE.md` at the workspace root
- `.docs/index.md`
- `.docs/architecture/architecture.md`
- related specs, rules, actors, and flows under `.docs/`
- the code the idea touches

Paths are fixed. Edit this file to change them.

If the code or docs can answer a question, inspect them instead of asking.

## Decision tree

- Walk each branch of the decision tree. Resolve dependencies before moving on.
- Challenge the idea against current architecture, conventions, and behavior.
- Separate actors (product user types) from technical roles and personas.
- Cover permissions, ownership, destructive impact, money, privacy,
  compliance, retention, and notifications when they apply.

Stop only when no material flow, rule, or boundary is open.

## Mode

The mode comes from [triage](../triage/SKILL.md#2-choose-the-mode). Without
triage, use `guided`.

### guided

Ask one question at a time. Include your recommended answer. Never close a
material decision as an assumption.

### review

Do not ask during the tree. Decide each question from code, docs, and
conventions. At the end, present every decision:

```md
1. [Question]
   Decision: [choice]
   Reason: [why]
```

Wait for the user to accept or change each decision.

### autonomous

Decide each question and continue. List the decisions in the summary so they
stay visible.

## Close

Summarize in a short list:

- goal and actors
- decided flows and rules
- out of scope
- open questions, if any remain

Continue the path from triage. Without triage, recommend
[write-spec](../write-spec/SKILL.md) for behavior changes or
[write-plan](../write-plan/SKILL.md) for technical work.
