import { CTABand } from "@/components/sections/CTABand";
import {
  HrmsLifecycle,
  ProductsHero,
  SuiteGrid,
} from "@/components/sections/products";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Orgofin Products — HRMS, Finance, CRM, and 40+ Modules on One Brain",
  description:
    "Explore Orgofin’s growing suite of modules — from HRMS and Payroll to Finance, CRM, and Compliance — all connected by a single Company Brain, starting with India-first HR.",
  path: "/products",
});

/**
 * Products (`docs/product/copy.md` §3, IA §3) — the canonical home of the
 * eight-suite grid, with Orgofin HRMS (the V1 wedge) shown in depth across its
 * hire-to-retire lifecycle. `/platform`'s `SuitesLayer` is the teaser that
 * deep-links here (IA §7). The single `<h1>` lives in `ProductsHero`; the page
 * closes on the shared waitlist `CTABand`.
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
      <SuiteGrid />
      <HrmsLifecycle />
      <CTABand source="products-waitlist" />
    </main>
  );
}
