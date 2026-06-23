---
name: write-skill
description: Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill.
---

# Writing Skills

## Process

1. **Gather requirements** - ask user about:
   - What task/domain does the skill cover?
   - What specific use cases should it handle?
   - Does an existing skill already cover this (especially a `build-feature` phase or a `build-*` / `add-*` skill)?
   - Does it need executable scripts or just instructions?
   - Any reference materials to include?

2. **Draft the skill** - create:
   - SKILL.md with concise instructions
   - Additional reference files if content exceeds 500 lines
   - Utility scripts if deterministic operations needed

3. **Review with user** - present draft and ask:
   - Does this cover your use cases?
   - Anything missing or unclear?
   - Should any section be more/less detailed?

## Naming convention

The skill name (directory name **and** the `name:` frontmatter, which must match exactly) is **always prefix-first**, kebab-case. Every skill leads with a category token so that sorting groups related skills together and the prefix alone signals intent.

There are two families of prefix:

**1. Verb prefixes** — for skills that produce a concrete artifact or perform a discrete action. Pick the verb by intent:

| Prefix       | Use for                                                | Examples                                                                                               |
| ------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `build-*`    | Implement/compose a product or code artifact           | `build-component`, `build-query-module`, `build-tests`                                                 |
| `add-*`      | Add a punctual registration, config, or capability     | `add-package`, `add-database-migration`, `add-localization`, `add-analytics-event`, `add-env-variable` |
| `create-*`   | Generate a specific technical artifact                 | `create-table`, `create-local-data-source`                                                             |
| `write-*`    | Produce a written document or document-driven workflow | `write-skill` (meta); prefer `design-feature` / `close-workflow` for delivery docs |
| `review-*`   | Review/evaluate quality                                | `review-mobile-code`, `review-design`                                                                  |
| `diagnose-*` | Investigate a problem                                  | `diagnose-issue`                                                                                       |

**2. Category prefixes** — for skills that are not a single artifact-producing action. These name a _kind_ of skill, with the rest of the name identifying the specific one:

| Prefix   | Use for                                                       | Examples                                    |
| -------- | ------------------------------------------------------------- | ------------------------------------------- |
| `flow-*` | Closed, multi-step operational pipeline                       | `flow-jira-git-pr`                          |
| `mode-*` | Interactive reasoning mode or methodology (no fixed artifact) | Grill mode inside `design-feature`, `mode-tdd` |

**Principles:**

- Lead with the right prefix; for verb-prefixed skills prefer **action + object** (`build-component`, not `screen-builder`).
- Do not use a technology/library as the primary name (`build-query-module`, not `react-hook-scaffold`).
- No gerunds (`write-plan`, not `writing-plans`; `mode-brainstorm`, not `brainstorming`).
- No humor or slang in the canonical name (`mode-grill`, not `grill-me`).
- Use plural only when the skill genuinely covers more than one inseparable artifact.
- Reach for a category prefix (`flow-`/`mode-`) only when no single verb captures the skill — a pipeline or a dialogue mode. If one verb fits, prefer the verb prefix.
- Do **not** create `plan-*` or `execute-*` skills — planning and implementation live in `build-feature`.

## Skill ecosystem

Before drafting, check the new skill does not overlap an existing one.

| Layer            | Examples                                                             | Role                                                   |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| Config           | [workflow](../workflow/SKILL.md), `skills.config.json`               | Per-user tracker, docs paths, branch prefix            |
| Repo rules       | `project.conventionsFile` from config                                | Stack, commands, project conventions                   |
| Design           | `design-feature`                                                     | Brainstorm, grill, spec before planning                |
| Plan + implement | `build-feature`                                                      | Phased implementation; ends with `close-workflow`      |
| Docs (delivery)  | `close-workflow`                                                     | Folder → only `01-spec.md` + `02-context.md`           |
| Review           | agent `code-reviewer`                                                | Quality gate before merge                              |

