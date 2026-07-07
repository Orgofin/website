import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { cn } from "@/lib/utils";

export type CTABandProps = {
  /** Anchor id — the nav "Join the Waitlist" button links here. */
  id?: string;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Attribution tag forwarded to the waitlist signup. */
  source?: string;
  className?: string;
};

/**
 * The one consistent end-of-page waitlist CTA, reused on every non-legal page
 * (`information-architecture.md` §6, E6.2.1) — a single component, not a
 * per-page rebuild. Copy defaults to the Chapter 10 waitlist deck and can be
 * overridden per page. Wires directly to `WaitlistForm`.
 */
export function CTABand({
  id = "waitlist",
  eyebrow,
  title = "Be early to the Company Brain.",
  subtitle = "Join founders and operators who are done paying for fragmentation.",
  source,
  className,
}: CTABandProps) {
  return (
    <Section id={id} spacing="lg" className={cn("scroll-mt-16", className)}>
      <Container
        size="readable"
        className="flex flex-col items-center gap-8 text-center"
      >
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
        />
        <WaitlistForm source={source} className="w-full max-w-sm text-left" />
      </Container>
    </Section>
  );
}
