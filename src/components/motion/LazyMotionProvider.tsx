"use client";

import { domAnimation, LazyMotion } from "framer-motion";

/**
 * Loads Framer Motion's `domAnimation` feature bundle once, near the app root,
 * instead of the full `motion` import — the concrete "minimal JS vs. cinematic
 * animation" fix from frontend.md §8. Every motion primitive uses the lighter
 * `m` component, which requires this provider as an ancestor.
 *
 * `strict` throws if a full `motion.*` component is used instead of `m.*`,
 * preventing the heavy bundle from sneaking back in.
 */
export function LazyMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
