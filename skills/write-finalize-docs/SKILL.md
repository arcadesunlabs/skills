---
name: write-finalize-docs
description: Finalize feature documentation after implementation — consolidate docs/<domain>/<feature>/ to only 01-spec.md and 02-context.md, merge transient artifacts, delete 03-plan.md, 04-tasks.md, and handoff.md. Use when implementation is complete, before merge, or when the user asks to finalize or clean up feature docs.
---

# Finalize Feature Docs

**Announce at start:** "I'm using the write-finalize-docs skill."

**When:** Always the **last documentation step** after implementation is complete (tests pass, code review done if applicable). Run before merge or when closing a `{cardKey}` slice.

**Goal:** `{docs.root}/<domain>/<feature>/` contains **only**:

```
{docs.root}/<domain>/<feature>/
├── 01-spec.md   # Product spec — no code snippets
└── 02-context.md   # Context — paths, APIs, code OK
```

All other files in that folder (`03-plan.md`, `04-tasks.md`, `handoff.md`, drafts) are **removed** after their useful content is merged.

---

## Prerequisites

- Load [workflow-config](../workflow-config/SKILL.md)
- Implementation matches (or intentionally updates) the spec
- `code.lintCommand` and relevant tests pass (from config)
- You know the feature folder path (`{docs.root}/<domain>/<feature>/`)

If the folder does not exist but the work was tracked, create the folder and both files from scratch using git diff + [write-feature-spec](../write-feature-spec/SKILL.md) / [write-plan REFERENCE](../write-plan/REFERENCE.md#02-contextmd-sections-during-implementation).

---

## Process

### Step 1 — Inventory

List every file under `{docs.root}/<domain>/<feature>/`:

| File            | Action                                                        |
| --------------- | ------------------------------------------------------------- |
| `01-spec.md`    | **Update** — shipped product truth                            |
| `02-context.md` | **Update** — final context reference                          |
| `03-plan.md`    | **Merge then delete**                                         |
| `04-tasks.md`   | **Merge then delete** (epics)                                 |
| `handoff.md`    | **Merge then delete**                                         |
| Anything else   | **Merge if valuable, then delete** — do not leave stray files |

Read all files before editing. Read the implementation diff if `02-context.md` is stale.

### Step 2 — Update `01-spec.md`

Author via [write-feature-spec](../write-feature-spec/SKILL.md) rules. Reflect **what shipped**, not what was planned.

| Do                                                         | Don't                                           |
| ---------------------------------------------------------- | ----------------------------------------------- |
| Present tense / shipped behavior                           | "Proposed", "will", "planned"                   |
| Scope and out of scope as delivered                        | Duplicate file paths or component names         |
| Testable acceptance criteria (checked `[x]` if all met)    | Copy implementation checklist from `03-plan.md` |
| Resolved open questions removed or folded into assumptions | Paste handoff "next steps"                      |
| Product-only language                                      | Code snippets, TS/JSX, JSON, paths              |

If implementation **changed** scope vs original spec, update scope/out of scope explicitly — do not leave contradictions.

### Step 3 — Update `02-context.md`

Single context reference for the next agent or developer. Merge from transient docs:

| Source        | Merge into `02-context.md`                                                                  |
| ------------- | ------------------------------------------------------------------------------------------- |
| `03-plan.md`  | Final file list, architecture decisions, skipped phases worth noting                        |
| `04-tasks.md` | Slice boundaries / dependencies (epics only) — under `## Epic slices` or remove if obsolete |
| `handoff.md`  | **Do not** copy next steps; merge only factual status, PR link, key files if missing        |
| Code / diff   | Components, hooks, queries, routes, i18n keys, localStorage keys, tests                     |

Use this skeleton (adapt sections; omit empty):

````markdown
# {Feature Name} — Context

## Status

- Shipped in {cardKey} / merged {PR link if known}
- Entry point: {page or trigger}
- Route: {path if applicable}

## Architecture

{Data flow, layers touched — brief}

## Key files

| Role | Path |
| ---- | ---- |
| …    | …    |

## Behavior notes

{Non-obvious rules, edge cases, persistence keys}

## Validation

```bash
{code.lintCommand from config}
{code.testCommand from config}
```
````

- [ ] {AC-derived manual checks}

```

Code snippets and paths **belong here**, never in `01-spec.md`.

### Step 4 — Delete transient files

After merge, delete:

- `03-plan.md`
- `04-tasks.md`
- `handoff.md`
- Any other file in the feature folder except `01-spec.md` and `02-context.md`

Use git delete so the removal is tracked.

### Step 5 — Self-review

- [ ] Folder contains **exactly** two markdown files
- [ ] `01-spec.md` has no code snippets or file paths
- [ ] `02-context.md` matches current code
- [ ] No TBD/TODO unless genuinely future work (prefer out of scope in spec)
- [ ] No duplicated paragraphs between spec and tech
- [ ] Epic `04-tasks` slice table not left orphaned elsewhere

### Step 6 — Commit

Commit docs separately or with the implementation PR — follow user preference. Suggested message:

```

Finalize docs for {feature}: keep 01-spec and 02-context only.

```

Tell the user:

> Docs finalized at `{docs.root}/<domain>/<feature>/` — only `01-spec.md` and `02-context.md` remain.

---

## Epics (`04-tasks.md`)

When multiple slices share one epic folder:

- **Parent epic folder** (`{docs.root}/<domain>/<epic>/`): keep epic-level `01-spec.md`; `02-context.md` covers shared architecture; add `## Epic slices` with delivered slices and `{cardKey}` entries.
- **Child slice folder** (if separate, e.g. `history-collapsible/`): finalize **that** folder independently when the slice merges.
- Remove `04-tasks.md` from the epic folder once all slices are delivered or the table is captured in `02-context.md`.

---

## Skip conditions

Skip only for **trivial** changes (typo, one-line fix) with no feature folder — do not create empty doc folders.

If user explicitly says not to touch docs, stop and confirm.

---

## Integration

| Skill | Relationship |
|-------|----------------|
| `write-plan` | Invokes this skill in **Completion** (mandatory last step) |
| `write-feature-spec` | Defines `01-spec.md` structure |
| `write-handoff` | Ephemeral — content merged then `handoff.md` deleted here |
| `mode-brainstorm` | Creates transient artifacts; this skill cleans them up after delivery |
```
