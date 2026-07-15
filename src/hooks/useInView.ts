"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * One-shot IntersectionObserver hook for lazy-mount gating (frontend.md §8):
 * `inView` flips to true the first time the referenced element approaches the
 * viewport and stays true — heavy client components mount once and stay
 * mounted. `rootMargin` extends the trigger area so loading starts before the
 * element is actually visible.
 *
 * This is a mount gate, not a scroll-animation trigger — motion primitives use
 * Framer Motion's own `whileInView` for that.
 */
export function useInView<T extends Element>(
  rootMargin = "0px",
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, inView]);

  return [ref, inView];
}
