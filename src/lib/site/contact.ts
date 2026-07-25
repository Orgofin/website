/**
 * The one public contact address for the whole site.
 *
 * Founder-supplied 2026-07-24 (`docs/legal/README.md` → Decisions taken). It
 * lives here rather than in `lib/legal/constants.ts` because it is not a legal
 * fact — it is the address `/contact` routes every enquiry to, and the legal
 * pages happen to use the same channel for data-principal requests. One
 * literal, imported by both, so the published policy and the contact page can
 * never drift into naming different addresses (CLAUDE.md non-negotiable #4).
 */
export const CONTACT_EMAIL = "contact@orgofin.com";

/**
 * A `mailto:` URL with the subject pre-filled, so an enquiry arrives already
 * sorted. Deliberately not a form: routing by subject line needs no new table,
 * no migration and no third PII collection point — see `docs/legal/
 * data-processing-inventory.md` for the two that do exist.
 */
export function mailtoUrl(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
