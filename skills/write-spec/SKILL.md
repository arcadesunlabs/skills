---
name: write-spec
description: Write a concise behavior-first spec for a use case, actor, domain rules, or cross-domain capability under .docs/. Use when writing or reviewing a spec, user story, use case, actor, business rules, or acceptance criteria before implementation.
---

# Write Spec

Do not write code. Do not invent product behavior. If material decisions are
still open, run [brainstorm](../brainstorm/SKILL.md) first.

## Paths

Paths are fixed. Edit this file to change them.

- Conventions: `AGENTS.md` or `CLAUDE.md` at the workspace root
- Docs root: `.docs/`
- Index: `.docs/index.md`
- Architecture: `.docs/architecture/architecture.md`

Read the conventions, index, and architecture when present. If the index is
missing, create a short navigational index. Never overwrite an existing one.

## Scope

Organize by user intent, not code folders. Path tags are kebab-case:

- `<domain>`: product area users recognize (`customers`, `orders`). Never a
  component, route, package, or folder name (`forms`, `screens`).
- `<use-case>`: verb-object user goal (`create-customer`). Distinct goals get
  distinct specs even when they share one component.
- `<capability>`: rules used by more than one domain (`access-control`).
- `<actor>`: product user type (`operator`). Not a technical role
  (`sales_manager`) or a research persona.
- `<initiative>`: technical work with no behavior change
  (`migrate-to-postgres`).

| Situation                                            | Write                                                   |
| ---------------------------------------------------- | ------------------------------------------------------- |
| Observable user goal                                 | `.docs/<domain>/<use-case>/<use-case>.spec.md`          |
| Rules shared by use cases of **one** domain          | `.docs/<domain>/<domain>.rules.md`                      |
| Rules shared **across** domains                      | `.docs/capabilities/<capability>/<capability>.rules.md` |
| Reusable user type with distinct goals or boundaries | `.docs/actors/<actor>.md`                               |
| Technical change with no behavior change             | `.docs/codebase/<initiative>/notes.md`                  |

Shared rules default to the domain hub. Promote to a capability only when
consumers span more than one domain. Link rules; do not copy them.

Reuse `.docs/actors/`. Create an actor document only when the type is reusable
or has distinct goals, responsibilities, or boundaries.

## Write

For codebase work, record technical scope in `notes.md` and stop.

For an actor, domain rules, or capability, use the matching template in
[references/document-templates.md](references/document-templates.md).

For a use case:

```md
# [Verb-object user goal]

## Goal

## Scope

## Out of scope

## User flow

## Rules
```

Filled example: [references/examples.md](references/examples.md).

Add a section only when it holds material information:

| Optional section | Include when                                           |
| ---------------- | ------------------------------------------------------ |
| Actor            | Participation or restrictions are not obvious          |
| Use cases        | Alternate scenarios are clearer in Given/When/Then     |
| Analytics        | Product events or metrics are part of the requirement  |
| Dependencies     | An external dependency can block or change behavior    |
| Open questions   | A product decision is genuinely unresolved             |
| Assumptions      | A low-risk fact is useful but does not change behavior |

Omit empty sections.

Rules:

- `Goal` states the problem and the outcome in one or two sentences.
- `Rules` are the acceptance criteria: one checkbox per testable rule,
  including edge cases and error states. Do not repeat a rule elsewhere.
- Put a technical constraint in the spec only when the user can observe it.
- No routes, components, APIs, file paths, or diagrams. Diagrams live in
  `<use-case>.flows.md` ([write-flows](../write-flows/SKILL.md)).
- Write objective rules. Avoid "works well" or "is intuitive":

```md
- [ ] The user cannot submit until all required fields are valid.
- [ ] A failed save preserves the previously displayed state.
```

Update `.docs/index.md` only when navigation changed.

## Report where it is

Whenever you create or change a spec, rules, or actor document, finish by
telling the user where to find it in the docs site sidebar, besides the file
path. Do this every time, including small edits.

- The docs are rendered by a site whose sidebar follows the folders (for
  example Docusaurus). Read the labels from the files, never guess them: each
  parent folder's `label` in its `_category_.json`, then the file's
  `sidebar_label` front matter, joined with `›`.
- Example: `Transações › Abrir a caixa de entrada › Especificação`
  (`.docs/transactions/open-inbox/open-inbox.spec.md`).
- Give one line per document touched. If a folder has no `_category_.json`
  label, use its name and say so.
- Without a docs site, give only the file path.

## Keep the docs site building

Docs are often rendered by an MDX site (for example Docusaurus). These slips
break its build, even in plain `.md` files:

- **Curly braces in prose are JavaScript.** `"Purchase {code}"` fails with
  `code is not defined`. Escape them (`\{code\}`) or use inline code.
- **`<` followed by a letter is read as a tag.** Write `<name>` in inline
  code or escape it.
- **Do not link to files the site excludes**, such as the transient
  `tasks.md`, `plan.md`, and `handoff.md` (see `exclude` in the site config),
  or to folders such as `shots/`. Name them in inline code instead.
- Links to other docs use relative paths to files that exist.

When docs changed and the project has a docs build (here, `make docs_build`),
run it before finishing and fix what it reports.

## Next

Continue the path from [triage](../triage/SKILL.md), usually
[split-tasks](../split-tasks/SKILL.md). Without triage, recommend split-tasks
and stop.
