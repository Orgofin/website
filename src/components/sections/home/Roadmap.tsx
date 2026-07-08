import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/** Module sequence from copy.md §1 Ch.8; HRMS is where Orgofin starts. */
const MODULES: readonly string[] = [
  "HRMS",
  "Books",
  "CRM",
  "Desk",
  "Workspace",
  "Analytics",
  "Company Brain API",
  "Agent Marketplace",
  "Enterprise OS",
];

/**
 * Chapter 8 — Roadmap. Copy verbatim from `docs/product/copy.md` §1 Ch.8. Links
 * to `/products` for full module detail (IA §5). Signature motion: the module
 * chips reveal in sequence, reading as the roadmap order.
 *
 * NOTE: the shared `RoadmapTrack` organism this will mount in `variant="teaser"`
 * (backlog E9.3.5) is not built yet (E6.2.3); this renders the chip sequence
 * directly for now.
 */
export function Roadmap() {
  return (
    <Section id="roadmap" spacing="lg" className="scroll-mt-16">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          title="We start where the pain is worst."
          subtitle="Orgofin HRMS first — hire to retire, India compliance built in, not bolted on. Then Finance. Then CRM. Then everything else."
        />

        <Stagger
          className="flex flex-wrap items-center gap-x-2 gap-y-3"
          stagger={0.05}
          role="list"
          aria-label="Product roadmap sequence"
        >
          {MODULES.map((module, index) => (
            <StaggerItem
              key={module}
              role="listitem"
              className="flex items-center gap-x-2"
            >
              {index > 0 ? (
                <span className="text-fg-subtle" aria-hidden="true">
                  →
                </span>
              ) : null}
              <Badge
                variant={index === 0 ? "accent" : "neutral"}
                dot={index === 0}
              >
                {module}
              </Badge>
            </StaggerItem>
          ))}
        </Stagger>

        <Button variant="link" size="md" asChild>
          <Link href="/products">Explore the full product suite →</Link>
        </Button>
      </Container>
    </Section>
  );
}
