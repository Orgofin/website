import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import {
  RoadmapTrack,
  type RoadmapStage,
} from "@/components/sections/RoadmapTrack";
import { Button } from "@/components/ui/Button";

/** Module sequence from copy.md §1 Ch.8; HRMS (active) is where Orgofin starts. */
const STAGES: readonly RoadmapStage[] = [
  { label: "HRMS", active: true },
  { label: "Books" },
  { label: "CRM" },
  { label: "Desk" },
  { label: "Workspace" },
  { label: "Analytics" },
  { label: "Company Brain API" },
  { label: "Agent Marketplace" },
  { label: "Enterprise OS" },
];

/**
 * Chapter 8 — Roadmap. Copy verbatim from `docs/product/copy.md` §1 Ch.8. Links
 * to `/products` for full module detail (IA §5). Mounts the shared
 * `RoadmapTrack` in `variant="teaser"` (E9.3.5) — the Investors page mounts the
 * same organism in `variant="full"` with horizon data. Signature motion lives
 * in the track: the stages reveal in sequence, reading as the roadmap order.
 */
export function Roadmap() {
  return (
    <Section id="roadmap" spacing="lg" className="scroll-mt-16">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          title="We start where the pain is worst."
          subtitle="Orgofin HRMS first — hire to retire, India compliance built in, not bolted on. Then Finance. Then CRM. Then everything else."
        />

        <RoadmapTrack
          variant="teaser"
          stages={STAGES}
          aria-label="Product roadmap sequence"
        />

        <Button variant="link" size="md" asChild>
          <Link href="/products">Explore the full product suite →</Link>
        </Button>
      </Container>
    </Section>
  );
}
