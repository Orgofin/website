"use client";

import { type HTMLMotionProps, m } from "framer-motion";

import {
  type SlideDirection,
  slideVariants,
} from "@/components/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type SlideProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "animate"
> & {
  direction?: SlideDirection;
  /** Travel distance in px before settling. */
  distance?: number;
  delay?: number;
};

/**
 * Slides + fades its children in on mount. Reduced motion drops the movement
 * and keeps an opacity fade.
 */
export function Slide({
  direction = "up",
  distance = 24,
  delay = 0,
  transition,
  children,
  ...rest
}: SlideProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      variants={slideVariants(reduced, direction, distance)}
      initial="hidden"
      animate="visible"
      transition={{ delay, ...transition }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

/** Convenience wrapper: slides up from below. */
export function SlideUp(props: Omit<SlideProps, "direction">) {
  return <Slide direction="up" {...props} />;
}

/** Convenience wrapper: slides down from above. */
export function SlideDown(props: Omit<SlideProps, "direction">) {
  return <Slide direction="down" {...props} />;
}
