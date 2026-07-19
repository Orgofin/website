# Deployment Conventions

> **Purpose:** The standing CI/CD rules and environment conventions for this repository. For the actual production runbook (URLs, rollback steps, on-call), see [`docs/deployment/`](../../docs/deployment/) — that's the human-facing operational doc; this is the policy Claude should assume when touching CI config or deployment-adjacent code.
> **Applies to:** anyone (human or Claude) writing a GitHub Actions workflow, touching environment variables, or changing anything deploy-related.

---

## Responsibilities

Owns: CI pipeline conventions, branch-to-environment mapping, and the backend-migration boundary as it relates to deployment. Does not own the actual runbook (`docs/deployment/`) or the frontend's internal architecture (`frontend.md` §11 has the detailed version of most of what's summarized here).

## Environment Mapping

| Branch             | Vercel environment  | Purpose                             |
| ------------------ | ------------------- | ----------------------------------- |
| `main`             | Production          | Live site                           |
| `uat`              | Staging/UAT         | Pre-production acceptance testing   |
| `dev`              | Development preview | Active development                  |
| any feature branch | PR preview          | Automatic per-PR preview deployment |

## CI Pipeline (GitHub Actions)

Required, in order, before merge: lint (ESLint) → format check (Prettier) → type-check (`tsc --noEmit`) → unit tests → Playwright E2E + axe accessibility pass → build → Lighthouse CI gate (Performance 95+, Accessibility/SEO/Best Practices 100 — see `docs/product/prd.md` §6). A regression at any step blocks merge; there is no "merge now, fix later" path for this pipeline.

The workflow implementing this pipeline is [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml): **lint → format check → typecheck → unit tests → dependency audit → build** on every PR to `dev`/`uat`/`main` (E1.2.1, plus the Vitest step E1.2.2). The Playwright/axe (E1.2.3) and Lighthouse (E1.2.4) steps are not wired yet — they depend on infrastructure that doesn't exist yet, and slot into the same file (after unit tests, before build, in the order above) once it does. A plain-English explainer of the whole gate lives at [`docs/engineering/quality-gates-explained.md`](../../docs/engineering/quality-gates-explained.md).

**Security scanning (audit M-03, added 2026-07-19).** Three layers, only the first merge-blocking:

- **`npm audit --audit-level=high`** — a step in the `ci.yml` quality gate (after tests, before build); a high/critical advisory blocks merge. No-fix advisories are pinned via `package.json` `overrides` (as the postcss GHSA was), never by relaxing the gate.
- **CodeQL SAST** — [`.github/workflows/codeql.yml`](../../.github/workflows/codeql.yml), `javascript-typescript` + `security-extended` queries, on PRs to the release branches + push to `main` + weekly. Advisory (findings surface in the Security tab / PR annotations), not gated.
- **Secret scanning + push protection** — GitHub-native (repo Settings → Code security), enabled 2026-07-19; free for this public repo, so no workflow. Dependabot **security** updates are on, and [`.github/dependabot.yml`](../../.github/dependabot.yml) adds weekly npm + actions **version** updates targeting `dev`.

Local pre-commit/pre-push (Husky): [`.husky/pre-commit`](../../.husky/pre-commit) runs `lint-staged` (ESLint + Prettier on staged files) at commit; [`.husky/pre-push`](../../.husky/pre-push) runs `npm run typecheck` at push — catching most issues before they reach CI at all.

## Environment Variables — Convention

- Never committed. Managed per-environment in Vercel's dashboard.
- `NEXT_PUBLIC_` prefix only for values genuinely needed client-side (e.g., GA4 measurement ID) — server-only secrets (Supabase service role key, if ever used server-side) never get this prefix.
- See [`docs/deployment/environment-variables.md`](../../docs/deployment/environment-variables.md) for the actual variable list (TODO-heavy until implementation).

## Supabase Environment Isolation

