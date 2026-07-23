import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * Layer 1 — Company Brain, the teaser cut. `/company-brain` is canonical for
 * this narrative (`docs/product/copy.md` §2, IA §7), so this section renders the
 * §2.0 overview line plus a one-line summary and deep-links out, rather than
 * duplicating the "what it knows" grid or the Context Engine / Decision
 * Intelligence deep-dives (the same teaser→canonical pattern as `SecurityLayer`
 * → `/security` and Home's `VisionTeaser` → `/vision`). Signature motion: a
 * single reveal.
 */
export function CompanyBrainLayer() {
  return (
    <Section spacing="lg" aria-labelledby="platform-brain-title">
      <Container size="content" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Layer one — the foundation"
            title={
              <span id="platform-brain-title">
                It knows your business the way your best employee would — if
                they never forgot anything.
              </span>
            }
            subtitle="Company Brain is a living, real-time map of your organization — not a dashboard you check, but a system that already knows. A data warehouse tells you what happened last night; Company Brain updates the instant anything happens."
          />
          <div>
            <Button asChild variant="secondary">
              <Link href="/company-brain">See how the Brain works</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
