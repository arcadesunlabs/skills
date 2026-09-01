# Write Feature Spec — Other document templates

Read only the section matching the requested document type.

## Actor

Use for a reusable product user type with distinct goals, responsibilities, or
boundaries. Update `{docs.root}/actors/actors.index.md`.

```md
# [Actor name]

## Definition

## Goals

## Responsibilities

## Boundaries

## Technical roles

Include authorization identifiers only when useful and link to their canonical
rules.

## Related use cases
```

## Domain rules

Use for rules shared by use cases within one product domain.

```md
# [Domain name] — Canonical rules

## Affected use cases

| Use case | Spec |
| -------- | ---- |

## Affected actors

## Rules
```

Keep shared invariants and semantics here. Keep use-case-specific UI and flow in
each use-case spec.

## Capability rules

Use only for rules shared by use cases across more than one domain.

```md
# [Capability name] — Canonical rules

## Affected use cases

| Use case | Spec |
| -------- | ---- |

## Affected actors

## Rules
```

Create `<capability>.scenarios.md` only when several use cases genuinely share
the same acceptance scenarios.
