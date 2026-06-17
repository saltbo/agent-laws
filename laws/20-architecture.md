# Architecture Law

**Prefix:** `AR` · **Domain:** software maintenance · **Authority:** [Constitution](../CONSTITUTION.md), esp. Articles I, III.

This Code governs software architecture — how a system's parts depend on one another — universally, independent of language, framework, or stack. It codifies the **Dependency Rule** and clean-architecture boundaries. It sets the standard and the conformance bar; *how* to apply it on a given stack lives in an implementing skill — e.g. [`hono-cf-clean-arch`](../skills/hono-cf-clean-arch/SKILL.md) (Hono + Cloudflare Workers + React). **The law judges; the skill shows the way.**

Architecture is **structure, not behavior** (Constitution Art. I §3): an architectural change is a refactor and MUST NOT alter what the system does — where conformance would change behavior, the Maintainer escalates (`MC-004`). Where a Project has an established, documented architecture that meets a provision's intent, that convention controls (`CQ-008`, `MC-014`); deviations are recorded as Waivers. Because restructuring is high-effort, existing projects are remediated by ordinary reconciliation priority (no forced deadline) — but new work is bound from the effective date.

---

### AR-001 — The Dependency Rule: dependencies point inward
> **MUST** · severity: critical · status: active · effective: 2026-06-17 · compliance-by: — · v1.0.0

**Rule.** Source dependencies MUST point inward, toward higher-level policy. Business rules MUST NOT depend on frameworks, UI, databases, or I/O; outer layers depend on inner ones, never the reverse.

**Rationale.** When policy depends on detail, every change to a detail risks the core; inverting that dependency is what makes a system soft.

**Applicability.** Any codebase with a distinguishable core of business rules. Trivial scripts and single-purpose adapters are exempt.

**Conformance.** A dependency/architecture check (e.g. dependency-cruiser, import-linter, ArchUnit) reports no inward layer importing an outer or framework module.

**Remediation.** Invert the offending dependency behind an interface owned by the inner layer (`AR-003`); move the detail outward.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-003`.

---

### AR-002 — Business logic is independent of frameworks and details
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: — · v1.0.0

**Rule.** Business logic MUST be independent of frameworks, persistence, and delivery mechanisms; these are replaceable details kept behind boundaries.

**Rationale.** Frameworks and databases outlive no system unchanged; coupling policy to them makes them impossible to replace and hard to test.

**Applicability.** The domain and application (use-case) layers.

**Conformance.** Domain and use-case modules import no web framework, ORM, or transport package; replacing a detail (database, web framework) requires no change to business rules.

**Remediation.** Extract the framework/DB usage into an adapter behind a port (`AR-003`).

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-003`.

---

### AR-003 — Cross boundaries only through explicit ports
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: — · v1.0.0

**Rule.** Crossing a process or system boundary (database, network, queue, clock, filesystem) MUST go through an explicit interface — a **port** — declared by the inner layer; outer layers implement it (dependency inversion).

**Rationale.** A named boundary is the seam that lets details vary and tests substitute fakes.

**Applicability.** Every dependency on something beyond the process boundary.

**Conformance.** Each external capability has an interface owned inward; adapters implement it; inner code depends on the interface, not the implementation.

**Remediation.** Define the port in the inner layer; move the concrete call into an adapter that implements it.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-003`.

---

### AR-004 — Do not leak details across a boundary
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: — · v1.0.0

**Rule.** Framework and transport objects and persistence rows MUST NOT cross into business layers; data crossing a boundary is plain, framework-free.

**Rationale.** A request object or ORM row in a use-case re-couples policy to the detail it was meant to be free of.

**Applicability.** All data passed across a layer boundary.

**Conformance.** No request/response/ORM-row type appears in domain or use-case signatures; boundary data is plain DTOs.

**Remediation.** Map the framework/row type to a plain shape at the adapter before it crosses inward.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-003`.

---

### AR-005 — Business rules are testable in isolation
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: — · v1.0.0

**Rule.** It MUST be possible to test business rules without a framework, UI, database, or network.

**Rationale.** Testability in isolation is both the payoff of clean boundaries and the litmus test that they exist.

**Applicability.** Domain and use-case layers.

**Conformance.** Use-case and domain tests run against fake ports, with no real I/O, framework, or database.

**Remediation.** Introduce the missing port so the dependency can be faked (`AR-003`).

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-003`.

---

### AR-006 — Wire dependencies in a single composition root
> **SHOULD** · severity: normal · status: active · effective: 2026-06-17 · compliance-by: — · v1.0.0

**Rule.** Concrete dependencies SHOULD be constructed and wired in one composition root; inner layers MUST NOT construct their own outward dependencies or reach for global singletons holding I/O state.

**Rationale.** One wiring place keeps the graph visible and inner layers pure and substitutable.

**Applicability.** Application start-up / request setup.

**Conformance.** Adapters are constructed only at the composition root; no inner module instantiates an adapter or a global I/O singleton.

**Remediation.** Move construction to the composition root; pass dependencies in.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-003`.

---

### AR-007 — Enforce boundaries with an automated check
> **MUST** · severity: high · status: active · effective: 2026-06-17 · compliance-by: — · v1.0.0

**Rule.** Architectural boundaries MUST be enforced by an automated check in CI, not by prose alone.

**Rationale.** Prose rules decay; a failing build does not. Boundaries that aren't enforced are eventually crossed.

**Applicability.** Any project asserting layered or hexagonal boundaries.

**Conformance.** A dependency/architecture linter (e.g. dependency-cruiser, import-linter, ArchUnit, eslint-plugin-boundaries) runs in CI and fails the build on a boundary violation.

**Remediation.** Add the linter and its ruleset; wire it into CI.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-003`.

---

### AR-008 — Proportion over ceremony
> **SHOULD** · severity: normal · status: active · effective: 2026-06-17 · compliance-by: — · v1.0.0

**Rule.** Structure SHOULD be proportional to the problem. Architectural ceremony — layers, indirections, or patterns that do not earn their cost — SHOULD NOT be added.

**Rationale.** Boundaries exist to manage real change and real dependencies; indirection with neither just raises the cost of every edit (`CQ-001`, `CQ-009`).

**Applicability.** All architectural structure.

**Conformance.** No empty pass-through layers; no indirection without a real boundary or a second implementation; layer sizes are proportional to the project.

**Remediation.** Collapse the ceremonial layer; call the boundary directly until a real reason to abstract appears.

**History.**
- v1.0.0 (2026-06-17): Enacted by Amendment `2026-003`.
