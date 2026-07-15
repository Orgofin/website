"use client";

import dynamic from "next/dynamic";

import { Scale } from "@/components/motion/Scale";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

// Code-split, client-only (frontend.md §8): the graph bundle (d3-force + the
// renderer) is fetched only when the frame scrolls near, and never blocks
// first paint. Crawlers and no-JS visitors get the static chain equivalent
// rendered by CompanyBrainVisual instead.
const CompanyBrainGraph = dynamic(
  () =>
    import("@/components/graph/CompanyBrainGraph").then(
      (mod) => mod.CompanyBrainGraph,
    ),
  { ssr: false },
);

export type CompanyBrainGraphLazyProps = {
  className?: string;
};

/**
 * The mount gate for `CompanyBrainGraph`: renders the graph's framed canvas
 * (radius-xl frame + ambient glow per design-system.md §2/§4) immediately so
 * the layout never shifts, and mounts the graph itself once the frame
 * approaches the viewport. Framer Motion handles only the entrance
 * (fade/scale) — the assembly motion belongs to the physics simulation.
 */
export function CompanyBrainGraphLazy({
  className,
}: CompanyBrainGraphLazyProps) {
  const [frameRef, inView] = useInView<HTMLDivElement>("320px");

  return (
    <div
      ref={frameRef}
      className={cn(
        "border-border relative overflow-hidden rounded-xl border",
        className,
      )}
    >
      <div className="bg-glow-ambient absolute inset-0" aria-hidden="true" />
      {/* aspect ratio mirrors the graph's 640×440 viewBox — reserved up front
          so the lazy mount causes no layout shift. */}
      <div className="relative aspect-[16/11]">
        {inView ? (
          <Scale className="h-full w-full">
            <CompanyBrainGraph />
          </Scale>
        ) : null}
      </div>
    </div>
  );
}
