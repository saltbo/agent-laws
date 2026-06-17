# The Codes

This directory holds the **Codes** — bodies of law that derive their authority from the [Constitution](../CONSTITUTION.md). A Code may be **general** (binding every Agent) or **domain-specific** (binding Agents working in one domain, such as software maintenance). Each Code is a file composed of numbered **provisions**.

This document is the authoring specification: it defines how a provision is written, identified, and cited. It binds the Legislature when writing law and Agents when reading it.

## Law and its skill

A Code sets the **standard** and the **conformance bar** — it stays lean. The detailed *how to comply* — patterns, decisions, worked examples — belongs in an implementing **skill** under [`../skills/`](../skills/), which the Code links to from its header. The law judges; the skill shows the way. The skill is itself held to the law: a reviewer checks the skill against the Code, and a skill that contradicts the law is fixed. *(Example: the [API Design Law](30-api-design.md) links to the [`api-design`](../skills/api-design/SKILL.md) skill.)*

---

## Codex index

Codes are organized by domain. Today every in-force Code belongs to the **software-maintenance** domain — the first domain Agent Laws covers. As the law expands to other domains (research, operations, support…), each adds its own Codes, and conduct common to all domains may later be promoted into a **general** Conduct Code that binds every Agent.

### Software maintenance

| Code | Prefix | File | Status |
|---|---|---|---|
| Maintainer Conduct | `MC` | [`00-maintainer-conduct.md`](00-maintainer-conduct.md) | Active |
| Code Quality | `CQ` | [`10-code-quality.md`](10-code-quality.md) | Active |
| Architecture | `AR` | [`20-architecture.md`](20-architecture.md) | Active |
| API Design | `API` | [`30-api-design.md`](30-api-design.md) | Active |
| Testing | `TS` | `40-testing.md` | Planned |
| Security | `SEC` | `50-security.md` | Planned |
| Dependencies | `DEP` | `60-dependencies.md` | Planned |
| Change Management | `CM` | `70-change-management.md` | Planned |
| Documentation | `DOC` | `80-documentation.md` | Planned |

The protocols [reconciliation](../protocol/reconciliation.md) and [petition](../protocol/petition.md) have the force of a Code (Constitution Art. XI §3, Art. X §5).

---

## Anatomy of a provision

Every provision is a Markdown section with a heading, a one-line metadata block, and a fixed set of fields.

```markdown
### CQ-003 — No dead code
> **MUST** · severity: normal · status: active · effective: 2026-06-16 · compliance-by: — · v1.0.0

**Rule.** Unused code MUST be removed, not retained, disabled, or commented out.

**Rationale.** Dead code misleads readers, hides intent, and rots silently.

**Applicability.** All source under maintenance. Excludes generated code and vendored third-party code.

**Conformance.** No unreachable code, commented-out blocks, or symbols unused across the Project. Static analysis or dead-code detection passes.

**Remediation.** Delete the dead code. If it encodes intent worth keeping, record that intent in documentation or an issue, then delete.

**History.**
- v1.0.0 (2026-06-16): Enacted by Amendment `2026-001`.
```

### The metadata line

```
> **<NORMATIVE>** · severity: <level> · status: <status> · effective: <YYYY-MM-DD> · compliance-by: <YYYY-MM-DD | —> · v<semver>
```

Field order is fixed so the line is machine-parseable.

### The body fields

| Field | Required | Meaning |
|---|---|---|
| **Rule** | yes | The normative statement. One or two sentences. Uses RFC 2119 keywords. |
| **Rationale** | yes | Why the rule exists. |
| **Applicability** | yes | Where the rule applies; scope and explicit exceptions. |
| **Conformance** | yes | How an Agent determines compliance. Prefer checkable criteria. |
| **Remediation** | yes | How to bring a non-conforming charge into compliance. |
| **History** | yes | One line per version: `v<semver> (<date>): <change> by Amendment <id>`. |

A Code's header SHOULD link to its implementing skill (see [Law and its skill](#law-and-its-skill)). Detailed patterns and worked examples go in that skill, not in the provision.

