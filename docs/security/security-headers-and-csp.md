# Security Headers & Content Security Policy

> **Purpose:** Documents the HTTP security headers and Content Security Policy implemented in `next.config.ts`, why each exists, what it mitigates, the trade-offs taken, and the path to a stricter policy. Closes security audit finding **H-01**.
> **Applies to:** engineers touching `next.config.ts`, headers, or anything that loads a new third-party origin.
> **Classification:** Internal.

---

## Responsibilities

Owns the response-header security baseline. Implementation lives in [`next.config.ts`](../../next.config.ts); this documents the reasoning. For the finding that motivated it, see [`security-audit-report.md`](./security-audit-report.md) (H-01); for the design principles, [`security-architecture.md`](./security-architecture.md) §8–9.

---

## 1. What was implemented

A single `headers()` block in `next.config.ts` applies the baseline below to **every route** (`source: "/:path*"`), plus `poweredByHeader: false` to stop advertising the framework. Verified emitting on a production build (`next start` → `curl -I`).

| Header                       | Value (summary)                                                                                        | What it mitigates                                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains; preload`                                                         | **SSL-strip / protocol-downgrade.** Forces HTTPS for 2 years across all subdomains and makes the site eligible for the browser preload list, so even the _first_ visit can't be downgraded.                 |
| `Content-Security-Policy`    | see §2                                                                                                 | **XSS and data exfiltration.** Restricts where scripts, styles, images, fonts, and connections may come from; blocks framing; blocks `<base>`/form-action hijacking. The single most important header here. |
| `X-Frame-Options`            | `DENY`                                                                                                 | **Clickjacking.** Belt-and-suspenders with CSP `frame-ancestors 'none'` for older browsers that don't honor CSP framing directives.                                                                         |
| `X-Content-Type-Options`     | `nosniff`                                                                                              | **MIME-sniffing attacks.** Stops a browser from reinterpreting a non-script response as executable script.                                                                                                  |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                                                                      | **Referrer leakage.** Sends only the origin (not full path/query) to other sites, and nothing when downgrading HTTPS→HTTP.                                                                                  |
| `Permissions-Policy`         | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()` | **Feature abuse & privacy.** Disables powerful browser features the marketing site never uses, and opts out of FLoC/Topics ad cohorts.                                                                      |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                                                          | **Cross-origin popup tampering** (XS-Leaks). Isolates our browsing-context group.                                                                                                                           |
| `X-DNS-Prefetch-Control`     | `on`                                                                                                   | Minor performance; harmless.                                                                                                                                                                                |
| _(removed)_ `X-Powered-By`   | —                                                                                                      | **Fingerprinting.** No longer advertising `Next.js`.                                                                                                                                                        |

---

## 2. The Content Security Policy, directive by directive

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com;
font-src 'self' data:;
connect-src 'self' https://*.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com;
frame-src 'none';
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests
```

| Directive                   | Why these sources                                                                                                                                                                                                                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self'`        | Deny-by-default: anything a more specific directive doesn't cover falls back to same-origin only.                                                                                                                                                                                                                                      |
| `script-src`                | Our own bundle (`'self'`); `'unsafe-inline'` for the two inline scripts we control (the pre-paint `ThemeScript` and the escaped JSON-LD in `StructuredData`) **plus** GA4's bootstrap injected by `@next/third-parties`; `googletagmanager.com` + `*.google-analytics.com` for the GA loader. **This is the one compromise — see §3.** |
| `style-src`                 | Tailwind's stylesheet (`'self'`) + `'unsafe-inline'` because Framer Motion and React set inline `style` attributes, which are governed by `style-src`. Style injection is far lower-risk than script injection.                                                                                                                        |
| `img-src`                   | Self + `data:`/`blob:` (inline SVG, canvas) + GA's tracking pixel.                                                                                                                                                                                                                                                                     |
| `font-src`                  | `'self'` + `data:` — Geist is **self-hosted** by `next/font`, so no external font origin (e.g. Google Fonts) is needed.                                                                                                                                                                                                                |
| `connect-src`               | `'self'` for our API; `*.supabase.co` for the waitlist/data-room REST + storage calls; the GA collect endpoints.                                                                                                                                                                                                                       |
| `frame-src 'none'`          | We embed no third-party iframes.                                                                                                                                                                                                                                                                                                       |
| `frame-ancestors 'none'`    | **Nobody** may frame us — the primary clickjacking control.                                                                                                                                                                                                                                                                            |
| `object-src 'none'`         | No `<object>`/`<embed>`/Flash.                                                                                                                                                                                                                                                                                                         |
| `base-uri 'self'`           | An injected `<base>` can't repoint every relative URL to an attacker.                                                                                                                                                                                                                                                                  |
| `form-action 'self'`        | Forms may only POST to our own origin.                                                                                                                                                                                                                                                                                                 |
| `upgrade-insecure-requests` | Any stray `http://` subresource is auto-upgraded to `https://`.                                                                                                                                                                                                                                                                        |

