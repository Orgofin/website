# Platform Architecture Overview (Future State)

> **Purpose:** The eventual full Orgofin platform's technical architecture, as described in the source vision document — for onboarding/investor/engineering context. This is **not** the architecture of anything in this repository today.
> **Applies to:** anyone trying to understand where the current website work fits into Orgofin's eventual full product.

---

## Responsibilities

Owns the long-term, full-platform architecture (HRMS + Finance + CRM + Company Brain + AGaaS, at scale) as described in `orgofin-idea.pdf` §4. Does not own this repository's actual architecture — see [`.claude/context/frontend.md`](../../.claude/context/frontend.md) and [`.claude/context/architecture.md`](../../.claude/context/architecture.md) for what's real today.

## Scope Warning

**Nothing described in this document is implemented anywhere in this repository.** This repository builds the marketing/waitlist website (H1 of the roadmap in `docs/product/vision.md`). This document exists so that a new engineer, investor, or Claude session understands the destination without mistaking it for the current state.

## The Six-Layer Stack (per the source PDF §4.1)

| Layer | Name | Responsibility | Example Technologies Named in Source |
|---|---|---|---|
| L6 | Application Layer | 40+ product modules (HRMS, Books, CRM, Desk, etc.) | React, Next.js, Module Federation |
| L5 | Agent Layer (AGaaS) | Autonomous agents, multi-agent orchestration, task execution | LangGraph, AutoGen, Custom Agent Runtime |
| L4 | Workflow Engine | Business process automation, approvals, triggers, state machines | Temporal.io, BPMN, Custom Rule Engine |
| L3 | Company Brain | Entity graph, organisational memory, context engine, semantic search | Neo4j, pgvector, Qdrant, Knowledge Graph |
| L2 | Data & Integration Layer | Event bus, CDC, API gateway, external connectors, iPaaS | Kafka, Debezium, Kong, Webhooks |
| L1 | Infrastructure | Multi-tenant cloud, India/UK/US data centres, encryption, DR | AWS/GCP, Kubernetes, Terraform |

> ⚠️ **Named but unreconciled in the source material:** L5 lists three different agent-orchestration approaches (LangGraph, AutoGen, and a "Custom Agent Runtime") without specifying which is canonical. L3 lists three different graph/vector stores (Neo4j, pgvector, Qdrant) without specifying which does what. These are open technical decisions, not settled architecture — do not treat this table as a finalized stack choice.

## How This Repository Relates to the Stack

This repository (the website) is a thin slice of **L6 only** — and not even a product module, but the marketing surface in front of the eventual product. It has no relationship to L1–L5 today. See `.claude/context/architecture.md` for what actually exists.

## Current Status

Documented vision, not implementation. No component of this six-layer stack exists in any Orgofin repository as of this writing (to the knowledge available when this document was written).

## Future Improvements

When the actual product (HRMS backend, Company Brain, agent runtime) begins implementation — in a separate repository or a later phase of this one — this document should be updated to reflect real technical decisions as they're made, replacing the "named but unreconciled" technologies with actual choices, ideally recorded as ADRs (see `docs/adr/`).

## TODO

- [ ] When L3/L5 technology decisions are actually made, record them as ADRs in `docs/adr/` and update this table to reflect the decision, not the brainstormed options.

## References

- `docs/product/orgofin-idea.pdf` — pp.8–10 (§4 "Product & Technical Architecture")

## Related Documents

- [`../product/vision.md`](../product/vision.md)
- [`../../.claude/knowledge/company-brain.md`](../../.claude/knowledge/company-brain.md)
- [`../../.claude/context/architecture.md`](../../.claude/context/architecture.md)

---
**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering Leadership (TODO: assign a DRI)
