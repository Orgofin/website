# Custom Domain Setup — orgofin.com

> **Purpose:** The exact steps to attach the production custom domain to the Vercel project and point DNS at it, plus the canonical-origin decision the rest of the site depends on. This is a one-time setup that finishes backlog task **E13.1.3**. For the ongoing operational runbook (URLs, rollback), see [`README.md`](./README.md); for the first-time Vercel connection, see [`vercel-setup.md`](./vercel-setup.md).
> **Applies to:** whoever owns the Vercel account **and** has access to the DNS registrar for `orgofin.com`.

---

## Responsibilities

Owns the domain-attachment and DNS steps and records the apex-vs-www canonical decision. Does not own the Vercel connection itself (`vercel-setup.md`), the variable reference (`environment-variables.md`), or SEO policy (`.claude/context/seo.md`).

## Canonical Decision (2026-07-08)

**`orgofin.com` (apex) is canonical. `www.orgofin.com` 301-redirects to it.**

Everything downstream depends on this being consistent:

- `NEXT_PUBLIC_SITE_URL` in Vercel **Production** = `https://orgofin.com` (no trailing slash, no `www`). This drives `siteConfig.url` in [`src/lib/seo/site.ts`](../../src/lib/seo/site.ts) and therefore every absolute URL in metadata, the sitemap, robots, and Open Graph tags.
- The same fallback (`https://orgofin.com`) is already hardcoded in `site.ts` for builds where the env var is unset, so metadata is correct even before the var is provisioned.

> Only one origin may be canonical, or SEO splits link equity and `metadataBase` disagrees with the served host. Apex was chosen over www; do not attach www as a second primary — attach it only as a redirect (Step 2).

## Prerequisites

- Ownership of `orgofin.com` and access to edit its DNS records at the registrar. **This site does not assert the domain is owned — confirm before starting (never invent a business fact).**
- Admin on the Vercel project `website`.
- The project already connected and building from `main` (see [`vercel-setup.md`](./vercel-setup.md)).

## Step 1 — Add the domains in Vercel

1. Vercel dashboard → project **`website`** → **Settings → Domains**.
2. Add **`orgofin.com`**. Vercel marks it as the domain to configure and shows the exact DNS records it expects — **treat the dashboard's values as authoritative** if they differ from the defaults below.
3. Add **`www.orgofin.com`**. Vercel will offer to configure it as a **redirect to `orgofin.com`** — accept that (this is what makes apex canonical).

## Step 2 — Configure DNS at the registrar

Add these records at whoever hosts DNS for `orgofin.com` (Vercel's Settings → Domains panel shows the exact values to copy — prefer those over the table if they differ):

| Host / Name | Type    | Value                  | Purpose                                   |
| ----------- | ------- | ---------------------- | ----------------------------------------- |
| `@` (apex)  | `A`     | `76.76.21.21`          | Points `orgofin.com` at Vercel            |
| `www`       | `CNAME` | `cname.vercel-dns.com` | Points `www` at Vercel (redirects → apex) |

Notes:

- If the registrar supports **ALIAS / ANAME / flattened CNAME** at the apex, Vercel prefers that over the `A` record — use it if offered; otherwise the `A` record works everywhere.
- Do **not** proxy through Cloudflare's orange-cloud on first setup — it can interfere with Vercel's certificate issuance. Use "DNS only" until the cert is live.
- TLS is automatic: once DNS resolves, Vercel provisions and renews the Let's Encrypt certificate. No manual cert step.

## Step 3 — Set `NEXT_PUBLIC_SITE_URL`

In **Settings → Environment Variables**, set (or update) `NEXT_PUBLIC_SITE_URL` = `https://orgofin.com`, scoped to **Production**. Leave Preview/Development unset (they fall back to the Vercel preview origin via `site.ts`). Redeploy `main` so metadata/sitemap/robots pick up the canonical origin.

## Step 4 — Verify

- `https://orgofin.com` serves the site over HTTPS with a valid certificate.
- `https://www.orgofin.com` **redirects** (301) to `https://orgofin.com`.
- `https://orgofin.com/sitemap.xml` and `/robots.txt` emit **absolute `https://orgofin.com/...` URLs** (confirms `NEXT_PUBLIC_SITE_URL` took effect).
- View source on `/`: `<link rel="canonical">` / `og:url` reference the apex, not the Vercel `*.vercel.app` origin.

## Design Decisions

- **Apex canonical, www redirect.** Chosen 2026-07-08. A single canonical origin keeps SEO link equity consolidated and `metadataBase` honest; www exists only as a courtesy redirect.
- **`A` record default, ALIAS if available.** Universal compatibility first; the cleaner apex-CNAME-flattening path is a registrar-dependent upgrade, not a requirement.
- **Registrar values yield to Vercel's panel.** Vercel occasionally issues account-specific records; the dashboard is the source of truth, this doc is the map.

## Current Status

**Not yet attached.** Production still serves from `https://website-chi-azure-55.vercel.app`. This document is the runbook to change that; execute it when the registrar access is in hand. Update [`README.md`](./README.md)'s environments table and the Production URL the moment the apex resolves.

## Future Improvements

- Once live, review production security headers (`next.config.ts`) and HSTS as a separate hardening change.
- Consider a stable Staging domain (e.g., `uat.orgofin.com`) via Vercel Custom Environments once a staging flow is actually used.

## TODO

- [ ] Confirm `orgofin.com` ownership + registrar DNS access.
- [ ] Add `orgofin.com` + `www.orgofin.com` in Vercel (Step 1) and configure DNS (Step 2).
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://orgofin.com` in Production (Step 3).
- [ ] Verify apex serves + www redirects + absolute URLs are canonical (Step 4).
- [ ] Update `README.md` Production URL and mark E13.1.3 done once verified.

## References

- [`vercel-setup.md`](./vercel-setup.md) — first-time Vercel connection (Step 5 points here)
- [`environment-variables.md`](./environment-variables.md) — the `NEXT_PUBLIC_SITE_URL` variable
- [`src/lib/seo/site.ts`](../../src/lib/seo/site.ts) — where the canonical origin is consumed
- [`.claude/context/seo.md`](../../.claude/context/seo.md) — canonical-URL policy

## Related Documents

- [`README.md`](./README.md) — operational runbook (URLs, rollback)

---

**Last Updated:** 2026-07-08
**Owner:** Orgofin Engineering (TODO: assign a DRI)
