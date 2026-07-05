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

Local pre-commit/pre-push (Husky): lint + format on staged files at commit, type-check at push — catches most issues before they reach CI at all.

## Environment Variables — Convention

- Never committed. Managed per-environment in Vercel's dashboard.
- `NEXT_PUBLIC_` prefix only for values genuinely needed client-side (e.g., GA4 measurement ID) — server-only secrets (Supabase service role key, if ever used server-side) never get this prefix.
- See [`docs/deployment/environment-variables.md`](../../docs/deployment/environment-variables.md) for the actual variable list (TODO-heavy until implementation).

## Supabase Environment Isolation

Recommended: separate Supabase projects (or at minimum clearly separated tables/RLS policies) for preview/dev vs. production — so test waitlist submissions during development never pollute the real, investor-facing signup count. Not yet decided — see `frontend.md` §11 TODO.

## The Backend-Migration Boundary

Deployment conventions must preserve the seam described in `frontend.md` §11: today, `lib/api/*` calls Supabase directly from Vercel-hosted API routes. When a NestJS/Go backend eventually exists, deployment changes to _where that backend is hosted and how it's deployed_ — it should never require changing how the Next.js app itself is deployed or configured.

## Current Status

Conventions only — no `.github/workflows/*`, no Vercel project, no CI pipeline exists yet.

## Future Improvements

Once the first workflow file is written, this document should link to it directly rather than describing it in prose.

## TODO

- [ ] Write the actual GitHub Actions workflow file(s).
- [ ] Set up the Vercel project and connect branch environments.
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
