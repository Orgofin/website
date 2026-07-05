"use client";

import { type HTMLMotionProps, m } from "framer-motion";

import {
  type SlideDirection,
  slideVariants,
} from "@/components/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type RevealProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "whileInView"
> & {
  direction?: SlideDirection;
  distance?: number;
  delay?: number;
  /** Animate only the first time it enters the viewport. */
  once?: boolean;
  /** Fraction of the element that must be visible to trigger (0–1). */
  amount?: number;
};

/**
 * Scroll-triggered reveal — fades/slides in when scrolled into view. The
 * content is always present in the DOM (keyboard/no-JS/reduced-motion users see
 * the full content), only its entrance is animated.
 */
export function Reveal({
  direction = "up",
  distance = 24,
  delay = 0,
  once = true,
  amount = 0.3,
  transition,
  children,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      variants={slideVariants(reduced, direction, distance)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay, ...transition }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
