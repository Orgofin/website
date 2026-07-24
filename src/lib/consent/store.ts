import {
  CONSENT_STORAGE_KEY,
  parseConsent,
  type ConsentDecision,
  type ConsentState,
} from "@/lib/consent/config";

/**
 * Module-level consent store, deliberately not React context.
 *
 * Two very different callers need this value: the banner and the analytics gate
 * (React, needing re-renders) and `trackEvent` (a plain fire-and-forget
 * function that must stay callable from anywhere without a hook — see
 * `frontend.md` §9, "analytics is not state"). A context would force
 * `trackEvent` to become a hook and every call site to thread it through. A
 * small external store serves both: `useSyncExternalStore` for the components,
 * a direct `getConsent()` read for the function.
 *
 * `localStorage` is the source of truth; this module caches it so reads are
 * cheap and so a `useSyncExternalStore` snapshot is referentially stable.
 */

let cached: ConsentState | null = null;
const listeners = new Set<() => void>();

function read(): ConsentState {
  if (typeof window === "undefined") return "unset";
  try {
    return parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    // Private-mode / blocked storage: treat as undecided rather than throwing.
    // The visitor gets asked again next load, which is the safe direction.
    return "unset";
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

/** Current consent, readable outside React. */
export function getConsent(): ConsentState {
  cached ??= read();
  return cached;
}

/** Persist the visitor's decision and notify subscribers. */
export function setConsent(decision: ConsentDecision): void {
  cached = decision;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, decision);
  } catch {
    // Storage unavailable — honour the decision for this page at least, rather
    // than dropping it. It simply won't survive a reload.
  }
  emit();
}

/**
 * Subscribe to consent changes, including changes made in another tab. A
 * decision is a site-wide choice, so a visitor who accepts in one tab should
 * not still be looking at the banner in another (same reasoning as the theme
 * provider's cross-tab sync).
 */
export function subscribeConsent(onChange: () => void): () => void {
  listeners.add(onChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== CONSENT_STORAGE_KEY) return;
    cached = read();
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Server snapshot for `useSyncExternalStore`. Always `unset` — the server
 * cannot know, and rendering the banner-hidden state during SSR would make the
 * banner appear only after hydration for *every* visitor. Components must gate
 * on mount instead (see `useConsent`).
 */
export function getServerConsent(): ConsentState {
  return "unset";
}

/** Test-only: drop the cached value so a fresh `localStorage` read happens. */
export function resetConsentCache(): void {
  cached = null;
}
