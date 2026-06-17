# Skills

This directory holds **best-practice skills** — concrete *how-to* capabilities a working agent loads to do a task well. A skill answers **"how do I do this?"**

Skills are a different kind of thing from the **laws** ([`../CONSTITUTION.md`](../CONSTITUTION.md), [`../laws/`](../laws/)), which answer **"what is required, and am I compliant?"** The law sets the bar and judges; the skill helps clear it.

| | Law | Skill |
|---|---|---|
| Answers | what is required / am I compliant? | how do I do it well? |
| Nature | binding standard (governance) | capability (know-how) |
| Used by | the **reviewer** agent, to judge | the **worker** agent, to build |
| Failure | a violation | doing it badly |

## The two-agent model

- A **worker agent** loads the relevant **skills** and produces the work.
- A **reviewer agent** applies the **laws** to judge that work — does the implementation meet the standard?

They are complementary, and usually different agents.

## The laws are the standard for these skills

The wider skill ecosystem has no quality bar — anyone publishes anything. Here, **every skill is held to Agent Laws.** A reviewer agent judges not only implementations but the skills themselves: a skill that advises something a law forbids is non-compliant and gets fixed (raise it via [petition](../protocol/petition.md) if the law itself is wrong). Each skill names the law it serves, and its guidance must stay consistent with that law.

## Install (skills.sh)

These are real, individually installable skills:

```bash
npx skills add saltbo/agent-laws --skill api-design   # one skill
npx skills add saltbo/agent-laws -g                    # all skills, globally
```

*(The laws are not skills; they are delivered to reviewer agents by a separate mechanism.)*

## Index

| Skill | Serves | Status |
|---|---|---|
| [`api-design`](api-design/SKILL.md) | API Design Law (`API-*`) | Active |
| `error-handling` | Code Quality Law (`CQ-004`) + future Error Handling Law | Planned |
| `architecture` | future Architecture Law (`AR-*`) | Planned |
| `testing` | future Testing Law (`TS-*`) | Planned |

## Authoring a skill

Each skill is `skills/<name>/SKILL.md` with `name` and `description` frontmatter followed by how-to guidance. Keep it practical and opinionated — methods, patterns, decisions — and tie each section to the law provision it helps satisfy. Where the relevant law does not yet exist, the skill may lead; the law follows and ratifies the standard.
