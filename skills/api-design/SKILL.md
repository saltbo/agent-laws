---
name: api-design
description: A detailed, AIP-based reference for designing clear, evolvable APIs — resource-oriented design, standard methods, resource names, pagination and filtering, partial updates with field masks, the full error model, and versioning and compatibility. Use when designing, extending, or reviewing an HTTP/RPC/GraphQL API, an SDK surface, a CLI, or an event schema. Read the relevant reference/*.md chapter for depth.
---

# Designing an API

The **how-to** for API design, in depth. The binding standard is the [API Design Law](../../laws/30-api-design.md) (`API-001`–`API-011`); this skill is how you *satisfy* it. If guidance here ever conflicts with the Law, the Law wins and this skill is fixed.

It follows **[Google AIP](https://google.aip.dev)**. This file is the map; the detail lives in **`reference/`** — open the chapter for the task at hand and follow it.

## Chapters

| Read | When | Covers (AIP) |
|---|---|---|
| [resources-and-methods](reference/resources-and-methods.md) | shaping the API surface | resource-oriented design, the five standard methods, custom methods (121, 131–136) |
| [resource-names](reference/resource-names.md) | naming anything | resource names, collection ids, resource ids (122) |
| [list-pagination-filtering](reference/list-pagination-filtering.md) | any collection endpoint | List, pagination, filtering, ordering (132, 158, 160) |
| [update-and-field-masks](reference/update-and-field-masks.md) | any update / PATCH | partial update, `update_mask`, `allow_missing` (134) |
| [errors](reference/errors.md) | designing error responses | the `google.rpc.Status` error model, `ErrorInfo`, code→HTTP (193) |
| [versioning-and-compatibility](reference/versioning-and-compatibility.md) | versioning, evolving, deprecating | versions, breaking changes, deprecation (180, 185) |

## The core in one screen

- **Model resources (nouns), not endpoints.** A small standard method set — Get, List, Create, Update (PATCH), Delete — plus custom methods (`POST /orders/{id}:cancel`) for the rest. Don't mirror the database. → `API-004`
- **Name predictably.** `collection/{id}/collection/{id}`; plural camelCase collections; DNS-safe ids; one casing for fields. → `API-004`
- **Version up front; evolve additively.** One live version, guarded by a CI schema-diff. → `API-001`/`API-002`
- **Errors are `google.rpc.Status`** with an `ErrorInfo` whose `(reason, domain)` is the machine-readable identity; correct code→HTTP. → `API-003`
- **Paginate everything that grows** (`page_size`/`page_token`/`next_page_token`, server-capped). → `API-005`
- **Reads are safe; risky writes are idempotent.** → `API-006`
- **Validate and authorize at the edge.** → `API-007`, `API-010`
- **Contract-first** (OpenAPI/proto), drift-checked in CI. → `API-008`

## Pre-ship checklist

- [ ] Versioned; CI schema-diff guards breaking changes (`API-001`, `API-002`)
- [ ] `google.rpc.Status` errors with `ErrorInfo`; correct code→HTTP (`API-003`)
- [ ] Resource-oriented surface; standard methods; predictable names (`API-004`)
- [ ] Lists paginated and capped (`API-005`)
- [ ] Reads safe; risky writes idempotent (`API-006`)
- [ ] Inputs validated and authorized at the edge (`API-007`, `API-010`)
- [ ] Machine-readable contract, drift-checked in CI (`API-008`)
- [ ] Deprecations signaled with a sunset date (`API-009`)
- [ ] Unambiguous data formats (`API-011`)

## References

[Google AIP](https://google.aip.dev) (primary) · [Google Cloud API Design Guide](https://cloud.google.com/apis/design) · [Zalando RESTful API Guidelines](https://opensource.zalando.com/restful-api-guidelines/) · [Microsoft/Azure REST API design](https://learn.microsoft.com/azure/architecture/best-practices/api-design) · [OpenAPI 3.1](https://www.openapis.org/) · [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457).
