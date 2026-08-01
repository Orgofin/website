/**
 * Shared facts for `/privacy` and `/terms`. Both pages state the same entity,
 * contact channel, retention window and effective date — keeping them in one
 * module means they can never drift into contradicting each other, which on a
 * legal page is a real liability rather than a cosmetic bug.
 *
 * Every value here is either a founder-supplied business fact or a recorded
 * decision. Nothing is inferred. The factual basis for what the pages say about
 * data handling is `docs/legal/data-processing-inventory.md` — update that
 * inventory and these pages in the same PR whenever a form field, table column
 * or third-party script changes.
 */

import { CONTACT_EMAIL } from "@/lib/site/contact";

/**
 * Founder-supplied 2026-07-24; provenance confirmed 2026-08-01.
 *
 * This is the **trading name**, and as of 2026-08-01 it is the only name there
 * is: the founders confirmed there is **no incorporated entity yet**. So the
 * value is right, but not for the reason the original note assumed — it is not
 * a stand-in for a registered name that already exists elsewhere.
 *
 * That distinction matters legally, not just editorially. Both policies are
 * currently published by an unincorporated venture, which is a question for
 * counsel review (docs/legal/README.md § TODO, tracked as founder input A3) and
 * not something engineering can resolve by choosing a different string.
 *
 * TODO(legal): on incorporation, replace with the registered name exactly as it
 * appears on the incorporation certificate — including the statutory suffix
 * ("Private Limited" / "LLP" / "Limited"), which a registered Indian entity
 * always carries and a trading name never does.
 */
export const LEGAL_ENTITY_NAME = "Orgofin";

/**
 * The defined-terms phrase both policies open with, as ONE string.
 *
 * Not assembled in JSX. Written as `{LEGAL_ENTITY_NAME} (&ldquo;we&rdquo;…)`,
 * the space before the parenthesis was silently dropped in the rendered output
 * — both pages shipped to production on 2026-07-24 reading `Orgofin(“we”, “us”,
 * “our”)`. An explicit `{" "}` fixes it but Prettier removes that again the
 * moment the line fits, so the fix does not survive a reformat. Keeping the
 * whole phrase in one string puts it beyond JSX whitespace handling entirely,
 * which also matches what it is: a single legal definition, not three tokens.
 */
export const LEGAL_ENTITY_DEFINED = `${LEGAL_ENTITY_NAME} (“we”, “us”, “our”)`;

/**
 * The channel for data-principal requests (access, correction, erasure) and
 * general legal contact. Founder-supplied 2026-07-24.
 *
 * Re-exported from `lib/site/contact.ts` rather than repeated: `/contact`
 * publishes the same address, and a legal page naming a different one than the
 * contact page is exactly the kind of drift that makes a policy unenforceable.
 */
export const LEGAL_CONTACT_EMAIL = CONTACT_EMAIL;

/**
 * Registered address — deliberately `null`, not a placeholder string. The pages
 * render an honest "not yet published, write to us instead" line rather than
 * inventing one (CLAUDE.md non-negotiable #1).
 *
 * Founder-confirmed 2026-08-01: there is **no registered office**, because the
 * company operates fully remotely and is not incorporated (see
 * {@link LEGAL_ENTITY_NAME}). The planned base is **Hyderabad**. Recorded so
 * this reads as a settled, deliberate absence rather than an unanswered
 * question — it is not an oversight and does not need re-raising.
 *
 * Set this to the real address once one exists and both pages pick it up.
 * TODO(legal): registered office address — pending incorporation, not pending a
 * decision.
 */
export const LEGAL_REGISTERED_ADDRESS: string | null = null;

/**
 * Retention window for waitlist and investor-lead rows, decided 2026-07-24.
 * Long enough to cover a pre-launch waitlist through GA and an investor
 * relationship through a raise; short enough to defend as "no longer than
 * necessary".
 *
 * ⚠️ **This value is duplicated in SQL.** `retention_window()` in
 * `supabase/migrations/20260724120000_lead_retention_expiry.sql` is what
 * actually deletes rows; this constant is what `/privacy` §8 renders to the
 * visitor. There is no way to share a value between TypeScript and Postgres
 * here, so both sides carry a pointer to the other — change one, change both.
 * A mismatch means the site publishes a promise the database doesn't keep.
 */
export const DATA_RETENTION_MONTHS = 24;

/**
 * The date the current text of both pages takes effect. Bump this whenever the
 * substance of either page changes — a stale effective date on a legal page
 * undermines every other claim on it.
 */
export const LEGAL_EFFECTIVE_DATE = "2026-07-24";

/** Display form of {@link LEGAL_EFFECTIVE_DATE}, e.g. "24 July 2026". */
export const LEGAL_EFFECTIVE_DATE_DISPLAY = new Date(
  `${LEGAL_EFFECTIVE_DATE}T00:00:00Z`,
).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
