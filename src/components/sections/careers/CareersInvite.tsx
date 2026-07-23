import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Text } from "@/components/ui/Text";

/**
 * "Who we'll come looking for" — an editorial, centred statement that sets the
 * bar without listing a single open role (there are none). Elevates the copy
 * deck's §11 line ("engineers who want to build real infrastructure, not
 * another CRUD app with an AI feature bolted on") into a memorable invitation,
 * then bridges to the waitlist `CTABand` as the honest "stay connected"
 * channel — no invented careers inbox or talent-network backend. Signature
 * motion: a single reveal of the block.
 */
export function CareersInvite() {
  return (
    <Section spacing="lg" aria-labelledby="careers-invite-title">
      <Container
        size="readable"
        className="flex flex-col items-center gap-6 text-center"
      >
        <Reveal className="flex flex-col items-center gap-6">
          <SectionHeading
            align="center"
            eyebrow="When the doors open"
            title={
              <span id="careers-invite-title">
                We&rsquo;ll come looking for builders, not seat-fillers.
              </span>
            }
            subtitle="Engineers, designers, and operators who want to build real infrastructure — people who read a hard problem and lean in. If that's you, you're early, and early is the best time to arrive."
          />
          <Text size="body-lg" tone="muted" className="max-w-xl">
            There&rsquo;s nothing to apply to yet — and that&rsquo;s the point.
            The best way to be first when roles open is to follow the build from
            the inside. Watch the Company Brain come to life, and we&rsquo;ll
            make sure you hear it here first.
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
