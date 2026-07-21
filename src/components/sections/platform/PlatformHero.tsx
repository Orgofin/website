import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Platform hero — the page's single `<h1>`. Copy from `docs/product/copy.md`
 * §2.0 (synthesized for this overview page; every claim traces to
 * `docs/product/company.md`'s Company Snapshot and the one-line vision). It
 * deliberately does *not* reuse `/company-brain`'s "One brain. Every part of
 * your business." headline — that page's canonical h1 is reserved for it
 * (`seo.md` rule 3). The gradient accent is this page's one gradient phrase.
 */
export function PlatformHero() {
  return (
    <Section spacing="lg" aria-labelledby="platform-hero-title">
      <Container
        size="content"
        className="flex flex-col items-center gap-6 py-8 text-center"
      >
        <Reveal className="flex flex-col items-center gap-6">
          <SectionHeading
            align="center"
            level={1}
            size="display-xl"
            titleClassName="text-gradient-brand"
            title={
              <span id="platform-hero-title">
                One brain. Infinite agents. Every function.
              </span>
            }
            subtitle="Company Brain holds everything your company knows. Agents act on it. Forty-plus modules across eight suites are how you use it. Here’s how the pieces fit together."
          />
        </Reveal>
      </Container>
    </Section>
  );
}
