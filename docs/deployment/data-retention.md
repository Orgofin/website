# Lead Retention & Purge — Operator Runbook

> **Purpose:** The operator steps that make the published 24-month retention window real, plus how to exempt a record that must be kept longer and how to verify the purge is actually running.
> **Applies to:** whoever has Supabase project access (founder or engineer).

---

## Responsibilities

Owns the procedure for applying and operating the retention purge. Does not own the retention _decision_ (founders, 2026-07-24 — [`../legal/README.md`](../legal/README.md)), what the site promises about it ([`/privacy`](<../../src/app/(marketing)/privacy/page.tsx>) §8), or the inventory of what is stored ([`../legal/data-processing-inventory.md`](../legal/data-processing-inventory.md) §4).

## Why this exists

`/privacy` §8 tells every visitor their record is deleted 24 months after they give it. Until this migration nothing enforced that: rows persisted indefinitely and deletion was a manual dashboard job someone had to remember. A published retention promise with no mechanism behind it creates the obligation without the compliance — strictly worse than not promising.

## What the migration installs

[`supabase/migrations/20260724120000_lead_retention_expiry.sql`](../../supabase/migrations/20260724120000_lead_retention_expiry.sql):

| Object                                      | What it does                                                                             |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `retained_until`, `retained_reason` columns | On both lead tables. The exemption mechanism — see below.                                |
| `created_at` indexes                        | The purge scans by age; give it an index to scan.                                        |
| `retention_window()`                        | Returns `interval '24 months'`. One definition, readable without reading the purge body. |
| `purge_expired_leads()`                     | Deletes expired, unexempted rows from both tables and returns the counts.                |
| `purge-expired-leads` cron job              | Runs the purge daily at **03:15 UTC**.                                                   |

And [`supabase/migrations/20260727120000_retention_purge_observability.sql`](../../supabase/migrations/20260727120000_retention_purge_observability.sql), which makes a failed run visible:

| Object                       | What it does                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `retention_purge_runs` table | One row per attempt — status, deleted counts, duration, error. RLS on with no policy; revoked from `anon`. |
| `purge_expired_leads()`      | Replaced: same deletion logic, now records every attempt and **catches** failures instead of raising.      |
| `retention_purge_health()`   | The verdict — `healthy` / `failing` / `stale` / `unknown`, plus the threshold that produced it.            |
| `/api/health/retention`      | Serves that verdict as **200 healthy / 503 look at this**, for the uptime monitor to poll.                 |

Two details worth knowing before you run it:

- **`purge_expired_leads()` is `SECURITY DEFINER`.** Both tables have RLS with INSERT-only policies and no DELETE policy at all — deliberately, so the anon key can never remove rows. The scheduled job therefore has to run as the owner. Its `search_path` is pinned for the usual privilege-escalation reason, and `EXECUTE` is revoked from `public`, `anon` and `authenticated` — without those revokes PostgREST would expose it at `/rest/v1/rpc/purge_expired_leads` and any anonymous visitor could wipe both lead tables.
- **A failed purge no longer raises, and this is deliberate.** Postgres has no autonomous transactions: a plpgsql exception handler stays inside the caller's transaction, so the failure row it writes survives only if the function then returns normally. Re-raising would abort the transaction and destroy the very record that makes the failure visible. There is no formulation that does both. **The consequence: `cron.job_run_details` now reports success for a failed purge.** `retention_purge_runs` is the authoritative record — do not trust the pg_cron history for this job. The error also goes to the Postgres log via `raise warning`.
- **The 24-month value exists in two places.** `retention_window()` is what deletes; `DATA_RETENTION_MONTHS` in [`src/lib/legal/constants.ts`](../../src/lib/legal/constants.ts) is what `/privacy` renders. They cannot share a value across TypeScript and Postgres, so both carry a pointer to the other. **Change one, change both** — a mismatch means the site publishes a promise the database doesn't keep.

## Apply it

Per Supabase project — **prod first, and non-prod too** so preview environments behave the same.

1. **Enable pg_cron.** Dashboard → Database → Extensions → search `pg_cron` → enable. This cannot be reliably done from a migration, which is why step 2 is guarded.
2. **Run the migration** (SQL editor, or CLI), same as the earlier ones. It is re-runnable-safe.
3. **Read the notices.** If pg_cron was not enabled, the migration still applies everything else and raises:
   > `pg_cron is NOT enabled — the purge function exists but NOTHING IS SCHEDULED.`
   > Enable it and re-run. **The migration succeeding is not proof the purge is scheduled** — this is the one failure mode that looks like success.
4. **Confirm the schedule:**
   ```sql
   select jobname, schedule, active from cron.job where jobname = 'purge-expired-leads';
   ```
   Expect one row, `15 3 * * *`, `active = true`.

