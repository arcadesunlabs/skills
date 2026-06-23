---
name: design-feature
description: Brainstorm, grill, and write feature specs before coding — explore intent, decompose epics, stress-test designs, and produce PRDs with acceptance criteria. Use before any creative work, new features, components, product requirements, user stories, or when the user wants a spec, brainstorm, or grill me.
---

# Design Feature

**Announce at start:** "I'm using the design-feature skill."

Turn ideas into approved designs and specs through collaborative dialogue. Two entry paths — pick by user intent:

| Path           | When                                                      | How                                      |
| -------------- | --------------------------------------------------------- | ---------------------------------------- |
| **Brainstorm** | New feature, component, or behavior before implementation | Checklist below (grill is step 2)        |
| **Spec only**  | Write or refine a spec — context already clear            | [references/spec.md](references/spec.md) |

**Grill-only:** user has a plan and wants it stress-tested → run [references/grill.md](references/grill.md) alone, then continue brainstorm from step 3 or stop.

**Step 0:** Invoke [workflow](../workflow/SKILL.md) and load `skills.config.json`.

<HARD-GATE>
Do NOT invoke build-feature, write code, scaffold, or implement until design is presented and the user has approved it (brainstorm path). Spec-only skips grill when context is already settled.
</HARD-GATE>

---

## Brainstorm checklist

Complete in order:

1. **Explore project context** — files, docs, recent commits
2. **Grill** — follow [references/grill.md](references/grill.md): clarify purpose, constraints, success criteria, and domain alignment; one question at a time until shared understanding
3. **Scope sizing** — [decomposition heuristics](references/decomposition.md); if epic-sized, propose slice table and get approval
4. **Propose 2-3 approaches** — trade-offs and recommendation
5. **Present design** — scaled sections; user approval after each
6. **Write spec** — follow [references/spec.md](references/spec.md); save to `{docs.root}/<domain>/<feature>/01-spec.md`
7. **Epic tracker items** — only if epic-sized **and** `taskTracker.enabled`: create child work items (with approval) via [tracker steps](../build-feature/references/tracker.md)
8. **Spec self-review** — placeholders, contradictions, ambiguity, scope
9. **User reviews spec** — wait for approval
10. **Transition** — single slice → `build-feature` | epic → **STOP**, ask which slice first

## Epic flow

See [references/decomposition.md](references/decomposition.md) for templates. Tracker-specific steps apply only when `taskTracker.enabled`.

## After approval

| Scope        | Next step                                                       |
| ------------ | --------------------------------------------------------------- |
| Single slice | [build-feature](../build-feature/SKILL.md) path A               |
| Epic         | **STOP** — user picks a slice → build-feature path A′ per slice |

## Key principles

- One question at a time; multiple choice when possible
- YAGNI — remove unnecessary features
- Always propose 2-3 approaches before settling
- Right-size delivery — one reviewable slice per branch/PR when possible

## Examples

Filled-in product spec: [EXAMPLES.md](EXAMPLES.md).
