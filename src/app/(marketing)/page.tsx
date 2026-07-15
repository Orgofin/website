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
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({ path: "/" });

/**
 * Home — the 10(+2)-chapter cinematic narrative (`docs/product/copy.md` §1, IA
 * §3). Each chapter is a `Section` organism; the single `<h1>` lives in Ch.1
 * (`WorldToday`), and the page closes on the shared waitlist `CTABand` (Ch.10).
 *
 * Deferred (documented follow-ons, not gaps): the `AgentOrchestrationDiagram`
 * (E9.3.4) visual — Ch.6 ships its copy and a static equivalent now; and the
 * Home `ScrollProgressProvider` for nav active-chapter highlight (E9.1.1).
 * Ch.5 mounts the interactive `CompanyBrainGraph` (E9.3.2, lazy/client-only)
 * alongside its static chain equivalent.
 */
export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
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
    </main>
  );
}
