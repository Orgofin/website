# Founder Inputs — The Launch Register

> **Purpose:** The single list of things only the founders can supply or decide, what each one blocks, and where the answer goes when it arrives.
> **Applies to:** the founders working through pre-launch, and any engineer who needs to know why something is still a placeholder.
> **Classification:** Internal.

---

## Responsibilities

Owns the _index_ of outstanding founder inputs and their blast radius. **Owns none of the underlying facts.** Every row points at the file that is canonical for that item; when an input lands, it is written **there** and the row here is ticked. This file must never become a second copy of a business fact ([`../../CLAUDE.md`](../../CLAUDE.md) non-negotiables #1 and #4).

Engineering readiness is not tracked here — that is [`production-readiness-review.md`](./production-readiness-review.md) and the `[Eng]` half of [`launch-playbook.md`](./launch-playbook.md).

## Why this exists

These items were scattered across thirteen documents, each perfectly reasonable in place and collectively impossible to act on. A founder asking "what do you need from me?" could not get an answer without reading the whole `docs/` tree. Consolidating the _pointers_ costs nothing and makes the remaining work finite and visible.

The engineering position, as of 2026-07-30, is that **nothing on this page is blocked on code**. Every row is waiting on a decision, a document, or an account that only a founder holds.

---

## A. Blocks a truthful launch

These are live on the site as placeholders, honest-but-incomplete statements, or gaps a visitor can notice. Each one is a claim the site is currently not making, or making weakly.

| #   | Input                                                                                 | What it unblocks                                                                                                                                                                                                                                                                                                                                                                                                                                     | Where it goes                                                                                                                       |
| --- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| A1  | ~~**Registered legal entity name**~~ **→ blocked on incorporation, not on an answer** | **Answered 2026-08-01: there is no incorporated entity yet**, so `Orgofin` is the trading name and also the only name there is. The published value is correct. What this surfaced instead: both policies are currently published by an **unincorporated venture**, which is a question for A3's counsel review, not one engineering can resolve. Re-opens at incorporation, when the registered name (with its statutory suffix) replaces this one. | `LEGAL_ENTITY_NAME` in [`lib/legal/constants.ts`](../../src/lib/legal/constants.ts) — provenance corrected, `TODO(legal)` re-scoped |
| A2  | ~~**Registered office address**~~ **→ settled absence**                               | **Answered 2026-08-01: no registered office**, because the company is remote and unincorporated; planned base is **Hyderabad**. `LEGAL_REGISTERED_ADDRESS` stays `null` and both policies keep rendering the honest "write to us instead" line — no code behaviour changes. Recorded so this is not re-raised as an open question. Re-opens with A1 at incorporation, since DPDP expects a contactable address.                                      | `LEGAL_REGISTERED_ADDRESS` in [`lib/legal/constants.ts`](../../src/lib/legal/constants.ts) — comment records the confirmation       |
| A3  | **Counsel review of both policies**                                                   | The pages were drafted by engineering and shipped un-reviewed — a recorded, deliberate trade-off (a site collecting PII with _no_ policy is worse). Start at `/terms` §4 and §5.                                                                                                                                                                                                                                                                     | [`../legal/README.md`](../legal/README.md) § TODO                                                                                   |
| A4  | **Named DPDP grievance contact**                                                      | `/privacy` §9 routes grievances to the general address. Honest, but not the named redressal officer DPDP contemplates.                                                                                                                                                                                                                                                                                                                               | [`../legal/README.md`](../legal/README.md) § TODO                                                                                   |
| A5  | **Verified social handles**                                                           | `twitter:creator` currently emits `@orgofin`, which is an **assumed** handle, not a confirmed account. If it is wrong or unclaimed, every shared card attributes the site to someone else — or nobody.                                                                                                                                                                                                                                               | `siteConfig.twitterHandle` in [`lib/seo/site.ts`](../../src/lib/seo/site.ts) (marked `TODO`)                                        |
| A6  | **Copy proofread**                                                                    | Last human read-through of every published page. Specifically checking for surviving placeholders and any business fact that reads as more certain than it is.                                                                                                                                                                                                                                                                                       | The pages themselves; note outcomes in [`launch-playbook.md`](./launch-playbook.md) § Quality                                       |

## B. Blocks a page or a feature that is otherwise built

Nothing here is broken — each is a finished mechanism waiting on its content.

| #   | Input                                 | What it unblocks                                                                                                                                                                       | Where it goes                                                                                                                                                              |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | **Founder bios, titles, photos**      | `/team` is unbuilt _only_ for want of this, and the "Meet the team" CTA is deliberately held out of `/about`. `copy.md` still carries a literal `[Founder Name]`.                      | [`../product/copy.md`](../product/copy.md) §11-ish, then a new `/team` route                                                                                               |
| B2  | **Investor one-pager PDF**            | The data room lists it but cannot serve it — `storagePath` is `null`, so the catalog filters it out. The deck already works this way, so the path is proven; only the file is missing. | Upload per [`../deployment/data-room-storage.md`](../deployment/data-room-storage.md), then flip `storagePath` in [`lib/api/data-room.ts`](../../src/lib/api/data-room.ts) |
| B3  | **Newsletter: now, or with the blog** | A footer newsletter block is drafted but unbuilt. Shipping it now means collecting a third category of PII, which pulls in the privacy inventory. Deferring costs nothing.             | Decision → [`../product/copy.md`](../product/copy.md) §19; if yes, also [`../legal/data-processing-inventory.md`](../legal/data-processing-inventory.md)                   |

## C. Accounts and dashboards only a founder can reach

Engineering has taken these as far as code allows. Each needs an owner logged in.

**Step-by-step procedure for this group: [`founder-account-setup.md`](./founder-account-setup.md)** — ordered by dependency, with prerequisites and verification steps. This table stays the record of _what each item blocks_; that file is the _how_.

| #   | Input                                   | What it unblocks                                                                                                                                                                                                          | Reference                                                                 |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| C1  | **Google Search Console + Bing**        | P-03. No indexing verification, no crawl-error visibility, and no way to submit the sitemap on launch day. Needs DNS/domain ownership.                                                                                    | [`production-readiness-review.md`](./production-readiness-review.md) P-03 |
| C2  | **Supabase backup / PITR confirmation** | P-04. Whether lead tables can be restored at all depends on the Supabase plan. Worth knowing _before_ there are leads worth losing.                                                                                       | [`production-readiness-review.md`](./production-readiness-review.md) P-04 |
| C3  | **Social-card render check**            | P-02. Tags and image are verified correct and serving (1200×630, absolute URLs); only the platforms' own debuggers can confirm the _render_, and they require a logged-in account.                                        | [`production-readiness-review.md`](./production-readiness-review.md) P-02 |
| C4  | **Delete the prod data-room test row**  | A row titled "Data Room Prod Verification" sits in the production `data_room_requests` table from an earlier end-to-end check. Harmless, but it is fake data in a real table — remove it before the table means anything. | Supabase dashboard → `data_room_requests`                                 |

## D. Launch-window decisions

| #   | Input                            | Note                                                                                                                                                |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Launch DRI and incident DRI**  | Every ops document in this repo ends with `TODO: assign a DRI`. Two names would close all of them.                                                  |
| D2  | **Final go/no-go**               | The engineering verdict is **GO** ([`production-readiness-review.md`](./production-readiness-review.md) §1). This is the founder half of that call. |
| D3  | **Launch date and announcement** | Drives the T-24h freeze in [`launch-playbook.md`](./launch-playbook.md) § Launch Day.                                                               |

---

## Design Decisions

- **Pointers, not values.** No row states a business fact; each names the file that will hold it. A register that carried the facts would immediately become a second source of truth for exactly the values where disagreement is most expensive.
- **Grouped by consequence, not by owner or theme.** "What breaks if this stays missing" is the question a founder deciding what to do first actually has. Group A is the only group that can make the site say something untrue.
- **Absence is recorded honestly in the code.** `LEGAL_REGISTERED_ADDRESS` is `null` and the pages render around it; `twitterHandle` carries an explicit `TODO`. Nothing here is a placeholder pretending to be a value, so no row is a ticking bug — only an incomplete claim.

## Current Status

**Compiled 2026-07-30** from a sweep of `docs/` and the `TODO(...)` markers in `src/`. Every engineering prerequisite these depend on is already shipped: the legal pages render around the missing entity/address, the data room serves the deck and filters the absent one-pager, `/team` is simply not routed.

**Nothing on this page is blocked on code.**

**Updated 2026-08-01.** A1 and A2 are answered and struck through. Neither changed a published value — both turned out to be _confirmations of a deliberate absence_ rather than missing facts, which is why the code comments now record the confirmation instead of a pending question. The substantive finding is that the site's policies are published by an unincorporated venture; that belongs to A3 (counsel review), which is now the highest-value row in Group A.

Group C gained a step-by-step procedure: [`founder-account-setup.md`](./founder-account-setup.md).

## Future Improvements

- Fold rows into the launch-day checklist as they close, so this file shrinks toward empty rather than accumulating history.
- If `/team` ships, the "Meet the team" CTA held out of `/about` goes in with it — one change, two places.

## TODO

- [ ] **Founders:** work Group A first — it is the only group that affects what the site currently _asserts_.
- [ ] **Engineering:** delete rows from this register as their canonical homes are filled in; do not annotate them as done here.

## References

- [`launch-playbook.md`](./launch-playbook.md) — the `[Eng]` half of pre-launch, plus launch-day sequencing
- [`production-readiness-review.md`](./production-readiness-review.md) — P-01–P-04, where C1–C3 come from
- [`../legal/README.md`](../legal/README.md) — canonical for A3 and A4

## Related Documents

- [`lighthouse-baseline.md`](./lighthouse-baseline.md)
- [`../security/security-audit-report.md`](../security/security-audit-report.md)

---

**Last Updated:** 2026-08-01 (A1 + A2 answered; Group C procedure added)
**Owner:** Orgofin Founders (TODO: assign a DRI — see D1)
