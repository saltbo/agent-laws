# Resources and methods

How to shape the API surface. Satisfies `API-004`. Follows [AIP-121](https://google.aip.dev/121) and the standard-method AIPs ([131](https://google.aip.dev/131)–[136](https://google.aip.dev/136)).

## Principles of resource-oriented design

- **Resources are nouns.** The building blocks of the API are individually-named resources (`order`, `payment`, `user`) and the relationships between them — not actions.
- **Don't mirror the database.** The API surface abstracts storage. Model what consumers need, not your tables.
- **Hierarchy is a DAG.** Parent/child relationships form a directed acyclic graph — no cycles (except via output-only reference fields, which users don't set).
- **Stateless.** Each request stands alone; a resource is directly addressable without a prerequisite sequence of calls. The server holds data; the client holds application state.
- **One schema per resource.** The resource representation is identical across every method that returns it (Get, List, Create, Update). Don't vary the shape by method.
- **Strong consistency after a mutation.** When a mutating call returns success, the change is already visible: a subsequent Get reflects a Create/Update, and returns `NOT_FOUND` (or a soft-deleted state) after Delete. Clients treat success as the signal to proceed.

## The five standard methods

| Method | HTTP | Request body | Response body |
|---|---|---|---|
| **Get** | `GET /v1/{name=publishers/*/books/*}` | none | the resource |
| **List** | `GET /v1/{parent=publishers/*}/books` | none | a page of resources + `next_page_token` |
| **Create** | `POST /v1/{parent=publishers/*}/books` | the resource | the created resource |
| **Update** | `PATCH /v1/{book.name=publishers/*/books/*}` | the resource + `update_mask` | the updated resource |
| **Delete** | `DELETE /v1/{name=publishers/*/books/*}` | none | empty (or the resource for soft delete) |

Rules:

- **Every resource supports Get and List** (List excepted for singletons). Get is what lets a client verify state after a mutation.
- **Create** returns the created resource (with its server-assigned `name`, `uid`, timestamps). Support a client-specified id where useful (e.g. `?book_id=...`); otherwise the server assigns one.
- **Update** uses `PATCH` with an `update_mask` — partial update. See [update-and-field-masks](update-and-field-masks.md).
- **List** is paginated and may filter/order. See [list-pagination-filtering](list-pagination-filtering.md).
- A **Get after any successful mutation** must reflect it (strong consistency).

## Custom methods

When an operation genuinely doesn't fit a standard method — cancel, publish, batch, import/export, a transactional action — use a **custom method**: `POST` with a `:verb` suffix on the resource or collection.

```
POST /v1/{name=publishers/*/books/*}:publish
POST /v1/{name=publishers/*/books/*}:archive
POST /v1/{parent=publishers/*}/books:batchGet
```

- Name them **`VerbNoun`** in UpperCamelCase (`PublishBook`, `BatchGetBooks`); the URI verb is `:lowerCamel`.
- Prefer a standard method whenever the operation maps to one. Reach for a custom method only when it doesn't — and justify it.
- A state change is usually better as a field updated via `PATCH` than as a custom method, unless the transition has side effects or guardrails that a plain field write shouldn't allow.

## Singleton sub-resources

Some resources exist exactly once under a parent (a `Settings`, a `Config`). A singleton: has no collection and no user-assigned id, can't be created or deleted independently of its parent, and supports Get and Update but not List.

```
GET   /v1/{name=users/*/settings}
PATCH /v1/{settings.name=users/*/settings}
```

## Do / Don't

**Do:** model resources and a hierarchy; implement Get + List at minimum; keep one schema per resource across methods; reach standard methods first; make mutations reach steady state before returning.

**Don't:** expose your database schema; create reference cycles (except output-only); require a sequence of calls to address a resource; default to custom methods; let a resource's shape differ between methods.