**Orchestration vs atomic:** `build-feature` is the main implementation orchestrator. New skills should be **atomic** (one clear job). If the gap is a new phase or step in the plan-and-implement flow, extend `build-feature` instead of creating a parallel orchestrator.

**Invocation flow:**

```
workflow (load skills.config.json)
build-feature (path B, when tracked — includes tracker steps)
design-feature → build-feature (path A, single slice)
design-feature → tracker children + parent links → STOP (epic)
  → user picks child {cardKey} → build-feature (slice only, path A′)
build-feature → close-workflow (mandatory last — only 01-spec + 02-context remain)
build-feature phase 11 → write-skill (if a recurring gap justifies a new skill)
```

## Skill Structure

All skill content (`SKILL.md`, `REFERENCE.md`, bundled docs) must be written in **English**, regardless of chat language or app locale.

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed docs (if needed)
├── EXAMPLES.md        # Usage examples (if needed)
└── scripts/           # Utility scripts (if needed)
    └── helper.js
```

## SKILL.md Template

```md
---
name: skill-name
description: Brief description of capability. Use when [specific triggers].
---

# Skill Name

## Quick start

[Minimal working example]

## Workflows

[Step-by-step processes with checklists for complex tasks]

## Advanced features

[Link to separate files: See [REFERENCE.md](REFERENCE.md)]
```

## Description Requirements

The description is **the only thing your agent sees** when deciding which skill to load. It's surfaced in the system prompt alongside all other installed skills. Your agent reads these descriptions and picks the relevant skill based on the user's request.

**Goal**: Give your agent just enough info to know:

1. What capability this skill provides
2. When/why to trigger it (specific keywords, contexts, file types)

**Format**:

- Max 1024 chars — shorter is better; aim for 1–2 sentences
- Keep on a single line — do not use YAML multiline syntax (`description: >`)
- First sentence: what it does
- Second sentence: "Use when [specific triggers]"
- Do not add `tags:` or `trigger:` fields — they are not read by Claude Code and have no effect on skill selection
- Do not dump keyword lists ("Trigger for: x, y, z") — the description itself is the signal

**Good example**:

```
Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.
```

**Bad example**:

```
Helps with documents.
```

The bad example gives your agent no way to distinguish this from other document skills.

## When to Add Scripts

Add utility scripts when:

- Operation is deterministic (validation, formatting)
- Same code would be generated repeatedly
- Errors need explicit handling

Scripts save tokens and improve reliability vs generated code.

## When to Split Files

Split into separate files when:

- SKILL.md exceeds 200 lines (see size guide below)
- Content has distinct domains (finance vs sales schemas)
- Advanced features are rarely needed

### Size guide

| Lines   | Status         | Typical fit                                                                        |
| ------- | -------------- | ---------------------------------------------------------------------------------- |
| < 100   | Ideal          | Atomic operations (`add-package`, `add-localization`)                              |
| 100–200 | Sweet spot     | Workflows with checklist + tables (`build-feature`, `workflow`)                  |
| 200–300 | Acceptable     | Skills with several essential sections; consider moving examples to `EXAMPLES.md`  |
| 300–500 | Reconsider     | Likely has material that belongs in `references/` (see `build-feature/references/plan.md`) |
| > 500   | Split required | Always extract reference content                                                   |

200 lines is the practical soft cap. Above it, ask: "does this all need to be in SKILL.md, or can part go to REFERENCE.md?"

## Review Checklist

After drafting, verify:

- [ ] Written in English (titles, instructions, checklists, tables)
- [ ] Name follows the naming convention (action + object, correct verb prefix, no gerund/tech name) and `name:` matches the directory
- [ ] Description includes triggers ("Use when...")
- [ ] SKILL.md under 200 lines (see size guide)
- [ ] Does not duplicate `build-feature` or an existing `build-*` / `add-*` / `review-*` skill
- [ ] If orchestration: justified — prefer extending `build-feature` instead
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Concrete examples included
- [ ] References one level deep
