"use client";

import { type HTMLMotionProps, m } from "framer-motion";

import { fadeVariants } from "@/components/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type FadeInProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "animate"
> & {
  /** Seconds to delay the reveal. */
  delay?: number;
};

/** Fades its children in on mount. Reduced motion → same fade, faster. */
export function FadeIn({
  delay = 0,
  transition,
  children,
  ...rest
}: FadeInProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      variants={fadeVariants(reduced)}
      initial="hidden"
      animate="visible"
      transition={{ delay, ...transition }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
