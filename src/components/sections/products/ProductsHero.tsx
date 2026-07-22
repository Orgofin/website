import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";

/**
 * Products hero — the page's single `<h1>`. Reframed 2026-07-22 for accuracy:
 * Orgofin is pre-launch with **no publicly available products**, and its first
 * product (HRMS) is in active development (founder correction — supersedes the
 * "Every function your company needs / 40+ modules" copy in
 * `docs/product/copy.md` §3, which read as an availability claim). The hero now
 * states that truth plainly while keeping the ambition. `/products` is
 * canonical for the suite grid (`seo.md` rule 3); `/platform`'s `SuitesLayer`
 * is the teaser that deep-links here. The gradient accent is this page's one
 * gradient phrase (design-system.md §2). The status Badge carries meaning as
 * text, never colour alone (accessibility.md). Signature motion: a single
 * reveal of the block.
 */
export function ProductsHero() {
  return (
    <Section spacing="lg" aria-labelledby="products-hero-title">
      <Container
        size="content"
        className="flex flex-col items-center gap-6 py-8 text-center"
      >
        <Reveal className="flex flex-col items-center gap-6">
          <Badge variant="accent">In development · Pre-launch</Badge>
          <SectionHeading
            align="center"
            level={1}
            size="display-xl"
            title={
              <span id="products-hero-title">
                We&rsquo;re not shipping forty products.{" "}
                <span className="text-gradient-brand">
                  We&rsquo;re building one brain.
                </span>
              </span>
            }
            subtitle="Orgofin is pre-launch. Our first product — an India-first HRMS — is in active development. Everything beyond it is the roadmap that same Company Brain unlocks, not a shelf of things you can buy today."
          />
        </Reveal>
      </Container>
    </Section>
  );
}
