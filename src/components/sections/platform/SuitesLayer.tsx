import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * Layer 3 — the suites, teaser cut. `/products` is canonical for the eight-suite
 * grid (`docs/product/copy.md` §3, IA §7), so this section names the concept and
 * deep-links out rather than duplicating the grid (the same teaser→canonical
 * pattern as Home's `VisionTeaser` → `/vision`). Signature motion: a single
 * reveal.
 */
export function SuitesLayer() {
  return (
    <Section spacing="lg" aria-labelledby="platform-suites-title">
      <Container size="content" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Layer three — the surface"
            title={
              <span id="platform-suites-title">
                One subscription. Every function your company needs.
              </span>
            }
            subtitle="Not 40 separate products. One brain, expressed as 40+ modules across eight suites — HR, Finance, CRM, Support, Collaboration, IT, Intelligence, and Governance — each one smarter because of everything around it."
          />
          <div>
            <Button asChild variant="secondary">
              <Link href="/products">Explore the suites</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
