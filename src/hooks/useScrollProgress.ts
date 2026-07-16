"use client";

import { useEffect, useState } from "react";

/**
 * Tracks how far the window has scrolled through the document, as a 0–1
 * fraction, throttled to one update per animation frame (same pattern as
 * `useScrollPosition`). Document height is re-read on every update, so lazy
 * content mounting below the fold never leaves the value stale. A document
 * shorter than the viewport reports 0. Server/first-render value is 0.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };

    const request = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}
