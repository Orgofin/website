# Domain Knowledge: AGaaS (Agent-as-a-Service) & AI Agents

> **Purpose:** What "AGaaS" and Orgofin's AI agents actually are as a product concept, including the specific agents named in the source material. Reference this before writing any agent-related copy.
> **Applies to:** anyone (human or Claude) writing about AI agents on the website.

---

## Responsibilities

Owns the AGaaS/agent concept definition, sourced from `docs/product/orgofin-idea.pdf`. Does not own the visual/interaction design of how agents are represented on the site (`docs/product/copy.md` §1 Chapter 6, and the `AgentOrchestrationDiagram` component per `.claude/context/frontend.md`).

## What AGaaS Is

Agent-as-a-Service — the layer that sits on top of [Company Brain](./company-brain.md). Orgofin agents are explicitly **not chatbots** — they are described as autonomous digital workers that:

- Have persistent long-term memory scoped to the organisation
- Can read, write, and execute across all Orgofin modules
- Collaborate with each other through a structured multi-agent protocol
- Learn organisational patterns and improve over time
- Can be deployed as specialised workers (HR Agent, Finance Agent, Sales Agent) or orchestrators

## The Named Agents (per the source PDF's V1–V3 roadmap)

| Agent                  | Function                                                            | Modules Used                          | Phase |
| ---------------------- | ------------------------------------------------------------------- | ------------------------------------- | ----- |
| HR Operations Agent    | Processes onboarding, offboarding, leave approvals, payroll queries | HRMS, Payroll, Attendance, Sign       | V1    |
| Finance Agent          | Reconciles bank statements, flags anomalies, generates GST reports  | Books, Expenses, GST Suite            | V2    |
| Sales Agent            | Enriches leads, drafts proposals, follows up on stalled deals       | CRM, CPQ, Sign, Mail                  | V2    |
| Support Agent          | Resolves L1 tickets, escalates L2+, updates CRM automatically       | Desk, Chat, CRM, Books                | V2    |
| Compliance Agent       | Monitors regulatory changes, flags violations, auto-files returns   | GST Suite, Compliance Center, Payroll | V3    |
| CEO Intelligence Agent | Daily business briefing, anomaly alerts, strategic recommendations  | All modules                           | V3    |

## Multi-Agent Collaboration Protocol

An orchestrator agent breaks down a business request into sub-tasks, delegates to specialised agents, collects results, and synthesises a final output. Human-in-the-loop checkpoints are configurable for high-stakes actions (the PDF's example: payroll processing above ₹10L).

## The Reference Vignette (the CEO Intelligence Agent, at maturity)

This is the source material's own illustration of the product at its most mature — the strongest available "show, don't tell" copy asset, already used as the centerpiece of Home Chapter 6 (see `docs/product/copy.md`):

> A CEO wakes up and the CEO Intelligence Agent has already: flagged that payroll in Hyderabad rose 11% (traced to three ATS-approved hires); noticed a key customer has gone quiet for six weeks and drafted an outreach email; identified 23 days of inventory left on a critical SKU and raised a draft purchase order; prepared Thursday's board deck from real data; reminded an employee about overdue POSH training.

Use this vignette (or a close variant) whenever copy needs to make agents feel concrete rather than abstract — it is deliberately mundane and specific, not "revolutionary AI" language.

## Current Status

Concept only — no agent runtime, orchestration layer, or any of the named agents exist in this repository (this repo builds the marketing website).

## Future Improvements

None currently identified.

## TODO

None — faithful, complete extraction of the source PDF's AGaaS material.

## References

- `docs/product/orgofin-idea.pdf` — p.6 (§3 "Our Solution — Layer 2"), pp.9–10 (§4.3 "AGaaS Architecture"), p.27 (CEO Intelligence Agent vignette)

## Related Documents

- [`company-brain.md`](./company-brain.md)
- [`hrms.md`](./hrms.md)
- [`enterprise-os.md`](./enterprise-os.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Product (TODO: assign a DRI)
