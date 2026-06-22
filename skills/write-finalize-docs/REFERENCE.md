# write-finalize-docs — Reference

## 01-spec.md — post-delivery checklist

- [ ] Context describes current product state, not pre-implementation pain only
- [ ] Objective still accurate
- [ ] Scope = what shipped; out of scope = what was explicitly not built
- [ ] User flows match UI today
- [ ] Business rules unchanged or updated to match code
- [ ] Acceptance criteria: `[x]` for delivered items; remove cancelled items
- [ ] Edge cases reflect implemented handling
- [ ] Open questions: empty or only genuine follow-ups
- [ ] Assumptions: drop planning-only guesses

## 02-context.md — merge map from transient files

| `03-plan.md` section | Destination in `02-context.md` |
|----------------------|----------------------------|
| Files CREATE/MODIFY | `## Key files` table |
| Skipped phases | `## Behavior notes` (if relevant) |
| Phase checkboxes | **Delete** — do not copy verbatim |
| Validation commands | `## Validation` |

| `handoff.md` section | Destination |
|----------------------|-------------|
| Key files | `## Key files` if missing |
| PR / branch | `## Status` |
| Next steps | **Discard** |
| Decisions vigentes | `## Behavior notes` or update `01-spec.md` |

## Folder hygiene command

After edits, verify:

```bash
ls docs/<domain>/<feature>/
# Expected: 01-spec.md  02-context.md
```
