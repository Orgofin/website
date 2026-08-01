# Founder Account Setup — Group C, Step by Step

> **Purpose:** The ordered, click-level procedure for the accounts and dashboards in [`founder-inputs.md`](./founder-inputs.md) Group C — the ones engineering cannot reach because they need an owner logged in.
> **Applies to:** the founder doing the setup. No engineering knowledge assumed.
> **Classification:** Internal.

---

## Responsibilities

Owns the **how**: order, prerequisites, and the configuration and verification steps for each account. Does **not** own what each item unblocks — that is [`founder-inputs.md`](./founder-inputs.md) Group C — nor the engineering findings behind them ([`production-readiness-review.md`](./production-readiness-review.md) P-02–P-04). This file adds no business facts; it is procedure only.

---

## Before you start

Three prerequisites gate everything below. Confirm all three before opening a single signup page — each one is far more expensive to correct after the fact than before.

| #   | Prerequisite                                                                                | Why it must come first                                                                                                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1  | **Decide the owning Google account, and make it a company account** — not a personal Gmail. | Search Console ownership is tied to the account that verifies it. Moving a property to a different owner later means re-verification, and if the original account is ever lost the property goes with it. This is the single most common and most annoying thing to get wrong. |
| P2  | **Confirm you can edit DNS for `orgofin.com`** at whoever hosts it.                         | Search Console's strongest verification method is a DNS `TXT` record. Without registrar access you fall back to weaker, more fragile methods. See [`../deployment/custom-domain-setup.md`](../deployment/custom-domain-setup.md).                                              |
| P3  | **Confirm you have Supabase access at Owner level**, not Member.                            | C2 may require a plan change, and plan and billing changes are Owner-only. Discovering this mid-task means waiting on whoever holds the Owner seat.                                                                                                                            |

**Use the same company Google account for Search Console, Analytics and Bing.** Splitting them across personal accounts is what turns a five-minute task into a support ticket a year from now.

---

## Order

Do them in this order. It is not arbitrary — each step either unblocks the next or takes time to propagate, so a different order means waiting twice.

```
1. Google Search Console      ← DNS propagation is the long pole; start it first
2. Bing Webmaster Tools       ← can IMPORT from Search Console; pointless before step 1
3. Social accounts (X, LinkedIn) ← the debuggers in step 4 require being logged in
4. Social-card render check   ← needs step 3
5. Supabase backups / PITR    ← independent, but protects data already being collected
6. Delete the prod test row   ← trivial; you are already in the Supabase dashboard from step 5
```

---

## 1. Google Search Console — **mandatory**

**Register:** C1 · **Unblocks:** P-03 · **Time:** ~10 min, plus up to 48h for DNS to propagate

**What it is.** Google's view of your site: which pages are indexed, which failed and why, what queries you appear for. Without it you have no way to submit the sitemap, no crawl-error visibility, and no way to tell whether Google can see the site at all.

**Prerequisites:** P1, P2.

**Steps**

1. Go to [search.google.com/search-console](https://search.google.com/search-console) and sign in with the company Google account (P1).
2. Add a property. **Choose the `Domain` property type, not `URL prefix`.** Enter `orgofin.com`.
   - A Domain property covers `http` and `https`, apex and `www`, and every subdomain, in one property. A URL-prefix property covers exactly one of those, so you would need several and would still miss the `www` → apex redirect.
3. Google shows a `TXT` record. Add it at the DNS host for `orgofin.com` (per P2), leave everything else alone, and click **Verify**.
   - If it fails, wait and retry — DNS propagation is not instant. Google re-checks the record periodically, so a verification that fails at first often succeeds later without any further action.
4. Once verified, go to **Sitemaps** and submit: `sitemap.xml`
   - The full URL is `https://orgofin.com/sitemap.xml`. It is live and currently lists **12 routes**. Enter only the path in the field — Google prefixes the domain itself.
5. Use **URL Inspection** on `https://orgofin.com/` and click **Request indexing**. Do this for the home page only; the sitemap handles the rest.

**Verification**

- The property shows as verified with no warning banner.
- Sitemaps shows status **Success** and "12 discovered URLs". A lower number means Google has not finished reading it — recheck the next day, not the next minute.
- After 48–72h, **Pages** should show pages indexed and, critically, **zero** entries under "Excluded by 'noindex' tag" other than `/investors/data-room`, which is deliberately `noindex`.

> **Do not panic if indexing is slow.** A brand-new domain commonly takes days to weeks for full coverage. What matters at this stage is that the property is verified, the sitemap parsed, and no _errors_ are reported. Coverage catches up on its own.

---

## 2. Bing Webmaster Tools — **recommended**

**Register:** C1 · **Time:** ~5 min if step 1 is done

**Why it is worth the five minutes.** Bing is not just Bing — it feeds DuckDuckGo, Microsoft Copilot and several AI search surfaces. For a company whose positioning is AI-first, being absent from the index that AI assistants read is a poor look, independent of raw traffic share.

**Prerequisites:** step 1 complete and verified.

**Steps**

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters) and sign in.
2. Choose **Import from Google Search Console** rather than adding the site manually. It carries the verification and the sitemap across in one click, which is the entire reason this step comes second.
3. If the import is unavailable, add `orgofin.com` manually and verify by the same DNS `TXT` method as step 1.

