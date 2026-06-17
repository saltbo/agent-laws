# Amendments

This is the legislative ledger of Agent Laws. Every enactment, amendment, and repeal is recorded here in addition to git history. Maintainers reconcile against the law in force (see [`protocol/reconciliation.md`](protocol/reconciliation.md)); this ledger is the human-readable account of how the law got there.

## Entry format

```
## <id> — <title>
- **Enacted:** YYYY-MM-DD
- **Effective:** YYYY-MM-DD
- **Compliance deadline:** YYYY-MM-DD | —
- **Affects:** <provision IDs or documents>
- **Constitutional review:** passed | <finding and cure> (Art. X)
- **Legislator:** <name>

<Summary of what changed and why.>
```

Amendment IDs are `YYYY-NNN`, allocated in order within a year. They are stable and never reused.

---

## 2026-001 — Founding enactment

- **Enacted:** 2026-06-16
- **Effective:** 2026-06-16
- **Compliance deadline:** —
- **Affects:** [`CONSTITUTION.md`](CONSTITUTION.md) (Articles I–XV); Maintainer Conduct Law `MC-001`–`MC-016`; Code Quality Law `CQ-001`–`CQ-010`; [`protocol/reconciliation.md`](protocol/reconciliation.md); [`protocol/petition.md`](protocol/petition.md)
- **Constitutional review:** Passed — founding baseline. The enacted Codes and protocols were reviewed against this Constitution (Art. X §2). As the founding act, the Constitution is adopted by ratification rather than tested against a prior one.
- **Legislator:** saltbo

Establishes the legal system. Adopts the Constitution as the supreme, **domain-neutral** law governing all Agents — its framework (separated powers, enumerated and reserved authority, a bill of rights, judicial review, amendment over time) adapted from the constitutional tradition and generalized from people to autonomous Agents. It includes the Agent's duties and rights (Art. VII–VIII), constitutional review of all legislation (Art. X), the duty to reconcile (Art. XI), and continuity and succession (Art. XIII). Enacts the first domain's Codes — the Maintainer Conduct Law and the Code Quality Law (software maintenance) — at version 1.0.0, and gives the Reconciliation and Petition protocols the force of a Code. With no compliance deadline, existing charges are brought into conformance by ordinary reconciliation priority — severity first.

---

## 2026-002 — Enact the API Design Law

- **Enacted:** 2026-06-17
- **Effective:** 2026-06-17
- **Compliance deadline:** 2026-09-30
- **Affects:** API Design Law `API-001`–`API-011` (new, software-maintenance domain); a Code now links to an implementing skill ([`laws/README.md`](laws/README.md)); the [`api-design`](skills/api-design/SKILL.md) skill is added as its execution guidance
- **Constitutional review:** Passed. Governs craft — interface design — not product behavior (Art. I §3); consistent with the Foundational Principles; each rule paired with a checkable conformance bar (Art. IX §1, Art. X §2(f)); abridges no right (Art. VIII). Reviewed independently of drafting (Art. X §3).
- **Legislator:** saltbo

Enacts the first technical Code. The law stays **lean** — rule, scope, and a checkable **conformance** bar — and points to its implementing [`api-design`](skills/api-design/SKILL.md) skill, where the detailed method and worked examples live (statute and implementing guidance, kept separate). New API work is bound from the Effective Date; existing APIs must reach conformance by the Compliance Deadline, in ordinary reconciliation priority — severity first.
