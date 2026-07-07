import { type Variants } from "framer-motion";

import { reducedTween, tween } from "@/lib/motion/tokens";

/**
 * Shared Framer Motion variants for the motion primitives. Every factory takes
 * `reduced` (from `useReducedMotion`) and returns an opacity-only, movement-free
 * variant when true — the single, centrally-defined reduced-motion path
 * (animations.md, design-system.md §5 principle 4).
 */

export type SlideDirection = "up" | "down" | "left" | "right";

export function fadeVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: reduced ? reducedTween : tween() },
  };
}

export function slideVariants(
  reduced: boolean,
  direction: SlideDirection = "up",
  distance = 24,
): Variants {
  const offset = reduced ? { x: 0, y: 0 } : offsetFor(direction, distance);
  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: reduced ? reducedTween : tween(),
    },
  };
}

export function scaleVariants(reduced: boolean, from = 0.96): Variants {
  return {
    hidden: { opacity: 0, scale: reduced ? 1 : from },
    visible: {
      opacity: 1,
      scale: 1,
      transition: reduced ? reducedTween : tween(),
    },
  };
}

/**
 * Container that staggers its children's reveal. Pair with `staggerItemVariants`
 * on each child. Stagger increment defaults to the 40–80ms token band.
 */
export function staggerContainerVariants(
  reduced: boolean,
  stagger = 0.06,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delayChildren,
      },
    },
  };
}

export function staggerItemVariants(
  reduced: boolean,
  direction: SlideDirection = "up",
  distance = 16,
): Variants {
  return slideVariants(reduced, direction, distance);
}

function offsetFor(direction: SlideDirection, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
  }
}
