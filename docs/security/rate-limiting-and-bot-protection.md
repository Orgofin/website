# Rate Limiting & Bot Protection

> **Purpose:** Documents the application-level abuse controls on the public write endpoints — per-IP rate limiting and a honeypot bot check — their configuration, limitations, and how Cloudflare + a shared store complete the picture. Closes security audit findings **H-02** and **M-02** at the application layer.
> **Applies to:** engineers touching the API routes, forms, or abuse controls.
> **Classification:** Internal.

---

## Responsibilities

Owns the application-layer abuse defenses. Implementation: [`src/lib/security/rate-limit.ts`](../../src/lib/security/rate-limit.ts), [`src/lib/security/bot-protection.ts`](../../src/lib/security/bot-protection.ts), [`src/components/forms/HoneypotField.tsx`](../../src/components/forms/HoneypotField.tsx), and the two API routes. Edge-layer defenses (WAF, Turnstile) are described here but provisioned in Cloudflare, not this repo.

---

## 1. Threats addressed

From the security audit (H-02) and the user's competitor-abuse threat model:

| Threat                                 | Control                                                                                                                                                                                      |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Excessive requests / API abuse         | Per-IP rate limit (429 + `Retry-After`)                                                                                                                                                      |
| Automated form spam / fake signups     | Honeypot + rate limit (+ Turnstile, recommended)                                                                                                                                             |
| Waitlist poisoning (inflating signups) | Rate limit + honeypot + unique-email constraint                                                                                                                                              |
| Data-room lead-table flooding          | Stricter rate limit + honeypot                                                                                                                                                               |
| Signed-URL harvesting (scripted gate)  | Stricter rate limit on `/api/data-room`                                                                                                                                                      |
| Web scraping / enumeration             | Rate limit (app) + Cloudflare (edge)                                                                                                                                                         |
| Brute-force / credential stuffing      | **N/A** — there is no authentication surface on this site. Documented here so the absence is a known decision, not an oversight. If auth is ever added, add login-specific limits + lockout. |
| DDoS (L3/4 volumetric)                 | **Out of application scope** — Cloudflare/Vercel edge (see §5).                                                                                                                              |

---

## 2. Rate limiting — how it works

`checkRateLimit(key, {limit, windowMs})` implements a **fixed-window** counter keyed by `"<route>:<ip>"`. The client IP comes from `x-forwarded-for` (first hop; Vercel sets this to the real client), falling back to `x-real-ip` then `"unknown"`.

**Configured limits** (in each route):

| Endpoint              | Limit      | Window     | Rationale                                                                                       |
| --------------------- | ---------- | ---------- | ----------------------------------------------------------------------------------------------- |
| `POST /api/waitlist`  | 5 requests | 60 s / IP  | Generous for a human, hostile to a script.                                                      |
| `POST /api/data-room` | 5 requests | 300 s / IP | Stricter — this endpoint mints signed URLs, so scripted access is more valuable to an attacker. |

On exceed, the route returns **`429`** with `Retry-After` and `RateLimit-*` headers. The check runs **first**, before body parsing or any DB work, so abusive traffic is rejected as cheaply as possible.

**Verified empirically** (production build, `curl`): the 6th request in a minute to `/api/waitlist` returns `429`; a fresh IP is unaffected.

### The critical limitation — read this

The default store is an **in-process `Map`**. On Vercel's serverless/edge fleet, each function instance has its own memory and instances scale out and recycle, so this limiter is **per-instance, best-effort**. It reliably stops a naive burst hitting one warm instance; it is **not** a distributed guarantee across the fleet. This is an honest defense-in-depth layer, not the whole defense. Two things complete it:

1. **Cloudflare Rate Limiting Rules** at the edge (§5) — the real, fleet-wide, pre-origin defense.
2. **A shared store** (Upstash Redis) swapped in via `setRateLimitStore()` (§3).

The design mirrors the rest of the codebase: it works with zero external provisioning today, and upgrades cleanly when the infra is added.

---

## 3. Upgrading to a distributed store (Upstash Redis)

The limiter is store-agnostic. To make it fleet-wide, provision a (free-tier) Upstash Redis and plug in an adapter — no call sites change:

```bash
npm install @upstash/redis
```

```ts
// src/lib/security/redis-rate-limit-store.ts  (add when provisioning)
import { Redis } from "@upstash/redis";
import { setRateLimitStore } from "@/lib/security/rate-limit";

const redis = Redis.fromEnv(); // UPSTASH_REDIS_REST_URL + _TOKEN

setRateLimitStore({
  async hit(key, windowMs) {
    const now = Date.now();
    const windowKey = `${key}:${Math.floor(now / windowMs)}`;
    const count = await redis.incr(windowKey);
    if (count === 1) await redis.pexpire(windowKey, windowMs);
    return { count, reset: (Math.floor(now / windowMs) + 1) * windowMs };
  },
});
```

Call this once at server startup (e.g. from an instrumentation hook). Add `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` to Vercel and `src/env.ts`. Until then the in-memory store is the default.

