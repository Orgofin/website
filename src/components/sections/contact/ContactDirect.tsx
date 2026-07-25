import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Text } from "@/components/ui/Text";
import { CONTACT_EMAIL } from "@/lib/site/contact";

/**
 * The address itself, stated plainly, plus what happens after you send it.
 *
 * The response promise is `docs/product/copy.md` §13's ("we read every one of
 * these ourselves… a reply within 1–2 business days") and matches the first-week
 * commitment in `docs/launch/launch-playbook.md`. It is a promise the founders
 * have to keep, so it says business days and nothing faster.
 *
 * No phone number and no office address: neither is a fact we have — the
 * registered office is still unsettled (`docs/legal/README.md`), and inventing
 * either would be exactly the fabrication CLAUDE.md non-negotiable #1 forbids.
 */
export function ContactDirect() {
  return (
    <Section spacing="lg" aria-labelledby="contact-direct-title">
      <Container
        size="readable"
        className="flex flex-col items-center gap-6 text-center"
      >
        <Reveal className="flex flex-col items-center gap-6">
          <SectionHeading
            align="center"
            eyebrow="Or just write to us"
            title={
              <span id="contact-direct-title">
                One address. A real person reads it.
              </span>
            }
          />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent hover:text-accent-hover text-heading-lg font-medium break-all transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
          <Text size="body-lg" tone="muted" className="max-w-xl">
            We read every one of these ourselves — there&rsquo;s no support
            queue and no auto-responder. Expect a reply within one to two
            business days, including when the honest answer is that we&rsquo;re
            not ready for you yet.
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
