# Personal Agent Skills

Agent skills for development workflows: triage, brainstorm, specs, task breakdown, plans, and flow docs. Compatible with [skills.sh](https://www.skills.sh/) and the [`npx skills`](https://github.com/vercel-labs/skills) CLI.

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

| Skill         | Does                                                          | Writes                                |
| ------------- | ------------------------------------------------------------- | ------------------------------------- |
| `triage`      | Classifies a new task, picks the mode and the path, starts it | nothing                               |
| `brainstorm`  | Closes every material decision for an idea                    | nothing                               |
| `write-spec`  | Behavior-first spec, actors, and shared rules                 | `<use-case>.spec.md`, rules, actors   |
| `split-tasks` | Decides one task or several                                   | `tasks.md` (transient)                |
| `write-plan`  | Plans, confirms, implements, validates, reviews, docs         | `plan.md` (transient), `changelog.md` |
| `write-flows` | Short Mermaid diagrams of existing flows plus entry points    | `<use-case>.flows.md`                 |

`triage` chooses the path. Examples:

| Request                           | Path                                                     |
| --------------------------------- | -------------------------------------------------------- |
| Bug with clear expected behavior  | `write-plan`                                             |
| Feature with open decisions       | `brainstorm` → `write-spec` → `split-tasks` → `write-plan` |
| Technical change                  | `split-tasks` → `write-plan`                             |
| Document an existing feature      | `write-flows`                                            |

`write-plan` calls `write-flows` at the end.

### Modes

Say the mode in your request ("autonomous mode"). Default: `guided` for features, `review` for bugs and technical changes.

| Mode         | Behavior                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `guided`     | The agent asks one question at a time. You approve the task breakdown and the plan.            |
| `review`     | The agent decides, then lists each decision and reason for you to accept. You approve the plan. |
| `autonomous` | The agent decides and implements. Limits come only from your agent's own permissions.          |

### Triage hook (Claude Code)

Optional. Asks the agent to run `triage` until it has run once in the session. After that it adds nothing. Add to `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/skills/triage/scripts/prompt-hook.mjs\""
          }
        ]
      }
    ]
  }
}
```

For a global install, use `~/.claude/skills/triage/scripts/prompt-hook.mjs`. Other agents trigger `triage` from its description, or you call it directly.

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
│       ├── tasks.md                      # transient, when split
│       └── plan.md                       # transient, deleted when done
├── capabilities/<capability>/
│   ├── <capability>.rules.md             # rules shared across domains
│   └── <capability>.flows.md
└── codebase/<initiative>/
    └── notes.md                          # technical work, no behavior change
```

Tags such as `<domain>` and `<use-case>` are defined in [write-spec — Scope](./skills/write-spec/SKILL.md#scope).

**Spec** says what the product does. **Flows** say how the code does it today. **Changelog** says when it changed.

## Develop this repository

```bash
npm run new -- my-skill       # create a skill
npm run validate              # validate SKILL.md files
npx skills add . --skill my-skill -a cursor -y   # test local install
```

Structure: `skills/<name>/SKILL.md`, with optional `references/`, `scripts/`, and `assets/`.
