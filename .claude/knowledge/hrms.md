# Domain Knowledge: Orgofin HRMS (V1 Product)

> **Purpose:** What Orgofin HRMS is and covers — the first product, and the website's go-to-market wedge. Reference this before writing any HR/payroll-related copy or feature description.
> **Applies to:** anyone (human or Claude) writing about the HRMS product on the website.

---

## Responsibilities

Owns the HRMS product definition, sourced from `docs/product/orgofin-idea.pdf`. Does not own pricing (see the PDF §8 directly if needed — not yet duplicated into any `.claude/` file) or the Products page's presentation of it (`docs/product/copy.md` §3).

## What It Is

The go-to-market wedge: "the most complete, AI-native HRMS built for India — and immediately relevant to UK and USA operations." Positioned as a full **hire-to-retire** platform with India-first compliance built in from day one, not bolted on later.

## The Hire-to-Retire Lifecycle (per the source PDF)

| Phase | Module | AI Automation | India Compliance |
|---|---|---|---|
| Attract | Recruit (ATS) | AI resume scoring, interview scheduling, JD generation | — |
| Hire | HRMS Core + Sign | Offer letter generation, Aadhaar e-KYC, digital onboarding | Form 11 (PF), ESI registration |
| Manage | Attendance + Shifts | Biometric/geo-fence check-in, shift auto-scheduling, anomaly detection | Factory Act, Shops Act compliance |
| Pay | Payroll | Auto salary calc, TDS, PF/ESI challan, Form 16 generation | PF, ESI, PT, LWF, TDS |
| Develop | Performance + LMS | AI goal suggestions, continuous feedback, course recommendations | — |
| Retain | Analytics Dashboard | Attrition prediction, compensation benchmarking, sentiment analysis | — |
| Exit | HRMS Core | Clearance workflows, F&F calculation, experience letter auto-gen | PF withdrawal, gratuity calc |

## Module Status (per the source PDF's own appendix, p.28)

The PDF states V1 status is **"MVP"** with the following modules already at that stage: HRMS Core, Payroll, Attendance, Shifts, Mail, Chat, Books, e-Invoice, Sign. Everything else in the HR & People suite (Performance & OKRs, Recruit/ATS, LMS) is labeled "Future."

> ⚠️ **Open question, not yet resolved** (see `docs/product/prd.md` §19.4 and §22.4): whether these "MVP" modules are genuinely functional today or aspirationally labeled. Do not write website copy that asserts "available now" for a module without confirming this with the founders first — see the Available/Roadmap badge convention in `docs/product/copy.md` §3.

## Why HRMS First (the strategic logic, not just the product)

Per the source PDF's GTM plan: India's HR/payroll compliance burden (PF, ESI, TDS, Gratuity, DPDP) is specific and painful enough to prove the Company Brain thesis before expanding into Finance, CRM, and beyond. It's also the easiest wedge to underprice competitors on (Keka, Darwinbox, Zoho People) by 30–50% while still being compliance-complete.

## Current Status

Concept/product-definition only — no HRMS software exists in this repository (this repo builds the marketing website).

## Future Improvements

Update this file the moment the MVP-status question above is resolved by the founders — it currently states the ambiguity rather than a confirmed fact.

## TODO

- [ ] Confirm actual functional status of the "MVP" modules listed above.

## References

- `docs/product/orgofin-idea.pdf` — p.7 ("V1: Orgofin HRMS — Hire to Retire, Fully Automated"), p.11 (§5.1 module pricing table), p.28 (status appendix)

## Related Documents

- [`company-brain.md`](./company-brain.md)
- [`enterprise-os.md`](./enterprise-os.md)

---
**Last Updated:** 2026-07-04
**Owner:** Orgofin Product (TODO: assign a DRI)
