-- Migration: create the `waitlist` table
-- Applied: 2026-07-08 to both Supabase projects (prod + non-prod), per the
--          two-project isolation strategy in
--          docs/deployment/environment-variables.md.
--
-- This file is the version-controlled source of truth for the schema that
-- src/lib/supabase/types.ts mirrors by hand (until `supabase gen types` is
-- adopted — backlog E7.1.2). Re-runnable-safe via IF NOT EXISTS guards.
--
-- Access model: the site writes with the public anon key and relies on RLS,
-- not elevated credentials (see src/lib/supabase/server.ts). The only policy
-- below grants INSERT; with RLS enabled and no SELECT/UPDATE/DELETE policy,
-- the anon key cannot read the list back — signups stay private.

create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Public clients (anon + authenticated) may INSERT only. A duplicate email
-- raises unique_violation (Postgres 23505), which lib/api/waitlist.ts treats
-- as success so re-signups are idempotent and don't leak who is registered.
drop policy if exists "waitlist_insert_public" on public.waitlist;
create policy "waitlist_insert_public"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);
