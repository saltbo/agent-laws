# Resource names

How to name resources and collections. Satisfies `API-004`. Follows [AIP-122](https://google.aip.dev/122).

## Format

A resource name is a URI path **without a leading slash**, alternating collection identifiers and resource ids:

```
publishers/123/books/les-miserables
projects/example/locations/us-east1/instances/prod-1
```

`collection/{id}/collection/{id}/...` — each `{id}` belongs to the collection that precedes it.

## Collection identifiers

The collection segments (`publishers`, `books`):

- **Plural** form of the resource noun. (Use the singular only when there is no distinct plural — `info` — or the plural equals the singular — `moose`.)
- **`camelCase`**, beginning with a lower-case letter: regex `/[a-z][a-zA-Z0-9]*/` (ASCII letters and numbers only).
- **Unique within a single resource name** (no `books/.../books`).
- **Concise American English** terms; the same term for the same concept everywhere.

## Resource ids

The `{id}` segments (`123`, `les-miserables`):

- **User-specified ids** should follow RFC-1034/1123 (DNS-safe): letters, numbers, and hyphen; first char a letter, last a letter or number; **lower-case**; ≤63 chars. Regex: `^[a-z]([a-z0-9-]{0,61}[a-z0-9])?$`.
- **Server-assigned ids** are opaque strings — treat them as such; don't make clients parse them.
- A good id is stable, unique within its collection, and (for user-chosen ids) meaningful. Avoid encoding mutable attributes into an id.

## Relative vs. full names

- **Relative** (within one API): `publishers/123/books/les-miserables`.
- **Full** (across APIs): prefix the owning service — `//library.googleapis.com/publishers/123/books/les-miserables`. Use the relative form whenever the owning API is clear from context.

## Required fields on the resource

- Every resource **must** expose a **`name`** field holding its own resource name.
- Optionally expose the bare resource id as a separate **output-only** field, and a server-generated **`uid`** (output-only) for a permanent handle that survives renames.
- **Don't** expose tuples, `self_link`s, or other ad-hoc identifiers — the resource name is the identifier.

## Examples

- ✓ `GET /v1/publishers/123/books/les-miserables`
- ✓ collections `users`, `apiKeys`, `events`; ids `prod-1`, `les-miserables`
- ✗ `GET /v1/Publisher/123/Book/5` — singular, PascalCase collections
- ✗ id `Les_Misérables` — upper-case, underscore, non-DNS character
- ✗ `book_id` of `getBook?id=...` as the identity — use the resource `name`
