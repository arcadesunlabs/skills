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
- code path that documentation domains should mirror;
- capabilities folder and touchpoints folder (relative to docs root; defaults: `capabilities`, `features`);
- main app or package root.

Then help me document the project's real workflow. Ask focused questions about:
- architecture, layers, naming conventions, and forbidden patterns;
- where code, tests, routes, copy/i18n, schemas, migrations, generated files, and docs belong;
- implementation flow for features, improvements/refactors, and bug fixes (`workflow.implementationFlow` in `skills.config.json`);
- hard dependencies between steps;
- validation commands, review expectations, and docs finalization;
- skills, agents, scripts, or external systems that should be called in each step.

Most importantly, help me define an implementation-flow table similar to this example, adapted to my project:

| #   | Phase                  | Skills / agents                                      |
| --- | ---------------------- | ---------------------------------------------------- |
| 1   | Surface / entry point  | project-specific build or design skills             |
| 2   | Orchestration          | project-specific controller, state, or service skills |
| 3   | Data / contracts       | schema, migration, API client, or repository skills  |
| 4   | Wiring / integration   | routing, dependency injection, jobs, or event wiring |
| 5   | Tests                  | project-specific test skill or commands             |
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

#### Cross-cutting capabilities

Some domain rules span multiple surfaces (API, web app, mobile app, CLI, etc.). The workflow supports a **capability + touchpoints** layout alongside vertical feature folders:

```text
{docs.root}/
├── capabilities/<capability>/spec.md    # canonical shared rules
├── capabilities/<capability>/scenarios.md   # optional shared Gherkin
├── features/<surface>/spec.md           # how one surface consumes the capability
└── <domain>/<feature>/01-spec.md        # full vertical feature spec (unchanged)
```

Configure folder names via `docs.capabilitiesRoot` and `docs.touchpointsRoot` in `skills.config.json` (defaults: `capabilities`, `features`). See [workflow-config](./skills/workflow-config/SKILL.md) for the decision tree.

### 3. Use Day To Day

Ask the agent in natural language. It chooses the skill from the `description` field in `SKILL.md`. Examples:

| Situation                    | What to ask                                         |
| ---------------------------- | --------------------------------------------------- |
| Epic brainstorm              | _"Brainstorm feature X"_ -> `mode-brainstorm`       |
| Write a product spec         | _"Spec for social login"_ -> `write-feature-spec`   |
| Technical plan before coding | _"Technical plan for social login"_ -> `write-plan` |
| Session handoff              | _"Handoff what we did"_ -> `write-handoff`          |

The `workflow-config` skill is the entry point: the agent should load `skills.config.json` before the other workflow skills.

---

## Included Skills

| Skill                | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `workflow-config`    | Loads or creates `skills.config.json`                      |
| `mode-brainstorm`    | Brainstorm, spec, and task breakdown (`04-tasks` optional) |
| `mode-grill`         | Critical review mode                                       |
| `write-feature-spec` | Product, capability, or touchpoint specs                   |
| `write-plan`         | Technical plan and implementation (`03-plan`)              |
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
