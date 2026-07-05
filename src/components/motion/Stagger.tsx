"use client";

import { type HTMLMotionProps, m } from "framer-motion";

import {
  type SlideDirection,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/motion/variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type StaggerProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "whileInView"
> & {
  /** Seconds between each child's reveal (40–80ms token band). */
  stagger?: number;
  /** Seconds before the first child reveals. */
  delayChildren?: number;
  once?: boolean;
  amount?: number;
};

/**
 * Scroll-triggered container that staggers the reveal of its children. Each
 * direct child should be a `<StaggerItem>`. Reduced motion collapses the
 * stagger to zero so everything fades in together.
 */
export function Stagger({
  stagger = 0.06,
  delayChildren = 0,
  once = true,
  amount = 0.2,
  children,
  ...rest
}: StaggerProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      variants={staggerContainerVariants(reduced, stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

export type StaggerItemProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "animate"
> & {
  direction?: SlideDirection;
  distance?: number;
};

/** A single item inside a `<Stagger>`. Inherits timing from the container. */
export function StaggerItem({
  direction = "up",
  distance = 16,
  children,
  ...rest
}: StaggerItemProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      variants={staggerItemVariants(reduced, direction, distance)}
      {...rest}
    >
      {children}
    </m.div>
  );
}
