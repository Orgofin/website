import {
  CareersHero,
  CareersInvite,
  CareersManifesto,
} from "@/components/sections/careers";
import { CTABand } from "@/components/sections/CTABand";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title:
    "Careers — We're Not Hiring Yet, But We're Building Something Worth Joining",
  description:
    "Orgofin isn't hiring right now — we're early, and building the Company Brain deliberately. When roles open, the first people through the door will shape the company. Follow the build and hear it here first.",
  path: "/careers",
});

/**
 * Careers (`docs/product/copy.md` §11, IA §2/§3) — a deliberately live page in
 * a "not currently hiring" state, kept for credibility and future growth per
 * the founder brief. It makes no open-role claims and invents no perks,
 * headcount, or team facts (CLAUDE.md non-negotiable #1). The single `<h1>`
 * lives in `CareersHero`; the page closes on the shared waitlist `CTABand`,
 * reframed as the honest "stay connected" channel and source-tagged
 * `careers-waitlist` for attribution — rather than a separate talent-network
 * backend or an invented careers inbox (the public contact email is still a
 * pending founder fact — see Footer).
 */
export default function CareersPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <CareersHero />
      <CareersManifesto />
      <CareersInvite />
      <CTABand
        source="careers-waitlist"
        eyebrow="Stay on our radar"
        title="Be first when the doors open."
        subtitle="No roles to apply for yet — so follow the build instead. Join the waitlist to watch the Company Brain come to life, and you'll hear about opportunities here before anywhere else."
      />
    </main>
  );
}
