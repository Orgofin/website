# Orgofin Website — Product Requirements Document (PRD)

**Status:** Draft v1 — merged from founder-authored website spec + [`orgofin-idea.pdf`](./orgofin-idea.pdf) (Vision & Strategy Document, June 2025)
**Sources:**

- Founder's original handwritten website requirements (as given in conversation)
- [`orgofin-idea.pdf`](./orgofin-idea.pdf) (business vision, market, product, GTM, moat, and financial narrative)

This document merges both sources into one buildable spec, and grounds every narrative/story requirement in the actual facts, numbers, and language of the vision document — so nobody building this site has to go re-derive the business case from the PDF. Sections flagged **[FROM PDF]** are new content pulled in that wasn't in the original website spec. Sections flagged **[GAP]**, **[CONFLICT]**, **[WEAK]**, or **[OPPORTUNITY]** are analysis, not requirements — see Sections 18–22 for the consolidated list.

---

## 1. Objective

Build a **world-class, production-ready company website** for Orgofin — not a traditional SaaS landing page.

It should feel like Apple introducing the iPhone, OpenAI introducing ChatGPT, or Linear introducing a new way of building software.

The site must communicate:

- What Orgofin is
- Why it exists
- The problem with today's enterprise software
- Why Company Brain is the future
- Why Agent-as-a-Service (AGaaS) changes everything
- Why investors should believe in this vision
- Why customers should join the waiting list

The experience should tell a story, not look like a marketing page.

**[FROM PDF] One-line vision to anchor every page:**

> "Orgofin is the unified Company Brain and Agent-as-a-Service (AGaaS) platform that replaces the fragmented SaaS stack with a single intelligence layer — where AI agents operate as digital employees across every business function."

**[FROM PDF] Core philosophy the design and copy should never contradict:**

> "Enterprise software is tool-centric. The future is company-centric. Orgofin does not build tools — it builds the brain that makes tools obsolete."
> "Every competitor builds products and then tries to connect them. Orgofin builds the brain first, and the products emerge from it."

---

## 2. Primary Audience

Three audiences, each with a distinct conversion goal:

### Investors

Convince them:

- This is a category-defining company (not incremental SaaS #46)
- The market opportunity is enormous
- The technical vision is credible
- The founders understand the problem deeply

**[FROM PDF] Data this audience needs to see somewhere on the site** (see Section 3 for full figures): TAM/SAM/SOM, unit economics trajectory, competitive teardown, the 6 stated moats, and the "why now" timing argument. None of this was in the original chapter list (Section 14) — see Section 21.

### Potential Customers

Make them feel: _"This solves a problem I experience every day."_ → join the waiting list.

**[FROM PDF] ICP to write copy against** (don't write generically — the vision doc is specific):

- Size: 50–500 employees, rapid growth phase
- Industry: Tech/SaaS, IT Services, D2C, Manufacturing, BFSI
- Geography: India (Tier 1 + Tier 2), UK (London, Birmingham, Leicester), USA (Bay Area, NYC, NJ, Texas)
- Current stack: Tally + Excel + Keka/Zoho, frustrated with fragmentation
- Decision maker: Founder/CEO (<100 emp) or CFO + HR Head (100–500 emp)
- Key pain: GST/PF/ESI compliance burden, no unified employee+financial data, paying 5+ vendors
- Willingness to pay: $200–$2,000/mo; ROI story is "saves even 1 FTE of manual work"

### Engineers

Every animation, transition, and interaction should communicate: _"This company builds world-class software."_

---

## 3. Business Context Snapshot **[FROM PDF — NEW SECTION]**

The original website spec had no section grounding the story in real business facts. This section exists so that whoever writes Chapter copy (Section 14) or the Investors page (Section 15) isn't inventing numbers or guessing at positioning.

### 3.1 Why Now (investor urgency argument — currently unused anywhere in the site plan)

- AI has crossed the capability threshold for reliable multi-step autonomous agents.
- India's digitisation wave: GST mandates, DPDP Act, e-invoicing, UPI rails forcing 60M+ SMEs to replace legacy tools.
- Global SMB SaaS fatigue: average mid-market company spends **$3,500/employee/year** on fragmented SaaS.
- Foundation models (GPT-4o, Claude, Gemini) made context-aware agents affordable for the first time.
- Post-Zoho, no India-born player has credibly attempted a full-stack, agent-native enterprise OS.

### 3.2 The Cost of Fragmentation (visceral, quotable numbers for Chapters 1–2)

A typical 200-person Indian SME runs 7+ vendors, 15+ tools, **$52K–$220K/year**, **₹1.5Cr+/year** — with zero unified context. Per-function cost ranges (HR&Payroll $8–24K, Finance $2.4–12K, Sales&CRM $12–60K, Support $6–30K, Collaboration $12–36K, PM $3.6–18K, IT&Security $8–40K) are available if the story wants a "watch the bill grow" moment in Chapter 2.

### 3.3 Market Sizing

> **[CONFLICT — see Section 19.1]** The PDF contains two different TAM tables (p.3 and p.17) with different totals ($405B+/$823B+ vs. $500B+/$998B+) and an extra "DevOps & Dev" category in the second that has no corresponding product suite anywhere else in the document. **Do not publish either table verbatim until this is reconciled with the founders** — pick or ask, don't silently choose.

Directionally safe figures (consistent across both tables):

- Total addressable market: **$500B+ (2025) → ~$1T (2030)**, ~15% CAGR
- SAM (India + UK + US SMB/mid-market, Year 1–3): **~$1.73B**
- SOM: Year 1 $2–5M ARR (250–500 orgs) → Year 3 $20–40M ARR (2,000–4,000 orgs) → Year 5 $100–200M ARR

### 3.4 Unit Economics (investor-credibility material, currently absent from site plan)

| Metric         | Year 1  | Year 3  | Year 5   |
| -------------- | ------- | ------- | -------- |
| ACV            | $4,800  | $12,000 | $36,000  |
| Gross Margin   | 65%     | 72%     | 78%      |
| Payback Period | 18mo    | 12mo    | 8mo      |
| NRR            | 105%    | 115%    | 125%     |
| CAC (blended)  | $1,200  | $2,400  | $3,600   |
| LTV (5-yr)     | $22,000 | $64,000 | $180,000 |
| LTV:CAC        | 18x     | 27x     | 50x      |

### 3.5 Competitive Teardown (completely absent from the current landing-page story)

| Competitor              | Fatal weakness vs. Orgofin                                                |
| ----------------------- | ------------------------------------------------------------------------- |
| Zoho (45+ tools)        | No unified data graph; siloed tools; no real AGaaS layer; weak compliance |
| Salesforce              | $150–300/user; poor India SMB fit; AI is CRM-only                         |
| SAP / Oracle            | ₹50L+ implementation; SMB-hostile; monolithic                             |
| Microsoft 365 + Copilot | Collaboration-only; Copilot is document-centric, not process-aware        |
| Freshworks              | Not truly unified; no Company Brain; no Finance/compliance                |
| Darwinbox / Keka        | HRMS-only; no AGaaS; no Company Brain                                     |
| Rippling                | US-only; expensive; no India compliance                                   |
| HubSpot                 | CRM-only; no unified brain; no India compliance                           |

### 3.6 The Six Moats (defensibility — the direct answer to "what stops a copycat")

1. **Organisational Memory** — the brain learns each org's specific patterns; re-learning cost for a switcher is months.
2. **Data Network Effects** — anonymised cross-customer benchmarks (payroll, GST compliance, attrition) improve agents over time.
3. **India Compliance Depth** — IRP e-invoicing API, PF/ESI challans, Form 16/24Q, Aadhaar e-KYC, DPDP — months of regulatory engineering competitors won't replicate.
4. **Ecosystem Lock-in Without Hostility** — switching cost rises because the brain becomes indispensable, not because of contracts.
5. **Agent Learning Loops** — every executed task (leave approval, reconciliation, ticket resolution) makes agents more accurate over time.
6. **CA/CS Partner Network** — India has 350,000 Chartered Accountants; once embedded in a CA's workflow, the CA becomes a sales channel.

### 3.7 Business Model & Pricing (for reference — see Section 19.3 on whether/how to expose this)

Revenue streams: SaaS subscriptions, AGaaS usage billing (per-agent-task), Agent Marketplace (30% rev share), Professional Services, Compliance & Data Services, Partner Channel revenue share.

Tiers: Starter $99–199/org/mo (100 agent tasks) · Growth $5–8/user/mo (500 tasks) · Business $10–15/user/mo (2,000 tasks) · Enterprise custom/₹15L+ ACV (unlimited) · AGaaS Add-on $0.05–0.10/task.

### 3.8 GTM Phasing (for the Roadmap chapter and Investors page)

Phase 1 (0–12mo): India HRMS wedge — direct + CA/CS partner channel (30% referral commission) + HR consultants + compliance-content SEO + community (NHRD, SHRM India, YourStory/Inc42/Nasscom).
Phase 2 (12–24mo): Finance + CRM cross-sell. Phase 3 (18–36mo): UK & US expansion. Phase 4 (Year 3+): Enterprise & AGaaS upsell.

### 3.9 The Vivid End-State Vignette (ready-made "show don't tell" copy — currently unused)

The PDF's own illustration of the product at maturity (p.27) is stronger than anything currently scripted for Chapter 6 ("AI Agents — show orchestration"). Recommend lifting it directly:

> A CEO wakes up and Orgofin's CEO Intelligence Agent has already: flagged that payroll in Hyderabad rose 11% (traced to 3 new ATS-approved hires last Tuesday); noticed a key enterprise customer hasn't logged a support ticket in 6 weeks and drafted an outreach email; identified 23 days of inventory left on SKU-447 and raised a draft PO; prepared Thursday's board deck from real data; reminded Employee #1042 about overdue POSH training.

### 3.10 Roadmap Horizons (for Chapter 8 + Investors page)

| Horizon                       | Timeline | Milestone                           | Revenue Target |
| ----------------------------- | -------- | ----------------------------------- | -------------- |
| H1: HRMS Wedge                | 0–12mo   | 500+ customers, India               | $2–5M ARR      |
| H2: Full-Stack SMB OS         | 12–36mo  | 3,000+ customers, UK/US live        | $20–40M ARR    |
| H3: AGaaS Platform            | 36–60mo  | Marketplace live, 10,000+ customers | $100–200M ARR  |
| H4: Company Brain as Platform | 5–8yr    | 3rd-party devs, 10,000+ agents      | $500M+ ARR     |
| H5: Enterprise OS             | 8–12yr   | Default mid-market OS globally      | $1B+ ARR       |

---

## 4. Design Philosophy

Avoid generic SaaS templates. No standard Hero + Features + Pricing layout.

The experience should feel: premium, cinematic, futuristic, elegant, minimal, intelligent.

Reference bar: Apple, Stripe, Linear, Arc Browser, Vercel, Anthropic. Not: generic Tailwind landing pages, Bootstrap templates, template marketplaces.

> **[WEAK — see Section 20.4]** Neither source document defines an actual **brand personality/voice** (tone of copy, verb choice, sentence rhythm). "Premium, cinematic, futuristic" describes visual/motion direction, not writing voice. Needs a short brand-voice note before copywriting starts, or every chapter risks reading like disconnected ad copy.

---

## 5. Technical Requirements

Production-grade architecture:

- Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- Supabase (waiting list, newsletter, contact forms, analytics events)
- Vercel (hosting/deployment)
- ESLint, Prettier, Husky, GitHub Actions

Frontend-first architecture. **Do not build a dedicated backend yet.** Architecture must allow future migration to NestJS/Go without changing the frontend.

> **[GAP — see Section 18.6]** "Admin should be able to export the waiting list" (Section 11) and "Explore the CMS/manage the Blog" (implied by having a Blog page, Section 15) both imply _some_ admin surface. Supabase's dashboard can satisfy CSV export directly (no custom admin UI required) — confirm that's acceptable before assuming a bespoke admin panel is in scope, since none is listed as a deliverable.

---

## 6. Performance

Lighthouse targets: Performance 95+, Accessibility 100, SEO 100, Best Practices 100.

Requirements: lazy loading, image optimization, code splitting, SSR where appropriate, font optimization, minimal JS, edge deployment, fast first paint.

> **[CONFLICT — see Section 19.2]** Heavy Framer Motion + 3D transforms + parallax + an interactive animated knowledge graph (Chapter 5) are inherently JS- and GPU-heavy. "Minimal JavaScript" and "Performance 95+" are in direct tension with "3D transforms, scroll storytelling, animated graph visualization." Both can't be maximized simultaneously — needs an explicit tradeoff decision (e.g., defer/lazy-load the heaviest chapter, provide a reduced-motion/lite path) rather than treating both as unconditional requirements.

---

## 7. Responsive Design

Support desktop, laptop, tablet, large mobile.

For screens < 320px, show a full-screen premium message instead of a broken layout:

> "Orgofin is best experienced on a larger screen. We're building an immersive experience to showcase the future of enterprise software. Please switch to a tablet or desktop."

> **[REVISED 2026-07-16 — founder decision]** The lockout threshold was originally <390px; the founder directed lowering the supported floor to **320px** (the WCAG 1.4.10 reflow width) so iPhone SE/Mini (375px) and compact Androids (360px) get the full site — resolving the Section 20.1 risk and Section 22 question 2. All routes were audited overflow-free at 320/360/375px when the floor changed; the lockout now applies only below 320px.

---

## 8. Theme System

Light Mode and Dark Mode. Not standard black/white — an original Orgofin color system: white + blue base, elegant gradients, premium neutral colors, soft glows, glass effects where appropriate.

The palette should become identity, the way Claude's warm tones, ChatGPT's green, Linear's dark purple, and Apple's neutral elegance are identity.

> **[GAP]** No actual palette (hex values, gradient stops, glow parameters) exists in either source document — this is a design-system decision, not a content decision, and should be resolved as its own deliverable (e.g., via the `dataviz`/design-system process) before any component work starts.

---

## 9. Animation Philosophy

Animations must feel meaningful — no random floating elements. Use Framer Motion, smooth scrolling, staggered reveals, parallax, 3D transforms, scroll storytelling, section transitions, page transitions. Everything intentional.

(See Section 6's flagged tension with the 95+ performance target.)

---

## 10. Analytics

Implement GA4. Requirements: explain what GA4 is and why it matters, show property setup, configure and integrate into Next.js. Track: Page Views, Waiting List Signups, CTA Clicks, Scroll Depth, Section Views, Theme Changes, Outbound Links, **Investor PDF Downloads**, **Demo Requests**, Future product interest. Architecture must be production-ready and privacy-conscious.

> **[GAP — see Section 18.4, 18.5]** Two tracked events have no corresponding feature anywhere in this spec:
>
> - **"Investor PDF Downloads"** — there is no investor deck/one-pager/data-room feature defined to download in the first place. See Section 15 for the proposed fix (Investor Data Room page).
> - **"Demo Requests"** — the only defined CTA anywhere in the plan is "Join Waiting List" (Chapter 10). There's no "Request a Demo" form/page/CTA specified. Either add the feature or drop the tracked event.

> **[OPPORTUNITY]** "Privacy-conscious" analytics sits awkwardly next to a company whose entire brand thesis is India DPDP Act / GDPR / CCPA compliance rigor (PDF §5.8, §10 Moat 3). The site itself should visibly practice what Orgofin sells — proper cookie consent banner, documented data retention for waitlist PII, and a plain-language "how we use your data" note would double as proof-of-competence for both the investor and customer audiences, not just a legal checkbox. Not currently specified anywhere.

---

## 11. Waiting List

Highest priority — purpose: show investors real users are interested before launch.

Store: Name, Email, Company, Role, Country, Company Size, Products Interested In, Optional Notes.

Signees receive: Early Access, Beta Invitations, Founder Updates, Lifetime Discounts, Priority onboarding.

Admin should be able to export the list. Use Supabase.

> **[OPPORTUNITY — see Section 21.3]** The PDF states H1's own success milestone is "500+ customers" and the explicit stated purpose of this waitlist (per this same section) is proving investor demand pre-launch. Yet nothing in the landing-page story (Section 14) surfaces the waitlist count back to visitors — e.g., a live/animated counter, or "join 400+ founders already on the list." This is a free, high-leverage piece of social proof for exactly the investor narrative the site is trying to build, and it's currently unused.

---

## 12. SEO

Production SEO: Open Graph, Twitter Cards, robots.txt, sitemap, structured data, canonical URLs, metadata, dynamic OG images, Schema.org, rich snippets.

---

## 13. Accessibility

Keyboard navigation, screen reader support, focus states, ARIA labels, reduced-motion support, proper contrast, semantic HTML, WCAG AA compliance.

> Reduced-motion support here directly interacts with the Section 6/9 performance-vs-animation tension — the reduced-motion path is also the natural performance-safe path and should be designed as one thing, not two.

---

## 14. Landing Page Story

Narrative flow instead of Hero/Features/Pricing. Each chapter below is the original founder-authored beat, annotated with the specific PDF material that should ground its copy — and the two chapters that are recommended additions.

### Chapter 1 — The World Today

Show disconnected SaaS, fragmented tools, duplicated work, context switching, lost knowledge.
**Ground it with:** the 10 Core Failures list (siloed data, no organisational memory after attrition, fragmented per-tool AI copilots, brittle Zapier-style integrations, duplicate data entry, 30–40% context-switching tax, compliance gaps, slow cross-system decisions, lock-in without network effects, ₹1.5Cr+/yr cost).

### Chapter 2 — The Hidden Cost

Visualize HRMS, CRM, Accounting, Support, Chat, Email, Projects — all disconnected. Show the pain.
**Ground it with:** the per-function cost table (§3.2) — concrete dollar ranges per tool make this land harder than an abstract diagram.

### Chapter 3 — There Must Be A Better Way

Transition. Everything converges.

### Chapter 4 — Introducing Company Brain

Centerpiece. No paragraphs — visual, interactive, animated, beautiful.
**Ground it with:** the plain-language translation problem flagged in Section 20.5 — "Company Brain" and "AGaaS" need a one-sentence plain translation here for the customer audience, not just technical framing for engineers.

### Chapter 5 — Visualize the Company Brain

Animated graph: Employees, Projects, Invoices, Customers, Documents, Knowledge, Agents — everything connected.
**Ground it with:** the entity-graph description from the vision doc — "Employee A approved Invoice B for Project C billed to Customer D" is a ready-made concrete example of cross-entity reasoning to animate literally.

### Chapter 6 — AI Agents

Visualize HR Agent, Finance Agent, Sales Agent, CEO Agent working together; show orchestration.
**Ground it with:** the CEO Intelligence Agent vignette (§3.9) — use it verbatim or near-verbatim as the payoff moment of this chapter instead of a generic "show orchestration" abstraction.

### Chapter 7 — Enterprise OS

Old: 20 disconnected apps. New: One Company Brain.
**Ground it with:** the $52K–$220K/yr / ₹1.5Cr+ figure again as the "old" side's price tag, and the "tool-centric vs. company-centric" core-philosophy line (Section 1) as the closing statement of this chapter.

### Chapter 7.5 — Why We Win _(recommended new chapter — see Section 21.1)_

Currently no chapter addresses competition or defensibility at all — a direct gap against the stated investor goal in Section 2. Recommend a short, visual "why not Zoho / Salesforce / SAP" beat plus 2–3 of the Six Moats (§3.6), specifically Organisational Memory and India Compliance Depth, since those are the hardest to dismiss as "just an AI wrapper."

### Chapter 8 — Roadmap

Show HRMS → Books → CRM → Desk → Workspace → Analytics → Company Brain → Agent Marketplace → Enterprise OS.
**Ground it with:** the Roadmap Horizons table (§3.10), including revenue targets — turns a qualitative feature list into the same glide-path investors expect to see in a deck.

### Chapter 8.5 — Why Now _(recommended new chapter — see Section 21.2)_

The single strongest, most time-bound investor argument in the source material (§3.1) is currently unused anywhere on the site. Recommend inserting it either as its own beat before the Roadmap, or folded into the Vision chapter's opening.

### Chapter 9 — Vision

Final emotional section: "The Operating System for Every Company." The 10-year vision.

### Chapter 10 — Waiting List

Strong CTA: Join Early Access. Become part of the future.
**See §11's opportunity note** — consider surfacing a live signee count here as investor-facing social proof, not just a form.

---

## 15. Additional Pages

Original list: About, Vision, Company Brain, Products, Careers (Coming Soon), Blog, Investors, Privacy Policy, Terms, Contact.

> **[GAP — see Section 18.1, 18.2]** Two pages are missing that both source documents independently point to as necessary:
>
> - **Team / Founders** — absent from the page list _and_ absent from the PDF itself (flagged separately as a business-doc gap). Investor audience (Section 2) weighs team credibility heavily; a category-defining pitch with no visible founders is a red flag, not a stylistic choice.
> - **Investor Data Room / Downloads** — needed to make the "Investor PDF Downloads" analytics event (Section 10) mean anything. Could be as simple as a gated section on the existing "Investors" page (email-gated download of a one-pager, tracked via the same GA4 event), rather than a full separate page.

> **[GAP]** No "Request a Demo" page/CTA exists anywhere, despite it being a tracked analytics event (Section 10). Either fold a lightweight "Talk to us" form into the Contact page and point the same event at it, or drop the event.

---

## 16. Developer Experience

Production-quality codebase: clean architecture, reusable components, feature folders, strict TypeScript, testing-ready, scalable, documented, maintainable. No technical debt.

---

## 17. Final Deliverable

A production-ready, fully responsive site with premium animations, waiting list system, Supabase integration, GA4 integration, SEO optimization, accessibility compliance, Vercel deployment, CI/CD via GitHub Actions, clean documentation — polished enough to confidently show investors, early customers, and future team members.

---

## 18. Missing Features (consolidated)

1. **Team / Founders page/section** — absent from both the website page list and the PDF itself. High priority for investor credibility.
2. **Investor Data Room / gated deck download** — implied by the "Investor PDF Downloads" analytics event but never specified as an actual feature.
3. **Demo Request CTA/form** — implied by the "Demo Requests" analytics event but never specified.
4. **Competitive positioning content** — the PDF's entire Section 7 (competitor teardown) and Section 10 (moats) have no home anywhere in the 10-chapter story or the page list.
5. **Newsletter signup as a distinct feature** — mentioned once under "Supabase usage" (Section 5) and implied by "Founder Updates" (Section 11), but never specified with its own fields/flow the way the waiting list is.
6. **Admin/export mechanism** — "Admin should be able to export the waiting list" (Section 11) has no defined interface; likely fine via Supabase's own dashboard, but that decision isn't made explicit anywhere.
7. **Cookie consent / data-usage disclosure** — required for the analytics + waitlist PII collection described, and doubly important given Orgofin's own compliance-first brand positioning (see Section 10 opportunity note).
8. **Multi-geography narrative** — India → UK → US phased GTM (PDF §9) and the specific ICP city list (PDF §"Ideal Customer Profile") have no representation anywhere in the story chapters, despite geography being central to the go-to-market plan.

## 19. Conflicting Requirements (consolidated)

1. **TAM figures.** Two different TAM tables in the PDF ($405B+/$823B+ vs. $500B+/$998B+, with a "DevOps & Dev" category that appears in only one). Whichever number ends up on the Investors page or in Chapter 8, it must be reconciled with the founders first — do not silently pick one.
2. **"Minimal JavaScript" / Performance 95+ vs. cinematic 3D/parallax/animated-graph requirements.** Both are stated as hard requirements (Sections 6 and 9) but are architecturally in tension. Needs an explicit tradeoff (e.g., a reduced-motion/lite rendering path for the Company Brain graph chapter) rather than assuming both can be maximized.
3. **No Pricing page vs. a fully-specified pricing model in the PDF.** The website spec explicitly avoids a "Hero + Features + Pricing" template and lists no Pricing page in Section 15/Additional Pages, yet the PDF has a complete tiered pricing table (§3.7) that a genuinely interested prospective customer will want to find. This may be an intentional pre-launch choice (waitlist-only, no self-serve pricing yet) — but it should be a stated decision, not an accidental omission. See Section 22.
4. **Roadmap-as-future vs. MVP-as-already-built.** The PDF's own appendix (p.28) states V1 Status is "MVP" with several modules (HRMS Core, Payroll, Attendance, Shifts, Mail, Chat, Books, e-Invoice, Sign) already at that stage, while the website's Chapter 8 frames the same modules purely as a forward-looking "Roadmap." If those modules genuinely exist today, the copy should say so — "available now" is a stronger investor and customer signal than "coming soon." If they don't yet exist in a demonstrable form, the PDF's "MVP" label is itself optimistic and worth flagging back to the founders (this is a business-doc issue, not just a website-copy issue). — **Resolved 2026-07-22 (founder statement): nothing is publicly available.** Orgofin has no shipping products; **HRMS is in active development** and every other suite is roadmap/vision. The site must not say "available now" for any suite — `/products` and [`copy.md`](./copy.md) §3 now badge HRMS _In development_ and all others _On the roadmap_. This reverses the earlier "Available Now" framing the copy deck had adopted; the PDF's "MVP" labels are treated as optimistic/aspirational, not as live-availability claims.

## 20. Weak Messaging (consolidated)

1. **Small-mobile lockout risk.** Given India is the lead market and mobile-first browsing dominates there, excluding <390px visitors entirely (Section 7) cuts against reaching exactly the audience segment the GTM plan targets. Worth an explicit founder decision, not a design default. — **Resolved 2026-07-16:** founder lowered the floor to 320px (Section 7); only sub-320px screens see the lockout.
2. **"Why Now" argument is unused.** The single most specific, time-bound, and credible investor argument in the source material (AI capability threshold, India digitisation wave, $3,500/employee SaaS fatigue stat, foundation model cost curve, "no India-born full-stack player post-Zoho") has no home anywhere in the current 10-chapter story.
3. **Competitive positioning is unused.** "The Fundamental Difference" one-liner ("every competitor builds products and connects them; Orgofin builds the brain first") is one of the strongest lines in the whole document and appears nowhere in the site plan.
4. **No defined brand voice.** "Premium, cinematic, futuristic" (Section 4) describes visual/motion direction only. There's no guidance on sentence rhythm, formality, or verb choice for actual copywriting — risk of each chapter reading like disconnected ad copy from different writers.
5. **Jargon risk on "Company Brain" / "AGaaS."** Both terms are used as proper nouns throughout with no plain-language translation planned for the customer audience (vs. the investor/engineer audiences, who may tolerate the jargon more readily). Chapter 4 needs an explicit one-sentence "in plain English" moment.

## 21. Opportunities to Improve the Investor Story (consolidated)

1. **Add a "Why We Win" chapter** (proposed Chapter 7.5) surfacing the competitive teardown and 2–3 of the Six Moats — directly answers the standard VC objection ("what stops someone from copying this in 6 months?"), which nothing in the current plan addresses.
2. **Add a "Why Now" chapter** (proposed Chapter 8.5) using the five timing arguments verbatim from the PDF — this is ready-made, high-quality investor copy that's currently sitting unused in a PDF nobody visiting the site will ever read.
3. **Turn the waiting list into visible social proof**, not just a private Supabase table — a live/animated signee counter or "N founders already on the list" directly serves the PDF's own stated purpose for the waitlist ("show investors that real users are interested before launch").
4. **Surface TAM/SAM/SOM and the unit-economics trajectory visually** (§3.3, §3.4) — likely as an Investors-page centerpiece — rather than leaving them absent from the site entirely, since a category-defining pitch without a market-size moment is incomplete for this audience.
5. **Use the Roadmap Horizons revenue targets** ($2–5M → $20–40M → $100–200M → $500M+ → $1B+ ARR) alongside the qualitative Chapter 8/9 roadmap, giving investors a concrete glide path instead of only aspirational language.
6. **Mention the CA/CS partner network** (350,000 Chartered Accountants as a distribution moat) somewhere investor-facing — it's one of the more India-specific, hard-to-copy go-to-market angles in the entire document and is currently invisible on the site.

## 22. Open Questions / Decisions Needed Before Build

These are decisions for the founders, not implementation details — flagging so they aren't made silently by whoever builds this:

1. Which TAM table (or reconciled figure) is canonical for public/investor-facing use? — **Partially resolved 2026-07-14:** founder approved publishing the §3.3 directionally-safe headline figures ($500B+ → ~$1T, SAM ~$1.73B, SOM targets) and the §3.4 unit-economics table on `/investors`; the per-category TAM breakdown stays unpublished until the two source tables are reconciled (see §19.1 and `copy.md` §6).
2. Is excluding <390px visitors an acceptable tradeoff given India is the lead market and likely mobile-heavy traffic? — **Resolved 2026-07-16:** no; the founder lowered the supported floor to 320px (see §7).
3. Is the total absence of a Pricing page intentional for this pre-launch phase, or an oversight?
4. Are the MVP-status modules listed in the PDF appendix actually functional today — should the site say "live" rather than "roadmap" for those? — **Resolved 2026-07-22 (founder statement): no.** Nothing is publicly available; HRMS is in active development, everything else is roadmap. The site says "In development" (HRMS only) / "On the roadmap" (all others), never "live"/"available now" (see §19.4 and `copy.md` §3).
5. Who are the named founders/team members to feature, and what can legally/comfortably be disclosed pre-funding?
6. What exactly should the Investor Data Room gate on (email capture? accreditation self-attestation? nothing?) before releasing deck/data? — **Resolved 2026-07-15 (user-approved from a compared recommendation): email-gated.** Name/firm/email form → instant access, files served via time-limited signed URLs (not public paths). Rationale and the two governing disciplines (content discipline: only competitor-safe collateral goes in, diligence-grade material stays in founder-controlled DocSend; signed-URL delivery closes hotlinking) are recorded in the backlog E11.1.4 status. Verified access and manual approval were considered and rejected for this stage (infra cost / journey-breaking friction respectively); upgrade path to magic-link verification stays open behind the same form.