---

## Normative keywords

Interpreted per **RFC 2119 / RFC 8174** when capitalized.

| Keyword | Meaning |
|---|---|
| **MUST** / **MUST NOT** | Absolute requirement or prohibition. |
| **SHOULD** / **SHOULD NOT** | Strong recommendation; deviation needs a justified reason (and usually a Waiver). |
| **MAY** | Truly optional; left to the Maintainer's judgment and Project convention. |

---

## Severity

Severity drives reconciliation priority, **not** correctness. A `low`-severity `MUST` is still mandatory.

| Severity | Scope | Reconciliation priority |
|---|---|---|
| `critical` | Security, data loss, licensing, irreversibility. | Highest. May justify expedited action. |
| `high` | Correctness, architectural integrity, public API contracts. | High. |
| `normal` | Maintainability, consistency, internal structure. | Ordinary. |
| `low` | Style, polish, cosmetics. | Lowest. Batched; never disruptive. |

---

## Status lifecycle

```
proposed ──► active ──► deprecated ──► repealed
```

| Status | In force? | Meaning |
|---|---|---|
| `proposed` | No | Enacted with a future Effective Date; in its grace period. Prepare, do not enforce. |
| `active` | Yes (once Effective Date arrives) | Binding law. |
| `deprecated` | Yes | Still binding, but scheduled for repeal; prefer its successor where one exists. |
| `repealed` | No (after repeal date) | No longer binding. Retained for history; never deleted. |

A provision is **in force** on a day when its status is `active` or `deprecated`, its `effective` date has arrived, and it has not been repealed as of that day.

---

## Identifiers

- IDs are `<PREFIX>-<NNN>` with a three-digit, zero-padded number (`MC-001`, `CQ-003`).
- IDs are **stable forever.** They are never renumbered and never reused.
- To remove a rule, **repeal** it (set `status: repealed` with a repeal date). Do not delete the provision.
- To change a rule materially, either amend it in place (bump `version`, add to **History**) or repeal it and enact a successor that references it via **Supersedes/Superseded-by** in History.

---

## Citing a provision in a change

Every law-driven change MUST cite the provision(s) that compelled it (Constitution Art. VII(e)). Add a trailer to the commit message and the pull request body:

```
Agent-Laws: CQ-003, CQ-004
```

This makes every change traceable to the law behind it.

---

## Adding or amending law

Lawmaking is the Legislature's power alone (Constitution Art. IX). The process:

1. **Draft.** Edit the relevant Code (or create a new one and register it in the index above). Set the provision's metadata, including its `effective` date and, if existing charges must be remediated by a deadline, its `compliance-by` date.
2. **Constitutional review.** Before the change takes effect, test it against the Constitution (Art. X). The review MUST be performed by someone other than the author (Art. X §3) and recorded. Use the checklist below.
3. **Record.** Note the change in [`../AMENDMENTS.md`](../AMENDMENTS.md) with an amendment ID and the review outcome.
4. **Commit.** Git history is the canonical version record; Agents reconcile against it.

### Constitutional review checklist

A provision passes only if every answer is "yes" (Constitution Art. X §2):

- [ ] **Scope** — it governs craft or conduct, not the purpose of a charge. *(Art. I §3)*
- [ ] **Principles** — it is consistent with the Foundational Principles. *(Art. III)*
- [ ] **Separation of powers** — it does not let the Executive legislate or self-judge. *(Art. IV)*
- [ ] **Hierarchy** — it does not conflict with the Constitution or with a higher or more specific provision; what it changes is properly amended, repealed, or superseded. *(Art. V, Art. IX §4)*
- [ ] **Rights** — it does not abridge an Agent's rights. *(Art. VIII)*
- [ ] **Form** — it is complete and checkable: stable ID, normative level, severity, status, a valid effective date, and conformance criteria. *(Art. IX §1)*

A provision that fails is unconstitutional and void until cured (Art. X §4).
