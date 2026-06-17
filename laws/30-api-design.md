# API Design Law

**Prefix:** `API` · **Domain:** software maintenance · **Authority:** [Constitution](../CONSTITUTION.md), esp. Articles I, III.

This Code governs the design of **interfaces consumed across a boundary** — HTTP/RPC/GraphQL services, message and event schemas, library/SDK surfaces, and CLIs. It sets the **standard** and the **conformance bar**; it does not teach method. *How* to comply — patterns, decisions, and worked examples — lives in its implementing skill, [`api-design`](../skills/api-design/SKILL.md): **the law judges; the skill shows the way.**

It governs the craft of the contract, not the product behavior behind it (Constitution Art. I §3); where conformance would change behavior, the Maintainer escalates (`MC-004`). Where a Project has an established convention that meets a provision's intent, that convention controls (`CQ-008`, `MC-014`); deviations are recorded as Waivers.

---

### API-001 — Version the public contract
> **MUST** · severity: critical · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** Every public API MUST carry an explicit version; a breaking change MUST be released as a new version, and an in-use version MUST NOT be changed in a breaking way.

**Rationale.** Consumers depend on a stable contract; a silent break fails systems the Maintainer cannot see.

**Applicability.** Any interface consumed outside its own deployable unit. Internal, single-consumer interfaces are exempt.

**Conformance.** A version identifier is present, and a schema-diff or contract suite against the prior released version reports no backward-incompatible change.

**Remediation.** Revert on the live version; reintroduce under the next version; deprecate the old version with a sunset date (`API-009`).

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-002 — Keep changes within a version backward compatible
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** Within a released version, every change MUST be backward compatible — additive only.

**Rationale.** Compatibility is what makes a version a stable promise rather than a moving target.

**Applicability.** All evolution of an in-use version.

**Conformance.** A compatibility check for the version reports additive-only change: no field removed or retyped, and new request fields optional with safe defaults.

**Remediation.** Make the addition optional, restore the removed field, or move the incompatible change to a new version (`API-001`).

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-003 — Return a consistent, machine-readable error model
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** Every error response MUST use the Project's single error schema and the semantically correct status.

**Rationale.** Consumers handle errors programmatically; ad-hoc shapes and wrong statuses force brittle parsing and hide failures.

**Applicability.** All non-success responses across the boundary.

**Conformance.** Every non-success response validates against one documented error schema, and its status matches the failure's meaning.

**Remediation.** Adopt one error schema; map ad-hoc errors onto it; correct misused status codes.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-004 — Name and shape resources predictably
> **SHOULD** · severity: normal · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** Names SHOULD be consistent and predictable, with one documented convention applied across the whole API.

**Rationale.** A predictable surface lets a consumer guess the next endpoint correctly; inconsistency taxes every integration.

**Applicability.** All public endpoints, methods, and payload field names.

**Conformance.** A style lint passes: no CRUD action is a verb in a path, and field casing and resource naming are uniform across the API.

**Remediation.** Rename to the convention under a new version (`API-001`); add the lint rule to CI.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-005 — Bound and paginate collections
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** An endpoint returning a collection MUST paginate and MUST NOT return an unbounded result set.

**Rationale.** Unbounded responses are a latency, memory, and denial-of-service hazard that worsens silently as data grows.

**Applicability.** Any response whose size grows with data.

**Conformance.** List endpoints accept a bounded page size and a cursor or offset, enforce a server-side cap, and return pagination metadata.

**Remediation.** Add pagination parameters and a hard server-side cap; return a next-page token.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-006 — Keep reads safe; make retried writes idempotent
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** Read operations MUST be side-effect-free; a non-idempotent mutation that may be retried MUST accept an idempotency key or be made naturally idempotent.

**Rationale.** Networks retry; a read with side effects or a retried create without a key corrupts data or double-charges.

**Applicability.** All operations across the boundary.

**Conformance.** Reads cause no state change, and at-risk mutations dedupe on an idempotency key so a retry yields the original result.

**Remediation.** Remove side effects from reads; add idempotency-key handling to at-risk mutations.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-007 — Validate every input at the boundary
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** An API MUST validate every input at its boundary and check authorization before acting, rejecting an invalid request with a clear error.

**Rationale.** The boundary is the real trust edge (`CQ-005`); unvalidated input is a correctness defect and a security hole.

**Applicability.** Every request handler at the boundary.

**Conformance.** Malformed or unauthorized requests are rejected with a structured 4xx error before any side effect; no handler assumes well-formed input.

**Remediation.** Add boundary validation; return a structured validation error (`API-003`).

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-008 — Publish a machine-readable contract and keep it in sync
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** The API MUST have a machine-readable contract that is the source of truth and stays in sync with the implementation.

**Rationale.** A contract that drifts from the code is worse than none: it misleads consumers and tooling.

**Applicability.** Every public interface.

**Conformance.** The contract lives in the repository, and a CI check fails on drift between it and the implementation.

**Remediation.** Add or regenerate the spec; wire a conformance/drift check into CI.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-009 — Deprecate with a signal and a sunset
> **SHOULD** · severity: normal · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** A deprecated endpoint, field, or version SHOULD be marked with a sunset date, and consumers MUST be signaled before it is removed.

**Rationale.** Removal without notice is a breaking change by surprise; a signaled sunset lets consumers migrate.

**Applicability.** Anything scheduled for removal from a public surface.

**Conformance.** Deprecation is annotated in the contract and signaled at runtime with a sunset date, and removal occurs only after that date.

**Remediation.** Restore the removed surface; re-announce with a sunset date; remove only after it passes.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-010 — Be secure by default
> **MUST** · severity: critical · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** Endpoints MUST require authentication and enforce authorization by default; an endpoint is public only by an explicit, recorded decision, and responses MUST NOT expose secrets or data beyond the caller's authorization.

**Rationale.** Default-open APIs leak data the first time someone forgets a check; default-deny fails safe.

**Applicability.** Every endpoint and field on the boundary.

**Conformance.** Every route resolves to an auth requirement under default-deny; public routes are explicitly marked; responses are scoped to the caller and carry no secrets or internal-only fields.

**Remediation.** Add the missing auth check; mark intended-public routes explicitly; redact over-shared fields.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.

---

### API-011 — Use consistent, unambiguous data formats
> **SHOULD** · severity: normal · status: active · effective: 2026-06-17 · compliance-by: 2026-09-30 · v1.0.0

**Rule.** Common value types SHOULD use one unambiguous, documented representation across the API.

**Rationale.** Ambiguous formats cause rounding bugs, timezone defects, and brittle parsing across consumers.

**Applicability.** All payload values of common types (timestamps, money, identifiers, enums).

**Conformance.** A schema or lint check enforces the canonical formats: timezone-qualified timestamps, non-float money, opaque identifiers, and documented closed enums.

**Remediation.** Migrate the field to the canonical format under a new version (`API-001`); document the enum set.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-002`.
