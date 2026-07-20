import { CTABand } from "@/components/sections/CTABand";
import {
  AgentsLayer,
  CompanyBrainLayer,
  PlatformHero,
  SecurityLayer,
  SuitesLayer,
} from "@/components/sections/platform";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Platform Overview — One Brain, Infinite Agents, Every Function",
  description:
    "How Orgofin fits together: Company Brain as the unified data layer, autonomous AI agents on top of it, and 40+ modules across eight suites — with India-first compliance underneath.",
  path: "/platform",
});

/**
 * Platform overview — the hub for the Platform nav cluster (IA §2). It is the
 * *map*, not a replacement for the deep-dives: `/company-brain`, `/agents`,
 * `/products`, and `/security` each stay canonical for their own narrative
 * (`seo.md` rule 3), and each layer section here links out to its page as that
 * page ships. Until then this page carries the overview cut of each so the
 * Platform menu leads somewhere real instead of a placeholder.
 *
 * The single `<h1>` lives in `PlatformHero`; the page closes on the shared
 * waitlist `CTABand`.
 */
export default function PlatformPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <PlatformHero />
      <CompanyBrainLayer />
      <AgentsLayer />
      <SuitesLayer />
      <SecurityLayer />
      <CTABand source="platform-waitlist" />
    </main>
  );
}
