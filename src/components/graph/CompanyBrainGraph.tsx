"use client";

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationNodeDatum,
} from "d3-force";
import { useEffect, useId, useRef, useState } from "react";

import {
  BRAIN_EDGES,
  BRAIN_NODES,
  type EntityNode,
} from "@/components/graph/data";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type SimNode = EntityNode & SimulationNodeDatum & { x: number; y: number };

type SimEdge = { source: SimNode; target: SimNode; verb: string };

type Point = { x: number; y: number };

/*
 * Graph geometry — coordinates in viewBox units, not design tokens: they are
 * the drawing's internal dimensions (like an illustration's), scaled as one
 * unit by the responsive container. Stroke width follows the 1.5px iconography
 * rule (design-system.md §6); everything visual (color, type, motion duration)
 * comes from semantic token utilities on the elements below.
 */
const VIEW_W = 640;
const VIEW_H = 440;
const NODE_R = 7;
const HIT_R = 22; // invisible pointer/touch target (≥44px at typical render widths)
const GLOW_R = 26; // the glow-focus halo behind the active node
const LABEL_OFFSET = 24;
const BOUND_X = 72; // keeps node labels inside the frame
const BOUND_Y = 44;
const SEED_R = 36; // the compact ring the assembly starts from
const EDGE_LENGTH = 118;
const CHARGE_STRENGTH = -380;
const COLLIDE_R = 46;
const VERB_OFFSET = 11; // lifts edge verbs off their line, clear of node labels
const SETTLE_TICKS = 300; // reduced motion: run the same physics to rest, render static
const DRIFT_AMPLITUDE = 3; // ambient idle drift, in viewBox units — subtle, never distracting

const NODE_LABELS = new Map(BRAIN_NODES.map((node) => [node.id, node.label]));

/** node id → itself + its direct neighbors (for dimming the rest). */
const CONNECTIONS = (() => {
  const map = new Map(BRAIN_NODES.map((node) => [node.id, new Set([node.id])]));
  for (const edge of BRAIN_EDGES) {
    map.get(edge.source)?.add(edge.target);
    map.get(edge.target)?.add(edge.source);
  }
  return map;
})();

/** node id → spoken description of its relationships (node aria-labels). */
const DESCRIPTIONS = new Map(
  BRAIN_NODES.map((node) => {
    const clauses = BRAIN_EDGES.filter(
      (edge) => edge.source === node.id || edge.target === node.id,
    ).map(
      (edge) =>
        `${NODE_LABELS.get(edge.source)} ${edge.verb} ${NODE_LABELS.get(edge.target)}`,
    );
    return [node.id, `${node.label}. ${clauses.join(". ")}.`];
  }),
);

/** Deterministic seed ring around the center — same assembly on every load. */
function seedPosition(index: number): Point {
  const angle = (index / BRAIN_NODES.length) * 2 * Math.PI;
  return {
    x: VIEW_W / 2 + SEED_R * Math.cos(angle),
    y: VIEW_H / 2 + SEED_R * Math.sin(angle),
  };
}

