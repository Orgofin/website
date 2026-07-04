# Deployment Runbook

> **Purpose:** The human-facing operational runbook for deploying and operating the live site — URLs, environments, rollback steps. For engineering conventions/CI policy, see [`.claude/context/deployment.md`](../../.claude/context/deployment.md).
> **Applies to:** whoever is operating or on-call for the live site.

---

## Responsibilities

Owns the actual runbook once the site is live. Does not own CI/CD conventions or the backend-migration boundary (`.claude/context/deployment.md`).

## Environments

| Branch | Environment | URL |
|---|---|---|
| `main` | Production | TODO — not yet deployed |
| `uat` | Staging | TODO — not yet deployed |
| `dev` | Development preview | TODO — not yet deployed |

## Rollback Procedure

TODO — document the actual Vercel rollback steps once the project is provisioned (expected: instant rollback to the prior deployment via the Vercel dashboard or CLI, per `.claude/context/deployment.md`).

## Incident Response

TODO — no on-call rotation, alerting, or incident process exists yet. Define once the site has real traffic to protect.

## Current Status

Nothing is deployed. This is a placeholder structure to be filled in as part of the first deployment, not a description of an existing operation.

## Future Improvements

Fill in every TODO above at the moment of first production deployment — do not let this file stay a stub after the site is actually live.

## TODO

- [ ] Provision the Vercel project and record the real URLs above.
- [ ] Document the actual rollback steps (dashboard vs. CLI).
- [ ] Define an incident response process once there's real traffic/data to protect.
- [ ] See [`environment-variables.md`](./environment-variables.md) for the related, equally TODO-heavy variable reference.

## References

- [`../../.claude/context/deployment.md`](../../.claude/context/deployment.md)

## Related Documents

- [`environment-variables.md`](./environment-variables.md)
- [`../adr/0001-frontend-first-no-backend-yet.md`](../adr/0001-frontend-first-no-backend-yet.md)

---
**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
