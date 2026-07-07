"use client";

import { type HTMLMotionProps, m } from "framer-motion";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { spring } from "@/lib/motion/tokens";

export type HoverableProps = Omit<
  HTMLMotionProps<"div">,
  "whileHover" | "whileTap"
> & {
  /** Pixels to lift on hover. */
  lift?: number;
};

/**
 * Wraps interactive content with a subtle spring lift on hover and settle on
 * tap. Prefer plain CSS `hover:` for simple color/border changes; reach for
 * this only when the interaction genuinely warrants spring physics. Fully
 * static under reduced motion.
 */
export function Hoverable({ lift = 4, children, ...rest }: HoverableProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      whileHover={reduced ? undefined : { y: -lift }}
      whileTap={reduced ? undefined : { y: 0 }}
      transition={spring.ui}
      {...rest}
    >
      {children}
    </m.div>
  );
}
