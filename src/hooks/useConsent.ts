"use client";

import { useCallback, useSyncExternalStore } from "react";

import { useMounted } from "@/hooks/useMounted";
import { type ConsentState } from "@/lib/consent/config";
import {
  getConsent,
  getServerConsent,
  setConsent,
  subscribeConsent,
} from "@/lib/consent/store";

export type UseConsentResult = {
  /** `unset` until the visitor decides. `unset` during SSR and first paint. */
  consent: ConsentState;
  /** False during SSR / the hydration render — gate rendering on this. */
  mounted: boolean;
  accept: () => void;
  reject: () => void;
};

/**
 * Read and set the visitor's analytics-consent decision.
 *
 * `mounted` is exposed rather than hidden because the two consumers need it for
 * opposite reasons: the banner must not render server-side (it would flash for
 * visitors who already decided), and the analytics gate must not mount GA4
 * server-side (it would load the script before consent could possibly be
 * known). Both gate on `mounted`, so the honest pre-hydration state is "we
 * don't know yet, do nothing".
 */
export function useConsent(): UseConsentResult {
  const mounted = useMounted();
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    getServerConsent,
  );

  const accept = useCallback(() => setConsent("granted"), []);
  const reject = useCallback(() => setConsent("denied"), []);

  return { consent, mounted, accept, reject };
}