> We deliberately did **not** add the Upstash dependency now (nothing is provisioned, and CLAUDE.md discourages premature dependencies) — this is the ready-to-use upgrade path.

---

## 4. Bot protection — honeypot

`HoneypotField` renders a hidden input (`name="contact_channel"`) that is off-screen, `aria-hidden`, `tabIndex=-1`, `autoComplete="off"`, with a name chosen to dodge browser/password-manager autofill (avoiding `email`/`name`/`organization`/`url`). Humans never fill it; naive bots do.

On the server, `isHoneypotTriggered(body)` checks the raw JSON body (the Zod schemas strip unknown keys, so it's read before parsing). When triggered, the route returns a **benign success** with **no side effect** — waitlist returns `{ok:true}` without inserting; data-room returns all documents as `"pending"` (`url: null`) without storing a lead or minting a URL. The bot believes it succeeded and stops retrying, while nothing is actually stored. Verified: a honeypot-filled request from a fresh IP returns `201` and does **not** reach the Supabase seam.

**Why benign-success over an error:** returning `400` tells the bot its payload was rejected, inviting it to adapt. Silent success is the standard, more effective honeypot behavior.

**False-positive guard:** the anti-autofill attributes make it very unlikely a real user's browser fills the field. If field data ever shows legitimate users being dropped, the field name/attributes are the first thing to revisit.

---

## 5. Cloudflare — the edge layer (recommended, provisioned at domain cutover)

Application-level controls are defense-in-depth; **Cloudflare is the primary defense** against volumetric abuse, scraping, and DDoS because it acts _before_ traffic reaches the origin. After the apex domain is proxied (E13.1.3), configure:

| Cloudflare feature             | Use                                                                                                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rate Limiting Rules**        | Fleet-wide per-IP limits on `/api/*` (e.g. 10 req/min) — the distributed limit the in-memory store can't guarantee.                                                                                                   |
| **WAF Managed Rules**          | Block known-bad payloads/patterns pre-origin.                                                                                                                                                                         |
| **Bot Fight Mode / Turnstile** | Challenge automated clients. **Turnstile** (free) is the recommended human-verification upgrade over the honeypot: add the widget to both forms, verify the token server-side in the route before inserting (see §6). |
| **"Under Attack" mode**        | Break-glass control during an active attack.                                                                                                                                                                          |
| **Analytics**                  | Bot/threat/rate-limit visibility (feeds the monitoring doc).                                                                                                                                                          |

Layering: **Cloudflare (edge) → app rate limit (per-instance) → honeypot → Zod validation → RLS (DB)**. No single layer is the only thing standing between an attacker and an asset.

---

## 6. Turnstile integration (recommended next step — not yet implemented)

When ready to add human verification:

1. Create a Turnstile widget in Cloudflare; get the site key (public) + secret key (server-only).
2. Add the widget to `WaitlistForm`/`DataRoomGate`; include the resulting token in the POST body.
3. In each route, before inserting, POST the token + `TURNSTILE_SECRET_KEY` to `https://challenges.cloudflare.com/turnstile/v0/siteverify`; reject on failure.
4. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` to `src/env.ts` and Vercel.

This complements (doesn't replace) the honeypot and rate limit.

---

## 7. Trade-offs & limitations

- **In-memory rate limit is best-effort on serverless** (§2) — mitigated by Cloudflare + the Upstash upgrade path.
- **Fixed window** allows a small burst at the window boundary — irrelevant at our thresholds; a sliding window (Upstash) removes it if ever needed.
- **Honeypot catches naive bots, not sophisticated ones** — Turnstile is the answer for determined abuse.
- **IP-based limits** can over-limit users behind shared NAT/corporate proxies — thresholds are set generously (5/min) to avoid this; monitor 429 rates for false positives.

---

## Current Status

Implemented and verified 2026-07-18: per-IP rate limiting on both write endpoints (429 + Retry-After), honeypot bot check with benign-success handling, unit-tested (`rate-limit.test.ts`, `bot-protection.test.ts`), full build + 102 tests green. Closes audit H-02/M-02 at the application layer. Cloudflare edge controls, the Upstash shared store, and Turnstile are the documented, provisioning-gated next layers.

## TODO

- [ ] Provision Cloudflare rate limiting + WAF on `/api/*` at domain cutover.
- [ ] Add Turnstile to both forms (§6).
- [ ] Swap in the Upstash store for fleet-wide limits (§3) if edge limits prove insufficient.

## References

- [`src/lib/security/rate-limit.ts`](../../src/lib/security/rate-limit.ts), [`bot-protection.ts`](../../src/lib/security/bot-protection.ts)
- [`security-audit-report.md`](./security-audit-report.md) — H-02, M-02.
- [`security-test-suite.md`](./security-test-suite.md) §4 — abuse test scripts.

## Related Documents

- [`security-headers-and-csp.md`](./security-headers-and-csp.md)
- [`../operations/monitoring-and-analytics.md`](../operations/monitoring-and-analytics.md)

---

**Last Updated:** 2026-07-18
**Owner:** Orgofin Engineering (TODO: assign a security DRI)
