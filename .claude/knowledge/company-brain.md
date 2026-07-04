# Domain Knowledge: Company Brain

> **Purpose:** What "Company Brain" actually means as a product concept — the reference Claude should consult whenever writing copy, features, or explanations that use this term, instead of re-reading the source PDF each time.
> **Applies to:** anyone (human or Claude) writing about Company Brain anywhere on the website or in product material.

---

## Responsibilities

Owns the concept definition, sourced faithfully from `docs/product/orgofin-idea.pdf`. Does not own how it's *visually* represented (`docs/product/copy.md` §1 Chapter 5, and the eventual `CompanyBrainGraph` component per `.claude/context/frontend.md`) — this file is the concept; those are its expressions.

## What It Is

The unified, continuously-updated knowledge graph of an entire organisation — the foundational layer beneath every Orgofin product module. Unlike a data warehouse (static, batch-updated), it is **event-driven and real-time**: every action in any Orgofin module immediately updates the graph.

## What It Knows (per the source PDF)

- **Every employee** — role, skills, performance history, compensation, reporting structure, compliance status
- **Every customer** — lifecycle, communication history, invoices, support tickets, NPS, contract terms
- **Every financial transaction** — mapped to cost centres, GST categories, reconciliation status
- **Every document** — contracts, policies, meeting notes, SOPs — indexed and semantically searchable
- **Every workflow** — who approved what, when, and why, with full audit trails
- **Every decision** — historical reasoning, outcomes, and dependencies

## Its Four Internal Components (per the source PDF §4.2)

1. **Organisational Entity Graph** — every business entity (Employee, Customer, Vendor, Project, Document, Invoice, Policy, Role) is a node in a property graph; relationships carry context (e.g., "Employee A approved Invoice B for Project C billed to Customer D"). This cross-entity reasoning is the thing no siloed SaaS tool can do.
2. **Event Engine** — every action emits a structured event (`EMPLOYEE_JOINED`, `INVOICE_APPROVED`, `TICKET_ESCALATED`); the event stream feeds the graph in real time and triggers agent workflows automatically.
3. **Context Engine** — when a user or agent asks a question, retrieves relevant subgraphs, recent events, and historical decisions to construct rich context — this is what lets an agent answer "why did our Bangalore payroll cost increase 12% last month?" without manual data preparation.
4. **Decision Intelligence** — over time, learns the organisation's decision patterns (approval thresholds, anomaly significance, preferred report formats) — this organisational learning is described as a compounding moat competitors can't replicate without months of re-learning per customer.

## The Core Philosophy It Embodies

> "Enterprise software is tool-centric. The future is company-centric. Orgofin does not build tools — it builds the brain that makes tools obsolete."
> "Every competitor builds products and then tries to connect them. Orgofin builds the brain first, and the products emerge from it."

This is the single most repeated idea in the source material and the one no copy should ever contradict, even implicitly (e.g., describing a module as if it existed independently of the Brain).

## Current Status

Concept only — no Company Brain implementation exists. This repository builds the marketing/waitlist website, not the product.

## Future Improvements

If the source PDF is ever revised or superseded by a newer vision document, this file must be re-derived from the new source, not hand-edited to drift from it.

## TODO

None — this is a faithful, complete extraction of everything the source PDF says about Company Brain as of the current version.

## References

- `docs/product/orgofin-idea.pdf` — pp. 6, 9 (§3 "Our Solution — Layer 1," §4.2 "Company Brain Architecture")

## Related Documents

- [`hrms.md`](./hrms.md)
- [`ai-agents.md`](./ai-agents.md)
- [`enterprise-os.md`](./enterprise-os.md)

---
**Last Updated:** 2026-07-04
**Owner:** Orgofin Product (TODO: assign a DRI)
