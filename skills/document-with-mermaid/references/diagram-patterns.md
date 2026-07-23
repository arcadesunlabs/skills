# Mermaid Documentation Patterns

Adapt these patterns to the current system. Keep only the nodes, messages, fields, and transitions that answer the reader's question.

## Flowchart — pages, paths, and decisions

```mermaid
flowchart LR
  Entry[User opens import] --> Review[Review items]
  Review --> Valid{All items valid?}
  Valid -->|No| Fix[Show items requiring action]
  Fix --> Review
  Valid -->|Yes| Confirm[Confirm import]
  Confirm --> Done[Show result]
```

Use decision labels for meaningful branches. Do not model widget internals or every loading state.

## Sequence diagram — interactions and failures

```mermaid
sequenceDiagram
  participant User
  participant App
  participant API
  participant Database

  User->>App: Confirm request
  App->>API: Submit validated data
  API->>Database: Persist transaction
  Database-->>API: Saved record
  API-->>App: Success response
  App-->>User: Show confirmation

  alt Validation or persistence fails
    API-->>App: Actionable error
    App-->>User: Preserve input and show error
  end
```

Use `alt`, `opt`, or `loop` only when they change the contract. Name participants by system responsibility, not client-library classes.

## State diagram — lifecycle

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Validating: submit
  Validating --> Draft: invalid data
  Validating --> Processing: valid data
  Processing --> Completed: success
  Processing --> Failed: unrecoverable error
  Failed --> Draft: retry
  Completed --> [*]
```

Use states that are visible to the domain or important to recovery. Do not use this diagram for a linear happy path.

## Class diagram — conceptual domain model

```mermaid
classDiagram
  class Order {
    +id
    +status
    +total
  }
  class OrderItem {
    +quantity
    +unitPrice
  }
  class Product {
    +id
    +name
  }

  Order "1" --> "1..*" OrderItem : contains
  OrderItem "*" --> "1" Product : references
```

Show domain concepts, cardinalities, and only the fields or operations needed to clarify the relationship. Avoid mirroring every implementation class.

## ER diagram — persistence model

```mermaid
erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : appears_in

  CUSTOMER {
    uuid id PK
    string email
  }
  ORDER {
    uuid id PK
    uuid customer_id FK
    string status
  }
  ORDER_ITEM {
    uuid order_id FK
    uuid product_id FK
    int quantity
  }
```

Use this for durable storage semantics. Mark keys only when that aids understanding; do not reproduce every column or migration detail.

## Architecture — boundaries and integrations

```mermaid
flowchart LR
  User[Customer]
  App[Mobile app]
  API[Application API]
  DB[(Primary database)]
  Payments[Payment provider]

  User --> App
  App --> API
  API --> DB
  API --> Payments
```

Prefer this portable boundary view when C4 rendering is uncertain. For C4-capable renderers, use `C4Context` or `C4Container` only for stable, cross-cutting architecture—not for a narrow use-case flow.

## User journey — experience across steps

```mermaid
journey
  title First-time onboarding
  section Discover
    Open invitation: 4: User
    Understand value: 5: User
  section Set up
    Create account: 3: User
    Verify email: 2: User, System
  section Complete
    Reach dashboard: 5: User
```

Use journey scores sparingly and only when they express an agreed product assessment, not an invented measurement.
