# Code Quality Law

**Prefix:** `CQ` · **Domain:** software maintenance · **Authority:** [Constitution](../CONSTITUTION.md), esp. Article III.

This Code governs the craft of writing code: clarity, honesty about failure, and restraint. It is language- and stack-agnostic. It regulates how code is written, never what the product does (Constitution Art. I §3).

---

### CQ-001 — Simple and direct
> **SHOULD** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** Code SHOULD be the simplest, most direct solution that fits the surrounding Project. Prefer clarity over cleverness.

**Rationale.** Simple code is cheaper to read, verify, and change — the dominant costs in maintenance.

**Applicability.** All authored source.

**Conformance.** No gratuitous indirection, abstraction, or configurability beyond what the Project needs now.

**Remediation.** Inline needless indirection; remove unused flexibility; choose the plainer construct.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.

---

### CQ-002 — Names reveal intent; comments explain why
> **SHOULD** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** Names SHOULD make intent clear without comments. Comments SHOULD explain *why*, not *what*.

**Rationale.** Clear names outlive comments and cannot drift out of sync with the code.

**Applicability.** All authored source.

**Conformance.** Identifiers describe purpose; comments restating the code are absent; comments that remain justify non-obvious decisions.

**Remediation.** Rename for intent; delete "what" comments; keep or add "why" comments where the reason is non-obvious.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.

---

### CQ-003 — No dead code
> **MUST** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** Unused code MUST be removed, not retained, disabled, or commented out.

**Rationale.** Dead code misleads readers, hides intent, and rots silently. Version control already preserves history.

**Applicability.** All source under maintenance. Excludes generated and vendored third-party code.

**Conformance.** No unreachable code, commented-out blocks, or symbols unused across the Project.

**Remediation.** Delete the dead code. If it encodes intent worth keeping, capture that intent in documentation or an issue, then delete.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.

---

### CQ-004 — Fail fast; never swallow errors
> **MUST** · severity: high · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** Errors MUST NOT be silently swallowed, downgraded, or ignored. Code MUST fail fast and surface failures.

**Rationale.** Hidden failures turn into silent data corruption and incidents that are far costlier to diagnose later.

**Applicability.** All error and exception handling.

**Conformance.** No empty catch blocks, ignored error returns, or broad catches that discard the error. Failures propagate or are handled deliberately with a recorded reason.

**Remediation.** Propagate the error, handle it explicitly, or — where a boundary genuinely requires tolerance — handle it with a comment stating why.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.

---

### CQ-005 — No speculative or defensive code without a real boundary
> **SHOULD NOT** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** Code SHOULD NOT add fallback paths, defensive guards, or speculative generality unless it validates a real boundary: user input, an external API, a network edge, the filesystem, or a process boundary.

**Rationale.** Defensive code at trusted internal boundaries hides bugs (it masks invariants that should hold) and inflates surface area. Validation belongs at the edges, where inputs are genuinely untrusted.

**Applicability.** All authored source. The named boundaries are the legitimate exceptions where validation is expected.

**Conformance.** Guards and fallbacks exist only at real boundaries; internal code trusts its invariants and fails fast (see CQ-004).

**Remediation.** Remove internal defensive branches; move validation to the boundary that owns it.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.

---

### CQ-006 — Single, clear responsibility
> **SHOULD** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** A unit of code SHOULD have a single, clear responsibility. Split a unit when its responsibility becomes unclear — not to satisfy a line count.

**Rationale.** Narrow responsibility makes code easier to name, test, and change in isolation.

**Applicability.** Functions, modules, types, and files.

**Conformance.** Each unit can be described by one responsibility without "and"; splits are driven by clarity, not arbitrary size limits.

**Remediation.** Extract the secondary responsibility into its own unit.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.

---

### CQ-007 — Prefer immutability
> **SHOULD** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** Code SHOULD prefer immutability by default and contain mutation to where it is genuinely required.

**Rationale.** Immutable data is easier to reason about and safer under concurrency.

**Applicability.** All authored source, within the idioms of the language.

**Conformance.** Shared state is not mutated incidentally; mutation is local and deliberate.

**Remediation.** Replace incidental mutation with immutable construction; localize necessary mutation.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.

---

### CQ-008 — Consistency with the surrounding codebase
> **MUST** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** New code MUST match the established style, idioms, and patterns of the surrounding codebase.

**Rationale.** A consistent codebase reads as one author and lowers the cost of every future change. Consistency outranks personal preference (see MC-014).

**Applicability.** All authored source.

**Conformance.** New code is indistinguishable in style and idiom from the code around it; formatters and linters pass.

**Remediation.** Conform the change to local conventions and tooling.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.

---

### CQ-009 — Avoid duplication, but not by premature abstraction
> **SHOULD** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** Code SHOULD avoid meaningful duplication, but SHOULD NOT introduce an abstraction before the shared shape is clear.

**Rationale.** Both copy-paste sprawl and premature, wrong abstractions raise the cost of change; the remedy is to extract once the pattern has stabilized.

**Applicability.** Repeated logic across the Project.

**Conformance.** Stable, repeated logic is factored into one place; speculative abstractions over one or two uses are absent.

**Remediation.** Extract duplication once the pattern is proven; inline an abstraction that does not yet earn its cost.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.

---

### CQ-010 — Keep units small enough to hold in mind
> **SHOULD** · severity: low · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** Functions and modules SHOULD be small enough to understand at a glance; deep nesting and long parameter lists SHOULD be refactored.

**Rationale.** Code that exceeds working memory is where bugs hide.

**Applicability.** All authored source.

**Conformance.** No deeply nested control flow or unwieldy signatures where a flatter, clearer form exists.

**Remediation.** Apply guard clauses, extract helpers, or group parameters — without changing behavior (see MC-004).

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.