## Verify it works

Run it by hand once. It is safe today: the site launched in 2026, so nothing is anywhere near 24 months old and the counts should be zero.

```sql
select * from public.purge_expired_leads();
```

Expect two rows, both `deleted_count = 0`. A non-zero count today means something is wrong with `created_at`, not that the purge worked.

To prove it actually deletes, use a throwaway row rather than waiting two years:

```sql
-- Arrange: a row that is already past the window.
insert into public.waitlist (email, source, created_at)
values ('retention-test@example.com', 'retention-test', now() - interval '25 months');

select * from public.purge_expired_leads();   -- expect waitlist = 1

select count(*) from public.waitlist where email = 'retention-test@example.com';  -- expect 0
```

And that the exemption holds:

```sql
insert into public.waitlist (email, source, created_at, retained_until, retained_reason)
values ('retention-exempt@example.com', 'retention-test',
        now() - interval '25 months', 'infinity', 'retention runbook test');

select * from public.purge_expired_leads();   -- expect waitlist = 0

delete from public.waitlist where email = 'retention-exempt@example.com';  -- clean up
```

## Is it still running?

Three ways to ask, cheapest first.

**1. Over HTTP** — what the uptime monitor polls, and the only one that needs no database access:

```
curl -i https://orgofin.com/api/health/retention
```

`200` with `{"status":"healthy", …}` means a run succeeded inside the window. `503` means one of:

| `status`      | What happened                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `stale`       | No successful run for over 48 hours. **Check pg_cron first** — a project where it was never enabled looks exactly like this. |
| `failing`     | Something succeeded inside the window, but the most recent attempt raised. Read `last_error` from the database (below).      |
| `unknown`     | No run history at all. Only reachable if `retention_purge_runs` was truncated; the migration seeds a baseline row.           |
| `unavailable` | The check itself could not run — missing `SUPABASE_SERVICE_ROLE_KEY`, or Supabase unreachable. Expected in local/CI/preview. |

**`stale` outranks `failing`, and the distinction tells you where to look.** A purge that failed last night but succeeded the night before is `failing` — read the error. A purge that has not succeeded for five days is `stale` even if its last attempt also failed, because the question is then whether the job is still firing at all. `last_error` is available in both cases.

48 hours against a daily 03:15 UTC schedule means **one missed run is tolerated, two are not** — tight enough to catch a real stall, loose enough not to flap on a maintenance window. The threshold lives in `retention_purge_health()` and travels back in the response as `staleAfterHours`; it is not restated in the TypeScript, so there is only one place to change it.

**2. The verdict, in SQL** — same answer, plus the error text the endpoint withholds:

```sql
select * from public.retention_purge_health();
```

**3. The raw history** — what actually happened, run by run:

```sql
select ran_at, status, waitlist_deleted, data_room_deleted, duration_ms, error_message
  from public.retention_purge_runs
 order by ran_at desc limit 20;
```

A `status = 'installed'` row is the migration-time baseline, not a purge. It exists so that a project where pg_cron was never enabled goes `stale` on schedule instead of sitting at `unknown` forever — that being the one failure mode that otherwise looks like success.

## Keeping a record longer

`/privacy` §8 promises deletion at 24 months _"unless you have become a customer or an investor and we have a continuing reason to hold them, or the law requires us to keep them longer."_ `retained_until` is what makes that clause real rather than aspirational.

```sql
update public.data_room_requests
   set retained_until  = 'infinity',
       retained_reason = 'Active investor — participated in the seed round'
 where email = 'someone@fund.example';
```

- `NULL` (the default, and the case for essentially every row) means no exemption.
- A timestamp holds the row until that moment; an **expired** exemption stops protecting it, so a temporary hold cleans itself up instead of quietly becoming permanent.
- `'infinity'` holds indefinitely.
- **Always set `retained_reason`.** An exemption without a recorded reason is indistinguishable from a mistake, and it is the first thing anyone auditing this will ask about.

Review the exemption list occasionally — it is the one place data escapes the published policy:

```sql
select email, created_at, retained_until, retained_reason
  from public.data_room_requests where retained_until is not null
union all
select email, created_at, retained_until, retained_reason
  from public.waitlist where retained_until is not null;
```

## Watch out for

