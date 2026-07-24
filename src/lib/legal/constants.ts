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

/**
 * Founder-supplied 2026-07-24. This is the trading name; the *registered* legal
 * entity name may differ once incorporation completes.
 * TODO(legal): confirm the registered entity name and replace if it differs.
 */
export const LEGAL_ENTITY_NAME = "Orgofin";

/**
 * Founder-supplied 2026-07-24 — the channel for data-principal requests
 * (access, correction, erasure) and general legal contact.
 */
export const LEGAL_CONTACT_EMAIL = "contact@orgofin.com";

/**
 * Registered address — deliberately `null`, not a placeholder string. The
 * founders have not settled the registered office yet (2026-07-24), and the
 * pages render an honest "not yet published, write to us instead" line rather
 * than inventing one (CLAUDE.md non-negotiable #1). Set this to the real
 * address and both pages pick it up.
 * TODO(legal): registered office address, founder input pending.
 */
export const LEGAL_REGISTERED_ADDRESS: string | null = null;

/**
 * Retention window for waitlist and investor-lead rows, decided 2026-07-24.
 * Long enough to cover a pre-launch waitlist through GA and an investor
 * relationship through a raise; short enough to defend as "no longer than
 * necessary".
 *
 * ⚠️ Not yet enforced in code — no expiry job exists (inventory §4). The pages
 * state this as our policy, which it is; the mechanism that honours it
 * automatically is tracked in that document's TODO.
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
