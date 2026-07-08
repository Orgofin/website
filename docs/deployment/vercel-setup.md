# Vercel Setup — One-Time Connection Guide

> **Purpose:** The exact steps to connect this repository to Vercel and get per-PR preview deploys plus the `main`/`uat`/`dev` environment mapping. This is the one-time setup; the ongoing operational runbook (URLs, rollback, on-call) lives in [`README.md`](./README.md), and the CI/CD _policy_ in [`.claude/context/deployment.md`](../../.claude/context/deployment.md).
> **Applies to:** whoever owns the Vercel account and is connecting the project for the first time.

---

## Responsibilities

Owns the step-by-step to import, configure, and verify the Vercel project. Does not own the CI pipeline (GitHub Actions — separate from Vercel builds, see `deployment.md`) or the variable reference ([`environment-variables.md`](./environment-variables.md)).

## Prerequisites

- A Vercel account with access to the **Orgofin** GitHub org (or an invite to it).
- Admin on the `Orgofin/website` repo (to authorize the Vercel GitHub app).
- Nothing in the repo needs changing first: this is a **zero-config Next.js app** — Vercel auto-detects the framework, build command (`next build`), and output. **Do not add a `vercel.json`** unless a real need appears; the defaults are correct.

## Step 1 — Import the project (dashboard, recommended)

1. Vercel dashboard → **Add New… → Project**.
2. Select **`Orgofin/website`** (authorize the Vercel GitHub app for the org if prompted).
3. Framework preset auto-detects as **Next.js**. Leave Build/Output/Install settings at their defaults. Root directory = repo root.
4. Add environment variables (Step 3) now, or after the first deploy. Click **Deploy**.

> CLI alternative (interactive, run these yourself — e.g. `! vercel login` in this session): `npm i -g vercel` → `vercel login` → `vercel link` → `vercel` (preview) / `vercel --prod`. The dashboard path is simpler for first setup.

## Step 2 — Branch → environment mapping

Vercel's native model is **Production** (one branch) + **Preview** (everything else). Map it to this repo's three-branch model:

1. **Settings → Git → Production Branch → `main`.** Every push to `main` → Production.
2. Every push to **`dev`** and **`uat`**, and **every PR**, automatically gets a **Preview** deployment with its own URL (the Vercel bot comments the URL on each PR — this is where light/dark + cross-breakpoint **visual QA** happens before merge).
3. To give `uat` a stable **Staging** URL and `dev` a stable **Development** URL (matching the table in `deployment.md`), use Vercel **Custom Environments**: create a `Staging` env tracking `uat` and a `Development` env tracking `dev`. Optional — plain Preview URLs are enough to start.

## Step 3 — Environment variables

Set these (from [`src/env.ts`](../../src/env.ts)) under **Settings → Environment Variables**, scoping each to the right environments (Production / Preview / Development). All are currently **optional** — the app builds and runs without them; add each as its service is provisioned (see [`environment-variables.md`](./environment-variables.md)).

| Variable                        | Scope                       | Notes                                                                                                                                                                                                                        |
| ------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | all                         | Canonical origin for metadata/sitemap/robots. Prod = `https://orgofin.com` (apex canonical, decided 2026-07-08 — see [`custom-domain-setup.md`](./custom-domain-setup.md)); preview falls back to the Vercel preview origin. |
| `NEXT_PUBLIC_SUPABASE_URL`      | all (once provisioned)      | Supabase project URL. Use **separate values per environment** if the Supabase project is split (E1.3.3) so preview signups never touch the production waitlist.                                                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | all (once provisioned)      | Public anon key.                                                                                                                                                                                                             |
| `SUPABASE_SERVICE_ROLE_KEY`     | server only, if ever needed | Never prefixed `NEXT_PUBLIC_`; only add if a server op actually requires elevated access.                                                                                                                                    |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Production (and Staging)    | GA4 id; leave unset on Preview to avoid polluting analytics.                                                                                                                                                                 |

## Step 4 — Verify

- Trigger a redeploy (or open a throwaway PR) and confirm the Preview build is green and the URL renders the home page in **both** light and dark.
- Confirm the CI checks (GitHub Actions) and the Vercel build both pass on the PR — they are independent gates.

## Step 5 — Later

- Attach the production **custom domain** — canonical decision resolved (apex `orgofin.com`); follow [`custom-domain-setup.md`](./custom-domain-setup.md) and set `NEXT_PUBLIC_SITE_URL=https://orgofin.com`.
- Fill in the real environment URLs and rollback steps in [`README.md`](./README.md) once deployed.

## Design Decisions

- **Zero-config, no `vercel.json`.** Next on Vercel needs no build config; adding one only risks drift from the framework defaults. Any future need (headers, redirects, function regions) is a deliberate, separate change.
- **CI and Vercel are independent gates.** GitHub Actions runs the correctness gate (lint/format/typecheck/test/build); Vercel builds and hosts. A PR should be green on both. This keeps the quality gate enforced even if Vercel build settings change.
- **Preview = the visual-QA surface.** Automated tests assert behaviour/structure; the per-PR preview deploy is where humans review the rendered design in both themes and across breakpoints.

## Current Status

Connected 2026-07-07 (Vercel project `website`, production branch `main`, zero-config, no env vars set — all currently optional). Production is live at https://website-chi-azure-55.vercel.app; live URLs and rollback target now recorded in [`README.md`](./README.md). Custom domain still pending (E13.1.3).

## Future Improvements

- Once connected, consider a lightweight production-readiness pass (security headers via `next.config.ts`, cache-control review) as its own change.
- Revisit Custom Environments vs. plain Preview once the team actually uses a staging flow.

## TODO

- [x] Connect the Vercel project (Step 1) and set the production branch (Step 2). — done 2026-07-07.
- [x] Record real URLs + rollback steps in `README.md` after first deploy. — done.
- [ ] Add env vars as each service is provisioned (Step 3).
- [x] Resolve the canonical domain decision — apex `orgofin.com` (2026-07-08), see [`custom-domain-setup.md`](./custom-domain-setup.md). Attaching DNS + setting `NEXT_PUBLIC_SITE_URL` still pending there.

## References

- [`.claude/context/deployment.md`](../../.claude/context/deployment.md) — CI/CD policy and branch→environment intent
- [`environment-variables.md`](./environment-variables.md) — the variable reference
- [`src/env.ts`](../../src/env.ts) — the typed env schema these variables satisfy

## Related Documents

- [`README.md`](./README.md) — the operational runbook (URLs, rollback, on-call)

---

**Last Updated:** 2026-07-07
**Owner:** Orgofin Engineering (TODO: assign a DRI)
