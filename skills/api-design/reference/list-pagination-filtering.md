# List, pagination, filtering, ordering

How to design a collection endpoint. Satisfies `API-005`. Follows [AIP-132](https://google.aip.dev/132) (List), [AIP-158](https://google.aip.dev/158) (pagination), [AIP-160](https://google.aip.dev/160) (filtering).

## Request

```
GET /v1/{parent=publishers/*}/books?page_size=50&page_token=...&filter=...&order_by=...
```

- **`parent`** — required, unless listing a top-level resource. Identifies the collection's owner.
- **`page_size`** (int32, optional) — max results to return.
- **`page_token`** (string, optional) — advances to the next page.
- **`filter`** (string, optional) — see [Filtering](#filtering).
- **`order_by`** (string, optional) — see [Ordering](#ordering).
- **`show_deleted`** (bool, optional) — include soft-deleted resources, for APIs that soft-delete.
- The request **must not** add other required fields.

## Response

```json
{ "books": [ ... ], "nextPageToken": "...", "totalSize": 1234 }
```

- The repeated **resources** field is first (proto field number 1).
- **`next_page_token`** — set when more pages remain; **empty when this is the last page**. Emptiness is the *only* end-of-collection signal.
- **`total_size`** (int32, optional) — count *after* the filter; may be an estimate (document if so).

## Pagination rules (AIP-158)

- `page_size` is **optional**; if unset or `0`, the server uses a **documented default** (e.g. 50).
- The server enforces a **maximum**; a larger request is **coerced down** to it (e.g. cap 1000).
- A **negative** `page_size` is `INVALID_ARGUMENT` (400).
- The server **may return fewer** than `page_size` — including **zero** — even when not at the end. Clients must keep calling until `next_page_token` is empty; never treat a short page as the end.
- `page_token` is **opaque and URL-safe** and **must not be user-parseable**; it carries **no authorization** to the underlying data.
- When paginating, **all other arguments must match** the call that produced the token, or the server returns `INVALID_ARGUMENT`. (A client *may* change `page_size` between pages; the server honors the new size.)
- **Design pagination from the start** — adding it to an existing unbounded list is a breaking change.
- Pagination applies to **any** RPC that returns a collection, not just `List`.

## Ordering

`order_by` is a comma-separated field list; append ` desc` for descending; use `.` for subfields; spaces are insignificant.

```
order_by=foo
order_by=foo desc, bar
order_by=author.name desc
```

Document which fields are orderable. An unknown field is `INVALID_ARGUMENT`.

## Filtering

If the collection supports filtering, accept a single string **`filter`** field with the [AIP-160](https://google.aip.dev/160) syntax (e.g. `state = ACTIVE AND create_time > "2026-01-01T00:00:00Z"`). Document the filterable fields and operators; reject an unknown field or malformed expression with `INVALID_ARGUMENT` (a `BadRequest` detail naming the problem).

## Example

```
GET /v1/publishers/123/books?page_size=100&order_by=create_time desc&filter=state=PUBLISHED
→ 200 { "books": [ ...≤100... ], "nextPageToken": "Cg9..." }      # more pages remain
→ 200 { "books": [ ... ] }                                        # nextPageToken absent → last page
```
