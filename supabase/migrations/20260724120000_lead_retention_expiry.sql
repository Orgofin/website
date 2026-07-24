-- Migration: enforce the published 24-month lead-retention window
-- Applied:   NOT YET — apply to both Supabase projects (prod + non-prod).
--            Runbook, including the pg_cron dashboard step:
--            docs/deployment/data-retention.md
--
-- Why this exists: /privacy §8 promises that waitlist and data-room records are
-- deleted 24 months after collection. Until this migration, nothing enforced
-- that — rows persisted forever and deletion was a manual dashboard job. A
-- published retention promise with no mechanism behind it is the worst of both
-- worlds: it creates the obligation without the compliance.
--
-- ⚠️ THE RETENTION WINDOW IS DUPLICATED. `retention_window()` below and
-- `DATA_RETENTION_MONTHS` in src/lib/legal/constants.ts must agree — the
-- constant is what /privacy renders to the visitor, this is what actually
-- deletes. There is no way to share a value between TypeScript and SQL here, so
-- both sides carry a pointer to the other. Change one, change both.
--
-- Re-runnable-safe throughout.

-- ---------------------------------------------------------------------------
-- 1. The exemption column
-- ---------------------------------------------------------------------------
-- /privacy §8 promises deletion at 24 months "unless you have become a customer
-- or an investor and we have a continuing reason to hold them, or the law
-- requires us to keep them longer". This column is what makes that clause real
-- rather than aspirational — without it the page would describe an exception
-- the system cannot express.
--
-- NULL (the default, and the case for essentially every row) means no
-- exemption: the row expires on schedule. Setting a timestamp holds the row
-- until that moment; set it far in the future to hold indefinitely. Setting it
-- is a deliberate manual act by an operator who has a reason, and that reason
-- belongs in `retained_reason` so a future reader — or an auditor — can see it.

alter table public.waitlist
  add column if not exists retained_until  timestamptz,
  add column if not exists retained_reason text;

alter table public.data_room_requests
  add column if not exists retained_until  timestamptz,
  add column if not exists retained_reason text;

comment on column public.waitlist.retained_until is
  'Exempts this row from the 24-month purge until this moment. NULL = no exemption. See /privacy section 8.';
comment on column public.waitlist.retained_reason is
  'Why this row is exempt. Required by convention whenever retained_until is set.';
comment on column public.data_room_requests.retained_until is
  'Exempts this row from the 24-month purge until this moment. NULL = no exemption. See /privacy section 8.';
comment on column public.data_room_requests.retained_reason is
  'Why this row is exempt. Required by convention whenever retained_until is set.';

-- The purge scans by age, so give it an index to scan.
create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at);
create index if not exists data_room_requests_created_at_idx
  on public.data_room_requests (created_at);

-- ---------------------------------------------------------------------------
-- 2. The retention window
-- ---------------------------------------------------------------------------
-- One definition, used by the purge and readable by an operator who wants to
-- know what is actually configured without reading the purge body.

create or replace function public.retention_window()
  returns interval
  language sql
  immutable
  set search_path = pg_catalog, pg_temp
as $$
  select interval '24 months';
$$;

comment on function public.retention_window() is
  'The published lead-retention window. Mirrors DATA_RETENTION_MONTHS in src/lib/legal/constants.ts — change both together.';

-- ---------------------------------------------------------------------------
-- 3. The purge
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER because both tables have RLS enabled with INSERT-only
-- policies and no DELETE policy at all — by design, so the anon key can never
-- remove rows. The scheduled job therefore needs to run as the owner.
--
-- `set search_path` is pinned on the function: an unpinned search_path on a
-- SECURITY DEFINER function is a privilege-escalation vector (a caller can
-- shadow `public` and have the elevated function call their own code).
--
-- Returns what it deleted so a manual run is auditable and the cron job's
-- effect is visible in the run history.

create or replace function public.purge_expired_leads()
  returns table (table_name text, deleted_count bigint)
  language plpgsql
  security definer
  set search_path = public, pg_temp
as $$
declare
  cutoff        timestamptz := now() - public.retention_window();
  waitlist_n    bigint;
  data_room_n   bigint;
begin
  -- A row goes when it is past the window AND is not currently exempt.
  -- An expired exemption (retained_until in the past) stops protecting it,
  -- so a temporary hold cleans itself up rather than becoming permanent.
  delete from public.waitlist
   where created_at < cutoff
     and (retained_until is null or retained_until <= now());
  get diagnostics waitlist_n = row_count;

  delete from public.data_room_requests
   where created_at < cutoff
     and (retained_until is null or retained_until <= now());
  get diagnostics data_room_n = row_count;

  return query
    select 'waitlist'::text,           waitlist_n
    union all
    select 'data_room_requests'::text, data_room_n;
end;
$$;

comment on function public.purge_expired_leads() is
  'Deletes waitlist and data_room_requests rows past the retention window, honouring retained_until. Scheduled nightly via pg_cron.';

-- Nobody reaches this through the API. PostgREST exposes public functions as
-- RPC endpoints, so without these revokes an anonymous visitor could call
-- `/rest/v1/rpc/purge_expired_leads` and wipe both lead tables — the exact
-- capability the INSERT-only RLS policies exist to deny.
revoke all on function public.purge_expired_leads() from public;
revoke all on function public.purge_expired_leads() from anon;
revoke all on function public.purge_expired_leads() from authenticated;

-- ---------------------------------------------------------------------------
-- 4. The schedule
-- ---------------------------------------------------------------------------
-- Guarded rather than bare: pg_cron must be enabled per-project from the
-- Supabase dashboard (Database → Extensions → pg_cron) and cannot be reliably
-- enabled from a migration. If it isn't on yet, everything above still applies
-- cleanly and this block raises a notice telling the operator what to do,
-- instead of failing the whole migration.
--
-- 03:15 UTC daily — off-peak for India-first traffic, and not on the hour where
-- it would contend with everyone else's cron jobs.

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.unschedule('purge-expired-leads')
      where exists (select 1 from cron.job where jobname = 'purge-expired-leads');

    perform cron.schedule(
      'purge-expired-leads',
      '15 3 * * *',
      $job$ select public.purge_expired_leads(); $job$
    );

    raise notice 'Scheduled purge-expired-leads (daily 03:15 UTC).';
  else
    raise notice
      'pg_cron is NOT enabled — the purge function exists but NOTHING IS SCHEDULED. Enable pg_cron (Database -> Extensions) and re-run this migration. See docs/deployment/data-retention.md.';
  end if;
end;
$$;