/** Fresh mutable node/edge objects for a simulation run (d3 mutates them). */
function buildSimData(): { nodes: SimNode[]; edges: SimEdge[] } {
  const nodes: SimNode[] = BRAIN_NODES.map((node, i) => ({
    ...node,
    ...seedPosition(i),
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const resolve = (id: string): SimNode => {
    const node = byId.get(id);
    if (!node) throw new Error(`CompanyBrainGraph: unknown node id "${id}"`);
    return node;
  };
  const edges: SimEdge[] = BRAIN_EDGES.map((edge) => ({
    source: resolve(edge.source),
    target: resolve(edge.target),
    verb: edge.verb,
  }));
  return { nodes, edges };
}

function createSimulation(
  nodes: SimNode[],
  edges: SimEdge[],
): Simulation<SimNode, SimEdge> {
  return forceSimulation<SimNode>(nodes)
    .force(
      "link",
      forceLink<SimNode, SimEdge>(edges).distance(EDGE_LENGTH).strength(0.8),
    )
    .force("charge", forceManyBody<SimNode>().strength(CHARGE_STRENGTH))
    .force("center", forceCenter<SimNode>(VIEW_W / 2, VIEW_H / 2))
    .force("collide", forceCollide<SimNode>(COLLIDE_R))
    .alphaDecay(0.05); // settles the assembly in ~1.5s (motion-cinematic scale)
}

function clampToFrame(nodes: SimNode[]): void {
  for (const node of nodes) {
    node.x = Math.min(Math.max(node.x, BOUND_X), VIEW_W - BOUND_X);
    node.y = Math.min(Math.max(node.y, BOUND_Y), VIEW_H - BOUND_Y);
  }
}

function toSnapshot(nodes: SimNode[]): ReadonlyMap<string, Point> {
  return new Map(nodes.map((node) => [node.id, { x: node.x, y: node.y }]));
}

/**
 * The reduced-motion layout: the same simulation run to rest synchronously.
 * Deterministic (fixed seed ring, no random jiggle at these positions), so it
 * is computed once per session and rendered static.
 */
let settledCache: ReadonlyMap<string, Point> | null = null;
function settledPositions(): ReadonlyMap<string, Point> {
  if (!settledCache) {
    const { nodes, edges } = buildSimData();
    createSimulation(nodes, edges).stop().tick(SETTLE_TICKS);
    clampToFrame(nodes);
    settledCache = toSnapshot(nodes);
  }
  return settledCache;
}

/**
 * The Company Brain entity graph (E9.3.2) — Ch.5's signature visualization.
 * Headless `d3-force` physics + bespoke SVG rendering per the E9.3.1 decision
 * (frontend.md §10): the graph assembles once on mount (the chapter's one
 * signature motion), then idles with a slow ambient drift. Hover, focus, or
 * click/tap a node to highlight its relationships; Escape or clicking the
 * background clears a pinned selection. Reduced motion renders the settled
 * layout statically — same implementation, run to rest.
 *
 * The mutable d3 simulation lives entirely inside the effect; React renders
 * from immutable position snapshots published per tick.
 *
 * Client-only and code-split — always mount via `CompanyBrainGraphLazy`, never
 * directly. The crawlable/no-JS text equivalent is the static relationship
 * chain rendered alongside in `CompanyBrainVisual` (E9.3.3 designation).
 */
export function CompanyBrainGraph() {
  const reduced = useReducedMotion();
  const glowId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const onScreenRef = useRef(true);
  const [livePositions, setLivePositions] = useState<
    ReadonlyMap<string, Point>
  >(() => new Map(BRAIN_NODES.map((node, i) => [node.id, seedPosition(i)])));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const focusId = pinnedId ?? activeId;
  const positions = reduced ? settledPositions() : livePositions;

  useEffect(() => {
    if (reduced) return;

    const { nodes, edges } = buildSimData();
    const simulation = createSimulation(nodes, edges);
    let raf = 0;

    simulation.on("tick", () => {
      clampToFrame(nodes);
      setLivePositions(toSnapshot(nodes));
    });

    // Assembly settled — hand off to a slow sinusoidal idle drift (the ambient
    // register of design-system.md §5, kept far below distraction threshold).
    simulation.on("end", () => {
      const settled = toSnapshot(nodes);
      const start = performance.now();
      const drift = (now: number) => {
        raf = requestAnimationFrame(drift);
        if (!onScreenRef.current) return; // scrolled away — idle for free
        const t = (now - start) / 1000;
        setLivePositions(
          new Map(
            nodes.map((node, i) => {
              const base = settled.get(node.id) ?? node;
              return [
                node.id,
                {
                  x: base.x + DRIFT_AMPLITUDE * Math.sin(t * 0.5 + i * 1.7),
                  y: base.y + DRIFT_AMPLITUDE * Math.cos(t * 0.4 + i * 2.3),
                },
              ];
            }),
          ),
        );
      };
      raf = requestAnimationFrame(drift);
    });

    return () => {
      simulation.on("tick", null).on("end", null);
      simulation.stop();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Pause the ambient drift while the graph is out of the viewport.
  useEffect(() => {
    const element = svgRef.current;
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      onScreenRef.current = entries.some((entry) => entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const togglePin = (id: string) => {
    setPinnedId((current) => (current === id ? null : id));
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-full w-full"
      role="group"
      aria-label="Company Brain entity graph: eight connected business entities. The same relationships are described in text alongside this graphic."
      onClick={() => setPinnedId(null)}
    >
      <defs>
        {/* SVG rendering of the design system's glow-focus token (§2) — the
            halo behind the active node. Stops read the semantic accent var so
            it re-themes with light/dark for free. */}
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
        </radialGradient>
      </defs>

      {BRAIN_EDGES.map((edge) => {
        const source = positions.get(edge.source);
        const target = positions.get(edge.target);
        if (!source || !target) return null;
        const incident =
          focusId !== null &&
          (edge.source === focusId || edge.target === focusId);
        const dimmed = focusId !== null && !incident;
        // Verb label: edge midpoint pushed along the edge's upward-facing
        // normal, so it reads beside the line rather than on top of it (and
        // clear of the node labels hanging below each node).
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const length = Math.hypot(dx, dy) || 1;
        const side = dx >= 0 ? -1 : 1; // pick the normal that points upward
        const verbX =
          (source.x + target.x) / 2 + (side * -dy * VERB_OFFSET) / length;
        const verbY =
          (source.y + target.y) / 2 + (side * dx * VERB_OFFSET) / length;
        return (
          <g
            key={`${edge.source}-${edge.target}`}
            className={cn(
              "ease-standard transition-opacity duration-[var(--motion-fast)]",
              dimmed && "opacity-30",
            )}
            aria-hidden="true"
          >
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              strokeWidth={1.5}
              className={cn(
                "ease-standard transition-[stroke] duration-[var(--motion-fast)]",
                incident ? "stroke-accent" : "stroke-border-strong",
              )}
            />
            <text
              x={verbX}
              y={verbY}
              textAnchor="middle"
              dominantBaseline="middle"
              paintOrder="stroke"
              strokeWidth={4}
              className={cn(
                "text-micro stroke-page uppercase",
                incident ? "fill-fg-muted" : "fill-fg-subtle",
              )}
            >
              {edge.verb}
            </text>
          </g>
        );
      })}

      {BRAIN_NODES.map((node) => {
        const point = positions.get(node.id);
        if (!point) return null;
        const isFocus = focusId === node.id;
        const related =
          focusId === null || (CONNECTIONS.get(focusId)?.has(node.id) ?? false);
        return (
          <g
            key={node.id}
            role="button"
            tabIndex={0}
            aria-pressed={pinnedId === node.id}
            aria-label={DESCRIPTIONS.get(node.id)}
            transform={`translate(${point.x}, ${point.y})`}
            className={cn(
              "ease-standard cursor-pointer transition-opacity duration-[var(--motion-fast)]",
              !related && "opacity-30",
            )}
            onMouseEnter={() => setActiveId(node.id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(node.id)}
            onBlur={() => setActiveId(null)}
            onClick={(event) => {
              event.stopPropagation();
              togglePin(node.id);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                togglePin(node.id);
              }
              if (event.key === "Escape") setPinnedId(null);
            }}
          >
            {isFocus ? <circle r={GLOW_R} fill={`url(#${glowId})`} /> : null}
            <circle r={HIT_R} className="fill-transparent" />
            <circle r={NODE_R} className="fill-accent" />
            <text
              y={LABEL_OFFSET}
              textAnchor="middle"
              paintOrder="stroke"
              strokeWidth={4}
              className={cn(
                "text-caption stroke-page",
                isFocus ? "fill-fg" : "fill-fg-muted",
              )}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
