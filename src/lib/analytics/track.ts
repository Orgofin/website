import { sendGAEvent } from "@next/third-parties/google";

import { env } from "@/env";
import { getConsent } from "@/lib/consent/store";

/**
 * The typed GA4 event vocabulary (PRD §10, backlog E14.2). Every trackable
 * interaction is a member of this union — ad-hoc event names and free-form
 * params cannot be sent, which doubles as the structural "no PII" guard: no
 * param shape accepts an email, name, or message body.
 *
 * `demo_request` and `partner_apply` are defined ahead of their forms (E8.x)
 * so wiring them later is a one-line call, not a naming decision.
 */
export type AnalyticsEvent =
  | {
      name: "waitlist_submit";
      params: { source: string; status: "success" | "error" };
    }
  | { name: "demo_request"; params: { status: "success" | "error" } }
  | { name: "partner_apply"; params: { status: "success" | "error" } }
  | { name: "theme_change"; params: { theme: "light" | "dark" | "system" } }
  | { name: "cta_click"; params: { cta: string; location: string } }
  | { name: "data_room_request"; params: { status: "success" | "error" } }
  // PRD §10's "Investor PDF Downloads" event — `document` is the catalog slug.
  | { name: "data_room_download"; params: { document: string } };

/**
 * Fire-and-forget GA4 event (frontend.md §9 — analytics is not state). Wraps
 * `sendGAEvent` from the same `@next/third-parties` integration that boots GA4
 * in the root layout. No-ops on the server, wherever
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` is unset (CI, local, previews — GA4 is
 * Production-scoped in Vercel), **and wherever analytics consent has not been
 * granted**, so call sites never need their own guard.
 *
 * The consent check is belt-and-braces: without granted consent
 * `GoogleAnalytics` never mounts, so there is no gtag to receive the event
 * anyway. It is here so the guarantee is stated in the one function every call
 * site goes through, rather than resting on a component's mount condition —
 * and it reads the consent store directly rather than a hook, because this
 * stays a plain callable function (see `lib/consent/store.ts`).
 *
 * There is deliberately no `trackPageView` counterpart: the integration
 * already fires pageviews on load and on App Router client navigations.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined" || !env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    return;
  }
  if (getConsent() !== "granted") return;
  try {
    sendGAEvent("event", event.name, event.params);
  } catch {
    // Fire-and-forget: a failed analytics call must never surface to the
    // user or break the interaction it was measuring.
  }
}
