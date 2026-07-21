# Personal Agent Skills

Agent skills for development workflows: specs, plans, handoffs, and documentation. Compatible with the [skills.sh](https://www.skills.sh/) ecosystem and the [`npx skills`](https://github.com/vercel-labs/skills) CLI.

## Prerequisites

| Requirement                                                                     | Why                                                 |
| ------------------------------------------------------------------------------- | --------------------------------------------------- |
| [Node.js](https://nodejs.org/) 18+                                              | The `npx skills` CLI runs on Node                   |
| A compatible agent, such as [Cursor](https://cursor.com), Codex, or Claude Code | Skills are installed into the agent's skills folder |

You **do not need to clone** this repository just to use the skills in your project.

---

## Get Started In 3 Steps

Always work from the **root of the project where you code** (for example, your monorepo or app), not from this skills repository.

### 1. Install The Skills

```bash
cd /path/to/your-project

# All skills (recommended)
npx skills add arcadesunlabs/skills --skill '*' -a cursor -y

# Or one specific skill
npx skills add arcadesunlabs/skills --skill write-plan -a cursor -y
```

Replace `cursor` with your agent (`codex`, `claude-code`, etc.). To install globally instead of into the project, add `-g`.

List what is available without installing:

```bash
npx skills add arcadesunlabs/skills --list
```

### 2. Configure Your Project Workflow

Workflow skills read **`skills.config.json` at your project root**. The recommended setup path is to configure it with help from your agent, because the agent can inspect the project, ask relevant questions, and document the real implementation flow in `skills.config.json`, the project conventions file, and `{docs.root}/architecture/architecture.md`.

Use this prompt from the root of the project where you code:

```text
I want to configure this project's workflow skills.

Read or create `skills.config.json` at the project root. If it does not exist, ask me for the required values before creating it:
- project name;
- project conventions file, such as `CLAUDE.md`, `AGENTS.md`, or equivalent;
- documentation root, such as `.docs`, `.specs`, or `docs`;
- documentation index file;
- capabilities folder (relative to docs root; default: `capabilities`);
- main app or package root;
- code search roots used to build technical context.

Then help me document the project's real workflow. Ask focused questions about:
- distinct product user types, their goals, responsibilities, and boundaries;
- architecture, layers, naming conventions, and forbidden patterns;
- where code, tests, routes, copy/i18n, schemas, migrations, generated files, and docs belong;
- implementation flow for features, improvements/refactors, and bug fixes (`workflow.implementationFlow` in `skills.config.json`);
- hard dependencies between steps;
- validation commands, review expectations, and docs finalization;
- skills, agents, scripts, or external systems that should be called in each step.

Most importantly, help me define an implementation-flow table similar to this example, adapted to my project:

| #   | Phase                  | Skills / agents                                      |
| --- | ---------------------- | ---------------------------------------------------- |
| 1   | Surface / entry point  | project-specific build or design skills              |
| 2   | Orchestration          | project-specific controller, state, or service skills|
| 3   | Data / contracts       | schema, migration, API client, or repository skills  |
| 4   | Wiring / integration   | routing, dependency injection, jobs, or event wiring |
| 5   | Tests                  | project-specific test skill or commands              |
| 6   | Copy / localization    | i18n or content skill, when applicable               |
| 7   | Analytics / telemetry  | analytics skill, when applicable                     |
| 8   | Code review            | review skill or review agent                         |
| 9   | Documentation finalize | update spec/context and remove transient artifacts   |
| 10  | New skill needed?      | `write-skill` if approved                            |

Do not copy this flow automatically. Use it only as a reference for the level of detail, and help me create the correct equivalent for this project.
```

If you only want to generate the base file without that conversation, run the interactive helper via `npx`:

```bash
npx github:arcadesunlabs/skills skills-configure /path/to/your-project
```

Answer the questions (Enter accepts the default value). The file is created at `/path/to/your-project/skills.config.json`.

To reconfigure later, ask the agent to review the configuration or run the same command again.

If you already cloned this repo:

```bash
npm --prefix skills run configure -- /path/to/your-project
```

Main fields: `project`, `docs`, `code`, and optional `workflow`. Reference: [skills.config.example.json](./skills.config.example.json).

Recommended: create `{docs.root}/architecture/architecture.md` with an overview of the stack, layers, and architectural decisions. The `mode-brainstorm` and `write-plan` skills read that file when it exists.

#### Behavior-first documentation

Documentation is organized by user intent, not code structure. Choose a product/business domain, then name each use case as a kebab-case verb-object goal. The use-case spec describes behavior; its context maps that behavior to current code.

**What is a domain?** A domain is a stable product or business area that groups related user goals. It describes what the product is about, not where code lives. Examples:

| Product     | Domain           | Use cases                          |
| ----------- | ---------------- | ---------------------------------- |
| CRM         | `customers`      | `create-customer`, `edit-customer` |
| Store       | `orders`         | `place-order`, `cancel-order`      |
| Finance app | `payments`       | `send-payment`, `refund-payment`   |
| Any app     | `authentication` | `sign-in`, `reset-password`        |

Use language users and product teams recognize. Do not choose component, route, package, layer, or folder names such as `forms`, `screens`, `controllers`, or `src/features`.

**What is an actor?** An actor is a product user type with distinct goals, responsibilities, or boundaries. Examples include `administrator`, `operator`, `manager`, and `salesperson`.

Do not mix these concepts:

| Concept | Meaning                                         | Example                                        |
| ------- | ----------------------------------------------- | ---------------------------------------------- |
| Actor   | Product user type participating in use cases    | Store manager                                  |
| Role    | Technical authorization identifier              | `sales_manager`                                |
| Persona | Research archetype with context and motivations | Busy store owner with low technical confidence |

Document reusable actors under `{docs.root}/actors/`. Actor documents explain who users are and what they are responsible for. Canonical permission matrices belong in capability rules such as `capabilities/access-control/rules.md`.

```text
{docs.root}/
├── architecture/architecture.md
├── actors/
│   ├── index.md
│   ├── administrator.md
│   └── operator.md
├── customers/create-customer/
│   ├── create-customer.spec.md          # user behavior and acceptance criteria
│   └── create-customer.context.md       # routes, components, APIs, data, and tests
├── customers/edit-customer/
│   ├── edit-customer.spec.md
│   └── edit-customer.context.md
└── capabilities/<capability>/
    ├── rules.md                         # canonical rules shared by multiple use cases
    └── scenarios.md                     # optional shared Gherkin
```

Distinct user goals get separate specs even when they share one component. Use `<use-case>.spec.md` and `<use-case>.context.md` so filenames remain descriptive in Obsidian Graph View, global search, backlinks, and exports. Put genuinely shared rules in `capabilities/` and link affected specs to them. `code.appRoot` and `code.searchRoots` guide technical discovery without determining documentation paths. See [workflow-config](./skills/workflow-config/SKILL.md) for the decision tree.

When migrating existing docs, rename each use-case `spec.md` and `context.md`, then update Markdown links before creating new files. For example: `customers/create-customer/spec.md` becomes `customers/create-customer/create-customer.spec.md`.

### 3. Use Day To Day

Ask the agent in natural language. It chooses the skill from the `description` field in `SKILL.md`. Examples:

| Situation                    | What to ask                                         |
| ---------------------------- | --------------------------------------------------- |
| Epic brainstorm              | _"Brainstorm feature X"_ -> `mode-brainstorm`       |
| Define product users         | _"Document our user types"_ -> `write-feature-spec` |
| Write a product spec         | _"Spec for social login"_ -> `write-feature-spec`   |
| Technical plan before coding | _"Technical plan for social login"_ -> `write-plan` |
| Session handoff              | _"Handoff what we did"_ -> `write-handoff`          |

The `workflow-config` skill is the entry point: the agent should load `skills.config.json` before the other workflow skills.

---

## Included Skills

| Skill                | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `workflow-config`    | Loads or creates `skills.config.json`                      |
| `mode-brainstorm`    | Brainstorm, spec, and task breakdown (`tasks.md` optional) |
| `mode-grill`         | Critical review mode                                       |
| `write-feature-spec` | Use-case specs, actor definitions, and capability rules    |
| `write-plan`         | Technical plan and implementation (`plan.md`)              |
| `write-handoff`      | Session handoff                                            |
| `write-skill`        | Create or improve skills                                   |

Visual organization on [skills.sh](https://skills.sh/): [skills.sh.json](./skills.sh.json).

---

## Develop Or Maintain This Repository

Use this section if you **cloned or forked** this repo to create or edit skills.

### Structure

```text
skills/
  skill-name/
    SKILL.md          # required
    scripts/          # optional
    references/       # optional
    assets/           # optional
skills.config.json       # local config (gitignored)
skills.config.example.json
```

### Commands

```bash
git clone https://github.com/arcadesunlabs/skills.git
cd skills

npm run new -- my-skill                         # create skill
npm run new -- my-skill --resources scripts,references,assets
npm run validate                                # validate SKILL.md files
npm run configure -- /path/to/project           # generate skills.config.json in the target project
npm run skills:list                             # list skills from this repo
```

After editing a skill, run `npm run validate`. The `new` script also adds the skill to the group in `skills.sh.json`.

### Test Local Installation

```bash
npx skills add . --skill my-skill -a cursor -y
```

---

## Quick Reference: `npx skills`

```bash
# From GitHub (normal usage)
npx skills add arcadesunlabs/skills --skill '*' -a cursor -y

# From this local clone
npx skills add . --skill my-skill -a cursor -y

# Global (all folders)
npx skills add arcadesunlabs/skills --skill '*' -a cursor -g -y
```

More options: [`vercel-labs/skills`](https://github.com/vercel-labs/skills).

---

## Credits And Third-Party Notices

The following skills are adapted from [Matt Pocock's skills repository](https://github.com/mattpocock/skills):

| Skill                                              | Original                                                                                                          |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [`mode-grill`](./skills/mode-grill/SKILL.md)       | [`grilling`](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling)                         |
| [`write-handoff`](./skills/write-handoff/SKILL.md) | [`handoff`](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff)                           |
| [`write-skill`](./skills/write-skill/SKILL.md)     | [`writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills) |

Original work copyright (c) 2026 Matt Pocock and licensed under the MIT License. These versions include project-specific modifications. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for the full license notice.
