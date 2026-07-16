import { Footer } from "@/components/layout/Footer";
import { MobileBlockScreen } from "@/components/layout/MobileBlockScreen";
import { Navbar } from "@/components/layout/Navbar";
import { PageShell } from "@/components/layout/PageShell";

// The persistent marketing chrome (E4.3.3): sticky nav, the page content, the
// footer, and the sub-320px lockout — all capped at the ultrawide content width
// by PageShell so the layout never stretches edge-to-edge on large displays.
const WAITLIST_CTA = { label: "Join the Waitlist", href: "/#waitlist" };

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell className="flex min-h-full flex-1 flex-col">
      <Navbar cta={WAITLIST_CTA} />
      {children}
      <Footer />
      <MobileBlockScreen />
    </PageShell>
  );
}
