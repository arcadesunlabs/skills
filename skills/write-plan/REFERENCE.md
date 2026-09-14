# Write Plan — Reference

## Plan template

```markdown
# [Task] Plan

**Goal:** [one sentence]
**Type:** New feature | Improvement | Bug fix
**Scope:** use case | capability | codebase
**Spec:** [link, when present]
**Slice:** [slice title, for epics]

## Files

CREATE path/to/new-file
MODIFY path/to/existing-file

## Steps

### 1. [Step name]

- [ ] ...

### 2. [Step name] (parallel with 3)

- [ ] ...

### Validate

- [ ] [command]

### Review

- [ ] Diff reviewed

### Docs

- [ ] Spec or rules match shipped behavior
- [ ] Flows updated (write-flows)
- [ ] Changelog line added
- [ ] Index and actors updated when needed
- [ ] `plan.md` and `tasks.md` deleted
```

## Confirmation summary

```text
Plan

Goal:  ...
Type:  New feature | Improvement | Bug fix
Scope: use case | capability | codebase

Files:
  CREATE ...
  MODIFY ...

Steps:
  1. ...
  2. ...

Waiting for confirmation.
```

## Changelog

One line per completed task, not per commit. Add it in the Docs step, in
`changelog.md` beside the spec, rules, or notes. Create the file when missing.
Newest first. No file paths.

```md
- 2026-09-20 Fix: expired link did not offer a new request (PR #45)
- 2026-09-14 Create customer with tax ID validation (PR #12)
```

## Spec checklist

- [ ] Describes current behavior, in present tense
- [ ] Scope is what shipped; out of scope is what was not built
- [ ] Delivered acceptance criteria are `[x]`; cancelled items are removed
- [ ] Open questions are empty or genuine follow-ups
