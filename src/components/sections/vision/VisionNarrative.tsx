import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Text } from "@/components/ui/Text";

/** The five beats of the 10-year narrative from copy.md §5 — prose, not a table. */
const BEATS: readonly string[] = [
  "We start with HR — the most complete, AI-native hire-to-retire platform built for India first.",
  "Then we expand — Finance, CRM, Support, Collaboration — until Company Brain replaces the vendor stack entirely.",
  "Then agents take over the busywork — a marketplace of thousands, built by us and by others.",
  "Eventually, Company Brain becomes a platform other developers build on — the way iOS became a platform other apps ran on.",
  "And eventually, Orgofin becomes what every mid-market company runs on, by default.",
];

/**
 * The 10-year narrative. Copy verbatim from `docs/product/copy.md` §5 —
 * deliberately rendered as staggered narrative paragraphs, not a list or
 * roadmap table, per the copy deck's "narrative, not a table" instruction.
 * Signature motion: the beats reveal in sequence, reading as the progression.
 */
export function VisionNarrative() {
  return (
    <Section spacing="lg" aria-label="The ten-year narrative">
      <Container size="readable">
        <Stagger className="flex flex-col gap-8">
          {BEATS.map((beat) => (
            <StaggerItem key={beat}>
              <Text size="body-lg" balance>
                {beat}
              </Text>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
