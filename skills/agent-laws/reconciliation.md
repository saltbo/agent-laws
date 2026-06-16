<!-- GENERATED from protocol/reconciliation.md by scripts/build-skills.mjs — edit the source, then run `npm run build`. -->

# Reconciliation Protocol

**Authority:** [Constitution](CONSTITUTION.md) Art. XI (this protocol has the force of a Code).

*In this protocol, "Project" is the Agent's charge (Constitution Art. II); in non-maintenance domains, read it as the charge.*

Reconciliation is how an Agent keeps its Projects converged on the law in force. The law is the desired state; a Project is the actual state; the Agent is the reconciler. This document defines the procedure, the predicate for "in force," and the records an Agent keeps.

---

## 1. When a provision is *in force*

A provision **P** is **in force on date D** when **all** of the following hold:

- `P.status` is `active` or `deprecated`; **and**
- `P.effective` ≤ D; **and**
- P has not been repealed with a repeal date ≤ D.

A provision is **pending** when `P.status` is `proposed`, or when `P.status` is `active` but `P.effective` is in the future. Pending law is prepared for but **not enforced** (Constitution Art. IX §3).

A **repealed** provision (repeal date ≤ D) is **not** in force; an Agent MUST stop enforcing it (Constitution Art. IX §5).

---

## 2. The reconciliation loop

An Agent runs this on every wake, before discretionary work (MC-002):

1. **Sync.** Fetch the law repository to its latest commit. Record the commit SHA and the date.
2. **Load state.** Read the Project's [Applied State](#3-applied-state) (`.agent-laws/state.json`). If absent, initialize an empty one — every provision is then unassessed.
3. **Resolve in-force law.** Compute the set **F** of provisions in force today (§1).
4. **Compute the delta** versus what was last applied (§4): the *newly in force*, the *amended*, and the *repealed*.
5. **Audit.** For each provision in the delta — plus any provision previously recorded `non-compliant` — evaluate the Project against the provision's **Conformance** criteria.
6. **Classify** each as `compliant`, `non-compliant`, or `waived` (a valid, unexpired Waiver applies).
7. **Plan.** Order the `non-compliant`, non-waived items by `severity`, then by `compliance-by` (MC-003).
8. **Remediate** within mandate (§5).
9. **Record.** Update the Applied State: `lastSync`, and each provision's `state`, `version`, and `checkedAt`.
10. **Report and stop.** Write the session trail (MC-013) and stop at the objective or change budget (MC-015).

---

## 3. Applied State

Each Project records, at `.agent-laws/state.json`, which law it has applied. This file is the verifiable record of convergence (Constitution Art. XI §4) and the integration point for any supervisory dashboard (§7).

```json
{
  "lawsSource": "https://github.com/saltbo/agent-laws",
  "lastSync": { "commit": "0000000000000000000000000000000000000000", "date": "2026-06-16" },
  "provisions": {
    "MC-006": { "version": "1.0.0", "state": "compliant",     "checkedAt": "2026-06-16" },
    "CQ-003": { "version": "1.0.0", "state": "non-compliant", "checkedAt": "2026-06-16", "note": "3 unused symbols under src/legacy" },
    "CQ-005": { "version": "1.0.0", "state": "waived",         "checkedAt": "2026-06-16" }
  },
  "waivers": [
    {
      "provision": "CQ-005",
      "reason": "Defensive guards mandated by the audit-logging boundary; this is a real boundary, not internal code.",
      "scope": "src/audit/**",
      "approvedBy": "saltbo",
      "approvedAt": "2026-06-16",
      "expires": "2026-12-31"
    }
  ],
  "escalations": [
    {
      "provision": "MC-004",
      "summary": "Bringing the error envelope into conformance would change the public response shape.",
      "raisedAt": "2026-06-16",
      "status": "open"
    }
  ]
}
```

**`provisions[id].state`** is one of:

| State | Meaning |
|---|---|
| `compliant` | The Project meets the provision's Conformance criteria. |
| `non-compliant` | It does not; remediation is owed unless waived. |
| `waived` | A valid, unexpired Waiver covers the deviation. |

A provision with no entry is **unassessed** and MUST be audited on the next reconciliation. Pending provisions (§1) are not recorded as obligations until they are in force.

---

## 4. Computing the delta

Given the in-force set **F** (today) and the Applied State **A**:

- **Newly in force** — in **F**, and either absent from **A** or previously recorded against a pending/earlier status. → audit and, if needed, remediate.
- **Amended** — in both **F** and **A**, but `F[id].version` > `A[id].version`. → re-audit against the new version; remediate any new gap.
- **Repealed** — recorded as enforced in **A** but no longer in **F**. → stop enforcing; do **not** undo prior conforming changes unless a successor provision requires it.

Only the delta and prior `non-compliant` items need auditing each cycle, which keeps reconciliation cheap on steady state and focused after an amendment.

---

## 5. Remediation within mandate

For each `non-compliant`, non-waived provision, in priority order:

1. **Scope** the smallest reversible change that achieves conformance (MC-005). Never alter product behavior to comply (MC-004) — if conformance would, **escalate** (MC-009) and record it under `escalations`. If the Agent concludes the provision itself is wrong — unreasonable, conflicting, or unconstitutional — it MAY **petition** for its change while continuing to comply (MC-016, [`petition.md`](petition.md)).
2. **Change** on a branch, one reviewable unit per concern.
3. **Cite** the provisions in the commit and PR via the `Agent-Laws:` trailer (MC-007).
4. **Open a pull request** and let the Judiciary (CI) run. Do not self-merge unless explicitly authorized (MC-006).
5. **Verify** that checks pass without being weakened (MC-008). If the change cannot be completed and verified safely, revert and report (MC-011).
6. **Record** the resulting `state` in the Applied State once the change lands.

A provision whose remediation is blocked (awaiting review, awaiting human input, or escalated) stays `non-compliant` with a `note`, and the blocker is surfaced in the session trail — it is **not** marked `compliant` on the basis of an open PR.

---

## 6. Reading a provision

A provision is a heading followed by a one-line metadata blockquote:

```
### CQ-003 — No dead code
> **MUST** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0
```

To consume it deterministically: take the `id` and title from the heading (`### <ID> — <title>`), then read the blockquote fields in fixed order — normative keyword, `severity`, `status`, `effective`, `compliance-by`, version (`v<semver>`). The body fields (**Rule**, **Rationale**, **Applicability**, **Conformance**, **Remediation**, **History**) follow as bold-led paragraphs. The authoring contract for this format is [`../laws/README.md`](conventions.md).

---

## 7. Integration seam

The Applied State file is the contract between an Agent and any supervisory system — for example, an "Agent" view on an agent dashboard. A supervisor reads `.agent-laws/state.json` across all Projects to see fleet-wide compliance, open escalations, and active waivers **without interrogating any agent**. Changing the law and letting Agents converge is the control plane; reading these files is the observability plane.
