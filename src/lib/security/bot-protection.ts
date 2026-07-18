/**
 * Lightweight, zero-dependency bot deterrence for the public forms.
 *
 * The technique is a HONEYPOT: the form renders a hidden field that a human
 * never sees or fills, but naive form-filling bots populate because it looks
 * like a normal input in the DOM. A non-empty value on the server is a strong
 * bot signal. This is a *complement* to, not a replacement for, rate limiting
 * (`rate-limit.ts`) and the recommended edge defense (Cloudflare Turnstile) —
 * see docs/security/rate-limiting-and-bot-protection.md.
 *
 * Anti-false-positive care: the field is named to avoid password-manager /
 * browser autofill (not `email`/`name`/`organization`/`url`), is `tabindex=-1`,
 * `autocomplete="off"`, and `aria-hidden`. See `HONEYPOT_FIELD_NAME` usage in
 * the form components.
 */

/**
 * The honeypot field name. Deliberately generic-but-not-autofilled. Shared by
 * the client forms (hidden input) and the API routes (server check) so the two
 * never drift.
 */
export const HONEYPOT_FIELD_NAME = "contact_channel";

/**
 * Returns true when the request looks like a bot (honeypot filled). Reads the
 * field from the raw parsed JSON body — the Zod schemas strip unknown keys, so
 * this MUST be checked before/independent of schema parsing.
 */
export function isHoneypotTriggered(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const value = (body as Record<string, unknown>)[HONEYPOT_FIELD_NAME];
  return typeof value === "string" && value.trim().length > 0;
}
