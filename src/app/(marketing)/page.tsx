import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CTABand } from "@/components/sections/CTABand";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

// Minimal home: the Chapter 1 opening beat + the waitlist CTA, so the shell and
// the primary conversion are live and visible. The full 10-chapter cinematic
// narrative (copy.md §1) is Epic 9 — this is intentionally not that yet.
export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Section spacing="lg">
        <Container
          size="content"
          className="flex flex-col items-center gap-6 py-8 text-center"
        >
          <Heading level={1} size="display-xl" balance>
            Your company runs on twenty tools that have never met each other.
          </Heading>
          <Text size="body-lg" tone="muted" balance className="max-w-prose">
            Payroll doesn&rsquo;t talk to accounting. Support doesn&rsquo;t talk
            to sales. And no one &mdash; not even your AI copilot &mdash; sees
            the whole picture.
          </Text>
        </Container>
      </Section>

      <CTABand source="home-hero" />
    </main>
  );
}
