"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

import { env } from "@/env";
import { useConsent } from "@/hooks/useConsent";

/**
 * Mounts GA4 only when **both** conditions hold:
 *
 * 1. `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set — which, per the Vercel env scoping,
 *    is Production only. In CI, local, and preview builds the var is absent, so
 *    no analytics script loads and no measurement ID is needed to build (see
 *    `src/env.ts` for why the var stays `.optional()`).
 * 2. The visitor has **granted** analytics consent (2026-07-24 decision, see
 *    `docs/legal/README.md`). Nothing loads while consent is `unset` or
 *    `denied`, so Google's cookies are never set before the visitor agrees —
 *    prior consent, not opt-out.
 *
 * This became a Client Component to read that decision. The cost is one small
 * client component in the root layout; the alternative — a cookie read on the
 * server — would mean setting our own cookie to record consent, which is a
 * worse trade than this.
 *
 * `mounted` gating matters here: without it the script would render server-side
 * on the very first response, before any stored decision could be read, which
 * is precisely the leak this component exists to prevent.
 *
 * Uses the first-party `@next/third-parties` integration rather than a raw gtag
 * snippet because it fires pageviews on App Router client-side navigations too,
 * not just full page loads.
 */
export function GoogleAnalytics() {
  const { consent, mounted } = useConsent();
  const gaId = env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId || !mounted || consent !== "granted") return null;
  return <NextGoogleAnalytics gaId={gaId} />;
}
