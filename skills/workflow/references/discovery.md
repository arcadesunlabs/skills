# Workflow discovery

Use when `skills.config.json` is missing `implementation.phases` or the user wants to redefine their delivery flow.

## Goal

Help the user map **idea → approved design → plan → implementation → ship** in terms that match _their_ stack and team — not a fixed frontend checklist.

## Conversation flow

Run in order. One topic at a time; use `AskQuestion` when choices are clear.

### 1 — Outcomes before code

Ask what must exist before implementation starts. Typical answers:

- Approved spec or ticket
- Design review
- API contract
- Nothing — small fixes go straight to code

Record only what applies; do not invent steps.

### 2 — Implementation slices

Ask: _"When you implement a non-trivial feature, what ordered steps do you usually follow?"_

Offer presets from [phase-presets](../../../scripts/phase-presets.mjs) (read labels via `implementation.preset`):

| Preset              | Best for                                    |
| ------------------- | ------------------------------------------- |
| `minimal`           | Small teams, scripts, backends, quick fixes |
| `frontend-ui-first` | UI-heavy apps with layered frontend         |
| `api-first`         | Contract-first or backend-led features      |
| `custom`            | User describes their own ordered list       |

Let the user pick a preset **or** dictate phases in their own words. Translate their list into `implementation.phases` entries: `{ name, notes?, optional?, alwaysLast? }`.

### 3 — Optional and final steps

Clarify:

- Which phases are often skipped (mark `optional: true`)
- Which step must always run last (usually **Finalize docs** with `alwaysLast: true` → `close-workflow`)

### 4 — Task tracker (optional)

Only if they use cards/issues:

- Provider (`trello`, `jira`, `linear`, `github`, or `none`)
- Whether branch name follows task ID

If they do not use a tracker, set `taskTracker.provider` to `none` and `enabled` to `false`. **Do not** ask about Trello lists or card keys unless they chose that provider.

### 5 — Write config

Update or create `skills.config.json` at the workspace root with `project`, `docs`, `implementation`, `taskTracker`, and `code` as needed.

Present a short summary table of `implementation.phases` and ask for confirmation before saving.

## Phase entry rules

| Field        | Meaning                                                    |
| ------------ | ---------------------------------------------------------- |
| `name`       | Phase title in plans and `03-plan.md` checklists           |
| `notes`      | Hint for the agent during that phase                       |
| `optional`   | Skip when irrelevant; document skip reason in `03-plan.md` |
| `alwaysLast` | Defer until all other phases complete (e.g. finalize docs) |

At least one phase is required. Presets ship with **Finalize docs** as `alwaysLast`.

## Re-discovery

User can re-run:

```bash
npx github:arcadesunlabs/skills skills-configure .
```

Or ask the agent to run workflow discovery and update only `implementation` in the existing config.
