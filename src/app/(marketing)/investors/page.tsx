import { CTABand } from "@/components/sections/CTABand";
import {
  InvestorsHero,
  MarketSizing,
  RoadmapHorizons,
  SixMoats,
  UnitEconomics,
  WhyNowArgument,
  WhyWeWinTeardown,
} from "@/components/sections/investors";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Investors — Category-Defining Enterprise AI, India-First",
  description:
    "Orgofin is building the Company Brain and Agent-as-a-Service platform for a $500B+ market. See our thesis, market sizing, moats, and roadmap.",
  path: "/investors",
});

/**
 * Investors — the full investor thesis (`docs/product/copy.md` §6, IA §3):
 * Why Now → Market → Why We Win → Six Moats → Roadmap & Targets → Unit
 * Economics → Data Room CTA. Home Ch.7.5's "full competitive picture" link and
 * /vision's "Investor Overview" link both land here (E11.1.2). The single
 * `<h1>` lives in `InvestorsHero`; the page closes on the shared waitlist
 * `CTABand`.
 */
export default function InvestorsPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <InvestorsHero />
      <WhyNowArgument />
      <MarketSizing />
      <WhyWeWinTeardown />
      <SixMoats />
      <RoadmapHorizons />
      <UnitEconomics />
      <CTABand source="investors-waitlist" />
    </main>
  );
}
