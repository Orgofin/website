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

The workflow implementing this pipeline is [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml): **lint → format check → typecheck → unit tests → build** on every PR to `dev`/`uat`/`main` (E1.2.1, plus the Vitest step E1.2.2). The Playwright/axe (E1.2.3) and Lighthouse (E1.2.4) steps are not wired yet — they depend on infrastructure that doesn't exist yet, and slot into the same file (after unit tests, before build, in the order above) once it does. A plain-English explainer of the whole gate lives at [`docs/engineering/quality-gates-explained.md`](../../docs/engineering/quality-gates-explained.md).

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

First CI slice live: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) gates PRs on lint → format check → typecheck → build, and Husky pre-commit/pre-push hooks run the local gate. The Vercel project is connected (2026-07-07): production builds from `main` at https://website-chi-azure-55.vercel.app, with automatic Preview deploys for `uat`/`dev`/PRs — see [`docs/deployment/README.md`](../../docs/deployment/README.md). The test/E2E/Lighthouse CI steps are still pending their underlying infrastructure.

## Future Improvements

Wire the remaining pipeline steps (unit tests, Playwright/axe, Lighthouse gate) into `ci.yml` as their infrastructure lands. Vercel is connected; the next deployment milestone is attaching a custom production domain (E13.1.3) and giving `uat`/`dev` stable Staging/Development URLs via Custom Environments.

## TODO

- [x] Write the actual GitHub Actions workflow file(s). — first slice done in `ci.yml`; test/E2E/Lighthouse steps still pending (E1.2.2–E1.2.4).
- [x] Set up the Vercel project and connect branch environments — done 2026-07-07 (production branch `main`); guide: [`docs/deployment/vercel-setup.md`](../../docs/deployment/vercel-setup.md).
- [ ] Attach a custom production domain / configure DNS (E13.1.3) and set `NEXT_PUBLIC_SITE_URL`.
- [x] Decide Supabase environment isolation strategy — done 2026-07-08: two projects (prod + non-prod), see above.
- [x] Populate `docs/deployment/environment-variables.md` with the real Supabase variables (done 2026-07-08); GA4 vars still pending its property.

## References

- [`docs/product/prd.md`](../../docs/product/prd.md) §6 (performance targets), §4 (tech stack)
- [`frontend.md`](./frontend.md) §11

## Related Documents

- [`docs/deployment/`](../../docs/deployment/)
- [`workflows.md`](./workflows.md)

---

**Last Updated:** 2026-07-07
**Owner:** Orgofin Engineering (TODO: assign a DRI)
