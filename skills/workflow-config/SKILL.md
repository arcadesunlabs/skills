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
| `docs.root`                   | Behavior docs folder (e.g. `.docs` or `docs`)               |
| `docs.indexFile`              | Docs index path                                             |
| `docs.capabilitiesRoot`       | Cross-cutting capabilities folder (default: `capabilities`) |
| `code.appRoot`                | Main app or package root                                    |
| `code.searchRoots`            | Optional code roots to inspect when building context        |
| `workflow.implementationFlow` | Optional project-specific implementation phases             |
| `workflow.validationCommands` | Optional validation commands                                |
| `workflow.review`             | Optional review expectations                                |
| `workflow.docsFinalization`   | Optional docs finalization rule                             |

## Documentation model

Organize documentation by **user intent**, not code structure.

- Choose `<domain>` as a stable product or business area that groups related user goals (`customers`, `orders`, `payments`, `authentication`). It describes what the product is about, not where code lives.
- Choose `<use-case>` as a kebab-case verb-object goal (`create-customer`, `edit-customer`, `approve-payment`).
- Never derive documentation paths from component, package, module, route, controller, or filesystem names.
- Use `code.appRoot` and `code.searchRoots` only to discover the implementation recorded in `context.md`.
- When both code fields are absent, inspect from the workspace root.

## Derived values

Compute these from config and the agreed behavior scope:

| Symbol               | Rule                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `{docsDomain}`       | `{docs.root}/<domain>/`                                                                        |
| `{docsUseCase}`      | `{docsDomain}/<use-case>/`                                                                     |
| `{specPath}`         | `{docsUseCase}/spec.md`                                                                        |
| `{contextPath}`      | `{docsUseCase}/context.md`                                                                     |
| `{planPath}`         | `{docsUseCase}/plan.md`                                                                        |
| `{handoffPath}`      | `{docsUseCase}/handoff.md`                                                                     |
| `{docsCapability}`   | `{docs.root}/{capabilitiesRoot}/<capability>/` (default `{capabilitiesRoot}` = `capabilities`) |
| `{architecturePath}` | `{docs.root}/architecture/architecture.md`                                                     |

When `capabilitiesRoot` is absent from config, use `capabilities`.

## Recommended project docs

Advise the user to maintain **`{architecturePath}`** — a living overview of stack, layers, module boundaries, data flow, workflow details, and architectural decisions. Workflow skills read it during brainstorm and planning when the file exists.

Suggested layout under `{docs.root}`:

```text
{docs.root}/
├── index.md                          # docs index (docs.indexFile)
├── architecture/
│   └── architecture.md               # project architecture reference
├── capabilities/<capability>/        # cross-cutting domain rules
│   ├── rules.md                      # canonical rules (permanent)
│   └── scenarios.md                  # shared acceptance scenarios (optional)
├── <domain>/                         # product or business domain
│   └── <use-case>/                   # user goal in verb-object form
│       ├── spec.md                   # behavior and acceptance criteria
│       └── context.md                # implementation map
└── codebase/<initiative>/            # technical work without behavior changes
    └── context.md
```

### Documentation scope decision tree

| Situation                                                 | Doc type             | Where to write                                          |
| --------------------------------------------------------- | -------------------- | ------------------------------------------------------- |
| User seeks an observable outcome                          | **Use case**         | `{specPath}` + `{contextPath}`                          |
| Rule or invariant is shared by multiple use cases         | **Capability**       | `{docsCapability}/rules.md` (+ optional `scenarios.md`) |
| Refactor or technical initiative changes no user behavior | **Codebase context** | `{docs.root}/codebase/<initiative>/context.md`          |
| Architecture affects the whole project                    | **Architecture**     | `{architecturePath}`                                    |

For each use case, identify the user goal and business domain before inspecting code. `spec.md` must remain useful without code paths. `context.md` links back to `spec.md` and maps the current routes, components, APIs, schemas, persistence, tests, data flow, decisions, and dependencies.

Create separate use cases for distinct user goals even when they share one implementation component. Put genuinely shared rules in a capability document and link to it instead of duplicating rules.

If `{architecturePath}` is missing during setup, remind the user to create it (even a short draft) before large features or refactors.

Use `workflow.implementationFlow` in `skills.config.json` for the short machine-readable flow, and `{architecturePath}` / `project.conventionsFile` for detailed rules, examples, and rationale.

## Interactive setup (no file yet)

If the user has not run `npm run configure`, gather at minimum:

1. Project name and conventions file
2. Docs root, index file, and capabilities root
3. Optional: app root and code search roots
4. Optional: implementation flow, validation commands, review rule, and docs finalization rule
5. Remind the user to add `{docs.root}/architecture/architecture.md` when absent

Write `skills.config.json` to the workspace root, then continue.

## Skills that depend on this config

- [write-plan](../write-plan/SKILL.md) — docs paths
- [write-feature-spec](../write-feature-spec/SKILL.md) — spec location
- [write-handoff](../write-handoff/SKILL.md) — handoff paths
- [mode-brainstorm](../mode-brainstorm/SKILL.md) — brainstorm and spec alignment

**Always load config before invoking those skills** (or ensure they load it in step 1).
