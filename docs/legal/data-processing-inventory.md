# Data Processing Inventory

> **Purpose:** The complete, code-derived record of every piece of personal data this website collects, where it is stored, who processes it, and how long it is kept. This is the factual input counsel needs to draft `/privacy` and `/terms` — it deliberately contains **no legal text and no compliance claims**.
> **Applies to:** whoever briefs legal counsel, and any engineer adding a field, a form, or a third-party script.

---

## Responsibilities

Owns the factual inventory of personal-data processing on the marketing website. Does not own the legal text of the privacy policy or terms (counsel — drafts framing only at [`copy.md`](../product/copy.md) §14), the security controls protecting this data ([`../security/security-architecture.md`](../security/security-architecture.md)), or the product platform's data handling (this repository is the website only).

**Scope boundary:** this covers the marketing/waitlist website exclusively. The Orgofin product (HRMS and the wider Enterprise OS) is not built in this repository and processes data under an entirely separate model — do not let a policy drafted from this document imply otherwise.

## 1. Personal data collected

Every field below was read from the code; each row cites where. There are exactly **two** collection points.

### 1.1 Waitlist signup — `POST /api/waitlist`

| Field        | Source                                                                               | Stored in `waitlist`          | Notes                                 |
| ------------ | ------------------------------------------------------------------------------------ | ----------------------------- | ------------------------------------- |
| `email`      | User-entered ([`WaitlistForm.tsx:106`](../../src/components/forms/WaitlistForm.tsx)) | ✅ `email` (unique, not null) | The **only** personal field collected |
| `source`     | Set by the app, e.g. `home-hero`                                                     | ✅ `source`                   | Origin tag, not personal data         |
| `created_at` | Server default `now()`                                                               | ✅ `created_at`               | Signup timestamp                      |

Schema: [`20260708000000_create_waitlist.sql:17-22`](../../supabase/migrations/20260708000000_create_waitlist.sql). Validation: [`waitlist.ts:10-14`](../../src/lib/api/waitlist.ts).

> ⚠️ **Discrepancy counsel must be told about.** The copy deck ([`copy.md`](../product/copy.md) §18) specifies a much larger waitlist form — Name, Company, Role, Country, Company Size, Products Interested In, Notes. **None of that is implemented or stored.** The live form collects an email address and nothing else. A policy must describe the site as built; if the fuller form ships later, the policy must be revised in the same PR.

A duplicate email raises Postgres `23505` and is deliberately treated as success ([`waitlist.ts:46-49`](../../src/lib/api/waitlist.ts)) so the endpoint cannot be used to enumerate who has signed up.

### 1.2 Investor data-room access — `POST /api/data-room`

| Field        | Required | Stored in `data_room_requests` |
| ------------ | -------- | ------------------------------ |
| `name`       | Yes      | ✅ `name`                      |
| `email`      | Yes      | ✅ `email` (lowercased)        |
| `firm`       | Yes      | ✅ `firm`                      |
| `checkSize`  | No       | ✅ `check_size` (nullable)     |
| `created_at` | —        | ✅ server default `now()`      |

Schema: [`20260715120000_create_data_room_requests.sql:20-27`](../../supabase/migrations/20260715120000_create_data_room_requests.sql). Validation: [`data-room.ts:14-19`](../../src/lib/api/data-room.ts).

There is **deliberately no unique constraint on email** — a returning investor is a new row, so the same person may appear multiple times.

### 1.3 IP addresses — transient, never persisted

Client IP is read from `x-forwarded-for` (falling back to `x-real-ip`, then the literal `"unknown"`) at [`rate-limit.ts:131-138`](../../src/lib/security/rate-limit.ts) and used **only** as a rate-limit bucket key:

- `waitlist:<ip>` — 5 requests/minute ([`api/waitlist/route.ts:23`](../../src/app/api/waitlist/route.ts))
- `data-room:<ip>` — 5 requests/5 minutes ([`api/data-room/route.ts:27`](../../src/app/api/data-room/route.ts))

Keys live in an **in-process `Map`** ([`rate-limit.ts:69-96`](../../src/lib/security/rate-limit.ts)), are swept once the window expires, and are **never written to a database and never associated with a submitted email**. They vanish when the serverless instance cycles. Note that IP is still personal data under DPDP even when held this briefly — and that Vercel's own request logging captures IPs independently of this code (see §3).

### 1.4 Analytics — GA4, production only

