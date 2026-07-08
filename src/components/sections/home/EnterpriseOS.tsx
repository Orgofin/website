import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Text } from "@/components/ui/Text";

/**
 * Chapter 7 — Enterprise OS. Copy verbatim from `docs/product/copy.md` §1 Ch.7.
 * Signature motion: an upward reveal; the closing "brain first" line lands last.
 */
export function EnterpriseOS() {
  return (
    <Section spacing="lg">
      <Container size="content" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            title="Stop paying for twenty apps. Start running on one brain."
            subtitle="Old way: Tally + Zoho + Keka + Slack + Jira, none of them speaking the same language. New way: Orgofin."
          />
          <Text size="body-lg" tone="muted" balance className="max-w-prose">
            Enterprise software was built tool by tool. Orgofin was built brain
            first — the products came after.
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
