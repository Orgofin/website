# Technical Proposal — Magic-Link Verification for the Investor Data Room

> **Purpose:** A detailed technical proposal to upgrade the Data Room access flow from today's self-asserted gate to **magic-link email verification**, so the founders can decide whether to adopt it. **This is a proposal only — nothing here is implemented.**
> **Applies to:** founders (decision) and engineering (if approved).
> **Classification:** Internal.
> **Status:** PROPOSED — awaiting founder decision. Addresses security audit finding **M-01**.

---

## Responsibilities

Presents the design, trade-offs, effort, and rollout for magic-link verification of `/investors/data-room`. Does not change any code. Builds on [`security-audit-report.md`](./security-audit-report.md) (M-01), [`security-architecture.md`](./security-architecture.md) §3, and the go-live runbook [`../deployment/data-room-storage.md`](../deployment/data-room-storage.md).

---

## 1. Problem recap

Today the Data Room is **email-gated with instant unlock** (decision E11.1.4): a visitor types any name/email/firm and immediately receives 15-minute signed URLs to the documents. The "gate" captures a lead and adds friction — it is **not** access control. Anyone, including a competitor, can enter `test@test.com / Acme Capital` and download the deck.

This is acceptable _only_ because the catalog is deliberately restricted to **competitor-safe collateral** (pitch deck, one-pager). The moment anything more sensitive is added — financial model, cap table, per-category TAM, customer contracts — self-assertion is no longer good enough, because the requester's identity is entirely unverified.

