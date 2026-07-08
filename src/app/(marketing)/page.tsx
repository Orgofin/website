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
 * Deferred (documented follow-ons, not gaps): the interactive `CompanyBrainGraph`
 * (E9.3.2, blocked on the E9.3.1 library decision) and `AgentOrchestrationDiagram`
 * (E9.3.4) visuals — Ch.5/Ch.6 ship their copy and a static equivalent now; and
 * the Home `ScrollProgressProvider` for nav active-chapter highlight (E9.1.1).
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
