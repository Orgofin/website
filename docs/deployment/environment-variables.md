# Environment Variables

> **Purpose:** The reference list of environment variables the site needs — names, purpose, and where each is set. For the naming/prefix convention, see [`.claude/context/coding-standards.md`](../../.claude/context/coding-standards.md).
> **Applies to:** anyone provisioning an environment or adding a new integration that needs a secret/config value.

---

## Responsibilities

Owns the concrete list of variables and where they're managed. Does not own the naming convention (`.claude/context/coding-standards.md`) or the environment-isolation policy (`.claude/context/deployment.md`).

## Expected Variables (per `docs/product/prd.md` §5, §9)

| Variable                        | Purpose                                                               | Client-visible? | Status                                                                          |
| ------------------------------- | --------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                                  | Yes             | TODO — no Supabase project provisioned yet                                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key                                         | Yes             | TODO                                                                            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-only Supabase key, if any server-side admin operation needs it | No              | TODO — only add if actually needed; don't provision unused elevated credentials |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 property ID                                                       | Yes             | TODO — no GA4 property created yet                                              |
| `NEXT_PUBLIC_SITE_URL`          | Canonical site origin for metadata/sitemap/robots absolute URLs       | Yes             | Optional in dev (falls back to `src/lib/seo/site.ts`); set per-env in Vercel    |

## Where They're Set

Vercel dashboard, scoped per environment (Production / Preview / Development) — never committed to the repository, never shared verbatim between environments if Supabase environments are split (see `.claude/context/deployment.md`).

## Current Status

No environment variables exist yet — nothing is provisioned. This table states the expected shape once Supabase and GA4 are set up.

## Future Improvements

Add each real variable name to this table the moment it's provisioned — this file should never be more than one PR behind the actual `.env` shape.

## TODO

- [ ] Provision Supabase project(s) and populate the actual variable values in Vercel.
- [ ] Create the GA4 property and populate `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- [ ] Decide if `SUPABASE_SERVICE_ROLE_KEY` is needed at all, or if the anon key + RLS policies are sufficient for this site's needs.

## References

- [`../product/prd.md`](../product/prd.md) §5, §9
- [`../../.claude/context/deployment.md`](../../.claude/context/deployment.md)

## Related Documents

- [`README.md`](./README.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
