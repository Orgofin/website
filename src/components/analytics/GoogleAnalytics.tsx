import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

import { env } from "@/env";

/**
 * Mounts GA4 only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is present — which, per
 * the Vercel env scoping, is Production only. In CI, local, and preview builds
 * the var is absent, so no analytics script loads and no measurement ID is
 * needed to build (see `src/env.ts` for why the var stays `.optional()`).
 *
 * Uses the first-party `@next/third-parties` integration rather than a raw gtag
 * snippet because it fires pageviews on App Router client-side navigations too,
 * not just full page loads.
 */
export function GoogleAnalytics() {
  const gaId = env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;
  return <NextGoogleAnalytics gaId={gaId} />;
}
