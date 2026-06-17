# Errors

The standard for error responses. Satisfies `API-003`. Follows [AIP-193](https://google.aip.dev/193) and the `google.rpc` error model.

## The model: `google.rpc.Status`

Every error is **one** object with three fields:

- **`code`** — a canonical status code from `google.rpc.Code` (the enum, e.g. `NOT_FOUND`). Over HTTP, send the **mapped HTTP status** and include the enum name as `status`.
- **`message`** — a developer-facing, human-readable string (see below).
- **`details[]`** — an array of typed, structured payloads (`google.protobuf.Any`). Each detail type appears **at most once**.

Over HTTP/JSON the conventional envelope is:

```json
{ "error": { "code": 404, "status": "NOT_FOUND", "message": "...", "details": [ ... ] } }
```

Do not invent new top-level error fields. Everything beyond `code`/`message` goes into a typed entry in `details`.

## Canonical codes → HTTP status

| `google.rpc.Code` | HTTP | Use for |
|---|---|---|
| `OK` | 200 | success (not an error) |
| `INVALID_ARGUMENT` | 400 | malformed input, independent of system state |
| `FAILED_PRECONDITION` | 400 | not valid in the current system state |
| `OUT_OF_RANGE` | 400 | value outside a valid range (e.g. bad page bounds) |
| `UNAUTHENTICATED` | 401 | missing or invalid credentials |
| `PERMISSION_DENIED` | 403 | authenticated but not authorized |
| `NOT_FOUND` | 404 | resource does not exist (and caller may know) |
| `ABORTED` | 409 | concurrency conflict (retry the read-modify-write) |
| `ALREADY_EXISTS` | 409 | resource the client tried to create exists |
| `RESOURCE_EXHAUSTED` | 429 | quota or rate limit |
| `CANCELLED` | 499 | client cancelled / closed the request |
| `DATA_LOSS` | 500 | unrecoverable data loss or corruption |
| `UNKNOWN` | 500 | unknown server error |
| `INTERNAL` | 500 | internal server fault (an invariant broke) |
| `UNIMPLEMENTED` | 501 | operation not implemented / not supported |
| `UNAVAILABLE` | 503 | transient; the client may retry with backoff |
| `DEADLINE_EXCEEDED` | 504 | deadline expired before the operation completed |

Pick by **meaning**, not by HTTP number convenience. `INVALID_ARGUMENT` vs `FAILED_PRECONDITION`: the former is wrong regardless of state (a malformed id), the latter is wrong *now* (deleting a non-empty bucket). `ABORTED` vs `FAILED_PRECONDITION` vs `UNAVAILABLE` say whether and how to retry: retry the whole transaction, don't retry until state changes, or retry with backoff.

## `message` — write it for a developer

- **Brief and actionable.** Help a reasonably technical user understand and fix the issue.
- **Plain language.** No jargon; don't assume the reader knows your API or its implementation.
- **No sensitive content.** Never include secrets, credentials, PII, internal hostnames/ids, or stack traces (a `DebugInfo` detail, gated to trusted callers, is the only place for debugging data).
- **Dynamic values go in `metadata`,** not only interpolated into the string. Any request-specific value mentioned in `message` (an id, a region, a limit) must also appear in `ErrorInfo.metadata`.
- **Stability.** If the RPC has always returned `ErrorInfo`, the `message` text may change over time. Otherwise keep it stable. To improve or localize what a human sees without changing `message`, add a `LocalizedMessage` detail.

## `ErrorInfo` — required in every error

`ErrorInfo` is the **machine-readable identity** of the error. Include it in every error response.

| Field | Rule |
|---|---|
| `reason` | `UPPER_SNAKE_CASE`, stable, terse but meaningful, ≤63 chars, regex `^[A-Z][A-Z0-9_]+[A-Z0-9]$`. E.g. `ORDER_NOT_FOUND`, `OUT_OF_STOCK`, `BILLING_DISABLED`. |
| `domain` | The logical owner of the reason, globally unique — usually the service name, e.g. `api.acme.com`. |
| `metadata` | A string→string map of dynamic context. Keys ≤64 chars, regex `^[a-z][a-zA-Z0-9-_]+$`, e.g. `{"order_id":"123","region":"us-east-1"}`. |

The **`(reason, domain)` pair identifies the error**; clients branch on it — never on the `message` text. Rules:

- Use the **same** `(reason, domain)` for the same logical error everywhere; never reuse a pair for a logically different error.
- `metadata` keys are **additive**: once a key has appeared it must keep appearing (value may be empty). You may add new keys over time.

## Standard detail types

Attach the typed details that apply; **each type at most once**.

| Detail | Carries | Use with |
|---|---|---|
| `ErrorInfo` | identity: `reason`, `domain`, `metadata` | **always** |
| `BadRequest` | `field_violations[{ field, description }]` — per-field input errors | `INVALID_ARGUMENT` |
| `PreconditionFailure` | `violations[{ type, subject, description }]` | `FAILED_PRECONDITION` |
| `QuotaFailure` | `violations[{ subject, description }]` | `RESOURCE_EXHAUSTED` |
| `RetryInfo` | `retry_delay` — earliest time to retry | `UNAVAILABLE`, `RESOURCE_EXHAUSTED` |
| `ResourceInfo` | `resource_type`, `resource_name`, `owner`, `description` | `NOT_FOUND`, `ALREADY_EXISTS` |
| `RequestInfo` | `request_id`, `serving_data` — correlation for support | any |
| `Help` | `links[{ description, url }]` — how to resolve | any |
| `LocalizedMessage` | `locale` (BCP-47), `message` — user-facing/localized text | any |
| `DebugInfo` | `stack_entries`, `detail` — **debug only**, trusted callers | server faults |

## Security: permission before existence

Check authorization **before** existence. Return `PERMISSION_DENIED` (403) when the caller may not access a resource, and `NOT_FOUND` (404) only when they may — otherwise the 403-vs-404 difference leaks whether the resource exists.

## Partial errors

Avoid them: an operation either succeeds or returns a single error. The one exception is an explicit **bulk** endpoint, which may report per-item outcomes — design that into the response shape deliberately.

## Examples

A resource is missing:

```json
// HTTP 404
{ "error": {
  "code": 404, "status": "NOT_FOUND",
  "message": "Order \"123\" was not found.",
  "details": [{
    "@type": "type.googleapis.com/google.rpc.ErrorInfo",
    "reason": "ORDER_NOT_FOUND", "domain": "api.acme.com",
    "metadata": { "order_id": "123" }
  }]
}}
```

Invalid input, with per-field violations:

```json
// HTTP 400
{ "error": {
  "code": 400, "status": "INVALID_ARGUMENT",
  "message": "Request has invalid fields.",
  "details": [
    { "@type": "type.googleapis.com/google.rpc.ErrorInfo",
      "reason": "INVALID_FIELDS", "domain": "api.acme.com", "metadata": {} },
    { "@type": "type.googleapis.com/google.rpc.BadRequest",
      "fieldViolations": [
        { "field": "page_size", "description": "must be >= 1" },
        { "field": "order_by", "description": "unknown field 'createdAt'" }
      ] }
  ]
}}
```

Rate limited, with quota and retry hints:

```json
// HTTP 429
{ "error": {
  "code": 429, "status": "RESOURCE_EXHAUSTED",
  "message": "Quota exceeded for create requests.",
  "details": [
    { "@type": "type.googleapis.com/google.rpc.ErrorInfo",
      "reason": "RATE_LIMIT_EXCEEDED", "domain": "api.acme.com",
      "metadata": { "limit": "100", "window": "1m" } },
    { "@type": "type.googleapis.com/google.rpc.RetryInfo",
      "retryDelay": "12s" }
  ]
}}
```

## Do / Don't

**Do:** return one `google.rpc.Status`; use the canonical code by meaning; include `ErrorInfo` in every error; branch clients on `(reason, domain)`; put dynamic data in `metadata`; signal retriability with `RetryInfo`; provide `Help` links and `LocalizedMessage` where useful; check permission before existence.

**Don't:** return `200` with an error body; invent ad-hoc error shapes per endpoint; leak secrets/PII/stack traces in `message`; make clients parse `message`; reuse a `(reason, domain)` pair for a different error; duplicate a detail type; return partial errors outside an explicit bulk endpoint.

## HTTP-native alternative

If a team prefers an HTTP-standard shape over `google.rpc.Status`, use **[RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457)**: `{ type, title, status, detail, instance }` plus extension members. Map the same concepts — `type` ≈ the `(reason, domain)` identity, `status` = HTTP status, `detail` = the developer message, extensions = `metadata`. Pick one model and use it everywhere.
