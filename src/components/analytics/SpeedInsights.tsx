"use client";

import { SpeedInsights as VercelSpeedInsights } from "@vercel/speed-insights/next";

import { useConsent } from "@/hooks/useConsent";

/**
 * Vercel Speed Insights — real Core Web Vitals from real devices.
 *
 * ## Why this exists
 *
 * Lighthouse is a lab measurement on a simulated mid-tier phone over simulated
 * slow 4G. It is deliberately pessimistic and it is not our audience. The
 * 2026-07-27 baseline (docs/launch/lighthouse-baseline.md) put mobile
 * performance at 91–93 against a 95 target, and every available lever to close
 * that gap turned out to be either ineffective or to cost real browser support.
 * Field data is what should answer the question instead — if actual visitors
 * see good LCP, the lab score is measuring a device nobody uses.
 *
 * ## Why it is consent-gated, unlike Vercel's own guidance
 *
 * Speed Insights sets no cookies and collects no personal data, so Vercel
 * documents it as needing no consent banner — and `monitoring-and-analytics.md`
 * repeats that. It is gated here anyway, because /privacy makes a stronger
 * promise than the law requires and that promise is published:
 *
 *   > "Choose essential only and **no analytics script runs**."
 *   > "The **only** cookies set on this site belong to Google Analytics."
 *
 * Loading this for a visitor who chose essential-only would make both lines
 * false. The options were to gate the script or to rewrite a counsel-pending
 * legal page to be narrower; keeping the promise is the better trade, and the
 * consent machinery already exists.
 *
 * **The cost is real and should be understood before reading the data:** CWV
 * are collected only from visitors who accepted analytics, so the sample is
 * biased toward people who accept banners. Treat it as directional, and note
 * that it under-counts by exactly the same population GA4 does.
 *
 * The `mounted` gate matters for the same reason it does in `GoogleAnalytics`:
 * without it the script would render server-side on the first response, before
 * any stored decision can be read — which is the leak the gate exists to
 * prevent.
 *
 * ## Notes
 *
 * No CSP change was needed. Both the script (`/_vercel/speed-insights/
 * script.js`) and the beacon (`/_vercel/speed-insights/vitals`) are served
 * same-origin by the Vercel platform, so the existing `script-src 'self'` and
 * `connect-src 'self'` already cover them — verified against the package source
 * rather than assumed.
 *
 * Only reports on Vercel deployments. Locally and in CI it no-ops, so there is
 * nothing to configure for development.
 */
export function SpeedInsights() {
  const { consent, mounted } = useConsent();

  if (!mounted || consent !== "granted") return null;
  return <VercelSpeedInsights />;
}
