---
name: workflow-config
description: Load or create per-user workflow settings (docs paths, project conventions). Use before write-plan, mode-brainstorm, write-feature-spec, write-handoff, or when skills.config.json is missing or unclear.
---

# Workflow Config

**Announce at start:** "I'm using the workflow-config skill."

Every workflow skill in this repo reads settings from **`skills.config.json`** at the **workspace root** (the project where you are working, not necessarily the skills repo).

## First step

1. Look for `skills.config.json` in the workspace root.
2. If **missing**, ask the user to run `npx github:arcadesunlabs/skills skills-configure <project-path>` **or** collect the values below with `AskQuestion` / conversation and write the file.
3. If **present**, read it and use its values for the rest of the session.

Example file: [skills.config.example.json](../../../skills.config.example.json) (in the skills repo).

## Config fields

| Field                         | Used for                                                    |
| ----------------------------- | ----------------------------------------------------------- |
| `project.name`                | Human-readable project label in plans and handoffs          |
| `project.conventionsFile`     | Repo rules file (e.g. `CLAUDE.md`)                          |
| `docs.root`                   | Feature docs folder (e.g. `.docs` or `docs`)                |
| `docs.indexFile`              | Docs index path                                             |
| `docs.domainMirror`           | Code path that doc domains mirror                           |
| `docs.capabilitiesRoot`       | Cross-cutting capabilities folder (default: `capabilities`) |
| `docs.touchpointsRoot`        | Feature touchpoints folder (default: `features`)            |
| `code.appRoot`                | App root for file paths in plans                            |
| `workflow.implementationFlow` | Optional project-specific implementation phases             |
| `workflow.validationCommands` | Optional validation commands                                |
| `workflow.review`             | Optional review expectations                                |
| `workflow.docsFinalization`   | Optional docs finalization rule                             |

## Derived values

Compute these from config — do not hardcode project-specific paths:

| Symbol               | Rule                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `{docsFeature}`      | `{docs.root}/<domain>/<feature>/`                                                              |
| `{docsCapability}`   | `{docs.root}/{capabilitiesRoot}/<capability>/` (default `{capabilitiesRoot}` = `capabilities`) |
| `{docsTouchpoint}`   | `{docs.root}/{touchpointsRoot}/<feature>/spec.md` (default `{touchpointsRoot}` = `features`)   |
| `{handoffPath}`      | `{docs.root}/<domain>/<feature>/handoff.md`                                                    |
| `{architecturePath}` | `{docs.root}/codebase/architecture.md`                                                         |

When `capabilitiesRoot` or `touchpointsRoot` is absent from config, use the defaults above.

## Recommended project docs

Advise the user to maintain **`{architecturePath}`** — a living overview of stack, layers, module boundaries, data flow, workflow details, and architectural decisions. Workflow skills read it during brainstorm and planning when the file exists.

Suggested layout under `{docs.root}`:

```text
{docs.root}/
├── index.md                          # docs index (docs.indexFile)
├── codebase/
│   └── architecture.md               # project architecture reference
├── capabilities/<capability>/        # cross-cutting domain rules
│   ├── spec.md                       # canonical rules (permanent)
│   └── scenarios.md                  # shared acceptance scenarios (optional)
├── features/<feature>/               # touchpoints — how a surface consumes a capability
│   └── spec.md
└── <domain>/<feature>/               # vertical features
    ├── 01-spec.md
    └── 02-context.md
```

### Documentation scope decision tree

| Situation                                                     | Doc type                     | Where to write                                                                     |
| ------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| Single product flow or screen with its own identity           | **Vertical feature**         | `{docsFeature}/01-spec.md` + `02-context.md`                                       |
| Domain rule or invariant consumed by 2+ surfaces              | **Capability** + touchpoints | `{docsCapability}/spec.md` (+ `scenarios.md`); then `{docsTouchpoint}` per surface |
| Change only on one surface that already consumes a capability | **Touchpoint only**          | `{docsTouchpoint}`; update `{docsCapability}/spec.md` if the shared rule changed   |

If `{architecturePath}` is missing during setup, remind the user to create it (even a short draft) before large features or refactors.

Use `workflow.implementationFlow` in `skills.config.json` for the short machine-readable flow, and `{architecturePath}` / `project.conventionsFile` for detailed rules, examples, and rationale.

## Interactive setup (no file yet)

If the user has not run `npm run configure`, gather at minimum:

1. Project name and conventions file
2. Docs root, domain mirror path, capabilities root, and touchpoints root
3. Optional: app root
4. Optional: implementation flow, validation commands, review rule, and docs finalization rule
5. Remind the user to add `{docs.root}/codebase/architecture.md` when absent

Write `skills.config.json` to the workspace root, then continue.

## Skills that depend on this config

- [write-plan](../write-plan/SKILL.md) — docs paths
- [write-feature-spec](../write-feature-spec/SKILL.md) — spec location
- [write-handoff](../write-handoff/SKILL.md) — handoff paths
- [mode-brainstorm](../mode-brainstorm/SKILL.md) — brainstorm and spec alignment

**Always load config before invoking those skills** (or ensure they load it in step 1).
