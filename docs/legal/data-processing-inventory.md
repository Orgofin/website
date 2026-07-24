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

**A retention policy now exists; the mechanism to enforce it does not.** The founders set the window at **24 months from collection** on 2026-07-24, and `/privacy` §8 states it publicly. In the code there is still **no expiry job and no deletion mechanism** — rows in `waitlist` and `data_room_requests` persist indefinitely, and nothing deletes personal data. Deleting a record on request is a manual operation today.

That gap is now the sharpest one in this document: we have moved from saying nothing to making a promise we keep by hand. Tracked in [`README.md`](./README.md)'s TODO.

**The channel gap is closed.** `contact@orgofin.com` (founder-supplied 2026-07-24) is published on both legal pages as the address for access, correction and erasure requests, and is held in one place at [`constants.ts`](../../src/lib/legal/constants.ts). A named grievance-redressal contact under DPDP is still outstanding — the general address is honest, but it is not the same thing.

## 5. Consent posture — resolved 2026-07-24

**GA4 now loads only after the visitor accepts.** The gap recorded here previously — GA4 running in production with no consent mechanism at all — was closed by the consent banner, built from the copy drafted at [`copy.md`](../product/copy.md) §18 ("Accept · Only Essential").

How it works, and what it guarantees:

- Consent is held in [`lib/consent/store.ts`](../../src/lib/consent/store.ts) (`localStorage` key `orgofin-analytics-consent`), with three states: `unset`, `granted`, `denied`. Only `unset` shows the banner, so a visitor who declines is never asked again.
- [`GoogleAnalytics`](../../src/components/analytics/GoogleAnalytics.tsx) mounts only on `granted`. This is **prior consent, not opt-out**: with no decision or a declined one, no Google script is requested and **no `_ga` cookie is ever set** — verified in a browser, including that zero requests reach `googletagmanager.com` before acceptance.
- [`trackEvent`](../../src/lib/analytics/track.ts) independently no-ops unless consent is `granted`, so the guarantee doesn't rest on a component's mount condition.
- Declining is exactly as easy as accepting (same size, same weight, adjacent), and nothing on the site is gated behind either answer.

The optics problem is also resolved: [`/security`](../../src/components/sections/security/ComplianceDepth.tsx) and [`/products`](../../src/components/sections/products/SuiteGrid.tsx) market **"DPDP consent management"** as a product capability, and the marketing site now has a consent mechanism of its own.

**Still open for counsel:** whether an explicit consent-withdrawal control is needed on `/privacy` itself. Today withdrawal means clearing site data or writing to the contact address — honest, but less direct than a button.

## Design Decisions

- **Inventory lives in `docs/`, not `.claude/`** — it is a point-in-time factual record of what the site does, not a standing convention ([`repository.md`](../../.claude/context/repository.md) rule of thumb).
- **No legal text here, by construction.** Counsel writes the policy; this document only supplies verifiable facts. Inventing DPDP compliance language would violate CLAUDE.md non-negotiable #1 and carries real legal risk.
- **Every claim cites `file:line`** so the inventory can be re-verified rather than trusted, and so it is obvious when it has drifted.

## Current Status

Complete and accurate as of 2026-07-24, re-verified against the code when `/privacy` and `/terms` were built from it. **Both pages now exist** and state publicly what this document records privately; they are pending counsel review — see [`README.md`](./README.md) for their status and the decisions taken.

One fact was added on 2026-07-24 that this inventory previously lacked: **Vercel executes the site's server-side functions in `iad1` (US East)**, confirmed from the `X-Vercel-Id: bom1::iad1::…` header on a dynamic request. Personal data submitted through either form is therefore processed outside India. The Supabase project region remains unconfirmed.

## Future Improvements

- Regenerate this inventory whenever a form field, table column, or third-party script changes — it is the kind of document that is dangerous when stale.
- Consider a scripted check that fails CI if a new `@supabase` table write or third-party script appears without a matching row here.

## TODO

Resolved 2026-07-24 (see [`README.md`](./README.md) for the decisions and who made them): entity name, data-principal contact address, retention period, consent posture, the Vercel function region, and the pages themselves. What remains:

- [ ] **Founder:** registered office address — deliberately unpublished rather than placeholdered.
- [ ] **Founder:** a named grievance-redressal contact under DPDP (§4).
- [ ] **Founder/infra:** confirm the **region** of both Supabase projects — the last unknown in §3, and a question counsel will ask.
- [ ] **Engineering:** implement the 24-month expiry. The policy is now published; nothing enforces it (§4).
- [ ] **Engineering:** build the consent banner and gate GA4 on it (§5).
- [ ] **Engineering:** resolve the §1.1 discrepancy — either build the fuller waitlist form the copy deck specifies or correct the copy deck to match the email-only reality.
- [ ] **Counsel:** review both pages, `/terms` §4 and §5 first.

## References

- [`copy.md`](../product/copy.md) §14 (framing lines), §18 (unbuilt consent copy, unbuilt form fields)
- [`../security/security-architecture.md`](../security/security-architecture.md) — how this data is protected
- [`../deployment/environment-variables.md`](../deployment/environment-variables.md) — two-project environment split
- [`../deployment/data-room-storage.md`](../deployment/data-room-storage.md) — private bucket and signed-URL access model

## Related Documents

- [`README.md`](./README.md) — review status of the pages built from this inventory
- [`../security/README.md`](../security/README.md)
- [`../launch/production-readiness-review.md`](../launch/production-readiness-review.md)

---

**Last Updated:** 2026-07-24
**Owner:** Orgofin Engineering (TODO: assign a DRI)
