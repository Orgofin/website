"use client";

import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down" | "none";

export type ScrollPosition = {
  x: number;
  y: number;
  direction: ScrollDirection;
};

/**
 * Tracks window scroll position and direction, throttled to one update per
 * animation frame. Server/first-render value is `{ x: 0, y: 0, direction: "none" }`.
 */
export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: "none",
  });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const x = window.scrollX;
      const direction: ScrollDirection =
        y === lastY ? "none" : y > lastY ? "down" : "up";
      lastY = y;
      setPosition({ x, y, direction });
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return position;
}
