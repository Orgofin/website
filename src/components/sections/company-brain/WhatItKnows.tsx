import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Text } from "@/components/ui/Text";

/**
 * What the Brain knows — the six "every X" clauses from `docs/product/copy.md`
 * §2 ("Section — What it knows"), split into their natural list form rather
 * than run together as one paragraph. This is the *canonical* treatment: it
 * moved here from `/platform`'s `CompanyBrainLayer` when this page shipped, and
 * that layer is now a teaser that deep-links back (IA §7, same teaser→canonical
 * split as `SecurityLayer` → `/security`). Signature motion: the clauses
 * stagger in as an accumulating picture.
 */
const WHAT_IT_KNOWS: readonly string[] = [
  "Every employee — role, skills, performance, compliance status.",
  "Every customer — lifecycle, invoices, tickets, contracts.",
  "Every transaction — mapped to cost centers and GST categories automatically.",
  "Every document — searchable by meaning, not just keywords.",
  "Every workflow — who approved what, when, and why.",
  "Every decision — with the reasoning behind it, not just the outcome.",
];

export function WhatItKnows() {
  return (
    <Section spacing="lg" aria-labelledby="company-brain-knows-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="What it knows"
          title={
            <span id="company-brain-knows-title">
              It knows your business the way your best employee would — if they
              never forgot anything.
            </span>
          }
        />
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {WHAT_IT_KNOWS.map((item) => (
            <StaggerItem key={item}>
              <Text size="body-lg" balance>
                {item}
              </Text>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
