# Security Documentation

Pre-public-launch security review of the Orgofin website (marketing/waitlist site only — not the product platform).

| Document                                                                       | Purpose                                                                                                                                          |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`security-audit-report.md`](./security-audit-report.md)                       | Executive summary, threat model, findings with severity/effort/impact, OWASP coverage, what's already correct, prioritized remediation.          |
| [`security-architecture.md`](./security-architecture.md)                       | How security is designed — auth model, authorization (RLS), data/API/file/DB/infra protection. Due-diligence-ready.                              |
| [`security-test-suite.md`](./security-test-suite.md)                           | Manual pen-test checklist, automated/regression tests, API-abuse scripts, tools, and the pre-deploy security gate.                               |
| [`security-headers-and-csp.md`](./security-headers-and-csp.md)                 | ✅ Implemented — the HTTP security headers + CSP in `next.config.ts`, per-header rationale, trade-offs (closes H-01).                            |
| [`rate-limiting-and-bot-protection.md`](./rate-limiting-and-bot-protection.md) | ✅ Implemented — per-IP rate limiting + honeypot on the write endpoints, Cloudflare/Upstash/Turnstile upgrade paths (closes H-02, partial M-02). |
| [`data-room-magic-link-proposal.md`](./data-room-magic-link-proposal.md)       | 📋 Proposal only — magic-link verification upgrade for the Data Room (addresses M-01); awaiting founder decision.                                |

**Headline:** no Critical findings; two High items (security headers/CSP, rate limiting) are the launch blockers. Overall risk MEDIUM pre-remediation → LOW after the High items close. The auth-free, write-only, RLS-protected surface eliminates most vulnerability classes by construction.

**Related:** [`../launch/production-readiness-review.md`](../launch/production-readiness-review.md) · [`../operations/monitoring-and-analytics.md`](../operations/monitoring-and-analytics.md) · [`../legal/data-processing-inventory.md`](../legal/data-processing-inventory.md) (what personal data the site holds — the privacy/DPDP counterpart to the controls documented here)

---

**Last Updated:** 2026-07-18 · **Owner:** Orgofin Engineering (TODO: assign a security DRI)
