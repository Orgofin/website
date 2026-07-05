# Architecture Decision Records (ADRs)

> **Purpose:** Explains what an ADR is, when to write one, and the numbering/template convention — the index for this folder.
> **Applies to:** anyone (human or Claude) making a decision significant enough to need a permanent, dated record.

---

## What Goes Here

A point-in-time technical decision with real alternatives that were considered — not a living convention (those live in `.claude/context/`) and not a business fact (those live in `docs/product/`).

**Write an ADR when:** choosing between genuinely different technical approaches with real trade-offs (e.g., "defer a dedicated backend vs. build one now"), and the reasoning would be valuable to someone questioning the decision in a year.

**Don't write an ADR for:** routine implementation choices already covered by `.claude/context/coding-standards.md`, or anything easily reversible with no real trade-off debate.

## Naming & Numbering

`NNNN-short-title.md` — zero-padded four-digit sequence, permanent once assigned. If a decision is later superseded, mark the old ADR **Superseded by ADR-NNNN** in its own Status field — never renumber or delete it. The record of _why_ something used to be true is as valuable as the current decision.

## Template

```markdown
# ADR-NNNN: [Decision Title]

**Status:** Proposed | Accepted | Superseded by ADR-NNNN
**Date:** YYYY-MM-DD

## Context

What situation/problem prompted this decision.

## Decision

What was decided.

## Alternatives Considered

What else was on the table, and why it wasn't chosen.

## Consequences

What this makes easier, harder, or possible later — including honest trade-offs, not just upside.
```

## Index

- [ADR-0001: Frontend-First Architecture, No Dedicated Backend Yet](./0001-frontend-first-no-backend-yet.md)

## Current Status

One ADR recorded. This is the first entry in what should become the permanent decision log for the repository.

## TODO

None.

## References

- [`../../.claude/context/repository.md`](../../.claude/context/repository.md) — naming convention this folder follows

## Related Documents

- [`../../.claude/context/workflows.md`](../../.claude/context/workflows.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
