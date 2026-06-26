---
name: workflow-config
description: Load or create per-user workflow settings (docs paths, project conventions). Use before write-plan, mode-brainstorm, write-feature-spec, write-handoff, or when skills.config.json is missing or unclear.
---

# Workflow Config

**Announce at start:** "I'm using the workflow-config skill."

Every workflow skill in this repo reads settings from **`skills.config.json`** at the **workspace root** (the project where you are working, not necessarily the skills repo).

## First step

1. Look for `skills.config.json` in the workspace root.
2. If **missing**, ask the user to run `npm run configure` in that project **or** collect the values below with `AskQuestion` / conversation and write the file.
3. If **present**, read it and use its values for the rest of the session.

Example file: [skills.config.example.json](../../../skills.config.example.json) (in the skills repo).

## Config fields

| Field                     | Used for                                           |
| ------------------------- | -------------------------------------------------- |
| `project.name`            | Human-readable project label in plans and handoffs |
| `project.conventionsFile` | Repo rules file (e.g. `CLAUDE.md`)                 |
| `docs.root`               | Feature docs folder (e.g. `.docs` or `docs`)       |
| `docs.indexFile`          | Docs index path                                    |
| `docs.domainMirror`       | Code path that doc domains mirror                  |
| `code.appRoot`            | App root for file paths in plans                   |

## Derived values

Compute these from config — do not hardcode project-specific paths:

| Symbol          | Rule                                        |
| --------------- | ------------------------------------------- |
| `{docsFeature}`    | `{docs.root}/<domain>/<feature>/`           |
| `{handoffPath}`    | `{docs.root}/<domain>/<feature>/handoff.md` |
| `{architecturePath}` | `{docs.root}/codebase/architecture.md`    |

## Recommended project docs

Advise the user to maintain **`{architecturePath}`** — a living overview of stack, layers, module boundaries, data flow, and architectural decisions. Workflow skills read it during brainstorm and planning when the file exists.

Suggested layout under `{docs.root}`:

```text
{docs.root}/
├── index.md              # docs index (docs.indexFile)
├── codebase/
│   └── architecture.md   # project architecture reference
└── <domain>/<feature>/   # per-feature specs and context
```

If `{architecturePath}` is missing during setup, remind the user to create it (even a short draft) before large features or refactors.

## Interactive setup (no file yet)

If the user has not run `npm run configure`, gather at minimum:

1. Project name and conventions file
2. Docs root and domain mirror path
3. Optional: app root
4. Remind the user to add `{docs.root}/codebase/architecture.md` when absent

Write `skills.config.json` to the workspace root, then continue.

## Skills that depend on this config

- [write-plan](../write-plan/SKILL.md) — docs paths
- [write-feature-spec](../write-feature-spec/SKILL.md) — spec location
- [write-handoff](../write-handoff/SKILL.md) — handoff paths
- [mode-brainstorm](../mode-brainstorm/SKILL.md) — brainstorm and spec alignment

**Always load config before invoking those skills** (or ensure they load it in step 1).
