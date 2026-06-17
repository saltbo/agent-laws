# Versioning and compatibility

How to version an API and evolve it without breaking consumers. Satisfies `API-001`, `API-002`, `API-009`. Follows [AIP-185](https://google.aip.dev/185) (versioning) and [AIP-180](https://google.aip.dev/180) (backwards compatibility).

## Strategy — pick one, apply everywhere

- **Public HTTP:** version in the URL path — `/v1/...` (visible, cache-friendly).
- **SDK / library:** package semver — `^2.0.0`.
- **gRPC / protobuf:** a versioned package — `acme.books.v1`.

The **major** version changes only on a breaking change. Optionally run pre-release channels (`v1beta1`, `v1alpha1`) for surfaces still in flux: pre-release versions may break with notice; the stable version may not.

Keep at most **one live version plus one deprecated** — don't accumulate versions.

## What is a breaking change

Any of these requires a **new version** (it may **not** ship within a live version):

- Removing or renaming a field, endpoint, method, or parameter.
- Narrowing a type, or tightening validation (a value that used to be accepted now isn't).
- Adding a **required** request field, or making an optional field required.
- Removing an enum value, or changing the **meaning** of an existing field.
- Changing a default value, the default page size, the default sort order, or the error code returned for a given situation.
- Changing a resource-name format or id scheme.

Additive and **safe within a version**:

- Adding an optional request field (with a safe default), a response field, an endpoint, or a method.
- Adding an enum value — **provided** the contract documents that clients must tolerate unknown values.
- Loosening validation (accepting more than before).

## Compatible evolution within a version

Additive only: new request fields optional; never remove or retype a response field; use `PATCH` + `update_mask` (see [update-and-field-masks](update-and-field-masks.md)) so that adding a field never wipes a client's data.

## Guard it in CI

Make the machine-readable contract the source of truth and run a **schema-diff / contract test** that fails the build on any backward-incompatible change to a live version. That check *is* your compliance with `API-001`/`API-002`.

## Deprecation and sunset

When retiring a surface (`API-009`):

- **Signal** it at runtime — `Deprecation: true` and a `Sunset: <http-date>` header ([RFC 8594](https://www.rfc-editor.org/rfc/rfc8594)) — and mark it in the contract (`deprecated: true` in OpenAPI, `@deprecated` in GraphQL, `[deprecated = true]` in protobuf).
- Give **notice**: publish a migration guide and a generous window before removal (external APIs commonly allow 6–12 months).
- **Remove only after** the published sunset date.

## Example

```
# live v1 — additive only:
+ add optional response field "subtitle"           # safe

# breaking — must go to v2, not v1:
- rename "user_name" → "username"                  # removal within v1 is breaking

# retiring v1:
GET /v1/books  →  Deprecation: true
                  Sunset: Wed, 30 Sep 2026 00:00:00 GMT
```
