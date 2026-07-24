# Legal

> **Purpose:** Index for the website's legal record — the factual inventory the policies are built on, the current review status of the published pages, and the founder/counsel inputs still outstanding.
> **Applies to:** anyone editing `/privacy`, `/terms`, or anything that changes what personal data this site touches.

---

## Responsibilities

Owns the status and provenance of the site's legal pages. Does not own the legal text itself (that lives in the pages — see below), the security controls behind the claims ([`../security/security-architecture.md`](../security/security-architecture.md)), or product-side data handling (this repository is the website only).

## What's here

| Document                                                         | What it is                                                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [`data-processing-inventory.md`](./data-processing-inventory.md) | The code-derived record of every personal-data field, processor and flow — cites `file:line` throughout |

## Where the legal text lives

**In the pages, not in this folder.** `/privacy` and `/terms` hold their own text as structured section data:

- [`src/app/(marketing)/privacy/page.tsx`](<../../src/app/(marketing)/privacy/page.tsx>)
- [`src/app/(marketing)/terms/page.tsx`](<../../src/app/(marketing)/terms/page.tsx>)
- Shared facts (entity name, contact address, retention window, effective date): [`src/lib/legal/constants.ts`](../../src/lib/legal/constants.ts)
- Shared document shell (contents list, numbering, anchors): [`src/components/sections/legal/LegalDocument.tsx`](../../src/components/sections/legal/LegalDocument.tsx)

There is deliberately no markdown copy of the policies. Two copies of a legal document is how a site ends up publishing one thing and believing another (CLAUDE.md non-negotiable #4). [`../product/copy.md`](../product/copy.md) §14 holds the framing lines only and points here.

## ⚠️ Review status

**Both pages are drafted by engineering and have NOT been reviewed by counsel** (as of 2026-07-24).

They are written from the verified inventory rather than from a template: every factual claim about what the site collects, stores and transfers is traceable to code, and nothing asserts a compliance status, a certification, or a business fact we do not have. That makes them honest and materially better than no policy at all — but they are text a lawyer should edit, not text a lawyer wrote.

**Two clauses deserve counsel's particular attention**, because they exist for things this specific site does:

- `/terms` §5 — the investor materials are **not an offer of securities**. The data room hands out a pitch deck to people who ask.
- `/terms` §4 — **forward-looking statements**. Most of the site describes software that does not exist yet.

Ship-blocking judgement call, recorded rather than hidden: publishing these before review was chosen over publishing nothing, because a site that collects email addresses and hands out investor decks with **no** privacy policy is the worse position under DPDP. Revisit if counsel disagrees.

## Decisions taken

| Decision                   | Value                                                      | Date       | By      |
| -------------------------- | ---------------------------------------------------------- | ---------- | ------- |
| Entity name shown on pages | "Orgofin" (trading name; registration may differ)          | 2026-07-24 | Founder |
| Data-principal contact     | `contact@orgofin.com`                                      | 2026-07-24 | Founder |
| Retention window           | 24 months from collection                                  | 2026-07-24 | Founder |
| Consent posture            | Build the banner; GA4 gated on acceptance — **shipped**    | 2026-07-24 | Founder |
| Registered address         | Not settled — pages publish none rather than a placeholder | 2026-07-24 | Founder |

## Verified infrastructure facts

Both confirmed 2026-07-24, and both matter to what the policy may claim:

- **Vercel executes this site's server-side functions in `iad1` (US East).** Confirmed from the `X-Vercel-Id: bom1::iad1::…` response header on a dynamic request to `orgofin.com/api/waitlist` — requests enter at the Mumbai edge but the function runs in the United States. `/privacy` §6 discloses this without naming the region. Changing it is a Vercel project setting (function region → `bom1`), and would let the page make a stronger residency statement.
- **Supabase project region is still unconfirmed.** It could not be determined remotely — the API host sits behind Cloudflare and the database host publishes no resolvable record. Read it from the dashboard (Project Settings → General → Region) for **both** the prod and non-prod projects.

## Current Status

`/privacy` and `/terms` are live in the codebase as of 2026-07-24, linked from the footer's Legal column and from `/security`. Both are indexed, prioritised 0.3 in the sitemap. Counsel review outstanding.

**The consent banner shipped the same day.** GA4 now loads only after the visitor accepts — prior consent, not opt-out, verified in a browser (no `googletagmanager.com` request and no `_ga` cookie before acceptance). Mechanism and guarantees: [`data-processing-inventory.md`](./data-processing-inventory.md) §5. `/privacy` §10 describes it.

**One promise on the pages still has no mechanism behind it:** the 24-month retention window. Nothing expires those rows; honouring it is manual. That is now the single largest gap between what we publish and what the system does.

## Future Improvements

- Re-verify the inventory against the code whenever a form field, table column or third-party script changes, and update both pages in the same PR.
- Consider a CI check that fails when a new `@supabase` table write or third-party script appears without a matching inventory row.

## TODO

- [ ] **Counsel:** review both pages. Start with `/terms` §4 and §5.
- [ ] **Founder:** registered office address → set `LEGAL_REGISTERED_ADDRESS` and both pages pick it up.
- [ ] **Founder:** confirm whether "Orgofin" is the registered entity name or a trading name over a different registered entity.
- [ ] **Founder/counsel:** appoint and name a grievance-redressal contact under DPDP. `/privacy` §9 currently routes everything to the general contact address, which is honest but not the same thing.
- [ ] **Founder/infra:** read both Supabase project regions off the dashboard; decide whether to move Vercel function execution to `bom1`.
- [ ] **Engineering:** implement the 24-month expiry. The pages state it as policy and **no mechanism enforces it** — the largest remaining gap between what we say and what we do.
- [x] ~~**Engineering:** build the consent banner and gate GA4 on it~~ — done 2026-07-24. See the inventory §5.
- [ ] **Counsel:** advise whether `/privacy` needs an explicit consent-withdrawal control. Today withdrawal means clearing site data or writing to us — honest, but less direct than a button.
- [ ] **Engineering:** resolve the inventory §1.1 discrepancy — the copy deck specifies a fuller waitlist form than the email-only one that ships.

## References

- [`data-processing-inventory.md`](./data-processing-inventory.md) — the factual basis for every claim on `/privacy`
- [`../product/copy.md`](../product/copy.md) §14 — framing lines, §18 — unbuilt consent-banner copy
- [`../../.claude/context/information-architecture.md`](../../.claude/context/information-architecture.md) §3/§4 — where the pages sit in the IA

## Related Documents

- [`../security/README.md`](../security/README.md)
- [`../launch/production-readiness-review.md`](../launch/production-readiness-review.md)

---

**Last Updated:** 2026-07-24
**Owner:** Orgofin Engineering (TODO: assign a DRI)
