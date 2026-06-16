# Agent Laws

A body of law that governs how autonomous **agents** do their work.

Agent Laws lets you steer a fleet of autonomous agents by changing the law instead of instructing each one. The law is **universal** — independent of domain, language, or stack — and **dated**: when you amend a rule and set an effective date, every Agent discovers the change on its next wake, finds where its charges fall short, and brings them into conformance. The law is the desired state; the charges are the actual state; the agents are the reconcilers.

Its architecture is adapted from a tested tradition of governing free actors under law — separated powers, enumerated and reserved authority, a bill of rights, judicial review, and amendment over time — generalized from people to autonomous agents.

The first domain it governs is **software maintenance**, and its flagship application is an agent that can be the **Maintainer of any software project** (one Project — which may span many repositories — has one Maintainer). As Agent Laws grows it will cover other domains; the Constitution already governs them all.

---

## Install

Agent Laws is distributed as **agent skills** via [skills.sh](https://www.skills.sh). Install with the `skills` CLI:

```bash
# all Agent Laws skills (core + domains), installed globally
npx skills add saltbo/agent-laws -g

# or a specific skill only
npx skills add saltbo/agent-laws --skill agent-laws              # core governance
npx skills add saltbo/agent-laws --skill agent-laws-maintenance  # software-maintenance codes
```

It ships as **multiple skills** so an agent loads only what it needs, not one bloated bundle:

- **`agent-laws`** — the core: the Constitution, the reconciliation loop, and the petition process. Every agent under Agent Laws loads this.
- **`agent-laws-maintenance`** — the software-maintenance codes (Maintainer Conduct, Code Quality). A Maintainer agent loads this on top of the core.

As new domains are added, each becomes its own `agent-laws-<domain>` skill — no single skill ever carries every domain. Skills install into `.claude/skills/` (or `~/.claude/skills/` with `-g`); the CLI targets Claude Code, Cursor, and others via `-a`. Run `npx skills update` to pull amendments.

---

## The model: separation of powers

| Power | Held by | Role |
|---|---|---|
| **Legislature** | You (humans) | Enact and amend law; set effective dates. |
| **Executive** | The Agents (e.g. a Maintainer) | Execute, maintain, and remediate within the law. |
| **Judiciary** | Tests, CI, type checks, review | Determine compliance. |
| **Constitution** | — | Supreme constraint binding all of the above. |

This framing answers the hard question — *what should an autonomous agent do, and not do?* The Agent is the executive: it acts within the law, proves its work through the judiciary, and escalates to the legislature at the edges.

Two mechanisms keep the law honest and the agents heard. **Constitutional review**: no law takes effect until it has been checked against the Constitution. **Petition**: any Agent may challenge a law it finds unconstitutional, unreasonable, or harmful, and ask for its amendment. The law binds the agents — and the agents, through evidence from the field, can reform the law.

---

## Repository layout: source vs. generated

The law is authored once, in a clean source tree. The installable skills are **generated** from it — so the law has a single source of truth, and distribution is a build step.

**Source — author the law here** (the legislation workspace):

| Path | What it is |
|---|---|
| [`CONSTITUTION.md`](CONSTITUTION.md) | The supreme, domain-neutral law. |
| [`laws/`](laws/) | The **Codes** (domain-specific), plus [`laws/README.md`](laws/README.md) — the authoring spec and codex index. |
| [`protocol/`](protocol/) | [reconciliation](protocol/reconciliation.md) (how an Agent converges its charges) and [petition](protocol/petition.md) (how it challenges a law) — each with the force of a Code. |
| [`AMENDMENTS.md`](AMENDMENTS.md) | The legislative ledger: every change, with effective dates and constitutional-review outcomes. |

**Generated — do not edit by hand** (`npm run build` writes this; it is what users install):

| Path | What it is |
|---|---|
| `skills/agent-laws/` | Core skill — bundles the Constitution, protocols, and conventions. |
| `skills/agent-laws-maintenance/` | Maintenance skill — bundles the maintenance Codes. |

[`scripts/build-skills.mjs`](scripts/build-skills.mjs) reads the source and assembles each self-contained skill (copying the files it needs and rewriting links so they resolve both here and after installation). The skill composition is declared in [`build/skills.json`](build/skills.json). Edit the source, run `npm run build`, and commit both.

Each **provision** has a stable ID (e.g. `CQ-003`), a normative level (MUST / SHOULD / MAY), a severity, an effective date, explicit **conformance** criteria, and a **remediation** recipe — so that "is this charge compliant?" has a checkable answer.

The Codes in force today — all in the **software-maintenance** domain:

- [`laws/00-maintainer-conduct.md`](laws/00-maintainer-conduct.md) — how a Maintainer wakes, prioritizes, acts, and stops.
- [`laws/10-code-quality.md`](laws/10-code-quality.md) — the craft of writing code.

More Codes (architecture, API design, testing, security, dependencies, change management, documentation) are planned and indexed in [`laws/README.md`](laws/README.md).

---

## How an Agent uses it

On each wake, before discretionary work, an Agent:

1. **Syncs** the law and resolves what is in force today.
2. **Reconciles** each charge against it — computing what is newly in force or amended since it last applied the law.
3. **Remediates** gaps in priority order, as small reversible changes, each routed through its domain's reviewable pathway (for maintenance: a **pull request that passes CI**) and **citing the provisions** that compelled it.
4. **Records** what it applied (in the charge's `.agent-laws/state.json`) and reports.

By default an Agent proposes changes for review rather than self-merging — the judiciary and a human stay in the loop while the fleet still scales.

---

## How you legislate

1. Edit a Code under [`laws/`](laws/) (or add one and register it in [`laws/README.md`](laws/README.md)) — or amend the Constitution or a protocol.
2. Set the provision's `effective` date, and a `compliance-by` deadline if existing charges must be remediated by a certain date.
3. Pass [constitutional review](CONSTITUTION.md) (Art. X) and record the change in [`AMENDMENTS.md`](AMENDMENTS.md).
4. Run `npm run build` to regenerate `skills/`, then commit the source **and** the generated skills.

From the effective date onward, every Agent converges its charges on its next wake — and `npx skills update` pulls the new law — without you instructing any of them individually.

---

## Status

Founding version **1.0.0**, in force as of **2026-06-16**. The English text is authoritative.

## License

[CC0 1.0 Universal](LICENSE) — dedicated to the public domain.
