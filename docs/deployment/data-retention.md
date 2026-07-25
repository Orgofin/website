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

Two details worth knowing before you run it:

- **`purge_expired_leads()` is `SECURITY DEFINER`.** Both tables have RLS with INSERT-only policies and no DELETE policy at all — deliberately, so the anon key can never remove rows. The scheduled job therefore has to run as the owner. Its `search_path` is pinned for the usual privilege-escalation reason, and `EXECUTE` is revoked from `public`, `anon` and `authenticated` — without those revokes PostgREST would expose it at `/rest/v1/rpc/purge_expired_leads` and any anonymous visitor could wipe both lead tables.
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
- **The purge is silent.** It writes no application log; its record is the `cron.job_run_details` table. Check it if you want proof it ran:
  ```sql
  select start_time, status, return_message
    from cron.job_run_details
   where jobid = (select jobid from cron.job where jobname = 'purge-expired-leads')
   order by start_time desc limit 10;
  ```
- **Non-prod drifts.** Applying to prod only means preview environments keep rows forever and the two projects diverge. Apply to both.

## Current Status

Migration written 2026-07-24 and **not yet applied to either project** — it needs the pg_cron dashboard step first, which only someone with project access can do. Until it is applied, `/privacy` §8 states a window that nothing enforces and deletion remains manual.

## Future Improvements

- Alerting on a failed purge run (today a silent failure stays silent until someone reads `cron.job_run_details`).
- Fold the retention window into generated types once `supabase gen types` is adopted (backlog E7.1.2), removing one side of the TypeScript/SQL duplication.
- A scheduled export of the exemption list into the launch-playbook review cadence, so exemptions get reviewed rather than accumulating.

## TODO

- [ ] **Founder/infra:** enable pg_cron and apply the migration to **both** Supabase projects, then run the §"Verify it works" checks.
- [ ] **Engineering:** once applied, update the Current Status here, [`../legal/README.md`](../legal/README.md) and [`../legal/data-processing-inventory.md`](../legal/data-processing-inventory.md) §4 to say enforced rather than promised.

## References

- [`../legal/README.md`](../legal/README.md) — the retention decision and who made it
- [`../legal/data-processing-inventory.md`](../legal/data-processing-inventory.md) §4 — retention and erasure, factually
- [`environment-variables.md`](./environment-variables.md) — the two-project split this must be applied across
- [`../security/security-architecture.md`](../security/security-architecture.md) §3 — the RLS model this function deliberately bypasses

## Related Documents

- [`data-room-storage.md`](./data-room-storage.md)
- [`../operations/operating-the-website.md`](../operations/operating-the-website.md)

---

**Last Updated:** 2026-07-24
**Owner:** Orgofin Engineering (TODO: assign a DRI)
