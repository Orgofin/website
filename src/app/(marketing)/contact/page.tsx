import {
  ContactChannels,
  ContactDirect,
  ContactHero,
} from "@/components/sections/contact";
import { CTABand } from "@/components/sections/CTABand";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact — Talk to the Orgofin Team",
  description:
    "Tell us what's broken in your current stack and we'll answer honestly. One address for product questions, investor enquiries, partnerships, press and data requests.",
  path: "/contact",
});

/**
 * Contact (`docs/product/copy.md` §13, IA §2/§3). Two decisions shape this page
 * and both are recorded rather than assumed (founder, 2026-07-25):
 *
 * 1. **No form.** The deck specified one; it would have been a third PII
 *    collection point requiring a table, migration and privacy-page change, and
 *    would sit broken in production until that migration was applied. Routing
 *    by pre-filled `mailto:` subject does the same job on day one and stores
 *    nothing new — see `ContactChannels`.
 * 2. **No "Request a Demo".** The deck's CTA promises a demo of software that
 *    is not publicly available (founder statement 2026-07-22 — the same fact
 *    that removed "available now" from `/products`). The page offers a
 *    conversation, which is a thing we can actually deliver.
 *
 * The single `<h1>` lives in `ContactHero`; the page closes on the shared
 * waitlist `CTABand`, source-tagged `contact-waitlist` for attribution.
 */
export default function ContactPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <ContactHero />
      <ContactChannels />
      <ContactDirect />
      <CTABand
        source="contact-waitlist"
        eyebrow="Not ready to write yet?"
        title="Follow the build instead."
        subtitle="Join the waitlist and watch the Company Brain come together — early access, founder updates, and the first look when the HRMS ships."
      />
    </main>
  );
}
