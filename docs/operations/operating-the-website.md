# Operating the Website After Launch — Runbook for First-Time Founders

> **Purpose:** A practical, founder-facing guide to running the live Orgofin website — maintenance, updates, backups, incidents, support workflows, release management, scaling, compliance, and the real-world edge cases that bite first-time teams — with **actionable mitigations**, not just a list.
> **Applies to:** founders and whoever operates the site day-to-day.
> **Classification:** Internal.

---

## Responsibilities

Owns steady-state operations. Detailed monitoring lives in [`monitoring-and-analytics.md`](./monitoring-and-analytics.md); the launch sequence in [`../launch/launch-playbook.md`](../launch/launch-playbook.md); deploy mechanics in [`docs/deployment/`](../deployment/). This document is the "how to keep it healthy and what to do when it isn't."

---

## 1. Maintenance Schedule

| Cadence            | Task                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Daily              | Glance at uptime, errors, signups, abuse signal (see monitoring doc, Daily).                        |
| Weekly             | Merge Dependabot PRs (after CI passes); `npm audit`; export leads; triage errors; SEO glance.       |
| Monthly            | Restore-test a backup; retune alerts; run security checklist; cost review; SEO deep-dive.           |
| Quarterly          | Full security manual pen-test; dependency major-version review; review the whole doc set for drift. |
| On Next.js release | Re-check the `postcss` `overrides` pin (remove when upstream stops pinning the vulnerable version). |

---

## 2. Dependency Updates

- **Automate:** enable Dependabot (weekly). Merge only on green CI. `package-lock.json` + `npm ci` guarantee reproducible installs.
- **Security patches:** treat high/critical `npm audit` findings as drop-everything; patch or pin (as was done for the `postcss` GHSA).
- **Majors (React/Next/Tailwind):** do these deliberately in their own PR, read the migration guide, verify the full CI gate + a manual smoke, never bundle with a feature.
- **Mitigation for a bad update:** it can't reach production without passing CI; if it slips through, roll back the deployment.

## 3. Database Maintenance (Supabase)

- Postgres is managed — no manual VACUUM/patching needed. Your jobs: watch table growth (spam inflates it), keep RLS policies intact, and keep the schema migrations in `supabase/migrations/` as the source of truth.
- **Never disable RLS** to "quickly fix" something — that's the control that keeps leads private.
- Periodically prune spam rows (see §14) and monitor row counts vs plan limits.

## 4. Backups

- **Two independent layers:** (a) Supabase's own backups/PITR — _confirm your plan actually includes this_; (b) an independent weekly export (CSV or `pg_dump`) of `waitlist` + `data_room_requests` to an owner-controlled location (e.g. founder's Drive).
- **The rule:** a backup you have never restored is a hope. Restore-test monthly into the non-prod project.
- **Code + config:** GitHub is the code backup; keep an offline note of _which_ secrets/services exist (not the values) so the stack is rebuildable.

## 5. Disaster Recovery

