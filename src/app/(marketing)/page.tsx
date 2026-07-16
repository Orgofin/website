import { CTABand } from "@/components/sections/CTABand";
import {
  AgentsVignette,
  BetterWay,
  CompanyBrainIntro,
  CompanyBrainVisual,
  EnterpriseOS,
  HiddenCost,
  Roadmap,
  VisionTeaser,
  WhyNow,
  WhyWeWin,
  WorldToday,
} from "@/components/sections/home";
import { ScrollProgressProvider } from "@/components/sections/home/ScrollProgressProvider";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({ path: "/" });

/**
 * Home — the 10(+2)-chapter cinematic narrative (`docs/product/copy.md` §1, IA
 * §3). Each chapter is a `Section` organism; the single `<h1>` lives in Ch.1
 * (`WorldToday`), and the page closes on the shared waitlist `CTABand` (Ch.10).
 *
 * The chapters share the Home-tree-scoped `ScrollProgressProvider` (E9.1.1),
 * which renders the reading-progress indicator; its nav active-chapter
 * consumer is pending the nav-structure decision (see the provider's doc).
 * Ch.5 mounts the interactive `CompanyBrainGraph` (E9.3.2, lazy/client-only)
 * alongside its static chain equivalent; Ch.6 mounts the static
 * `AgentOrchestrationDiagram` (E9.3.4) below the vignette.
 */
export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <ScrollProgressProvider>
        <WorldToday />
        <HiddenCost />
        <BetterWay />
        <CompanyBrainIntro />
        <CompanyBrainVisual />
        <AgentsVignette />
        <EnterpriseOS />
        <WhyWeWin />
        <Roadmap />
        <WhyNow />
        <VisionTeaser />
        <CTABand source="home-waitlist" />
      </ScrollProgressProvider>
    </main>
  );
}
