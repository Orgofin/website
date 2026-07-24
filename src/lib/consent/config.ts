/**
 * Shared analytics-consent constants and types. Mirrors the shape of
 * `lib/theme/config.ts` — one module owns the storage key and the valid values
 * so the store, the banner and the analytics gate can never disagree about
 * what's persisted.
 *
 * Decided 2026-07-24 (docs/legal/README.md): GA4 loads only after the visitor
 * accepts. Until then no analytics script runs and no Google cookie is set.
 */

export const CONSENT_STORAGE_KEY = "orgofin-analytics-consent";

/**
 * `unset` is a real state, not a null case — it is the only state that shows
 * the banner, and it must be distinguishable from an explicit `denied` so a
 * visitor who declined is never asked again.
 */
export type ConsentState = "granted" | "denied" | "unset";

/** The two states a visitor can choose. */
export type ConsentDecision = Exclude<ConsentState, "unset">;

/** Narrow an unknown persisted value to a decision, or `unset` if it isn't one. */
export function parseConsent(value: unknown): ConsentState {
  return value === "granted" || value === "denied" ? value : "unset";
}
