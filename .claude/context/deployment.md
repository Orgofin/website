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

Recommended: separate Supabase projects (or at minimum clearly separated tables/RLS policies) for preview/dev vs. production — so test waitlist submissions during development never pollute the real, investor-facing signup count. Not yet decided — see `frontend.md` §11 TODO.

## The Backend-Migration Boundary

Deployment conventions must preserve the seam described in `frontend.md` §11: today, `lib/api/*` calls Supabase directly from Vercel-hosted API routes. When a NestJS/Go backend eventually exists, deployment changes to _where that backend is hosted and how it's deployed_ — it should never require changing how the Next.js app itself is deployed or configured.

## Current Status

First CI slice live: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) gates PRs on lint → format check → typecheck → build, and Husky pre-commit/pre-push hooks run the local gate. No Vercel project is connected yet, and the test/E2E/Lighthouse CI steps are still pending their underlying infrastructure.

## Future Improvements

Wire the remaining pipeline steps (unit tests, Playwright/axe, Lighthouse gate) into `ci.yml` as their infrastructure lands, and connect the Vercel project so branch → environment mapping (above) becomes real.

## TODO

- [x] Write the actual GitHub Actions workflow file(s). — first slice done in `ci.yml`; test/E2E/Lighthouse steps still pending (E1.2.2–E1.2.4).
- [ ] Set up the Vercel project and connect branch environments — the step-by-step guide is written ([`docs/deployment/vercel-setup.md`](../../docs/deployment/vercel-setup.md)); the connection itself is an interactive account step.
- [ ] Decide Supabase environment isolation strategy (see above).
- [ ] Populate `docs/deployment/environment-variables.md` with real variable names once Supabase/GA4 are provisioned.

## References

- [`docs/product/prd.md`](../../docs/product/prd.md) §6 (performance targets), §4 (tech stack)
- [`frontend.md`](./frontend.md) §11

## Related Documents

- [`docs/deployment/`](../../docs/deployment/)
- [`workflows.md`](./workflows.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