- **Deletion is permanent.** There is no soft-delete and no archive. If leads matter to the business beyond 24 months, export them to the founder-controlled store ([`../launch/launch-playbook.md`](../launch/launch-playbook.md) first-week checklist) — do not rely on exemptions to serve as a backup.
- **`cron.job_run_details` is no longer the source of truth for this job.** It will say `succeeded` even when the purge failed, for the transaction reason above. Use `retention_purge_health()` or `retention_purge_runs`. pg_cron's own history is still worth reading for the _other_ failure mode — the job not firing at all, which leaves no row in either place:
  ```sql
  select start_time, status, return_message
    from cron.job_run_details
   where jobid = (select jobid from cron.job where jobname = 'purge-expired-leads')
   order by start_time desc limit 10;
  ```
- **The endpoint answers honestly whether or not anyone is listening.** Alerting is the uptime monitor's job; until [`../launch/launch-playbook.md`](../launch/launch-playbook.md)'s monitor gate is done, a 503 here goes to nobody.
- **Non-prod drifts.** Applying to prod only means preview environments keep rows forever and the two projects diverge. Apply to both.

## Current Status

**Applied and running on both projects (prod and non-prod) as of 2026-07-25.** pg_cron was enabled and the migration run on each; `cron.job` reports `purge-expired-leads`, `15 3 * * *`, `active = true` on both. `/privacy` §8's 24-month window is now enforced by a mechanism rather than by intention.

The schedule confirmation — not the migration exit status — is the evidence, for the reason in the "Apply it" section above: with pg_cron off, the migration still succeeds and schedules nothing. Re-run the `cron.job` query after any replay, restore, or project migration.

**Observability (`20260727120000`) is written and merged but NOT YET APPLIED to either project.** Until it is, the purge remains silent and `/api/health/retention` answers `503 unavailable` in production. Applying it is a founder/infra step — see the TODO below.

## Future Improvements

- Fold the retention window into generated types once `supabase gen types` is adopted (backlog E7.1.2), removing one side of the TypeScript/SQL duplication.
- Record _why_ a purge deleted nothing when the lead tables are non-empty — today a zero-count success and a correctly-empty window look identical.
- Re-raise on failure once there is somewhere to write the record out-of-band (a webhook from the exception handler, or `pg_net`), so `cron.job_run_details` can be trusted again.
- **Run the migration SQL in CI.** These functions have no automated coverage in the repo — they were verified for this change by applying both migrations to an in-process Postgres (PGlite) and exercising the success, failure, staleness and RLS paths, which is how the `stale`/`failing` precedence bug was caught before it shipped. Making that a committed test (a `@electric-sql/pglite` devDependency plus a suite alongside the migrations) would keep the compliance control covered rather than re-verified by hand each time. Its own PR — it introduces a dependency and a test category.
- A scheduled export of the exemption list into the launch-playbook review cadence, so exemptions get reviewed rather than accumulating.

## TODO

- [x] ~~**Founder/infra:** enable pg_cron and apply the migration to **both** Supabase projects~~ — done 2026-07-25, schedule confirmed active on each.
- [x] ~~**Engineering:** once applied, update the Current Status here, [`../legal/README.md`](../legal/README.md) and [`../legal/data-processing-inventory.md`](../legal/data-processing-inventory.md) §4 to say enforced rather than promised~~ — done 2026-07-25.
- [x] ~~**Engineering:** the purge is still silent — a failed run stays invisible until someone reads `cron.job_run_details`. Add alerting~~ — done 2026-07-27: every attempt is recorded, `retention_purge_health()` renders a verdict, and `/api/health/retention` exposes it as 200/503 for the uptime monitor.
- [ ] **Founder/infra:** apply `20260727120000_retention_purge_observability.sql` to **both** Supabase projects (prod + non-prod). Same steps as the first migration; pg_cron is already enabled on both, so no dashboard step this time.
- [ ] **Engineering:** after applying, verify in production — `curl -i https://orgofin.com/api/health/retention` should return `200` with `"status":"healthy"`. A `503 unavailable` means `SUPABASE_SERVICE_ROLE_KEY` is not reaching the function.
- [ ] **Engineering:** add `/api/health/retention` to the uptime monitor when that gate is done ([`../launch/launch-playbook.md`](../launch/launch-playbook.md)). **The endpoint is not alerting until this exists** — it only answers when asked.

## References

- [`../legal/README.md`](../legal/README.md) — the retention decision and who made it
- [`../legal/data-processing-inventory.md`](../legal/data-processing-inventory.md) §4 — retention and erasure, factually
- [`environment-variables.md`](./environment-variables.md) — the two-project split this must be applied across
- [`../security/security-architecture.md`](../security/security-architecture.md) §3 — the RLS model this function deliberately bypasses

## Related Documents

- [`data-room-storage.md`](./data-room-storage.md)
- [`../operations/operating-the-website.md`](../operations/operating-the-website.md)

---

**Last Updated:** 2026-07-27
**Owner:** Orgofin Engineering (TODO: assign a DRI)
