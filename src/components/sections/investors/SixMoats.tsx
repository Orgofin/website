import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { SixMoatsList } from "@/components/sections/SixMoatsList";

/** The six moats from copy.md §6 — the same set Home Ch.7.5 teases. */
const SIX_MOATS: readonly string[] = [
  "Organisational memory that compounds with every customer.",
  "Data network effects across thousands of Indian SMBs.",
  "India compliance depth competitors won't easily replicate.",
  "Lock-in earned through value, not contracts.",
  "Agents that learn from every task they execute.",
  "A 350,000-strong Chartered Accountant network as a distribution channel.",
];

/**
 * The Six Moats — defensibility. Copy verbatim from `docs/product/copy.md` §6;
 * mounts the shared `SixMoatsList` in `variant="full"` (E6.2.3), the roomier
 * single-column treatment of the list Home Ch.7.5 shows as a compact grid.
 * Signature motion: the section's single reveal (the list is motion-free).
 */
export function SixMoats() {
  return (
    <Section spacing="lg" aria-labelledby="six-moats-title">
      <Container size="content" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            title={
              <span id="six-moats-title">
                Why this gets harder to copy, not easier, over time.
              </span>
            }
          />
          <SixMoatsList
            variant="full"
            moats={SIX_MOATS}
            aria-label="The six moats"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