**Magic-link verification** is the recommended upgrade (already noted as the upgrade path in the storage runbook's "Future Improvements").

---

## 2. How it works

### User perspective

1. Visitor fills the same form (name, work email, firm, optional check size) and submits.
2. Instead of documents appearing instantly, they see: _"Check your inbox — we've emailed a secure access link to you@fund.com. It expires in 15 minutes."_
3. They open the email and click **"Open the Orgofin data room."**
4. The link returns them to the site, now **verified**, and the documents unlock with fresh signed URLs.

### System perspective

```mermaid
sequenceDiagram
  participant U as Investor
  participant F as DataRoomGate (client)
  participant API as /api/data-room/request
  participant DB as Supabase (leads + tokens)
  participant M as Email provider (Resend/Supabase)
  participant V as /api/data-room/verify
  participant ST as Supabase Storage (private)

  U->>F: Submit name/email/firm
  F->>API: POST request
  API->>DB: store lead + create single-use token (hashed, 15-min TTL)
  API->>M: send magic link (contains raw token)
  API-->>F: 200 "check your email" (NO documents yet)
  U->>V: Click link → GET /verify?token=...
  V->>DB: look up token hash, check unused + unexpired
  alt valid
    V->>DB: mark token used; record verified_at
    V->>ST: mint 15-min signed URLs
    V-->>U: render unlocked room with documents
  else invalid/expired/used
    V-->>U: "This link expired — request a new one"
  end
```

**Token design (critical details):**

- Generate a **cryptographically random** token (e.g. 32 bytes, base64url) server-side.
- Store only a **hash** of it (SHA-256) in the DB — never the raw token — so a DB read can't replay links.
- Token is **single-use** (marked consumed on first successful verify) and **short-TTL** (15 min).
- The link is bound to the request row (email/firm), so verification confirms control of _that_ email.

---

## 3. How the flow changes

|                    | Today                                | With magic link                                                                                          |
| ------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Endpoints          | `POST /api/data-room` (store + sign) | `POST /api/data-room/request` (store + email link) **and** `GET /api/data-room/verify` (validate + sign) |
| When docs unlock   | Immediately, same response           | Only after the email link is clicked                                                                     |
| Identity assurance | None (self-asserted)                 | Proves control of the submitted email                                                                    |
| New table          | —                                    | `data_room_access_tokens` (or reuse Supabase Auth OTP)                                                   |
| New dependency     | —                                    | An email sender (Resend, Postmark, or Supabase Auth's built-in email)                                    |
| Signed-URL minting | In the POST                          | Moved to the verify step                                                                                 |

The **document delivery mechanism is unchanged** — still a private bucket + service-role-minted 15-minute signed URLs. Only a verification step is inserted _before_ minting.

---

## 4. Why it's more secure

- **Identity assurance:** the requester must control the email they entered. A competitor can no longer harvest documents with a throwaway/fake address in one shot — they'd need a working mailbox and to click through, which is logged and attributable.
- **Attribution & audit:** every unlock is tied to a verified email and timestamp — useful for knowing exactly who accessed materials (important as sensitivity rises).
- **Harder to script:** the two-step, email-round-trip flow defeats the simple "POST in a loop to mint URLs" abuse that the current single-step flow allows (complements the rate limiting already shipped).
- **Revocable & expiring:** unclicked links expire and are single-use; a leaked link is far less valuable than an always-open gate.

---

## 5. Threats mitigated & new risks introduced

**Mitigated:**

| Threat                               | Effect                                       |
| ------------------------------------ | -------------------------------------------- |
| Anonymous document harvesting (M-01) | Requires a real, controlled mailbox + click. |
| Scripted signed-URL minting          | Broken by the email round-trip.              |
| Fake/typo lead emails                | Only deliverable, verified emails unlock.    |
| Untraceable competitor access        | Access is now attributable.                  |

**New risks (and how to handle them):**

| New risk                                                        | Mitigation                                                                                                                                      |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Token leakage** (link forwarded/logged)                       | Single-use + 15-min TTL + hash-at-rest; never log the raw token.                                                                                |
| **Email deliverability / spam folder**                          | Use a reputable sender (Resend/Postmark) with SPF/DKIM/DMARC; show clear "check spam / resend" UX.                                              |
| **Email enumeration**                                           | The `request` endpoint should return the _same_ "check your email" response regardless of whether the email is new — never reveal prior access. |
| **Token-verification abuse** (brute forcing tokens)             | 32-byte random tokens are infeasible to guess; add rate limiting on `/verify` anyway.                                                           |
| **Open-redirect via the link**                                  | The verify endpoint returns to a fixed internal route — no user-controlled redirect target.                                                     |
| **Disposable-mailbox bypass**                                   | Optional: block known disposable domains; not fully solvable, but raises the bar.                                                               |
| **New attack surface** (email provider = new dependency/secret) | Server-only API key, scoped, rotated; provider is a trust anchor to vet.                                                                        |

Net: the new risks are well-understood and controllable; the mitigation is strongly net-positive for sensitive documents.

---

## 6. UX impact

- **Added friction:** one extra step (open email, click). For _investors evaluating a deal_, this is expected and acceptable — data rooms normally have more friction, not less. The trade-off is right for diligence-grade material and arguably _wrong_ for the current low-sensitivity deck (see §9 recommendation).
- **Failure modes to design for:** email delay, spam folder, expired link, wrong email typed. Provide: a clear "we emailed you" state, a "resend link" action (rate-limited), and a friendly "link expired — request a new one" page.
- **Latency:** unlock is no longer instant; it's "as fast as the email arrives" (typically seconds with a good provider).
- **Mobile:** clicking the link may open a different browser than the one used to submit — because signed URLs are minted at verify time and returned on that page, this works fine (no session assumed to carry over).

---

## 7. Integration with existing auth/authorization

**Important context:** the site has **no end-user authentication system today** — access control is Postgres RLS (insert-only) plus the self-asserted gate. So this is not "integrating with" an existing auth system; it's introducing the **first real verification step**. Two implementation options:

### Option A — Custom tokens (recommended for scope)

- Add a `data_room_access_tokens` table (`id`, `request_id`, `token_hash`, `expires_at`, `used_at`).
- Keep the existing insert-only RLS model; token creation/lookup happens **server-side via the service-role client** (already used for signing), not the anon key.
- No user accounts, no sessions — stays consistent with the site's "no auth" architecture. Minimal new surface.

### Option B — Supabase Auth magic links (OTP)

- Use Supabase Auth's built-in `signInWithOtp` (magic link) to verify the email; on the callback, mint signed URLs.
- Pros: email sending + token lifecycle handled by Supabase; battle-tested.
- Cons: introduces Supabase **sessions/JWTs** and a real auth layer for what is otherwise an auth-free marketing site — heavier, and it changes the architecture more than the feature warrants. Better if user accounts are coming _anyway_.

**Recommendation: Option A.** It delivers the security benefit with the least architectural change and stays true to the current design. Revisit Option B if/when the product introduces real user accounts (then unify on Supabase Auth).

Either way, it slots behind the existing `lib/api/*` seam — callers and the page shell barely change.

---

## 8. Implementation effort & architectural changes

**Effort: Medium (~2–4 focused days).**

| Work item                                                                   | Effort |
| --------------------------------------------------------------------------- | ------ |
| `data_room_access_tokens` migration (Option A)                              | Low    |
| Split route into `/request` (store + email) and `/verify` (validate + sign) | Medium |
| Token generation/hashing/verification in `lib/api/data-room.ts`             | Medium |
| Email integration (Resend/Postmark) + templates + env vars (`src/env.ts`)   | Medium |
| `DataRoomGate` UX: "check your email", resend, expired states               | Medium |
| Rate limiting on `/verify` (reuse `lib/security/rate-limit.ts`)             | Low    |
| Tests (token lifecycle, expiry, single-use, enumeration-safety)             | Medium |
| Docs update (this file → implemented; runbook; architecture §3)             | Low    |

**Architectural changes:** one new table; one endpoint split into two; one new third-party (email) with a server-only secret; signed-URL minting moves from request-time to verify-time. No change to storage, RLS model, or the seam boundary. The document catalog flip (`storagePath`) is unaffected.

---

## 9. Rollout plan

1. **Decision (this doc).** Founders approve, and decide the _scope trigger_ (see below).
2. **Build behind a flag.** Implement Option A with an env flag (e.g. `DATA_ROOM_REQUIRE_VERIFICATION`) so the room can run instant-unlock _or_ verified without a redeploy — mirrors the existing graceful-degradation pattern.
3. **Provision email** (Resend/Postmark), configure SPF/DKIM/DMARC on the domain (do this alongside the domain cutover, E13.1.3).
4. **Test on non-prod:** full token lifecycle, deliverability, expired/used/enumeration cases.
5. **Enable in production** when the first sensitive document is added — not before.

**Recommended policy (tiered, not all-or-nothing):**

> Keep **instant unlock** for the low-sensitivity collateral (deck, one-pager) to preserve conversion, and require **magic-link verification** for a separate "diligence" tier of documents. This gives the friction only where the sensitivity justifies it. Implementable as a per-document `tier` field gating whether verification is required before that document's URL is minted.

This directly resolves M-01 while respecting the E11.1.4 UX intent for the public collateral.

---

## Current Status

Proposed 2026-07-18, not implemented. Awaiting founder decision on (a) whether to adopt and (b) the tiered vs. all-documents scope. The current instant-unlock flow remains in place and is safe for the competitor-safe collateral it currently serves.

## Future Improvements

- Per-request **PDF watermarking** (stamp the verified email) for the diligence tier — pairs naturally with verification (audit L-01).
- Per-recipient access expiry / revocation dashboard if the investor list grows.
- Unify on Supabase Auth (Option B) if/when the product gains user accounts.

## TODO

- [ ] Founder decision: adopt magic-link verification? Tiered or all documents?
- [ ] If approved: schedule the ~2–4 day build behind a flag; provision email + DMARC.

## References

- [`security-audit-report.md`](./security-audit-report.md) — M-01, L-01.
- [`security-architecture.md`](./security-architecture.md) §3–6.
- [`../deployment/data-room-storage.md`](../deployment/data-room-storage.md) — the go-live runbook (Future Improvements notes this upgrade path).
- [`rate-limiting-and-bot-protection.md`](./rate-limiting-and-bot-protection.md) — reused on `/verify`.

## Related Documents

- [`../launch/production-readiness-review.md`](../launch/production-readiness-review.md)

---

**Last Updated:** 2026-07-18
**Owner:** Orgofin Engineering (proposal) · Orgofin Founders (decision)
