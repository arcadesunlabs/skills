---
name: close-workflow
description: Hand off work between sessions or finalize feature docs after implementation — write handoff.md, merge transient artifacts, keep only 01-spec.md and 02-context.md. Use when switching agents, ending a session, implementation is complete, before merge, or when the user asks to finalize or clean up docs.
---

# Close Workflow

**Announce at start:** "I'm using the close-workflow skill."

Two modes — pick by user intent:

| Mode        | When                                              |
| ----------- | ------------------------------------------------- |
| **Handoff** | Switching agents or ending a long session         |
| **Finalize** | Implementation complete, before merge, or cleanup |

**Step 0:** Invoke [workflow](../workflow/SKILL.md) and read `skills.config.json`.

---

## Handoff mode

Write a handoff document so a fresh agent can continue.

### Where to save

**Always in the repo** under `{docs.root}/` — never OS temp or outside workspace.

| Work context            | Path                                      |
| ----------------------- | ----------------------------------------- |
| Feature with subfolder  | `{docs.root}/<domain>/<feature>/handoff.md` |
| Flat domain             | `{docs.root}/<domain>/handoff.md`       |
| Architecture / refactors| `{docs.root}/codebase/handoff.md`         |
| Integrations            | `{docs.root}/integrations/handoff.md`   |
| Dev setup / CI          | `{docs.root}/setup/handoff.md`          |

Use `handoff.md` (not numbered `01`–`04`). Replace existing handoff in the same folder when updating.

### What to include

- Current objective and `{cardKey}` if `taskTracker.enabled`
- What was done (commits, branches, key files)
- What is in progress or blocked
- Explicit next steps for the receiving agent
- **Suggested skills** — which to invoke next and why
- Links to artifacts — do not duplicate spec/plan content

### Rules

- Redact secrets (API keys, passwords, PII)
- Reference artifacts by path or URL instead of copying them
- Run Prettier on the handoff file if the project uses it

---

## Finalize mode

**When:** Last documentation step after implementation (tests pass, review done). Run before merge or closing a `{cardKey}` slice.

**Goal:** `{docs.root}/<domain>/<feature>/` contains **only** `01-spec.md` and `02-context.md`.

### Prerequisites

- Implementation matches (or intentionally updates) the spec
- `code.lintCommand` and relevant tests pass when configured
- Known feature folder path

If folder missing but work was tracked, create both files from git diff + [design-feature spec](../design-feature/references/spec.md).

### Process

1. **Inventory** — list all files; merge then delete `03-plan.md`, `04-tasks.md`, `handoff.md`, drafts
2. **Update `01-spec.md`** — shipped product truth, present tense, no code snippets — see [design-feature spec rules](../design-feature/references/spec.md)
3. **Update `02-context.md`** — merge file lists, architecture, validation commands from plan/handoff/code
4. **Delete transient files** — git delete so removal is tracked
5. **Self-review** — exactly two markdown files; no TBD unless genuine follow-up
6. **Commit** — e.g. `Finalize docs for {feature}: keep 01-spec and 02-context only.`

Detailed checklists: [references/finalize.md](references/finalize.md).

### Epics

Parent epic folder keeps epic-level `01-spec.md`; add `## Epic slices` to `02-context.md` when multiple slices share a folder. Finalize child slice folders independently when each merges.

### Skip

Trivial one-line fixes with no feature folder. Confirm with user if they say not to touch docs.

---

## Integration

| Skill           | Relationship                              |
| --------------- | ----------------------------------------- |
| `build-feature` | Invokes finalize mode on completion       |
| `design-feature`| Creates transient `04-tasks.md` at epic time |
| `workflow`      | Supplies paths and validation commands    |
