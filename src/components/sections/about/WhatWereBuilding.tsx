import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

/**
 * What we're building — bridges the origin story into the thesis, then hands
 * off to `/vision` rather than restating it (IA §6; `/vision` stays canonical
 * for the narrative, so this section summarises and links, never duplicates).
 * Headline is the "fundamental difference" line from `docs/product/copy.md`
 * §1 Ch.7.5; the body is the one-line vision from `docs/product/company.md`.
 */
export function WhatWereBuilding() {
  return (
    <Section spacing="lg" aria-labelledby="about-building-title">
      <Container size="readable" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            title={
              <span id="about-building-title">
                Everyone else connects tools. We started with the brain.
              </span>
            }
            subtitle="A unified Company Brain — where every employee, process, document, transaction, and decision lives in one interconnected graph — and AI agents that work autonomously on top of it."
          />
          <Text size="body-lg" balance>
            Enterprise software was built tool by tool. Orgofin was built brain
            first — the products came after. It launches with an India-first
            HRMS and expands from there into Finance, CRM, Support, and
            Collaboration.
          </Text>
          <div>
            <Button asChild variant="secondary">
              <Link href="/vision">Read our vision</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
