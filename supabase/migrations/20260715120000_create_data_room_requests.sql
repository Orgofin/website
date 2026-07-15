-- Migration: create the `data_room_requests` table (E11.1.3, gating per the
--            E11.1.4 decision: email-gated, instant unlock)
-- Applied:   NOT YET — apply to both Supabase projects (prod + non-prod) when
--            the data room ships, together with the private storage bucket.
--            Runbook: docs/deployment/data-room-storage.md.
--
-- This file is the version-controlled source of truth for the schema that
-- src/lib/supabase/types.ts mirrors by hand (until `supabase gen types` is
-- adopted — backlog E7.1.2). Re-runnable-safe via IF NOT EXISTS guards.
--
-- Access model: identical to the waitlist — the site writes with the public
-- anon key and relies on RLS. INSERT-only for public clients; with no
-- SELECT/UPDATE/DELETE policy the anon key cannot read requests back, so the
-- investor lead list stays private. Deliberately NO unique constraint on
-- email: an investor returning for fresh links is a new, useful signal, and
-- each visit re-mints time-limited signed URLs.

create extension if not exists pgcrypto;

create table if not exists public.data_room_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  firm       text not null,
  check_size text,
  created_at timestamptz not null default now()
);

alter table public.data_room_requests enable row level security;

drop policy if exists "data_room_requests_insert_public" on public.data_room_requests;
create policy "data_room_requests_insert_public"
  on public.data_room_requests
  for insert
  to anon, authenticated
  with check (true);
