# Investor Data Room — Storage & Go-Live Runbook

> **Purpose:** The operator steps that take `/investors/data-room` from its shipped placeholder state to serving real founder-supplied documents. The page, gate, lead table, signed-URL delivery, and analytics are all built (E11.1.3); this runbook is everything that happens **outside the repo**, plus the one in-repo flip.
> **Applies to:** whoever provisions Supabase/Vercel for this feature (founder or engineer with project access).

---

## Responsibilities

Owns the go-live procedure and the access model rationale for data-room file delivery. Does not own the gating decision itself (PRD §22.6, backlog E11.1.4), the page implementation (`src/app/(marketing)/investors/data-room/`), or general env-var conventions ([`environment-variables.md`](./environment-variables.md)).

## Access model (why it's built this way)

- Requests are stored in `data_room_requests` via the **anon key + insert-only RLS** — identical to the waitlist; the lead list is unreadable from the site.
- Documents live in a **private** storage bucket. They are served exclusively as **time-limited signed URLs (15 min)** minted server-side with the **service-role key** — granting the anon key storage read would make the bucket effectively public, since that key ships to every browser.
- The service-role key is **server-only** (`SUPABASE_SERVICE_ROLE_KEY`, no `NEXT_PUBLIC_` prefix, used nowhere but `createSupabaseAdminClient` for storage signing).
- Without the key (local, CI, previews without it), the room still works: leads are stored and documents render as "In preparation" — degraded, never broken.

## Go-live steps

Do this per Supabase project (prod, and non-prod if you want preview/uat testing with real files):

1. **Apply the migration** `supabase/migrations/20260715120000_create_data_room_requests.sql` (SQL editor or CLI), same as the waitlist migration was applied.
2. **Create the bucket**: Storage → New bucket → name `investor-data-room` → **Public bucket: OFF**. No storage RLS policies are needed — nothing but the service-role key touches it.
3. **Upload the PDFs** (see the required-documents list in the backlog E11.1.3 status / founder checklist). Suggested paths: `pitch-deck.pdf`, `one-pager.pdf` at the bucket root.
4. **Set the env var** in Vercel: `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API → `service_role`), scoped **Production** (and Preview only if the non-prod project's key is used there). Redeploy for it to take effect.
5. **Flip the catalog**: in `src/lib/api/data-room.ts`, set each document's `storagePath` from `null` to its uploaded path (e.g. `"pitch-deck.pdf"`) — one-line change per document, PR'd like any other.
6. **Verify**: submit the gate on the deployed environment → download links appear, open the PDF, expire after 15 minutes; the request row lands in `data_room_requests`; `data_room_request` / `data_room_download` events appear in GA4 (prod only).

## Current Status

Feature shipped in placeholder state: table migration written (not yet applied), bucket not yet created, no files uploaded, `SUPABASE_SERVICE_ROLE_KEY` not yet set anywhere, both catalog slots `storagePath: null`. The founder-supplied documents are the blocking input.

## Future Improvements

- Move the document catalog from code to a Supabase table if the room grows beyond a handful of files (not before — two slots don't justify a CMS).
- Consider magic-link email verification behind the same form if inbound volume or sensitivity grows (upgrade path recorded with the E11.1.4 decision).

## TODO

- [ ] Apply the migration to both Supabase projects.
- [ ] Create the private `investor-data-room` bucket (both projects).
- [ ] Receive the founder-supplied PDFs and upload them (prod at minimum).
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel Production.
- [ ] Flip the `storagePath` values and verify end-to-end per step 6.

## References

- Backlog E11.1.3 / E11.1.4 — feature + decision record
- PRD §22.6 — the resolved gating question
- [`environment-variables.md`](./environment-variables.md) — env-var conventions

## Related Documents

- [`vercel-setup.md`](./vercel-setup.md)
- [`.claude/context/deployment.md`](../../.claude/context/deployment.md)

---

**Last Updated:** 2026-07-15
**Owner:** Orgofin Engineering (TODO: assign a DRI)
