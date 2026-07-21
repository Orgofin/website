import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * Security & compliance — the teaser cut. `/security` is canonical for this
 * narrative (`docs/product/copy.md` §4, IA §7), so this section renders the
 * §4 hero line plus a one-line summary and deep-links out, rather than
 * duplicating the three trust pillars (the same teaser→canonical pattern as
 * Home's `VisionTeaser` → `/vision`). Signature motion: a single reveal.
 */
export function SecurityLayer() {
  return (
    <Section spacing="lg" aria-labelledby="platform-security-title">
      <Container size="content" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Underneath all of it"
            title={
              <span id="platform-security-title">
                Compliance isn’t a feature we sell. It’s how we operate.
              </span>
            }
            subtitle="Data residency across India, UK, and US; an architecture built for DPDP from day one; and a full audit trail on every access. If we’re asking you to trust us with your company’s data, we should show you exactly how we handle it."
          />
          <div>
            <Button asChild variant="secondary">
              <Link href="/security">See how we handle your data</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
