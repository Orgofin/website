# Information Architecture

> **Purpose:** The canonical route/page inventory for the Orgofin website — every URL, its sections, its nav placement, its CTA, and how pages link to each other.
> **Applies to:** anyone (human or Claude) adding, renaming, or removing a route. If a route isn't listed here, it isn't part of the plan — update this document in the same change that adds the route.

Builds on [`docs/product/prd.md`](../../docs/product/prd.md) and [`docs/product/website-strategy.md`](../../docs/product/website-strategy.md). This is IA/planning only — no code.

---

## Responsibilities

Owns: the full route list, per-page section breakdown, header/footer nav structure, per-persona user journeys, internal linking rules, and SEO hierarchy (sitemap priority, canonical rules). Does not own visual styling (`design-system.md`) or page copy (`docs/product/copy.md`) — this is the map; copy and styling fill it in.

---

## 1. Sitemap Tree

```
Home (/)
│
├── Platform
│   ├── Company Brain         (/company-brain)
│   ├── AI Agents / AGaaS     (/agents)
│   ├── Products              (/products)
│   └── Security & Compliance (/security)          [NEW — see note below]
│
├── Vision                    (/vision)
│
├── Investors                 (/investors)
│   └── Data Room             (/investors/data-room)   [gated]
│
├── Partners                  (/partners)              [NEW — see note below]
│
├── Company
│   ├── About                 (/about)
│   ├── Team                  (/team)                  [NEW — see note below]
│   ├── Careers               (/careers)
│   └── Blog                  (/blog, /blog/[slug])
│
├── Contact / Request a Demo  (/contact)
│
├── Waitlist confirmation     (/waitlist/thank-you)
│
└── Legal
    ├── Privacy Policy        (/privacy)
    └── Terms                 (/terms)
```

Three pages beyond the founder's original page list and beyond `docs/product/prd.md`'s original page list — each closes a gap flagged in the PRD:

- **`/security`** — no page previously made the compliance-rigor claim concrete; highest-leverage page for the CFO/HR Head persona.
- **`/team`** — absent from both the website spec and the source business PDF; investor trust depends on visible founders (see `docs/product/prd.md` §18.1 and §22.5 — still open, no founder bios exist yet).
- **`/partners`** — the CA/CS channel is a named moat (350,000 Chartered Accountants) with no page or CTA anywhere in the original plan.

## 2. Navigation (Header)

```
[Logo]   Platform ▾    Vision    Investors    Company ▾        [Join Waitlist]  [☾/☀]
              │                                    │
    Company Brain                              About
    AI Agents                                  Team
    Products                                   Careers
    Security                                   Blog
                                                Contact
```

- **Platform** and **Company** are dropdown clusters; everything else is a flat top-level link.
- **Investors** stays top-level, un-nested — treated as a distinct, high-value audience per `docs/product/website-strategy.md`, not buried in a dropdown.
- **Join Waitlist** is a persistent button, visually distinct from nav links — the one CTA that matters (see §6).
- **Partners** is deliberately _not_ in the primary nav — reached via footer/direct outreach links, not casual discovery.

## 3. Pages & Sections

| Page                                          | Sections                                                                                                                                                                                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Home** `/`                                  | Ch.1 World Today → Ch.2 Hidden Cost → Ch.3 Better Way → Ch.4 Company Brain intro → Ch.5 The Graph → Ch.6 AI Agents (CEO vignette) → Ch.7 Enterprise OS → Ch.7.5 Why We Win → Ch.8 Roadmap → Ch.8.5 Why Now → Ch.9 Vision teaser → Ch.10 Waitlist |
| **Company Brain** `/company-brain`            | Plain-English hero → Entity graph deep-dive → Context Engine → Decision Intelligence → worked example ("why did Bangalore payroll rise 12%?") → CTA                                                                                              |
| **Products** `/products`                      | Suite grid (8 suites) → per-suite anchors, each module tagged **Available** vs **Roadmap** (resolves the MVP-vs-roadmap conflict in `docs/product/prd.md` §19.4) → CTA                                                                           |
| **Security** `/security` _(new)_              | Data residency (India/UK/US) → DPDP/GDPR/CCPA approach → encryption/access model                                                                                                                                                                 |
| **Vision** `/vision`                          | Full 10-year narrative, Windows/iOS analogy, "Enduring Promise"                                                                                                                                                                                  |
| **Investors** `/investors`                    | Why Now → TAM/SAM/SOM → Why We Win/competitors → Six Moats → Roadmap horizons + revenue targets → unit economics → CTA to Data Room                                                                                                              |
| **Investor Data Room** `/investors/data-room` | Gated email capture → deck/one-pager download → optional founder follow-up                                                                                                                                                                       |
| **Team** `/team` _(new)_                      | Founder bios, advisors, "we're hiring" tie-in                                                                                                                                                                                                    |
| **Partners** `/partners` _(new)_              | CA/CS channel pitch, referral commission structure, apply CTA                                                                                                                                                                                    |
| **About** `/about`                            | Origin story, links to Vision + Team                                                                                                                                                                                                             |
| **Careers** `/careers`                        | Premium "coming soon" state, culture teaser, register-interest form                                                                                                                                                                              |
| **Blog** `/blog`                              | Compliance-content SEO engine (PF calculator, TDS calculator, Form 16 generator) — category taxonomy from day one                                                                                                                                |
| **Contact** `/contact`                        | Demo request (primary), general inquiry, partner inquiry redirect                                                                                                                                                                                |
| **Privacy / Terms**                           | Framed with a short trust-building intro, not raw legal boilerplate                                                                                                                                                                              |

