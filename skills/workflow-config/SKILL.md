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
| `docs.indexFile`              | Canonical docs navigation, taxonomy, and conventions file   |
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
- Choose `<actor>` as a kebab-case product user type with distinct goals, responsibilities, or boundaries (`administrator`, `operator`, `sales-manager`). An actor is not a code role or a research persona.
- Never derive documentation paths from component, package, module, route, controller, or filesystem names.
- Use `code.appRoot` and `code.searchRoots` only to discover implementation recorded in `<use-case>.context.md` or a codebase initiative's `context.md`.
- When both code fields are absent, inspect from the workspace root.

## Documentation index contract

`docs.indexFile` is a workspace-relative path to the canonical entry point for project documentation. It must remain inside the workspace. Read it immediately after `skills.config.json`, before choosing documentation scope or paths. It should help humans and agents navigate the docs without scanning the entire tree.

Keep the index short and navigational. It should:

- Link architecture, actor catalog, domains, use cases, capabilities, integrations, setup guides, and other important entry points.
- State project-specific documentation naming or organization rules that extend this skill.
- Point to canonical documents instead of duplicating their architecture, behavior, rules, or implementation details.
- Be updated when entry points are added, moved, renamed, or removed.

If `docs.indexFile` is missing during setup, create it. The configuration helper creates this starter automatically without overwriting an existing index:

```md
# <Project> Documentation

Canonical entry point for project documentation.

## Start Here

Add links to architecture, actors, and other existing documentation entry points.

## Documentation Map

- `{docs.root}/actors/` — product user types and boundaries
- `{docs.root}/{docs.capabilitiesRoot}/` — rules shared by multiple use cases
- `{docs.root}/<domain>/<verb-object>/` — behavior specs and implementation context
- `{docs.root}/codebase/<initiative>/` — technical work without behavior changes

## Conventions

- Organize behavior by user intent, not code structure.
- Name use cases as kebab-case verb-object goals.
- Keep this index navigational; link canonical details.
```

## Derived values

Compute these from config and the agreed behavior scope:

| Symbol               | Rule                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `{docsIndex}`        | Value of `docs.indexFile`                                                                      |
| `{docsDomain}`       | `{docs.root}/<domain>/`                                                                        |
| `{docsUseCase}`      | `{docsDomain}/<use-case>/`                                                                     |
| `{docsActors}`       | `{docs.root}/actors/`                                                                          |
| `{docsActor}`        | `{docsActors}/<actor>.md`                                                                      |
| `{specPath}`         | `{docsUseCase}/<use-case>.spec.md`                                                             |
| `{contextPath}`      | `{docsUseCase}/<use-case>.context.md`                                                          |
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
├── index.md                          # canonical navigation and conventions (docs.indexFile)
├── architecture/
│   └── architecture.md               # project architecture reference
├── actors/
│   ├── actors.index.md                # actor catalog
│   └── <actor>.md                     # goals, responsibilities, and boundaries
├── capabilities/<capability>/        # cross-cutting domain rules
│   ├── <capability>.rules.md         # canonical rules (permanent)
│   └── <capability>.scenarios.md     # shared acceptance scenarios (optional)
├── <domain>/                         # product or business domain
│   └── <use-case>/                   # user goal in verb-object form
│       ├── <use-case>.spec.md        # behavior and acceptance criteria
│       └── <use-case>.context.md     # implementation map
└── codebase/<initiative>/            # technical work without behavior changes
    └── context.md
```

### Documentation scope decision tree

| Situation                                                 | Doc type             | Where to write                                                                    |
| --------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------- |
| User seeks an observable outcome                          | **Use case**         | `{specPath}` + `{contextPath}`                                                    |
| User type has distinct goals, responsibilities, or limits | **Actor**            | `{docsActor}`                                                                     |
| Rule or invariant is shared by multiple use cases         | **Capability**       | `{docsCapability}/<capability>.rules.md` (+ optional `<capability>.scenarios.md`) |
| Refactor or technical initiative changes no user behavior | **Codebase context** | `{docs.root}/codebase/<initiative>/context.md`                                    |
| Architecture affects the whole project                    | **Architecture**     | `{architecturePath}`                                                              |

For each use case, identify the user goal, business domain, and affected actors before inspecting code. `<use-case>.spec.md` must remain useful without code paths. `<use-case>.context.md` links back to the spec and maps the current routes, components, APIs, schemas, persistence, tests, data flow, decisions, and dependencies. Repeating the use-case name makes Obsidian Graph View nodes, global search results, and exported files descriptive.

When old use-case `spec.md` or `context.md` files exist, rename them and update Markdown links before writing new artifacts. Never create the new filenames beside stale canonical files.

Create separate use cases for distinct user goals even when they share one implementation component. Put genuinely shared rules in a capability document and link to it instead of duplicating rules.

Create an actor document when a user type appears in multiple use cases or has materially different goals, responsibilities, or boundaries. Actor docs describe product meaning; authorization rules belong in a capability such as `access-control/access-control.rules.md`, and technical role identifiers may be linked from the actor doc.

If `{architecturePath}` is missing during setup, remind the user to create it (even a short draft) before large features or refactors.

Use `workflow.implementationFlow` in `skills.config.json` for the short machine-readable flow, and `{architecturePath}` / `project.conventionsFile` for detailed rules, examples, and rationale.

## Interactive setup (no file yet)

If the user has not run `npm run configure`, gather at minimum:

1. Project name and conventions file
2. Docs root, index file, and capabilities root; create the index from the contract above when missing
3. Optional: app root and code search roots
4. Optional: implementation flow, validation commands, review rule, and docs finalization rule
5. Identify distinct product user types and create `{docsActors}/actors.index.md` plus one `{docsActor}` per meaningful actor
6. Remind the user to add `{docs.root}/architecture/architecture.md` when absent

Write `skills.config.json` to the workspace root, then continue.

## Skills that depend on this config

- [write-plan](../write-plan/SKILL.md) — docs paths
- [write-feature-spec](../write-feature-spec/SKILL.md) — spec location
- [write-handoff](../write-handoff/SKILL.md) — handoff paths
- [mode-brainstorm](../mode-brainstorm/SKILL.md) — brainstorm and spec alignment

**Always load config before invoking those skills** (or ensure they load it in step 1).
