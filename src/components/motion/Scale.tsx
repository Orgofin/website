"use client";

import { type HTMLMotionProps, m } from "framer-motion";

import { scaleVariants } from "@/components/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type ScaleProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "animate"
> & {
  /** Starting scale before settling to 1. */
  from?: number;
  delay?: number;
};

/** Scales + fades its children in on mount. Reduced motion → fade only. */
export function Scale({
  from = 0.96,
  delay = 0,
  transition,
  children,
  ...rest
}: ScaleProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      variants={scaleVariants(reduced, from)}
      initial="hidden"
      animate="visible"
      transition={{ delay, ...transition }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
