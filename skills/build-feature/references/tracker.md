# Task tracker operations

Load [workflow](../../workflow/SKILL.md) and read `skills.config.json`. All board names, prefixes, and paths come from config — never assume a specific project.

If `taskTracker.enabled` is `false` or `provider` is `none`, stop tracker sync and proceed without card/issue lookup (user provides branch name if needed).

## Rules (all providers)

1. **Never invent card/issue numbers.** After creating a card, fetch again for real ID, URL, and key.
2. **Branch naming:** when `branchMatchesCardKey` is true, branch = `{cardKey}` (e.g. `REV-42` → `git checkout -b REV-42`).
3. **One card, one branch, one reviewable slice.** Epic parent tracks spec and child links; code commits go on child branches.
4. **Confirm with user** when title, scope, or branch name is ambiguous.

## Trello (`provider: trello`)

Use MCP server from `taskTracker.mcpServer` (default `user-trello`). Board and lists: `taskTracker.trello` in config.

| Action             | Tool                       |
| ------------------ | -------------------------- |
| Find board/card    | `trello_search_all_boards` |
| List board lists   | `trello_get_lists`         |
| Create card        | `trello_add_card`          |
| Update description | `trello_update_card`       |
| Cards in a list    | `trello_get_cards_by_list` |

Read each tool schema in the MCP folder before calling.

**Lists** (from config `taskTracker.trello.lists`):

| Purpose                             | Config key   |
| ----------------------------------- | ------------ |
| New implementation cards (children) | `todo`       |
| Active epic / work in progress      | `inProgress` |
| Lower-priority backlog              | `backlog`    |
| Done                                | `done`       |

### Starting work on an existing card

1. Search for the card (by `{cardKey}` or title).
2. Read description: scope, acceptance criteria, parent epic link.
3. Create or checkout branch per config branch rule.
4. Tell the user: card URL, branch name, and spec path under `{docs.root}/` if present.
5. Proceed to build-feature plan (path A or A′) or implement if trivial.

### Creating cards (epic flow)

- **Child implementation card** → `todo` list
- **Parent epic while active** → `inProgress` list

Create via tracker MCP on the **todo** list ID from config. After creation, search the new card for real key, `url`, and `id` — never invent numbers.

#### Parent card description (after children exist)

```markdown
## Epic

{one-paragraph summary}

## Spec

`{docs.root}/<domain>/<feature>/01-spec.md`

## Child cards

| Key       | Title   | Status  |
| --------- | ------- | ------- |
| {cardKey} | {title} | backlog |

## Implementation order

1. {cardKey} — {why first}
```

Update via tracker MCP (e.g. `trello_update_card` for Trello, or the Jira issue-update tool for Jira) using the parent `cardId` / issue key from search.

#### Child card description template

```markdown
## Parent epic

{parentCardKey} — {parent title}
{parent.url from API}

## Spec section

See `{docs.root}/<domain>/<feature>/01-spec.md` — slice "{slice name}"

## Scope

{objective}

## Acceptance criteria

- …
- …

## Out of scope

- …

## Depends on

{otherCardKey} or none
```

### Starting implementation on a child slice

When the user picks a slice:

1. Run tracker steps for the **child slice** (branch + confirm work item).
2. Read the child card description (scope + acceptance criteria) and epic `01-spec.md` for shared context.
3. Invoke [build-feature](../../build-feature/SKILL.md) path A′ — scope is **that slice only**; do not re-spec the whole epic.
4. Parent branch may hold only spec/skills/docs commits; application code commits belong on child branches.

## Jira (`provider: jira`)

Use MCP server from `taskTracker.mcpServer` (default `user-jira`) when available. Project and workflow settings: `taskTracker.jira` in config.

Read each MCP tool schema in the MCP folder before calling. Tool names vary by Jira MCP package — search the server's tool list for issue search, create, update, and transition.

| Action             | Typical approach                                             |
| ------------------ | ------------------------------------------------------------ |
| Find issue         | Search by `{cardKey}` (e.g. `REV-42`) or JQL                 |
| Read issue         | Fetch summary, description, status, parent/epic link         |
| Create issue       | Project `jira.projectKey`, issue type from `jira.issueTypes` |
| Update description | Patch issue body (Markdown or ADF per MCP)                   |
| Move status        | Transition to `jira.statuses.todo` / `inProgress` / `done`   |

**Issue types** (from config `taskTracker.jira.issueTypes`):

| Purpose                   | Config key |
| ------------------------- | ---------- |
| Parent epic               | `epic`     |
| User-facing slice / story | `story`    |
| Technical sub-task        | `task`     |

**Statuses** (from config `taskTracker.jira.statuses`):

| Purpose                              | Config key   |
| ------------------------------------ | ------------ |
| New implementation issues (children) | `todo`       |
| Active epic / work in progress       | `inProgress` |
| Lower-priority backlog               | `backlog`    |
| Done                                 | `done`       |

### Starting work on an existing issue

1. Search for the issue by `{cardKey}` or title (JQL: `project = {projectKey} AND key = {cardKey}`).
2. Read description: scope, acceptance criteria, parent epic link.
3. Create or checkout branch per config branch rule.
4. Tell the user: issue URL (`{siteUrl}/browse/{cardKey}`), branch name, and spec path under `{docs.root}/` if present.
5. Transition to `inProgress` status when starting work (if workflow allows).
6. Proceed to build-feature plan (path A or A′) or implement if trivial.

### Creating issues (epic flow)

- **Child implementation issue** → create with parent epic link; initial status `todo`
- **Parent epic while active** → issue type `epic`; status `inProgress`

### Without Jira MCP

Ask the user for issue URL/key, or use Jira REST API / `jira` CLI if configured locally. Never invent issue numbers — fetch after create.

## Linear / GitHub

Provider-specific steps are not bundled yet. Use available MCP or CLI:

- **Linear:** search issue by identifier; branch = `{cardKey}` or team convention from user.
- **GitHub:** `gh issue view {number}`; branch per user preference in config or conversation.

Ask the user for board/repo and list/column mapping if not in config.

## When to skip

- Typo or one-line fix with no tracker card — implement directly per `project.conventionsFile`.
- User explicitly says not to use the task tracker for this task.