## 4. Footer

```
[Logo + one-line mission + social icons]

Platform            Company            Investors           Legal
Company Brain        About              Investors            Privacy Policy
AI Agents            Team               Data Room            Terms
Products             Careers
Security             Blog
                      Contact

──────────────────────────────────────────────────────
© Orgofin   ·   India → UK → USA   ·   [theme toggle]   ·   [Join Waitlist]
```

Exists mainly for crawlability (no orphan pages — every page reachable within one click of the footer) and as the last low-friction shot at the primary CTA. `/partners` is included here even though it's absent from the header nav.

## 5. User Journeys

| Persona             | Path                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| Cold investor       | Home (full scroll) → Ch.7.5/Ch.8.5 → `/investors` → `/team` → `/investors/data-room`                         |
| Founder/CEO in pain | Google "Keka alternative" → `/blog/[compliance-article]` → `/products` (HRMS) → Home → Ch.2 → Ch.10 waitlist |
| CFO/HR Head         | Sent link → skims Home → `/security` (compliance trust check) → `/products` → `/contact` (Request Demo)      |
| Engineer/candidate  | Home (notices build quality) → `/company-brain` → `/careers` → `/team`                                       |
| CA/CS partner       | Outreach email → `/partners` → `/contact` (partner inquiry)                                                  |
| Press/cold visitor  | `/about` → `/vision` → `/team`                                                                               |

Each journey branches off the shared Home spine — never a separate landing experience, per `docs/product/website-strategy.md`'s "one story, not three pitches" principle.

## 6. Internal Linking

- Home Ch.9 (Vision teaser) → deep-links to `/vision` with unique summarized copy, not duplicated text (avoids the SEO duplicate-content issue in §7).
- Home Ch.7.5 (Why We Win) → links to `/investors` for full competitive/moat detail.
- Home Ch.8 (Roadmap) → links to `/products` for full module detail.
- `/products` cross-links to `/company-brain` and `/security`.
- Blog posts link back to the relevant `/products` module and to the Home waitlist CTA — the literal SEO→PLG funnel from the GTM plan, not a generic blog.
- `/investors` links to `/team` and `/investors/data-room`.
- Every page except legal ends on the same waitlist `CTABand` component (see `frontend.md` §3) — one consistent CTA, not a unique one per page.
- Footer links every page to every other page, keeping crawl depth ≤ 2 clicks from Home.

## 7. SEO Hierarchy

- One H1 per page, matching primary intent.
- Flat URLs; exceptions are `/blog/[slug]`, `/investors/data-room`, and (future) `/products/[suite]` once individual suites graduate from anchor-section to full page.
- **Canonical:** `/vision` is canonical for the Vision narrative — Home's Ch.9 must render unique summary copy, not a duplicate block, or it splits the ranking signal.
- Sitemap priority: Home 1.0 → Products/Company Brain/Vision 0.8 → Investors/Blog 0.7 → Team/About/Security 0.6 → legal 0.3.
- Structured data: `Organization` (Home), `Article` (Blog), `BreadcrumbList` (Blog/Products), `JobPosting` (Careers, once real roles exist).
- Blog is the primary long-tail SEO growth engine (PF/TDS/GST calculators) — category taxonomy needs to exist from the first post, not be retrofitted later.

## 8. Future Scalability

- **Products** splits into standalone pages (`/products/hrms`, `/products/books`, `/products/crm`…) as suites move from "Future" to "MVP" status.
- **Developers / Docs** (`/docs`) — reserved nav slot for when the Agent Marketplace opens to third parties (H3 horizon, 36–60mo per the roadmap). Not needed at launch.
- **Marketplace** (`/marketplace`) — aligns with the H3/H4 roadmap horizons.
- **Locale routing** (`/uk`, `/us`) — plan the routing convention now; Phase 3 GTM (Months 18–36) explicitly targets UK/US.
- **Customer stories/case studies** — reserve the slot; no content until post-launch customers exist.
- **Press Kit** — split out of the Investor Data Room once PR volume justifies it.
- **Partners** may split into CA/CS Partners vs. Technology/Integration Partners as the channel matures.
- **Status page** — relevant once the Enterprise motion (H3+) requires uptime transparency.

---

## Design Decisions

The `variant="teaser"|"full"` reuse pattern (see `frontend.md` §3) exists specifically to keep §5's "one story" principle true in code, not just in this document — any future page that duplicates Home content instead of parametrizing a shared component is a violation of this IA, not a stylistic choice.

## Current Status

Planning only — none of these routes exist in code yet.

## Future Improvements

Once `/products` graduates to per-suite pages, this document's §1 tree and §7 URL rules need updating in the same PR — do not let the sitemap drift from the actual `app/` folder structure.

## TODO

- [ ] Decide whether `/agents` is a real standalone route or folds into `/company-brain` — currently listed in the tree (§1) but not detailed in §3's page table. Resolve before implementation.
- [ ] Confirm gating mechanism for `/investors/data-room` (see `docs/product/prd.md` §22.6).

## References

- [`docs/product/prd.md`](../../docs/product/prd.md)
- [`docs/product/website-strategy.md`](../../docs/product/website-strategy.md)
- [`docs/product/copy.md`](../../docs/product/copy.md)

## Related Documents

- [`frontend.md`](./frontend.md)
- [`seo.md`](./seo.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Product/Engineering (TODO: assign a DRI)
