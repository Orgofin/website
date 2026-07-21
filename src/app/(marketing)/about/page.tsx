import {
  AboutHero,
  WhatWereBuilding,
  WhereWeStart,
} from "@/components/sections/about";
import { CTABand } from "@/components/sections/CTABand";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About Orgofin — Why We’re Building the Company Brain",
  description:
    "Orgofin exists because enterprise software stopped serving companies and started fragmenting them. Here’s why we’re building something different.",
  path: "/about",
});

/**
 * About — the origin story (`docs/product/copy.md` §10, IA §3). The single
 * `<h1>` lives in `AboutHero`; the page closes on the shared waitlist
 * `CTABand`.
 *
 * Deliberately three sections, not five: the copy deck's third CTA ("Meet the
 * Team") and the founding-story specifics are business facts nobody has
 * supplied yet. Rather than ship a visibly empty "Our team" block or invent
 * plausible bios, those sections are held out until the facts land — see the
 * TODO in `.claude/context/information-architecture.md` for the exact list of
 * inputs and what each one unblocks (founder bios/photos → a `/team` link
 * here, founding year + registered entity → an origin dateline in
 * `AboutHero`).
 */
export default function AboutPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <AboutHero />
      <WhatWereBuilding />
      <WhereWeStart />
      <CTABand source="about-waitlist" />
    </main>
  );
}
