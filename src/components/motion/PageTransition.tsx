"use client";

import { type HTMLMotionProps, m } from "framer-motion";

import { slideVariants } from "@/components/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type PageTransitionProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "animate"
>;

/**
 * A short, fast entrance for page/route content — mount into a `template.tsx`
 * so navigating between pages fades rather than snaps. Deliberately subtle
 * (frontend.md §10: no full-page wipes). Reduced motion → opacity only.
 */
export function PageTransition({ children, ...rest }: PageTransitionProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      variants={slideVariants(reduced, "up", 8)}
      initial="hidden"
      animate="visible"
      {...rest}
    >
      {children}
    </m.div>
  );
}
