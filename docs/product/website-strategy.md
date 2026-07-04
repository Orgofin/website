# Orgofin Website Strategy

**Companion to:** [`prd.md`](./prd.md)
**Purpose:** the layer above the PRD — not *what* to build, but *why* each piece exists and what a visitor needs to feel before they'll act.

---

## 1. Who Actually Visits This Website

The PRD names three audiences (Investors, Customers, Engineers). In practice, traffic arrives with very different context and intent depending on *how* they got here — and strategy has to account for that, not just who they are.

| Segment | How they arrive | Context level | Real question in their head |
|---|---|---|---|
| **Investor (warm)** | Founder outreach, deck follow-up link | High — already knows the pitch | "Does the site match the ambition of the deck, or undercut it?" |
| **Investor (cold)** | Portfolio scout, inbound interest, PR mention | Low — never heard of Orgofin | "Is this a real category or another AI-wrapper deck?" |
| **Founder/CEO (<100 emp)** | LinkedIn, Google ("Keka alternative"), referral | Low-medium, actively in pain | "Will this actually replace what I'm duct-taping together right now?" |
| **CFO/HR Head (100–500 emp)** | Sent the link by a founder/colleague | Medium, analytical | "Is this compliant, safe, and worth the switching risk?" |
| **Engineer (candidate or curious)** | Careers page, HN/Twitter, GitHub | Low-medium, technically skeptical | "Do the people who built this site actually know what they're doing?" |
| **CA/CS partner** *(not in original 3-audience model — surfaced by the PDF's Moat #6)* | Partner outreach, referral | Low | "Can I put my name behind this to my SME clients?" |
| **Cold/forwarded traffic** | Shared link, no prior context | Zero | "What is this, in one sentence?" |

**The gap worth naming:** the PRD's 3-persona model is fine for *design intent* but too coarse for *copy and CTA sequencing*. A cold-forwarded visitor and a warm investor need the story told at completely different speeds — the site's single linear scroll (Chapters 1–10) has to work for someone with zero context in the first 10 seconds, or the customer segment bounces before Chapter 3.

---

## 2. What They Want (per segment)

- **Investors** don't want to be convinced Orgofin is a good idea — decks already do that. They want **evidence this is being executed at category-defining quality**: production polish, technical sophistication, and proof of real demand (waitlist numbers), not slideware translated to HTML.
- **Founders/CEOs in pain** want **recognition, then proof, then a low-risk next step**. They don't want a 10-chapter story on first visit — they want to confirm "this solves my Tally+Excel+Keka mess" within seconds, then decide whether to invest the time.
- **CFO/HR Heads** want **risk reduction**, not inspiration. Compliance depth, data handling, and credibility signals matter more to them than the cinematic graph animation.
- **Engineers** want **craft as proof of competence** — the site itself is the technical writing sample. If the animations stutter or the Lighthouse score is bad, it actively damages the pitch to this audience regardless of copy.
- **CA/CS partners** want **an economic story**, not a vision story — what's the referral commission, how do I explain this to a client, is this reputationally safe.

---

## 3. What Emotions They Should Feel (the arc)

A Head of Product question worth asking here: is this one emotional arc for everyone, or does it fork? **It should be one arc** — the linear chapter story is a strength precisely because it forces one coherent emotional throughline, and the audience-specific payoffs (investor data, demo CTA, careers) branch off *from* that shared spine rather than replacing it.

| Chapter | Emotion | Why it matters |
|---|---|---|
| 1 — The World Today | **Recognition** ("yes, that's my Monday") | Without this, nothing after it lands — it's the hook |
| 2 — The Hidden Cost | **Quiet alarm** ("it costs *how much*?") | Converts vague annoyance into a number worth acting on |
| 3 — There Must Be A Better Way | **Relief / anticipation** | The turn — permission to hope |
| 4 — Company Brain | **Curiosity / "oh, that's clever"** | First genuine "wow," must land in plain language, not jargon |
| 5 — Graph Visualization | **Awe** | This is the engineer-audience payoff moment specifically |
| 6 — AI Agents (CEO vignette) | **Desire** ("I want this running my company") | The only chapter that should make someone imagine owning the product |
| 7 / 7.5 — Enterprise OS / Why We Win | **Trust** | Converts desire into belief it's not hype — this is the investor payoff moment |
| 8 / 8.5 — Roadmap / Why Now | **Urgency** | Without urgency the waitlist ask feels optional, not time-sensitive |
| 9 — Vision | **Inspiration / pride** | Emotional peak — "I want to be associated with this" |
| 10 — Waiting List | **Belonging + momentum** | FOMO converted into an action, not just a feeling |

The failure mode to design against: if Chapter 4–5 (Company Brain/graph) is all wonder and no plain-English translation, the CFO/HR persona disengages right when the site needs to be building their trust, not just dazzling them.

---

## 4. What Story the Website Tells

> **Every company today is quietly bleeding time and money into tools that don't talk to each other — Orgofin is the brain that ends that, starting with the parts of the business (HR, payroll, compliance) that hurt the most, in India first — and you can be early to it.**

This is deliberately **not** three separate pitches stitched together. The investor, customer, and engineer payoffs all sit *inside* the same emotional arc rather than requiring three different landing experiences — the investor believes because the customer's pain is real and specific; the customer trusts it because the technical execution (Chapter 5, the site itself) looks serious; the engineer wants in because the vision (Chapter 9) and craft are both credible.

**Risk flagged in the PRD that directly threatens this story:** if "Company Brain" and "AGaaS" stay jargon through Chapter 4 without a plain-English beat, the story silently forks — engineers and investors follow it, the founder/CFO audience gets lost and the "recognition → relief" arc breaks exactly at its hinge point.

---

## 5. Why Every Page Exists

The 10-chapter scroll is the story. The other pages exist to **serve a specific audience that peels off from the main story with a specific question** — each page should exist because a real visitor needs it, not because "companies have an About page."

| Page | Who it's really for | Why it exists | Primary CTA |
|---|---|---|---|
| **Home (the 10-chapter story)** | Everyone — the shared spine | Builds the one coherent narrative; this is the actual product | Join Waitlist |
| **Vision** | Investors, press, inspired customers | Deeper version of Chapter 9 for people who want to sit with the ambition | Join Waitlist / Read Investors |
| **Company Brain** | Engineers, technical customers, curious investors | Deeper technical/product explanation of Chapter 4–5 for people who scrolled past too fast or want to go deeper before trusting it | Join Waitlist |
| **Products** | Founder/CFO evaluating fit | The only page that behaves like a "normal" SaaS page — concrete module list, because a serious buyer eventually needs to check "does it do X" | Join Waitlist |
| **Investors** | Investors (warm + cold) | Houses TAM/SAM/SOM, unit economics, moats, roadmap horizons (PRD §3) — the numbers a cinematic homepage shouldn't carry but investors need | Access Investor Data Room |
| **Investor Data Room** *(new, per PRD gap)* | Investors only | Gated deck/data download — the actual destination for the "Investor PDF Download" analytics event that currently points nowhere | Request Access (email-gated) |
| **Team / Founders** *(new, per PRD gap)* | Investors primarily, some customers | Investor trust is disproportionately about team; a category-defining pitch with invisible founders reads as a red flag | Connect on LinkedIn / Join Waitlist |
| **Careers (Coming Soon)** | Engineers | Signals ambition to future hires even pre-launch; "coming soon" itself is a credibility/momentum signal if done well | Register Interest |
| **Blog** | SEO-driven founder/CFO traffic, press | This is the PLG/SEO engine explicitly named in the PDF's GTM plan (PF calculator, TDS calculator, compliance content) — it exists to *bring in* the founder/CFO audience, not just inform people already here | Join Waitlist |
| **Contact / Demo Request** *(merge, per PRD gap)* | Founder/CFO with high intent | The only page for someone who's ready to talk now rather than wait | Request a Demo |
| **Privacy Policy / Terms** | CFO/HR Head, compliance-conscious customers | For this specific company, this page is a **trust signal, not boilerplate** — Orgofin's whole pitch is compliance rigor; a sloppy privacy page directly undercuts the product claim | — |

**Notably absent from the current page list, worth raising with the founders:** a **Partners** page for the CA/CS channel (PDF Moat #6, 350,000 Chartered Accountants). It's a named distribution moat with no page, no CTA, and no audience treatment anywhere in the current plan.

---

## 6. Desired Calls to Action

A Head of Product's job here is mostly **restraint** — the biggest risk on a story-driven site is CTA fatigue diluting the one action that actually matters pre-launch.

**The rule:** there is exactly **one CTA that matters right now** — *Join the Waitlist*. Everything else is a variant of it or a deliberate, rare exception.

- **Global/primary CTA (sticky, every page):** *Join the Waitlist* — this is the whole point of a pre-launch site. Resist the urge to add a second competing primary action.
- **Investor-specific exception:** *Access the Investor Data Room* — investors are a small, high-value, already-warm audience who need a different door, not the waitlist form.
- **High-intent customer exception:** *Request a Demo* — for the CFO/HR Head persona who's past "recognition" and wants a conversation now rather than an email list. This should be visually secondary to the waitlist CTA everywhere except the Contact page, where it's the point.
- **Careers:** *Register Interest* — same mechanism as the waitlist (Supabase), different destination list, framed for candidates not customers.
- **Partner (if the Partners page gets built):** *Apply to Become a Partner* — distinct from the waitlist because the conversion event (a CA firm, not an individual prospect) is different.

**What should *not* have its own CTA:** About, Vision, Company Brain, Products, Blog. These are all *belief-building* pages that should funnel back to the same one or two CTAs above — adding a unique CTA per page is the single most common way story-driven sites quietly become confusing.

---

## 7. The One-Line Test

Before shipping any chapter or page, the test to apply: **does this make someone more likely to join the waitlist, request a demo, or trust the investor story — and if we deleted it, would the story still make sense?** Anything that fails that test (a chapter, a page, a stat) is decoration, not strategy, no matter how impressive it looks in isolation.
