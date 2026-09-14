# Personal Agent Skills

Agent skills for development workflows: brainstorm, specs, plans, and flow docs. Compatible with [skills.sh](https://www.skills.sh/) and the [`npx skills`](https://github.com/vercel-labs/skills) CLI.

## Install

Run from the root of the project where you code:

```bash
# All skills
npx skills add arcadesunlabs/skills --skill '*' -a cursor -y

# One skill
npx skills add arcadesunlabs/skills --skill write-plan -a cursor -y
```

Replace `cursor` with your agent (`codex`, `claude-code`, etc.). Add `-g` to install globally. List skills with `npx skills add arcadesunlabs/skills --list`.

No configuration file. Paths and the plan workflow are written in each `SKILL.md`. To change them, edit the installed skill.

## Skills

| Skill         | Does                                                       | Writes                               |
| ------------- | ---------------------------------------------------------- | ------------------------------------ |
| `brainstorm`  | Explores an idea, one question at a time, until it is closed | nothing                              |
| `write-spec`  | Behavior-first spec, actors, and shared rules              | `<use-case>.spec.md`, rules, actors  |
| `write-plan`  | Plans, confirms, implements, validates, reviews, docs      | `plan.md` (transient), `changelog.md` |
| `write-flows` | Short Mermaid diagrams of existing flows plus entry points  | `<use-case>.flows.md`                |

Typical path: `brainstorm` → `write-spec` → `write-plan` (which calls `write-flows` at the end).

## Documentation layout

```text
.docs/
├── index.md                              # navigation
├── architecture/architecture.md          # stack, layers, boundaries
├── actors/
│   ├── actors.index.md
│   └── operator.md
├── customers/
│   ├── customers.rules.md                # rules shared inside one domain
│   └── create-customer/
│       ├── create-customer.spec.md       # behavior and testable rules
│       ├── create-customer.flows.md      # diagrams and code entry points
│       ├── changelog.md                  # one line per completed task
│       └── plan.md                       # transient, deleted when done
├── capabilities/<capability>/
│   ├── <capability>.rules.md             # rules shared across domains
│   └── <capability>.flows.md
└── codebase/<initiative>/
    └── notes.md                          # technical work, no behavior change
```

- **Domain**: a product area users recognize (`customers`, `orders`), not a code folder.
- **Use case**: a kebab-case verb-object goal (`create-customer`).
- **Actor**: a product user type with distinct goals or boundaries. Not a technical role or a persona.
- **Spec** says what the product does. **Flows** say how the code does it today. **Changelog** says when it changed.

## Develop this repository

```bash
npm run new -- my-skill       # create a skill
npm run validate              # validate SKILL.md files
npx skills add . --skill my-skill -a cursor -y   # test local install
```

Structure: `skills/<name>/SKILL.md`, with optional `references/`, `scripts/`, and `assets/`.
