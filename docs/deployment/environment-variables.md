# Environment Variables

> **Purpose:** The reference list of environment variables the site needs — names, purpose, and where each is set. For the naming/prefix convention, see [`.claude/context/coding-standards.md`](../../.claude/context/coding-standards.md).
> **Applies to:** anyone provisioning an environment or adding a new integration that needs a secret/config value.

---

## Responsibilities

Owns the concrete list of variables and where they're managed. Does not own the naming convention (`.claude/context/coding-standards.md`) or the environment-isolation policy (`.claude/context/deployment.md`).

## Expected Variables (per `docs/product/prd.md` §5, §9)

| Variable                        | Purpose                                                               | Client-visible? | Status                                                                                  |
| ------------------------------- | --------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                                  | Yes             | ✅ Set in Vercel (prod project → Production; non-prod project → Preview + Development)  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key                                         | Yes             | ✅ Set in Vercel, same per-environment scoping as the URL                               |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-only Supabase key, if any server-side admin operation needs it | No              | Not used — public write path relies on the anon key + RLS (see the migration), not this |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 property ID                                                       | Yes             | TODO — no GA4 property created yet                                                      |
| `NEXT_PUBLIC_SITE_URL`          | Canonical site origin for metadata/sitemap/robots absolute URLs       | Yes             | Optional in dev (falls back to `src/lib/seo/site.ts`); set per-env in Vercel            |

## Where They're Set

Vercel dashboard, scoped per environment (Production / Preview / Development) — never committed to the repository. Supabase environments are **split into two projects** (isolation strategy decided 2026-07-08, see `.claude/context/deployment.md`):

- **Production** scope → the **prod** Supabase project.
- **Preview + Development** scope → the shared **non-prod** Supabase project.

So preview/dev/PR test submissions land in a separate database and never pollute the real, investor-facing signup count. The `waitlist` schema in both projects comes from [`supabase/migrations/20260708000000_create_waitlist.sql`](../../supabase/migrations/20260708000000_create_waitlist.sql).

## Current Status

Supabase is provisioned (2026-07-08): two projects, `waitlist` table created from the migration in both, and `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel with per-environment scoping. Verified end-to-end — a live submission on Production writes to the prod project's `waitlist` table. GA4 is not provisioned yet.

## Future Improvements

Add each real variable name to this table the moment it's provisioned — this file should never be more than one PR behind the actual `.env` shape.

## TODO

- [x] Provision Supabase project(s) and populate the actual variable values in Vercel. — done 2026-07-08 (two projects; verified live).
- [x] Decide if `SUPABASE_SERVICE_ROLE_KEY` is needed — not needed; anon key + RLS insert policy is sufficient for the public write path.
- [ ] Create the GA4 property and populate `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- [ ] Adopt `supabase gen types typescript` against the projects so `src/lib/supabase/types.ts` is generated rather than hand-mirrored (backlog E7.1.2).

## References

- [`../product/prd.md`](../product/prd.md) §5, §9
- [`../../.claude/context/deployment.md`](../../.claude/context/deployment.md)

## Related Documents

- [`README.md`](./README.md)

---

**Last Updated:** 2026-07-08
**Owner:** Orgofin Engineering (TODO: assign a DRI)