**Decided (2026-07-08): two separate Supabase projects.** A **prod** project backs Production (`main`); a shared **non-prod** project backs `uat`, `dev`, and PR previews. The split is enforced by per-environment scoping of `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` in Vercel, so test waitlist submissions never pollute the real, investor-facing signup count. Variable-level detail: [`docs/deployment/environment-variables.md`](../../docs/deployment/environment-variables.md); schema: [`supabase/migrations/`](../../supabase/migrations/).

## The Backend-Migration Boundary

Deployment conventions must preserve the seam described in `frontend.md` §11: today, `lib/api/*` calls Supabase directly from Vercel-hosted API routes. When a NestJS/Go backend eventually exists, deployment changes to _where that backend is hosted and how it's deployed_ — it should never require changing how the Next.js app itself is deployed or configured.

## Current Status

CI live: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) gates PRs on lint → format check → typecheck → unit tests → dependency audit → build; CodeQL SAST and GitHub-native secret scanning run alongside (security layer, above); Husky pre-commit/pre-push hooks run the local gate. The Vercel project is connected (2026-07-07): production builds from `main`, live on the custom apex domain **https://orgofin.com** (www 308-redirects to apex; `NEXT_PUBLIC_SITE_URL` set in Production), with automatic Preview deploys for `uat`/`dev`/PRs — see [`docs/deployment/README.md`](../../docs/deployment/README.md). The Playwright/axe + Lighthouse CI steps are still pending their underlying infrastructure.

## Future Improvements

Wire the remaining pipeline steps (Playwright/axe, Lighthouse gate) into `ci.yml` as their infrastructure lands. Vercel is connected and the custom apex domain is live; remaining deployment polish: give `uat`/`dev` stable Staging/Development URLs via Custom Environments, and consider Cloudflare orange-cloud/WAF in front of the apex (security audit M-04).

## TODO

- [x] Write the actual GitHub Actions workflow file(s). — first slice done in `ci.yml`; test/E2E/Lighthouse steps still pending (E1.2.2–E1.2.4).
- [x] Set up the Vercel project and connect branch environments — done 2026-07-07 (production branch `main`); guide: [`docs/deployment/vercel-setup.md`](../../docs/deployment/vercel-setup.md).
- [x] Attach a custom production domain / configure DNS (E13.1.3) and set `NEXT_PUBLIC_SITE_URL` — **done**: apex `orgofin.com` live, www 308→apex, canonicals/OG resolve to the apex, security headers served (verified 2026-07-19). Runbook: [`docs/deployment/custom-domain-setup.md`](../../docs/deployment/custom-domain-setup.md).
- [x] Wire CI security scanning (audit M-03) — done 2026-07-19: `npm audit` gate + CodeQL + native secret scanning/push protection + Dependabot.
- [x] Decide Supabase environment isolation strategy — done 2026-07-08: two projects (prod + non-prod), see above.
- [x] Populate `docs/deployment/environment-variables.md` with the real Supabase variables (done 2026-07-08); GA4 vars still pending its property.
- [ ] Remove the `package.json` `overrides` entry forcing `next`'s nested `postcss` to `^8.5.10` (added 2026-07-15 for the Dependabot XSS alert, GHSA postcss < 8.5.10) once a Next release stops pinning `postcss@8.4.31` — check on each Next upgrade.
- [ ] **Deferred toolchain majors (2026-07-19):** TypeScript **7.x** and ESLint **10.x** are `ignore`d for `semver-major` in `.github/dependabot.yml` — both broke `typecheck`/`lint` on the first Dependabot bump (TS 7 is the native-compiler jump past 6.x; ESLint 10 is a flat-config-breaking major) and are gated on ecosystem support. Do each as its own deliberate migration PR (verify the toolchain + Next.js/plugins are ready), then remove the corresponding `ignore` rule. Minor/patch for both still auto-update.

## References

- [`docs/product/prd.md`](../../docs/product/prd.md) §6 (performance targets), §4 (tech stack)
- [`frontend.md`](./frontend.md) §11

## Related Documents

- [`docs/deployment/`](../../docs/deployment/)
- [`workflows.md`](./workflows.md)

---

**Last Updated:** 2026-07-07
**Owner:** Orgofin Engineering (TODO: assign a DRI)
