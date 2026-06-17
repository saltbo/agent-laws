# Agent Laws

A body of law that governs how autonomous **agents** do their work — paired with a library of **best-practice skills** held to that law.

Two different things live here, and keeping them distinct is the whole point:

- **Laws** say *what* is required — what an agent may and may not do, what a result must and must not look like. Laws are the binding standard; an agent is **judged** against them.
- **Skills** say *how* — the concrete craft of doing a thing well. Skills are capability; an agent **loads** them to build.

The law sets the bar and judges; the skill helps clear it. The law even keeps the skills honest — the wider skill ecosystem has no quality bar, so here **every skill is held to the law.**

| | **Law** | **Skill** |
|---|---|---|
| Answers | *what is required / am I compliant?* | *how do I do it well?* |
| Nature | binding standard (governance) | capability (know-how) |
| Used by | the **reviewer** agent, to judge | the **worker** agent, to build |
| Changes via | amendment + effective date + reconciliation | just update the know-how |
| Failure | a violation | doing it badly |

**The two-agent model:** a **worker** agent loads the relevant **skills** and produces the work; a **reviewer** agent applies the **laws** to judge it — both the implementation *and* the skills that produced it.

---

## The Laws — governance

The binding standard, for reviewer agents.

| Path | What it is |
|---|---|
| [`CONSTITUTION.md`](CONSTITUTION.md) | The supreme, domain-neutral law: principles, separation of powers, rights, constitutional review, lawmaking, reconciliation. |
| [`laws/`](laws/) | The **Codes** — domain-specific law, composed of citable provisions. See [`laws/README.md`](laws/README.md) for the index and authoring spec. |
| [`protocol/`](protocol/) | [reconciliation](protocol/reconciliation.md) (how an agent converges its charges) and [petition](protocol/petition.md) (how it challenges a law) — each with the force of a Code. |
| [`AMENDMENTS.md`](AMENDMENTS.md) | The legislative ledger: every change, with effective dates and constitutional-review outcomes. |

The law is **dated**: amend a rule, set an effective date, and every agent — on its next wake — discovers the change and brings its work into conformance. The law is the desired state; the work is the actual state; the agents reconcile. **Separation of powers** keeps it honest: you (the Legislature) make law; agents (the Executive) act within it; tests/CI/review (the Judiciary) determine compliance; the Constitution binds all three. No law takes effect until it passes **constitutional review**, and any agent may **petition** to change a law it finds wrong.

Each **provision** carries a stable ID (e.g. `API-001`), a normative level (MUST/SHOULD/MAY), a severity, an effective date, explicit **conformance** criteria, and a **remediation** recipe — so "is this compliant?" has a checkable answer.

Codes in force today (software-maintenance domain): [`maintainer-conduct`](laws/00-maintainer-conduct.md), [`code-quality`](laws/10-code-quality.md), [`architecture`](laws/20-architecture.md), [`api-design`](laws/30-api-design.md).

---

## The Skills — best practice

The concrete how-to, for worker agents. Each skill is `skills/<name>/SKILL.md`; each is **held to the law** and names the law it serves. See [`skills/README.md`](skills/README.md).

Active: [`api-design`](skills/api-design/SKILL.md) — how to design clear, evolvable APIs (pairs with the API Design Law); [`hono-cf-clean-arch`](skills/hono-cf-clean-arch/SKILL.md) — clean architecture for Hono + Cloudflare Workers + React (pairs with the Architecture Law).

A law and its skill are a matched pair: the [API Design **Law**](laws/30-api-design.md) says *APIs MUST be versioned and conformance is a passing schema-diff*; the [API Design **skill**](skills/api-design/SKILL.md) says *here is how to choose a versioning strategy and wire that check up*.

---

## Install

The **skills** are real, individually installable via [skills.sh](https://www.skills.sh):

```bash
npx skills add saltbo/agent-laws --skill api-design   # one skill
npx skills add saltbo/agent-laws -g                    # all skills, globally
```

The **laws** are governance, not a skill — they are delivered to reviewer agents by a separate mechanism (to be defined). For now, point a reviewer at this repository's `CONSTITUTION.md`, `laws/`, and `protocol/`.

---

## How you extend it

**Legislate (a law):** edit a Code under [`laws/`](laws/) (or add one); set its `effective` date and any `compliance-by` deadline; pass [constitutional review](CONSTITUTION.md) (Art. X); record it in [`AMENDMENTS.md`](AMENDMENTS.md). From the effective date, every agent converges on its next wake.

**Author (a skill):** add `skills/<name>/SKILL.md` with practical how-to, tied to the law it serves. If the relevant law doesn't exist yet, the skill may lead and the law follows.

---

## Status

Founding version **1.0.0**, in force as of **2026-06-16**; API Design Law added by Amendment `2026-002` (2026-06-17). The English text is authoritative.

## License

[CC0 1.0 Universal](LICENSE) — dedicated to the public domain.