**Verification:** the site appears with the sitemap listed and no verification warning.

---

## 3. Social accounts — **mandatory**

**Register:** prerequisite for C3; **also closes A5** · **Time:** ~20 min

**Why this comes before the card check.** [`founder-inputs.md`](./founder-inputs.md) A5 records that the site currently emits `twitter:creator` as `@orgofin`, which is an **assumed** handle, not a confirmed account. Verifying how a card renders for a handle nobody has claimed proves nothing — and if someone else holds it, every shared link attributes the site to them. Claim the handles first.

**Steps**

1. **X / Twitter** — claim or confirm the handle. If `@orgofin` is unavailable, the chosen handle must be written to `siteConfig.twitterHandle` in [`../../src/lib/seo/site.ts`](../../src/lib/seo/site.ts), which is engineering's job — tell us the handle and we will ship it. **Do not leave a handle in the code that nobody owns.**
2. **LinkedIn** — create the company Page. This is the higher-value one for an investor-facing site, and it is also what the Post Inspector in step 4 needs.
3. Report both handles back so A5 can be closed in the code.

**Verification:** both profiles resolve publicly in a logged-out browser window.

---

## 4. Social-card render check — **mandatory** (Facebook step optional)

**Register:** C3 · **Unblocks:** P-02 · **Time:** ~10 min

**What is already done.** Engineering has verified the tags and the image are correct and serving — `og/default.png` at 1200×630, absolute URLs, `200` on the apex. What _cannot_ be verified from outside is how each platform actually **renders** it, because every debugger requires a logged-in account.

**Prerequisites:** step 3.

**Steps**

1. **LinkedIn** — [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/), paste `https://orgofin.com`. Confirm the title, description and image render correctly.
   - This also **force-refreshes LinkedIn's cache**, which is the only way to clear a bad preview. LinkedIn caches Open Graph data for roughly a week, so if a wrong card was ever fetched, this is how it gets fixed.
2. **X / Twitter** — the standalone Card Validator was retired. Check by opening the compose box while logged in, pasting the URL, and confirming the card preview appears. **Do not post it.**
3. **WhatsApp** — paste the link into a chat with yourself and confirm the preview. Worth doing explicitly rather than assuming: for an India-first launch, WhatsApp is a primary sharing surface, and it renders the same Open Graph tags.
4. **Facebook** _(optional)_ — [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/). Requires a Meta developer account; skip unless Facebook is a real distribution channel for you.

**Verification:** title, description and a correctly cropped 1200×630 image on every platform you checked. Report any platform where the image is missing or wrong — that is an engineering fix, not a founder one.

---

## 5. Supabase backups / PITR — **mandatory**

**Register:** C2 · **Unblocks:** P-04 (security L-06) · **Time:** ~15 min, plus a plan decision

**What it is.** Whether the waitlist and investor-lead tables can be restored **at all** depends on the Supabase plan. This is worth settling before there are leads worth losing, which is precisely the window you are in now.

**Prerequisites:** P3 (Owner access).

**Steps**

