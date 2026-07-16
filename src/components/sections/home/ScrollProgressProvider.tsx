"use client";

import { createContext, useContext } from "react";

import { useScrollProgress } from "@/hooks/useScrollProgress";

const HomeScrollProgressContext = createContext<number | null>(null);

/**
 * Read the Home narrative's 0–1 scroll progress. Only usable inside
 * `ScrollProgressProvider` — the context is deliberately local to the Home
 * tree, not global app state (frontend.md §9).
 */
export function useHomeScrollProgress(): number {
  const progress = useContext(HomeScrollProgressContext);
  if (progress === null) {
    throw new Error(
      "useHomeScrollProgress must be used inside ScrollProgressProvider (the Home page tree).",
    );
  }
  return progress;
}

/** The thin reading-progress bar along the top edge of the viewport. Purely
 *  decorative (`aria-hidden`) — scroll position itself is the semantic signal.
 *  Scroll-linked direct manipulation, not an animation: no transition to
 *  reduce, so it behaves identically under `prefers-reduced-motion`. */
function ProgressBar() {
  const progress = useHomeScrollProgress();
  return (
    <div
      aria-hidden="true"
      className="bg-accent fixed inset-x-0 top-0 z-50 h-0.5 origin-left"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

/**
 * Home-tree-scoped scroll progress (E9.1.1, frontend.md §4/§9): provides the
 * narrative's scroll fraction to the Home subtree and renders the progress
 * indicator. The spec's second consumer — nav active-chapter highlight — has
 * no surface yet (IA §2's header has no chapter-level links; the nav structure
 * decision is with the founders), so `useHomeScrollProgress` is the seam it
 * will plug into, tracked in the backlog rather than built speculatively.
 */
export function ScrollProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const progress = useScrollProgress();
  return (
    <HomeScrollProgressContext.Provider value={progress}>
      <ProgressBar />
      {children}
    </HomeScrollProgressContext.Provider>
  );
}
