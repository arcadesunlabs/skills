---
name: design-feature
description: Brainstorm, grill, and write feature specs before coding — explore intent, decompose epics, stress-test designs, and produce PRDs with acceptance criteria. Use before any creative work, new features, components, product requirements, user stories, or when the user wants a spec, brainstorm, or grill me.
---

# Design Feature

**Announce at start:** "I'm using the design-feature skill."

Turn ideas into approved designs and specs through collaborative dialogue. Three modes — pick by user intent:

| Mode        | When                                                         | Reference                                      |
| ----------- | ------------------------------------------------------------ | ---------------------------------------------- |
| **Brainstorm** | New feature, component, or behavior before implementation | This skill (checklist below)                   |
| **Grill**      | Stress-test an existing plan or design                      | [references/grill.md](references/grill.md)   |
| **Spec only**  | Write or refine a spec without full brainstorm             | [references/spec.md](references/spec.md)       |

**Step 0:** Invoke [workflow](../workflow/SKILL.md) and load `skills.config.json`.

<HARD-GATE>
Do NOT invoke build-feature, write code, scaffold, or implement until design is presented and the user has approved it (brainstorm mode). Grill and spec-only modes follow their own references.
</HARD-GATE>

---

## Brainstorm checklist

Complete in order:

1. **Explore project context** — files, docs, recent commits
2. **Ask clarifying questions** — one at a time; purpose, constraints, success criteria
3. **Domain alignment** — run [grill mode](references/grill.md) to stress-test terminology against the domain model
4. **Scope sizing** — [decomposition heuristics](references/decomposition.md); if epic-sized, propose slice table and get approval
5. **Propose 2-3 approaches** — trade-offs and recommendation
6. **Present design** — scaled sections; user approval after each
7. **Write spec** — follow [references/spec.md](references/spec.md); save to `{docs.root}/<domain>/<feature>/01-spec.md`
8. **Epic artifacts** — if epic-sized and `taskTracker.enabled`: create child cards (with approval) via [tracker steps](../build-feature/references/tracker.md)
9. **Spec self-review** — placeholders, contradictions, ambiguity, scope
10. **User reviews spec** — wait for approval
11. **Transition** — single slice → `build-feature` | epic → **STOP**, ask which child slice first

## Epic flow

See [references/decomposition.md](references/decomposition.md) for templates, tracker conventions, and child-card descriptions.

## After approval

| Scope        | Next step                                                                 |
| ------------ | ------------------------------------------------------------------------- |
| Single slice | [build-feature](../build-feature/SKILL.md) path A                         |
| Epic         | **STOP** — user picks child `{cardKey}` → build-feature path A′ per slice |

## Key principles

- One question at a time; multiple choice when possible
- YAGNI — remove unnecessary features
- Always propose 2-3 approaches before settling
- Right-size delivery — one card/branch/PR per reviewable slice

## Examples

Filled-in product spec: [EXAMPLES.md](EXAMPLES.md).
