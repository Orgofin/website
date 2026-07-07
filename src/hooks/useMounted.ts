"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Returns `true` only after the component has mounted on the client (`false`
 * during SSR and the hydration render). Implemented with `useSyncExternalStore`
 * — a snapshot that differs between server and client — so it never triggers a
 * hydration mismatch or a setState-in-effect.
 *
 * Use to gate rendering that depends on `window`, theme, or media queries.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
