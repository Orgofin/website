-- Migration: make a failed retention purge visible
-- Applied:   NOT YET — apply to both Supabase projects (prod + non-prod).
--            Runbook: docs/deployment/data-retention.md
--
-- Why this exists: 20260724120000 made the published 24-month retention window
-- real, but the mechanism is silent. `purge_expired_leads()` writes no record
-- of itself; if it starts failing — a lock, a permission change, a schema drift
-- — nothing says so. The site keeps promising deletion at 24 months while
-- nothing deletes, and the first sign is someone happening to read
-- `cron.job_run_details`. An unmonitored compliance control is close to no
-- control: it produces the obligation without the assurance.
--
-- This adds the missing record and a health verdict that an external uptime
-- monitor can poll over HTTP (/api/health/retention), so a stalled purge pages
-- someone instead of waiting to be discovered.
--
-- Re-runnable-safe throughout.

-- ---------------------------------------------------------------------------
-- 1. The run log
-- ---------------------------------------------------------------------------
-- One row per purge attempt. This is the durable record `cron.job_run_details`
-- cannot be (pg_cron trims it, and it cannot distinguish "ran and deleted
-- nothing" from "ran and deleted 4000 rows"), and it is what the health verdict
-- below reads.
--
-- `installed` is the seed status written once by this migration. It gives the
-- staleness clock a starting point, so a project where pg_cron was never
-- enabled reports stale after the first missed window rather than reporting
-- "unknown" forever — the failure mode this whole migration exists to catch.

-- No `create extension pgcrypto` here, unlike the earlier migrations:
-- `gen_random_uuid()` has been core Postgres since 13, so requiring the
-- extension would add a dependency this file does not need.

create table if not exists public.retention_purge_runs (
  id                uuid primary key default gen_random_uuid(),
  ran_at            timestamptz not null default now(),
  status            text not null
                      check (status in ('success', 'failure', 'installed')),
  waitlist_deleted  bigint,
  data_room_deleted bigint,
  duration_ms       integer,
  error_message     text
);

create index if not exists retention_purge_runs_ran_at_idx
  on public.retention_purge_runs (ran_at desc);

comment on table public.retention_purge_runs is
  'One row per purge attempt. Read via retention_purge_health(); see docs/deployment/data-retention.md.';
comment on column public.retention_purge_runs.status is
  'success | failure | installed. "installed" is the migration-time seed that starts the staleness clock.';

-- Same access model as the lead tables: RLS on with NO policy at all, so anon
-- and authenticated are denied outright. The revokes are belt-and-braces —
-- they also keep the table out of PostgREST, so a policy added later by mistake
-- still cannot expose it. Deleted-row counts are business data; nothing here is
-- for public consumption. The health function below is SECURITY DEFINER and so
-- reads this table regardless.

alter table public.retention_purge_runs enable row level security;

revoke all on table public.retention_purge_runs from anon;
revoke all on table public.retention_purge_runs from authenticated;

insert into public.retention_purge_runs (status)
select 'installed'
where not exists (select 1 from public.retention_purge_runs);

-- ---------------------------------------------------------------------------
-- 2. The purge, now self-recording
-- ---------------------------------------------------------------------------
-- Body is unchanged from 20260724120000 — same cutoff, same exemption rule,
-- same return shape. What is new is that every attempt writes a row, and a
-- failure is caught rather than propagated.
--
-- ⚠️ WHY THE EXCEPTION IS SWALLOWED RATHER THAN RE-RAISED. Postgres has no
-- autonomous transactions. A plpgsql exception block rolls back to its implicit
-- savepoint but stays inside the caller's transaction, so the failure row
-- inserted by the handler only survives if the function then returns normally.
-- `raise` would abort the transaction and take the failure record with it —
-- destroying the exact evidence this migration exists to create. There is no
-- formulation that both re-raises and records; this is the trade-off, taken
-- deliberately.
--
-- The cost: `cron.job_run_details` now reports success for a failed purge.
-- `retention_purge_runs` is therefore the authoritative record, not pg_cron's,
-- and `raise warning` still puts the error in the Postgres logs. The runbook
-- says this in as many words so nobody trusts the old signal.
--
-- Still SECURITY DEFINER with a pinned search_path, for the reasons in the
-- previous migration: both lead tables have INSERT-only RLS and no DELETE
-- policy, so the scheduled job has to run as the owner, and an unpinned
-- search_path on a SECURITY DEFINER function is a privilege-escalation vector.

create or replace function public.purge_expired_leads()
  returns table (table_name text, deleted_count bigint)
  language plpgsql
  security definer
  set search_path = public, pg_temp
as $$
declare
  cutoff      timestamptz := now() - public.retention_window();
  started_at  timestamptz := clock_timestamp();
  waitlist_n  bigint;
  data_room_n bigint;
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

  insert into public.retention_purge_runs
    (status, waitlist_deleted, data_room_deleted, duration_ms)
  values
    ('success', waitlist_n, data_room_n,
     (extract(epoch from clock_timestamp() - started_at) * 1000)::integer);

  return query
    select 'waitlist'::text,           waitlist_n
    union all
    select 'data_room_requests'::text, data_room_n;

exception
  when others then
    -- Truncated because sqlerrm can carry an arbitrarily long message, and a
    -- health endpoint should never be a channel for unbounded database text.
    insert into public.retention_purge_runs (status, error_message)
    values ('failure', left(coalesce(sqlerrm, 'unknown error'), 1000));

    raise warning 'purge_expired_leads failed: % (%)', sqlerrm, sqlstate;

    -- NULL counts, not zero: "we do not know" is the truth here, and zero would
    -- be indistinguishable from a clean run that had nothing to delete.
    return query
      select 'waitlist'::text,           null::bigint
      union all
      select 'data_room_requests'::text, null::bigint;
end;
$$;

comment on function public.purge_expired_leads() is
  'Deletes waitlist and data_room_requests rows past the retention window, honouring retained_until. Records every attempt in retention_purge_runs and never raises — check retention_purge_health(), not cron.job_run_details.';

-- Repeated from the previous migration rather than assumed: `create or replace`
-- preserves privileges on an existing function, but on a project restored from
-- scratch this file may be the one that creates it, and the default there is
-- EXECUTE to PUBLIC. Without these revokes PostgREST exposes
-- `/rest/v1/rpc/purge_expired_leads` and any anonymous visitor could wipe both
-- lead tables — the exact capability the INSERT-only RLS policies exist to deny.
revoke all on function public.purge_expired_leads() from public;
revoke all on function public.purge_expired_leads() from anon;
revoke all on function public.purge_expired_leads() from authenticated;

-- ---------------------------------------------------------------------------
-- 3. The health verdict
-- ---------------------------------------------------------------------------
-- One place decides what "healthy" means, and it is this function — not the
-- TypeScript that serves it over HTTP. `stale_after_hours` is returned rather
-- than duplicated in the application for the same reason the retention window's
-- duplication is called out as a hazard: a threshold that exists in two places
-- drifts, and the copy that drifts is always the one nobody is watching.
--
-- 48 hours, against a 03:15 UTC daily schedule, means one missed run is
-- tolerated and two are not. A single-day threshold would flap on any routine
-- maintenance window; a week would let a month of undeleted personal data
-- accumulate before anyone heard about it.
--
-- The clock outranks 'failing', and the order matters. A purge that failed last
-- night but succeeded the night before is 'failing' — read the error. A purge
-- that has not succeeded for five days is 'stale' even though its last attempt
-- also failed, because the first thing to check is whether the job is still
-- firing at all, not an error from days ago. Reporting 'failing' there would
-- point the operator at the narrower of the two problems. Either way the
-- verdict is unhealthy and `last_error` still travels with it.

create or replace function public.retention_purge_health()
  returns table (
    status              text,
    last_run_at         timestamptz,
    last_run_status     text,
    last_success_at     timestamptz,
    hours_since_success numeric,
    stale_after_hours   integer,
    last_error          text
  )
  language sql
  stable
  security definer
  set search_path = public, pg_temp
as $$
  with stale_after as (
    select 48 as hours
  ),
  latest as (
    select r.ran_at, r.status, r.error_message
      from public.retention_purge_runs r
     order by r.ran_at desc
     limit 1
  ),
  last_ok as (
    -- 'installed' counts: it is the migration-time baseline, and treating it as
    -- a success is what makes a never-scheduled job go stale on time.
    select max(r.ran_at) as at
      from public.retention_purge_runs r
     where r.status in ('success', 'installed')
  )
  select
    case
      when last_ok.at is null                                   then 'unknown'
      when last_ok.at < now() - make_interval(hours => s.hours) then 'stale'
      when (select l.status from latest l) = 'failure'          then 'failing'
      else 'healthy'
    end,
    (select l.ran_at from latest l),
    (select l.status from latest l),
    last_ok.at,
    round(extract(epoch from now() - last_ok.at)::numeric / 3600.0, 1),
    s.hours,
    (select l.error_message from latest l where l.status = 'failure')
  from last_ok, stale_after s;
$$;

comment on function public.retention_purge_health() is
  'Verdict on whether the retention purge is running: healthy | failing | stale | unknown. Served over HTTP by /api/health/retention.';

-- Readable by the server-side service-role client only. `anon` must never see
-- it: `last_error` carries raw database error text, and the endpoint that
-- fronts this function deliberately drops that field before responding.
revoke all on function public.retention_purge_health() from public;
revoke all on function public.retention_purge_health() from anon;
revoke all on function public.retention_purge_health() from authenticated;
grant execute on function public.retention_purge_health() to service_role;

-- ---------------------------------------------------------------------------
-- 4. The schedule
-- ---------------------------------------------------------------------------
-- Unchanged: the job name and the function it calls are the same, so an
-- existing `purge-expired-leads` job keeps working and needs no reschedule.
-- Re-asserted here only so that applying THIS file to a fresh project leaves a
-- working schedule, and so the same "migration succeeded but nothing is
-- scheduled" failure mode raises a notice rather than passing quietly.

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
