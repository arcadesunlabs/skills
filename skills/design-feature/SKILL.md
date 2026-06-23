---
name: design-feature
description: Brainstorm and write feature specs before coding. Use for new features, PRDs, or product design — not for stress-testing alone (use mode-grill).
---

# Design Feature

**Announce at start:** "I'm using the design-feature skill."

Turn ideas into approved designs and specs through collaborative dialogue.

| Path           | When                                           | Start at |
| -------------- | ---------------------------------------------- | -------- |
| **Brainstorm** | New feature or behavior before implementation  | Phase 0  |
| **Spec only**  | Write or refine a spec — context already clear | Phase 4  |

**Grill-only:** invoke [mode-grill](../mode-grill/SKILL.md); stop or continue from Phase 3.

Load each `references/` file **only when entering that phase**. Never pre-read all references at skill start.

**Hard gate:** Do NOT invoke build-feature, write code, scaffold, or implement until design is presented and the user has approved it (brainstorm path).

---

## Phases

Complete in order (spec-only skips 1–3):

0. **Config** — invoke [workflow](../workflow/SKILL.md); load `skills.config.json`
1. **Context** — explore files, docs, recent commits
2. **Understand** — invoke [mode-grill](../mode-grill/SKILL.md); do not assume understanding of any flow or business rule that is not clear — always question the user and refine until full closure of each point; continue to Shape when you can state what we're building, what we're not, and domain mapping — user agrees
3. **Shape** — If ≥2 epic signals apply (>8 files, ≥2 shippable slices, UI plus migration, >8 acceptance scenarios, or >1 focused session), propose a vertical-slice table for approval before the spec and never create tracker items without consent; then propose 2–3 approaches with trade-offs, present design, get approval
4. **Spec** — follow [references/spec.md](references/spec.md); save to `{docs.root}/<domain>/<feature>/01-spec.md`; self-review; wait for user approval
5. **Hand off** — if epic-sized and `taskTracker.enabled`: create child work items (with approval) via [tracker steps](../build-feature/references/tracker.md); then single slice → [build-feature](../build-feature/SKILL.md) path A | epic → **STOP**, ask which slice first

Filled-in product spec example: [references/spec-example.md](references/spec-example.md).