Booted via `@next/third-parties`, active **only where `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set**, which is Vercel Production scope alone — never on preview, local, or CI ([`track.ts:31-40`](../../src/lib/analytics/track.ts)).

The event vocabulary is a **closed TypeScript union** ([`track.ts:14-25`](../../src/lib/analytics/track.ts)): `waitlist_submit`, `demo_request`, `partner_apply`, `theme_change`, `cta_click`, `data_room_request`, `data_room_download`. No parameter in any variant accepts an email, name, or free text — the type system structurally prevents PII reaching GA4. This is a genuine design strength and worth stating in the policy.

Google Analytics itself sets its standard `_ga*` cookies and processes IP and device/browser data under Google's own terms — that is Google's processing, not ours, and the policy must disclose it.

### 1.5 Browser storage — one functional key

`localStorage` holds the theme preference only ([`ThemeProvider.tsx:38,99`](../../src/components/theme/ThemeProvider.tsx)). No personal data, no tracking identifier. **The site sets no first-party cookies of its own.**

## 2. What is deliberately NOT collected

Worth stating explicitly, because it is unusually little and it is a selling point: no user accounts, no passwords, no authentication of any kind, no payment data, no uploaded user files, no session cookies, no advertising or remarketing pixels, no third-party embeds beyond GA4, and no server-side logging of submitted form values (the `console.error` calls at [`waitlist.ts:50`](../../src/lib/api/waitlist.ts) and [`data-room.ts:113`](../../src/lib/api/data-room.ts) log the database error object, never the submission).

## 3. Processors and data flow

| Processor    | Role                                                          | Data it holds                                                   |
| ------------ | ------------------------------------------------------------- | --------------------------------------------------------------- |
| **Supabase** | Postgres database + private Storage bucket                    | Both tables in full; the investor documents                     |
| **Vercel**   | Hosting, serverless function execution, platform request logs | Request metadata including **client IP**, independently of §1.3 |
| **Google**   | Analytics (production only)                                   | Cookie ID, IP, device/browser, the §1.4 events                  |

Both tables are protected by row-level security with an **INSERT-only policy** for the public anon key and **no SELECT/UPDATE/DELETE policy at all**, so the key shipped to browsers cannot read either list back. Investor documents are served exclusively as 15-minute signed URLs minted server-side with the service-role key; the bucket is private and the service-role key never reaches the browser. Full rationale: [`../deployment/data-room-storage.md`](../deployment/data-room-storage.md).

Environments are split across **two Supabase projects** — production traffic writes to the prod project, preview/development to the non-prod one ([`../deployment/environment-variables.md`](../deployment/environment-variables.md)) — so test submissions never mix with real ones.

## 4. Retention and erasure — the honest current state

**There is no retention policy, no expiry job, and no deletion mechanism.** Rows in `waitlist` and `data_room_requests` persist indefinitely. Nothing in the codebase deletes personal data.

**There is also no channel through which a person could ask.** The site publishes no contact address anywhere (founder input pending, see §6), so a data-principal request for access, correction, or erasure currently has nowhere to go. This is the single most consequential gap in this document: a policy cannot promise rights the site provides no way to exercise.

## 5. Consent posture — a real gap

The site runs GA4 in production, which sets Google's cookies, and **no consent banner or mechanism exists** — a search of `src/` for consent/cookie handling returns only theme-storage code and marketing copy. Consent-banner copy was drafted at [`copy.md`](../product/copy.md) §18 ("Accept · Only Essential") and never built.

Note the optics: [`/security`](../../src/components/sections/security/ComplianceDepth.tsx) and [`/products`](../../src/components/sections/products/SuiteGrid.tsx) both market **"DPDP consent management"** as an Orgofin product capability, while the marketing site itself has no consent mechanism. Whatever counsel advises, the two should not stay visibly inconsistent at launch.

## Design Decisions

- **Inventory lives in `docs/`, not `.claude/`** — it is a point-in-time factual record of what the site does, not a standing convention ([`repository.md`](../../.claude/context/repository.md) rule of thumb).
- **No legal text here, by construction.** Counsel writes the policy; this document only supplies verifiable facts. Inventing DPDP compliance language would violate CLAUDE.md non-negotiable #1 and carries real legal risk.
- **Every claim cites `file:line`** so the inventory can be re-verified rather than trusted, and so it is obvious when it has drifted.

## Current Status

Complete and accurate as of 2026-07-23, derived from `main` at the production release `75135f0`. Nothing in it is blocked — it is ready to hand to counsel today. `/privacy` and `/terms` remain unbuilt.

## Future Improvements

- Regenerate this inventory whenever a form field, table column, or third-party script changes — it is the kind of document that is dangerous when stale.
- Consider a scripted check that fails CI if a new `@supabase` table write or third-party script appears without a matching row here.

## TODO

- [ ] **Founder:** registered legal entity name and registered address — required on both legal pages.
- [ ] **Founder:** a working contact address for data-principal requests (access/correction/erasure) and, under DPDP, a named grievance-redressal contact. Blocks §4.
- [ ] **Founder/infra:** confirm the **region** of both Supabase projects and the Vercel function region — determines whether personal data leaves India and is a question counsel will ask first.
- [ ] **Founder/counsel:** decide the retention period for waitlist and investor-lead rows; implement expiry once decided (nothing exists today).
- [ ] **Founder/counsel:** decide the consent posture for GA4 and whether the drafted banner ships (§5).
- [ ] **Counsel:** draft `/privacy` and `/terms` from this inventory; engineering builds the pages once text exists.
- [ ] **Engineering:** resolve the §1.1 discrepancy — either build the fuller waitlist form the copy deck specifies or correct the copy deck to match the email-only reality.

## References

- [`copy.md`](../product/copy.md) §14 (framing lines), §18 (unbuilt consent copy, unbuilt form fields)
- [`../security/security-architecture.md`](../security/security-architecture.md) — how this data is protected
- [`../deployment/environment-variables.md`](../deployment/environment-variables.md) — two-project environment split
- [`../deployment/data-room-storage.md`](../deployment/data-room-storage.md) — private bucket and signed-URL access model

## Related Documents

- [`../security/README.md`](../security/README.md)
- [`../launch/production-readiness-review.md`](../launch/production-readiness-review.md)

---

**Last Updated:** 2026-07-23
**Owner:** Orgofin Engineering (TODO: assign a DRI)