1. Open the [Supabase dashboard](https://supabase.com/dashboard) and select the **production** project. Prod and non-prod are separate projects — confirm you are in the right one before doing anything.
2. Check the current plan (Settings → Billing). Note it down.
3. Go to Database → **Backups**.
   - **Free plan:** no point-in-time recovery, and backups are limited. If this is where you are, you must either upgrade or schedule your own export — leaving it as-is means an accidental delete is unrecoverable.
   - **Pro and above:** daily backups, with PITR available. Confirm PITR is actually **enabled**, not merely available on the plan — they are different things.
4. Decide and record: upgrade the plan, or establish a scheduled `pg_dump` export elsewhere. Either is defensible; no decision is not.

**Verification — this is the part people skip**

Download one backup, or run one export, and confirm it opens and contains the `waitlist` and `data_room_requests` tables. **A backup you have never restored is not a backup, it is a belief about a backup.** Note the outcome and the date in [`production-readiness-review.md`](./production-readiness-review.md) P-04.

---

## 6. Delete the production data-room test row — **mandatory**

**Register:** C4 · **Time:** ~2 min

**What it is.** A row titled **"Data Room Prod Verification"** sits in the production `data_room_requests` table, left over from an earlier end-to-end check. It is harmless, but it is fake data in a real table, and it should not be there the first time that table means something.

**Prerequisites:** step 5 (you are already in the right dashboard).

**Steps**

1. Supabase dashboard → **production** project → Table Editor → `data_room_requests`.
2. Find the row titled `Data Room Prod Verification` and delete it.
3. Scan the remaining rows for any other obvious test entries before you close the tab — this is the one moment someone is looking at the table with fresh eyes.

**Verification:** no row in `data_room_requests` refers to a test or verification run.

---

## Summary

| Order | Item                         | Register | Mandatory?    | Prerequisite |
| ----- | ---------------------------- | -------- | ------------- | ------------ |
| —     | Company Google account       | —        | **Yes**       | —            |
| —     | DNS access for `orgofin.com` | —        | **Yes**       | —            |
| —     | Supabase Owner access        | —        | **Yes**       | —            |
| 1     | Google Search Console        | C1       | **Mandatory** | P1, P2       |
| 2     | Bing Webmaster Tools         | C1       | Recommended   | Step 1       |
| 3     | X / Twitter + LinkedIn       | C3 / A5  | **Mandatory** | —            |
| 4     | Social-card render check     | C3       | **Mandatory** | Step 3       |
| 5     | Supabase backups / PITR      | C2       | **Mandatory** | P3           |
| 6     | Delete prod test row         | C4       | **Mandatory** | Step 5       |

**Report back:** the confirmed social handles (closes A5 in code), the Supabase plan and backup decision (closes P-04), and any platform where the social card rendered wrongly (an engineering fix).

---

## Design Decisions

- **Ordered by dependency and latency, not by importance.** Search Console is first because DNS propagation is the only step with a wait measured in hours; Bing is second because it can import that work rather than repeat it. Ordering by importance would have the founder verifying a Twitter card for a handle nobody had claimed yet.
- **Accounts the founder does not need are deliberately absent.** Vercel, Sentry and GA4 are provisioned and operating; adding them to a founder checklist would imply an action that does not exist. Group C is scoped to what genuinely requires an owner logged in.
- **Separate file from the register.** [`founder-inputs.md`](./founder-inputs.md) owns _what each item blocks_ and is designed to shrink toward empty. A procedure does not shrink, and mixing the two would make the register unreadable as a status list (CLAUDE.md non-negotiable #4).
- **Verification steps are stated as outcomes, not clicks.** "The property is verified" survives a dashboard redesign; "click the blue button top-right" does not.

## Current Status

**Written 2026-08-01.** None of the six steps has been performed — all six are open in [`founder-inputs.md`](./founder-inputs.md) Group C. Every engineering prerequisite is already shipped: the sitemap serves 12 routes, the OG image serves at 1200×630, and both Supabase projects exist.

## Future Improvements

- Fold each step into [`launch-playbook.md`](./launch-playbook.md) as it closes, and delete it here, so this file also shrinks toward empty.
- If a second person ever needs these dashboards, record the access model (shared owner vs delegated roles) rather than duplicating this procedure.

## TODO

- [ ] **Founder:** work steps 1–6 in order.
- [ ] **Founder:** report the confirmed social handles so A5 can be closed in `lib/seo/site.ts`.
- [ ] **Engineering:** tick C1–C4 in [`founder-inputs.md`](./founder-inputs.md) as each is confirmed, and record the P-02/P-03/P-04 outcomes in [`production-readiness-review.md`](./production-readiness-review.md).

## References

- [`founder-inputs.md`](./founder-inputs.md) — Group C, what each item blocks
- [`production-readiness-review.md`](./production-readiness-review.md) — P-02, P-03, P-04
- [`../deployment/custom-domain-setup.md`](../deployment/custom-domain-setup.md) — DNS and registrar access (P2)

## Related Documents

- [`launch-playbook.md`](./launch-playbook.md)
- [`../security/security-audit-report.md`](../security/security-audit-report.md) — L-06, the finding behind C2

---

**Last Updated:** 2026-08-01
**Owner:** Orgofin Founders (TODO: assign a DRI — see [`founder-inputs.md`](./founder-inputs.md) D1)
