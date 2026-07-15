import Link from "next/link";

import { DataRoomGate } from "@/components/forms/DataRoomGate";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Investor Data Room",
  description:
    "The deck and one-pager behind the numbers on this site — shared with investors, not published.",
  path: "/investors/data-room",
  noindex: true,
});

/**
 * Investor Data Room (E11.1.3) — gated per the E11.1.4 decision: email-gated
 * with instant unlock, files served as time-limited signed URLs. Copy per
 * `docs/product/copy.md` §7 (revised 2026-07-15 with the decision). Ships
 * `noindex, nofollow` and is disallowed in robots.ts; deliberately absent from
 * the sitemap and header nav — its door is the /investors CTA. Not a separate
 * layout: a gate inside the normal marketing shell (`frontend.md` §4).
 */
export default function DataRoomPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Section spacing="lg" aria-labelledby="data-room-title">
        <Container size="narrow" className="flex flex-col gap-10">
          <Reveal className="flex flex-col gap-10">
            <SectionHeading
              level={1}
              size="display-xl"
              title={
                <span id="data-room-title">
                  Everything you need to evaluate Orgofin.
                </span>
              }
              subtitle="The deck and one-pager behind the numbers on this site — shared with investors, not published."
            />
            <DataRoomGate className="max-w-xl" />
          </Reveal>

          <p className="text-body-sm text-fg-muted">
            Looking for the public thesis first? It&rsquo;s all on{" "}
            <Link
              href="/investors"
              className="text-accent hover:text-accent-hover underline underline-offset-4"
            >
              the Investors page
            </Link>
            .
          </p>
        </Container>
      </Section>
    </main>
  );
}
