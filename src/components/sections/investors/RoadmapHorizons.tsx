import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import {
  RoadmapTrack,
  type RoadmapStage,
} from "@/components/sections/RoadmapTrack";

/** The five horizons from copy.md §6 (Roadmap & Targets); H1 is where Orgofin is today. */
const HORIZONS: readonly RoadmapStage[] = [
  {
    label: "H1 — HRMS Wedge",
    timeframe: "0–12 months",
    target: "$2–5M ARR",
    active: true,
  },
  {
    label: "H2 — Full-Stack SMB OS",
    timeframe: "12–36 months",
    target: "$20–40M ARR",
  },
  {
    label: "H3 — AGaaS Platform",
    timeframe: "36–60 months",
    target: "$100–200M ARR",
  },
  {
    label: "H4 — Company Brain as Platform",
    timeframe: "5–8 years",
    target: "$500M+ ARR",
  },
  {
    label: "H5 — Enterprise OS",
    timeframe: "8–12 years",
    target: "$1B+ ARR",
  },
];

/**
 * Roadmap & Targets — the five horizons with revenue targets. Copy verbatim
 * from `docs/product/copy.md` §6; mounts the shared `RoadmapTrack` in
 * `variant="full"` (E6.2.2) — the same organism Home Ch.8 mounts as a teaser
 * chip sequence. Signature motion lives in the track: horizons reveal in
 * sequence, reading as the glide path.
 */
export function RoadmapHorizons() {
  return (
    <Section spacing="lg" aria-labelledby="roadmap-horizons-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          title={
            <span id="roadmap-horizons-title">
              The path from HRMS wedge to Enterprise OS.
            </span>
          }
        />

        <RoadmapTrack
          variant="full"
          stages={HORIZONS}
          aria-label="Roadmap horizons with revenue targets"
        />
      </Container>
    </Section>
  );
}
