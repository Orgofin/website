# Deployment Runbook

> **Purpose:** The human-facing operational runbook for deploying and operating the live site — URLs, environments, rollback steps. For engineering conventions/CI policy, see [`.claude/context/deployment.md`](../../.claude/context/deployment.md).
> **Applies to:** whoever is operating or on-call for the live site.

---

## Responsibilities

Owns the actual runbook once the site is live. Does not own CI/CD conventions or the backend-migration boundary (`.claude/context/deployment.md`).

> **First-time connection:** follow [`vercel-setup.md`](./vercel-setup.md) to import the repo, set the production branch, and configure env vars. The project is now connected — the URLs and rollback target below are live.

## Environments

| Branch | Environment         | URL                                                                                      |
| ------ | ------------------- | ---------------------------------------------------------------------------------------- |
| `main` | Production          | https://website-chi-azure-55.vercel.app — custom domain pending (DNS not yet configured) |
| `uat`  | Staging             | Per-push Vercel Preview URL (see dashboard) — stable Staging URL is a future improvement |
| `dev`  | Development preview | Per-push Vercel Preview URL (see dashboard)                                              |

## Rollback Procedure

Vercel keeps every prior deployment immutable, so rollback is a promotion, not a rebuild:

- **Dashboard:** Project → **Deployments** → pick the last known-good deployment → **⋯ → Promote to Production** (instant; no git revert needed).
- **CLI:** `vercel rollback [deployment-url]` (or `vercel rollback` to pick interactively).
- **Then** open a fix-forward PR for the actual bug — a rollback buys time, it isn't the fix.

Production URL to promote against: **https://website-chi-azure-55.vercel.app** (Vercel project `website`).

## Incident Response

TODO — no on-call rotation, alerting, or incident process exists yet. Define once the site has real traffic to protect.

## Current Status

Live on Vercel as of 2026-07-07. Production builds from `main` at https://website-chi-azure-55.vercel.app; `uat` and `dev` (plus every PR) get automatic Preview deploys. No custom domain yet (DNS pending — E13.1.3), no env vars set yet (all currently optional), and no incident-response process yet.

## Future Improvements

Fill in every TODO above at the moment of first production deployment — do not let this file stay a stub after the site is actually live.

## TODO

- [x] Provision the Vercel project and record the real URLs above. — connected 2026-07-07 (project `website`).
- [x] Document the actual rollback steps (dashboard vs. CLI). — see Rollback Procedure above.
- [ ] Attach a custom production domain and configure DNS (E13.1.3), then update the Production URL above.
- [ ] Define an incident response process once there's real traffic/data to protect.
- [ ] See [`environment-variables.md`](./environment-variables.md) for the related, equally TODO-heavy variable reference.

## References

- [`../../.claude/context/deployment.md`](../../.claude/context/deployment.md)

## Related Documents

- [`environment-variables.md`](./environment-variables.md)
- [`../adr/0001-frontend-first-no-backend-yet.md`](../adr/0001-frontend-first-no-backend-yet.md)

---

**Last Updated:** 2026-07-07
**Owner:** Orgofin Engineering (TODO: assign a DRI)
