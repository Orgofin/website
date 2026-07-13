import { CTABand } from "@/components/sections/CTABand";
import {
  EnduringPromise,
  VisionHero,
  VisionNarrative,
} from "@/components/sections/vision";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Our Vision — The Operating System for Every Company",
  description:
    "Orgofin’s long-term vision: just as Windows became the OS for the PC, Orgofin is becoming the Operating System for the company itself — one brain, infinite agents.",
  path: "/vision",
});

/**
 * Vision — the canonical home of the vision narrative (`docs/product/copy.md`
 * §5, IA §3). Home's Ch.9 teaser deep-links here and renders unique summary
 * copy, so this page is the canonical URL for the narrative (seo.md rule 3).
 * The single `<h1>` lives in `VisionHero`; the page closes on the shared
 * waitlist `CTABand`.
 */
export default function VisionPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <VisionHero />
      <VisionNarrative />
      <EnduringPromise />
      <CTABand source="vision-waitlist" />
    </main>
  );
}