See the [launch playbook's DR section](../launch/launch-playbook.md#disaster-recovery-plan) for the full scenario table and rollback steps. Core reflex: **mitigate (roll back / enable protection) before you diagnose.**

## 6. SSL / TLS Renewal

- Automatic via Vercel (Let's Encrypt) once DNS resolves — no manual step, auto-renews.
- **Mitigation:** the only way this breaks is DNS changing or the domain lapsing (§9). Uptime monitor + a certificate-expiry check catch it.

## 7. Domain Management

- Keep **auto-renew ON** at the registrar and a backup payment method on file — an expired domain is one of the most common and most damaging startup outages.
- Lock the domain (registrar transfer lock) and enable registrar 2FA.
- Document the registrar, DNS host, and record set (per `custom-domain-setup.md`). Losing knowledge of _where DNS lives_ is its own outage.

## 8. CDN Management

- Vercel CDN is automatic (immutable hashed assets). If Cloudflare is added, keep origin = Vercel, use "DNS only" during cert changes, and document which features (WAF/rate-limit/cache) are enabled.

## 9. Monitoring

- Covered in [`monitoring-and-analytics.md`](./monitoring-and-analytics.md). The operational point: **alerts must route to a human who is actually watching.** Test-fire them.

## 10. Incident Response

- Define a DRI (currently a TODO across the deployment docs). Severity → mitigate → diagnose → fix-forward → communicate → blameless post-mortem. Full flow in the launch playbook.

## 11. Customer / Investor Support Workflow

- **Waitlist replies / general contact:** route to a shared inbox; SLA e.g. 2 business days.
- **Investor data-room requests:** the site promises "a founder will follow up within 48 hours" — honor it. Export new `data_room_requests` rows, qualify, and respond personally.
- **Mitigation for volume spikes:** templated-but-personal responses; a simple CRM/spreadsheet to track lead status so nobody falls through.

## 12. Bug Reporting Workflow

- Give users one obvious channel (contact email / form). Internally, funnel bugs into GitHub Issues with a severity label. Sentry auto-captures errors users don't report.
- **Fix path:** reproduce → issue → PR through CI → deploy. No hotfixing straight to production outside the pipeline.

## 13. Feature Request Workflow

- Collect in one backlog (GitHub Issues / the existing implementation backlog). Founder prioritizes against the product narrative. Don't let the marketing site accrete features that belong in the product.

## 14. Release Management, Staging vs Production, Deployment & Rollback

- **Branches:** `dev` (development) → `uat` (staging) → `main` (production); every PR gets a preview. Changes flow through PR + CI; no direct-to-prod.
- **Staging (`uat`)** uses the non-prod Supabase project so test data never pollutes real signups.
- **Deploy:** merge to `main` → Vercel builds + deploys. **Rollback:** promote the last known-good deployment (instant). One PR does one thing; docs ride with the change.

## 15. Scaling Plan

- The site scales on Vercel's CDN/serverless automatically — static marketing pages are effectively infinitely scalable. The only scaling pressure points are: Supabase write volume/row count (mitigated by rate limiting + spam pruning) and third-party quotas (GA4/Sentry — watch free-tier limits).
- **At 100k+ visitors:** costs stay low (static content); ensure rate limiting + WAF are tuned; consider Vercel/Supabase paid tiers as quotas approach. No re-architecture needed for the _website_.

## 16. Hiring Considerations

- For the website alone, one part-time engineer suffices. The docs (this set + `.claude/context/`) are written so a new engineer or a new Claude session can onboard without a walkthrough.
- The real hiring need arrives with the **product platform** (backend, agents, compliance) — a different, larger effort out of scope here.

## 17. Compliance, Privacy & Legal Basics

- **Privacy policy and terms — published 2026-07-24** at `/privacy` and `/terms`, covering lead PII (email/name/firm) with DPDP framing. Status, decisions and open inputs: [`../legal/README.md`](../legal/README.md). Both are **pending counsel review**.
- **Consent:** shipped 2026-07-24. GA4 loads only after the visitor accepts, so no Google cookie is set before then. Operationally this means **analytics under-counts by however many visitors decline** — treat GA4 traffic as a floor, not a total, and don't read a drop after launch as lost traffic.
- **Data minimization:** the forms already collect only what's needed; keep it that way.
- **Data subject requests:** requests come to `contact@orgofin.com`. Deletion is **manual via the Supabase dashboard** — the published 24-month retention window has no expiry job behind it yet, so honouring it is an operator responsibility today.
- **Contact page** does not exist yet; the legal pages route everything to `contact@orgofin.com`. No fabricated business facts anywhere (CLAUDE.md non-negotiable #1).

## 18. Investor Due Diligence Readiness

- This documentation set _is_ a diligence asset: the [security architecture](../security/security-architecture.md) and [audit](../security/security-audit-report.md) answer the security questionnaire; ADRs record decisions; the runbooks show operational maturity.
- Keep the confidential technical handbook (internal only) current for CTO-level conversations.

## 19. Enterprise Readiness

- Enterprise/BFSI prospects will ask for the security posture — the security docs cover it. As real customers arrive, expect requests for a SOC2 path, DPA, and uptime SLA — track these as they come; don't over-invest pre-traction.

---

## 20. Real-World Edge Cases → Actionable Mitigations

| Edge case                      | Prevention                                                                                                                                      | If it happens                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Production outage**          | CI gate; immutable deploys; uptime alerts                                                                                                       | Roll back to last good deploy; comms; fix-forward.                                                          |
| **Database corruption**        | Managed Postgres; migrations in VCS                                                                                                             | Restore from PITR/export into non-prod, verify, promote.                                                    |
| **Accidental deletion**        | RLS blocks anon deletes; limit dashboard access                                                                                                 | Restore from backup/export; audit who had access.                                                           |
| **Spam users / fake accounts** | Rate limiting + Turnstile (audit H-02/M-02); unique email on waitlist                                                                           | Prune spam rows; tighten limits; block offending IPs/ASNs at Cloudflare.                                    |
| **Bot attacks**                | Cloudflare bot fight mode; rate limits                                                                                                          | "Under Attack" mode; block patterns; monitor WAF analytics.                                                 |
| **API abuse**                  | Rate limiting; Origin checks; monitoring 429s                                                                                                   | Tighten thresholds; block sources; confirm not hitting real users.                                          |
| **Leaked credentials**         | Service key server-only; secret scanning; least privilege                                                                                       | Rotate the key in Supabase immediately → update Vercel → redeploy → audit access.                           |
| **Expired domain**             | Auto-renew ON; registrar 2FA + transfer lock; backup card                                                                                       | Renew immediately; if seized, contact registrar; DNS documented for fast re-point.                          |
| **Billing failures**           | Backup payment method on Vercel/Supabase/registrar; billing alerts                                                                              | Update payment before suspension; monitor account emails.                                                   |
| **Cloudflare/Vercel outage**   | Nothing you control — depend on their SLAs                                                                                                      | Monitor their status pages; comms to stakeholders; for CF-proxy issues, drop to "DNS only".                 |
| **Employee offboarding**       | Least-privilege access; SSO; access inventory                                                                                                   | Revoke GitHub/Vercel/Supabase/registrar/GA access same day; rotate any shared secrets they knew.            |
| **Founder access management**  | **No single point of failure:** ≥2 owners on every critical account (domain, Vercel, Supabase, GitHub, GA); 2FA everywhere; documented recovery | If a founder is unreachable, a second owner retains access — this is the most important item on this table. |

**The two mitigations first-time founders most often skip, and must not:**

1. **≥2 owners + 2FA on every critical account** (domain, Vercel, Supabase, GitHub). Bus-factor-of-one on the domain or the Supabase project is an existential, unforced error.
2. **A tested, independent backup** of the lead data. Supabase's own backups are not enough if the failure is your account access.

---

## Current Status

Steady-state operations guide drafted 2026-07-18; §17 refreshed 2026-07-24 when `/privacy` and `/terms` shipped. Several mitigations (WAF, Sentry, alerting, backup export, consent banner, retention expiry, DRI assignment) are recommended and not yet implemented — tracked in the launch/security/legal docs.

## Future Improvements

Revisit when the product platform launches — it changes support, compliance (SOC2/DPA), scaling, and hiring materially.

## TODO

- [ ] Assign a DRI (operations owner).
- [ ] Ensure ≥2 owners + 2FA on domain, Vercel, Supabase, GitHub, GA.
- [ ] Set up the independent lead-table export + monthly restore test.
- [x] Publish privacy policy + decide consent posture — pages live 2026-07-24, posture decided (banner to be built). See [`../legal/README.md`](../legal/README.md).
- [ ] Implement the published 24-month retention window — no expiry job exists, so honouring it is manual today.

## References

- [`monitoring-and-analytics.md`](./monitoring-and-analytics.md)
- [`../launch/launch-playbook.md`](../launch/launch-playbook.md)
- [`docs/deployment/README.md`](../deployment/README.md)
- [`../security/security-architecture.md`](../security/security-architecture.md)

## Related Documents

- [`docs/deployment/environment-variables.md`](../deployment/environment-variables.md)

---

**Last Updated:** 2026-07-18
**Owner:** Orgofin Founders + Engineering (TODO: assign a DRI)
