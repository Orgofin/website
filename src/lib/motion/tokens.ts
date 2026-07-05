import { type Transition } from "framer-motion";

/**
 * Motion tokens for Framer Motion, mirroring the CSS `--motion-*` durations and
 * `--ease-*` easings in globals.css / design-system.md §5. Durations are in
 * SECONDS (Framer's unit); the CSS side is in ms. Keep the two in sync — this
 * file is the JS source of truth, design-system.md is the rationale.
 *
 * Spring configs are JS-only: a spring can't be expressed as a CSS bezier, so
 * it has no CSS-token counterpart.
 */

export const duration = {
  instant: 0.1,
  fast: 0.18,
  base: 0.28,
  slow: 0.45,
  cinematic: 0.8,
} as const;

type Bezier = [number, number, number, number];

export const easing = {
  /** expo-out — the default "premium settle" curve for nearly everything. */
  standard: [0.16, 1, 0.3, 1] as Bezier,
  /** for elements leaving the screen. */
  in: [0.4, 0, 1, 1] as Bezier,
} as const;

export const spring = {
  /** interactive elements the user directly manipulates. */
  ui: { type: "spring", stiffness: 260, damping: 26, mass: 1 } as Transition,
  /** ambient/background motion — slower, heavier, never distracting. */
  ambient: {
    type: "spring",
    stiffness: 80,
    damping: 20,
    mass: 1.2,
  } as Transition,
} as const;

/** The standard tween used by the reveal/slide/fade primitives. */
export function tween(d: number = duration.slow): Transition {
  return { duration: d, ease: easing.standard };
}

/** The reduced-motion transition: a quick opacity settle, no movement. */
export const reducedTween: Transition = {
  duration: duration.fast,
  ease: easing.standard,
};
