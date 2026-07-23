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

**Pitch deck live on the prod project (2026-07-22):** the founder uploaded the investor-safe deck to the private `investor-data-room` bucket (object key `pitch-deck.pptx`) and set `SUPABASE_SERVICE_ROLE_KEY` in Vercel **Production** scope; the `pitch-deck` slot's `storagePath` is flipped to `"pitch-deck.pptx"` (step 5 done). The **one-pager** slot remains `storagePath: null` (no file yet). If a download 404s, re-check the object key — Supabase Storage paths are case-sensitive and must match exactly.

**Not yet verified end-to-end (step 6), and there is a sequencing trap (2026-07-23):** steps 1–4 were done on the **prod** project only, but the step-5 flip currently lives on the `dev` branch, which deploys to **Preview** → the **non-prod** project ([`environment-variables.md`](./environment-variables.md) — two-project isolation). So a preview test hits a project with no migration, no bucket, no file, and no service-role key, and the room degrades to "In preparation"; while Production has all the Supabase pieces but not yet the flip. Either **mirror steps 1–4 into non-prod** (with the non-prod key scoped **Preview**) and verify on the `dev` preview before promoting — recommended, so investor-facing Production is never the first test — or apply the migration to prod only, promote `dev`→`uat`→`main`, and verify on Production.

## Future Improvements

- Move the document catalog from code to a Supabase table if the room grows beyond a handful of files (not before — two slots don't justify a CMS).
- Consider magic-link email verification behind the same form if inbound volume or sensitivity grows (upgrade path recorded with the E11.1.4 decision).

## TODO

- [ ] Apply the migration to **both** Supabase projects. _(Unconfirmed in either — required for the gate's lead insert to succeed; without it no signed URL is ever minted.)_
- [x] Create the private `investor-data-room` bucket (**prod**). _(Founder, 2026-07-22.)_
- [ ] Create the same bucket on the **non-prod** project — needed to verify on a preview deploy.
- [x] Receive the founder-supplied pitch deck and upload it (**prod**). _(Founder, 2026-07-22: `pitch-deck.pptx`.)_ One-pager still pending.
- [ ] Upload the same deck to the **non-prod** bucket (same lowercase key).
- [x] Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel **Production**. _(Founder, 2026-07-22.)_
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` (non-prod key) in Vercel **Preview** scope, then redeploy `dev`.
- [x] Flip the `pitch-deck` `storagePath`. Still: **verify end-to-end per step 6** (download works + expires; row lands in `data_room_requests`; GA4 events fire — prod only). One-pager `storagePath` still `null`.

## References

- Backlog E11.1.3 / E11.1.4 — feature + decision record
- PRD §22.6 — the resolved gating question
- [`environment-variables.md`](./environment-variables.md) — env-var conventions

## Related Documents

- [`vercel-setup.md`](./vercel-setup.md)
- [`.claude/context/deployment.md`](../../.claude/context/deployment.md)

---

**Last Updated:** 2026-07-23 (prod-only provisioning recorded; preview-verification sequencing trap documented)
**Owner:** Orgofin Engineering (TODO: assign a DRI)
