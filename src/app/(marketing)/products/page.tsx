import { CTABand } from "@/components/sections/CTABand";
import {
  HrmsLifecycle,
  ProductsHero,
  SuiteGrid,
} from "@/components/sections/products";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title:
    "Products — Building the Company Brain, Starting with India-First HRMS",
  description:
    "Orgofin is pre-launch. Our first product, an India-first HRMS, is in active development — the wedge for a single Company Brain that later expands into Finance, CRM, and more. Here's what we're building and what's on the roadmap.",
  path: "/products",
});

/**
 * Products (`docs/product/copy.md` §3, IA §3) — the canonical home of the suite
 * ecosystem. Restructured 2026-07-22 for accuracy (founder correction): Orgofin
 * has **no publicly available products**, so the page now leads with the truth
 * (`ProductsHero`), shows the one product in active development in depth
 * (`HrmsLifecycle` — HRMS, the wedge), then presents the wider suite ecosystem
 * as an honest roadmap (`SuiteGrid`, badged In development / On the roadmap).
 * `/platform`'s `SuitesLayer` is the teaser that deep-links here (IA §7). The
 * single `<h1>` lives in `ProductsHero`; the page closes on the shared waitlist
 * `CTABand`.
 *
 * Only HRMS gets a per-module breakdown — it's the one suite with a documented
 * module list (`.claude/knowledge/hrms.md`); the other seven stay at suite
 * level rather than inventing modules. The copy deck's §3 "Request a Demo" CTA
 * is deferred until `/contact` exists (never-link-a-404, IA §4); tracked in
 * information-architecture.md's TODO.
 */
export default function ProductsPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <ProductsHero />
      <HrmsLifecycle />
      <SuiteGrid />
      <CTABand source="products-waitlist" />
    </main>
  );
}