> **When you add a third-party origin** (a new analytics tool, an embedded video, an external image host, a CDN), you MUST add its origin to the relevant directive here or the browser will silently block it. This is the intended friction — it forces a conscious decision.

---

## 3. Trade-offs

**1. Static CSP, not per-request nonce — deliberate.**
The strongest CSP uses a unique per-request **nonce** with `'strict-dynamic'` and drops `'unsafe-inline'` entirely. We did **not** do this because a nonce must be unique per response, which forces **dynamic rendering** of every page — and this site's performance budget (Lighthouse 95+, CDN-cached static pages) depends on static generation. Verified: with the static CSP, `next build` still prerenders all pages as static (○). A nonce approach would convert them to dynamic (ƒ), trading a measurable, guaranteed performance/caching loss for a marginal XSS-hardening gain on a site that renders **no user-generated content**. For this site, static CSP + `'unsafe-inline'` is the correct point on the curve.

**2. `'unsafe-inline'` in `script-src` — the compromise.**
This weakens the CSP's XSS protection (an injected inline `<script>` would execute). It's currently unavoidable because (a) GA4 via `@next/third-parties` injects an inline bootstrap whose exact bytes we don't control (so hashing is fragile across versions), and (b) our own inline `ThemeScript` runs pre-hydration by design. **Mitigating context:** the app renders no user-controlled HTML anywhere, the one dynamic inline script (`StructuredData`) escapes `<`, and `object-src`/`base-uri`/`form-action`/`frame-ancestors` are all locked down — so even if an inline script somehow executed, exfiltration paths are constrained by `connect-src`.

**3. `'unsafe-inline'` in `style-src` — low-risk, effectively required.**
Framer Motion animates via inline style attributes. CSS injection can't run code; worst case is defacement. Acceptable.

---

## 4. Rollout & verification

- **Recommended safe rollout for future CSP changes:** ship as `Content-Security-Policy-Report-Only` first (add a second header with the same value), watch for violation reports for a few days, then flip to the enforcing header. The _current_ policy was validated against a production build and the app's known origins, so it ships enforcing.
- **Verify after any change:**
  ```bash
  npm run build && (PORT=3123 npm run start &) && sleep 6
  curl -sI http://localhost:3123/ | grep -iE 'content-security|strict-transport|x-frame|referrer|permissions'
  ```
  Then load the site in a browser and confirm **zero CSP violations** in the console (especially the theme flash — if the inline `ThemeScript` were blocked, you'd see a flash of the wrong theme).
- **External grade:** run the deployed site through [securityheaders.com](https://securityheaders.com) and [SSL Labs](https://www.ssllabs.com/ssltest/) — target A/A+.

---

## 5. Future improvements

- **Nonce-based CSP** to drop `'unsafe-inline'` from `script-src` — revisit if/when the site adopts dynamic rendering anyway, or if a self-hosted analytics approach removes the GTM inline dependency. Would use Next.js middleware to inject a nonce and read it in the inline-script components.
- **CSP reporting endpoint** (`report-to`/`report-uri`) to collect violations in production once there's traffic — pairs well with Sentry.
- **Subresource Integrity (SRI)** if any external script is ever added.
- Move the header list into a small typed module if it grows, to keep `next.config.ts` readable.

---

## Current Status

Implemented and verified on 2026-07-18 (`next.config.ts`). All headers emit on a production build; pages remain statically generated. Closes audit H-01. `'unsafe-inline'` for scripts is the documented residual, tracked as a future nonce migration.

## TODO

- [ ] Run the deployed apex domain through securityheaders.com + SSL Labs after domain cutover; record the grade.
- [ ] Add a `report-to` CSP reporting endpoint once Sentry is wired.
- [ ] Re-evaluate nonce-based CSP if the rendering model changes.

## References

- [`next.config.ts`](../../next.config.ts) — the implementation.
- [`security-audit-report.md`](./security-audit-report.md) — H-01.
- [`security-architecture.md`](./security-architecture.md) §8–9.
- MDN CSP reference; OWASP Secure Headers Project.

## Related Documents

- [`rate-limiting-and-bot-protection.md`](./rate-limiting-and-bot-protection.md)

---

**Last Updated:** 2026-07-18
**Owner:** Orgofin Engineering (TODO: assign a security DRI)
