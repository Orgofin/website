import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";

/**
 * Careers hero — the page's single `<h1>` and the honest headline state:
 * Orgofin is not currently hiring. Copy elevates `docs/product/copy.md` §11's
 * "We're not hiring yet. We will be soon." into a premium, optimistic
 * statement, per the founder brief (keep the page live for credibility and
 * future growth). The gradient accent is this page's one gradient phrase
 * (design-system.md §2). The status Badge carries the "not hiring" meaning as
 * text, never colour alone (accessibility.md).
 */
export function CareersHero() {
  return (
    <Section spacing="lg" aria-labelledby="careers-hero-title">
      <Container
        size="content"
        className="flex flex-col items-center gap-6 py-8 text-center"
      >
        <Reveal className="flex flex-col items-center gap-6">
          <Badge variant="roadmap">Not currently hiring</Badge>
          <SectionHeading
            align="center"
            level={1}
            size="display-xl"
            title={
              <span id="careers-hero-title">
                We&rsquo;re not hiring today.{" "}
                <span className="text-gradient-brand">
                  We&rsquo;re building something worth joining.
                </span>
              </span>
            }
            subtitle="Every company you admire had a moment before the world was watching. Orgofin is in that moment now — and the people who join first won't inherit a company. They'll shape the one everyone reads about later."
          />
        </Reveal>
      </Container>
    </Section>
  );
}
