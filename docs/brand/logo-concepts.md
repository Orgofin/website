# Orgofin — Logo & Visual Identity Concepts

> **Purpose:** Founder-review proposals for Orgofin's official visual identity — logo, app icon, and favicon — with the strategy behind each. This is a **decision document**: pick a direction, then commission/finalize the chosen mark across all products.
> **Applies to:** founders (decision-makers) and whoever produces the final asset set.
> **Classification:** Internal (pre-decision). Not the final brand — proposals only.
> **How to view:** open [`preview.html`](./preview.html) in a browser to see all four rendered (lockups, app icons, favicon sizes, light/dark). Individual SVGs are in [`concepts/`](./concepts/).

---

## Responsibilities

Owns the logo concept exploration and the brand-strategy rationale for the decision. Does not own the shipped design tokens ([`.claude/context/design-system.md`](../../.claude/context/design-system.md)) or the brand _voice_ ([`.claude/context/branding.md`](../../.claude/context/branding.md)) — the chosen logo should harmonize with both. Note the in-progress brand-palette experiment (cobalt/aurum/indigo) referenced throughout; the palette decision and this logo decision should be made together.

---

## 1. Brand Brief (what the mark must say)

**The strategic trap to avoid:** Orgofin is _not_ a fintech and _not_ a generic "AI startup." A dollar sign, a coin, an upward arrow, or a generic neural-net swirl would actively mislead. The identity must communicate Orgofin's actual, differentiated idea:

> **"Build the brain first; the products emerge from it."** A single, unified **Company Brain** — one interconnected graph of everything a company knows and does — with autonomous **AI agents** operating on top of it.

So the mark should evoke **connection, unification, and intelligence** — a _graph/network_ and a _central core_, not finance and not a literal robot/brain-organ.

**Requirements (from the brief):** unique & memorable · modern/futuristic · minimal & scalable · enterprise-credible · legible as a 16px favicon · works across web, mobile app icon, decks, social, print · India-first but globally premium.

**Design constraints for all concepts:**

- **Reads at 16px.** Every mark is tested at favicon size in the preview. Detail that dies at 16px is cut.
- **One-color safe.** Each works in a single flat color (for embossing, watermarks, dark UI) — the gradient is an enhancement, not a dependency.
- **Geometric, not illustrative.** Constructed from circles/lines on a grid → scalable, reproducible, timeless.
- **Container-friendly.** The app-icon mark sits in a rounded square (`rx=14` on 64) — the iOS/Android/PWA norm.

---

## 2. The Four Concepts

### Concept 1 — **Nexus** (the Company-Brain graph)

_Files: [`concept-1-nexus.svg`](./concepts/concept-1-nexus.svg), [`concept-1-nexus-mark.svg`](./concepts/concept-1-nexus-mark.svg)_

- **Design philosophy.** Depict the Company Brain literally-but-abstractly: six nodes on a ring, each wired to a bright central core. It's a _graph_ — the single most accurate visual metaphor for what Orgofin is (one interconnected data model).
- **Symbolism.** Nodes = employees/processes/documents/transactions; edges = the connections competitors lack; the bright core = the unified intelligence layer. Six outer nodes nod to the **Six Moats** and the multi-suite product (HR, Finance, CRM, …).
- **Color palette.** Cobalt→Indigo gradient (`#3B5BFF → #6E44FF`) on near-black (`#0B1020`). Cobalt = enterprise trust; indigo = intelligence/depth. Optional aurum (`#F4B740`) accent for a single "active" node.
- **Typography.** Geist Semibold (already the site's typeface), tight tracking (`-1`) for a modern, engineered feel. Lowercase-friendly.
- **Favicon concept.** The node-ring on the dark rounded square, white core — distinctive and legible at 16px.
- **App icon concept.** Same mark centered in the rounded square; the graph fills the tile confidently.
- **Strengths.** Most _literally on-message_ (this is a graph company). Highly ownable. Scales well.
- **Drawbacks.** Node-graph marks are having a moment (some AI/data tools use them) — differentiation rests on execution and the ring+core composition. Six nodes is near the detail ceiling at 16px; the provided mark trims accordingly.

### Concept 2 — **Orbit** (brain core + autonomous agents)

_Files: [`concept-2-orbit.svg`](./concepts/concept-2-orbit.svg), [`concept-2-orbit-mark.svg`](./concepts/concept-2-orbit-mark.svg)_

- **Design philosophy.** A solid core with agents orbiting on a dashed ring — the **AGaaS** story: one brain, many autonomous agents working around it.
- **Symbolism.** Core = the Company Brain; orbiting dots = AI agents ("digital employees"); the dashed ring = motion/autonomy. One gold agent = the "active" agent executing a task.
- **Color palette.** Cobalt core (`#2647FF`), cobalt ring, one **aurum** agent (`#F4B740`) — the gold ties to India/premium/ledger heritage without being a finance cliché.
- **Typography.** Geist Semibold, as Concept 1.
- **Favicon concept.** Core + three orbit dots on dark — clean and recognizable small; the gold dot adds a memorable spark of color.
- **App icon concept.** The orbit composition centered; feels dynamic and "alive," fitting an agent product.
- **Strengths.** Uniquely captures the _agents_ dimension (which the pure graph doesn't). The gold accent is distinctive and warm. Implies motion.
- **Drawbacks.** "Orbit/atom" marks are common (Google, React, many). Needs careful execution to avoid looking like a generic tech/atom logo. Dashed ring can shimmer at very small sizes.

### Concept 3 — **Convergence** (many tools → one brain)

_Files: [`concept-3-convergence.svg`](./concepts/concept-3-convergence.svg), [`concept-3-convergence-mark.svg`](./concepts/concept-3-convergence-mark.svg)_

- **Design philosophy.** Tell the _problem→solution_ story in the mark: many faint, fragmented inputs on the left converge into one bright unified node on the right.
- **Symbolism.** The 20–80 disconnected SaaS tools (faint, scattered) unifying into the single Company Brain (bright, solid). It's the elevator pitch as a glyph.
- **Color palette.** Left strands fade (low-opacity cobalt), resolving into a solid indigo/cobalt node — the gradient _is_ the narrative (fragmentation → clarity).
- **Typography.** Geist Semibold.
- **Favicon concept.** Simplified to three converging strands + node (detail reduced for 16px). Reads as "flow into one."
- **App icon concept.** The convergence centered; directional energy pointing to the core.
- **Strengths.** The most _conceptually differentiated_ — no competitor tells the fragmentation story in their mark. Memorable once explained.
- **Drawbacks.** Directional/asymmetric marks are harder to center in a square tile and can feel less "solid" as an app icon. The meaning needs a beat to land (less immediate than a graph or O). Hardest of the four to keep crisp at 16px.

### Concept 4 — **Monogram** (the "O" is a graph) — _recommended default_

_Files: [`concept-4-monogram.svg`](./concepts/concept-4-monogram.svg), [`concept-4-monogram-mark.svg`](./concepts/concept-4-monogram-mark.svg)_

- **Design philosophy.** Build the letter **O** of "Orgofin" as a ring containing a small graph (three connected nodes). The mark _is_ the first letter — so the logo and the wordmark are one system, and the lockup can read as **[O-graph] + "rgofin"**.
- **Symbolism.** The O = the whole company / the container; the graph inside = the Company Brain. Enclosure = "everything in one place" (the Enterprise OS promise).
- **Color palette.** Cobalt→Indigo gradient ring; white graph on the dark app tile.
- **Typography.** Geist Semibold; the mark's stroke weight is tuned to match the wordmark's letterforms so they sit as equals.
- **Favicon concept.** The single strongest favicon of the four — it's a _letter_, instantly legible at 16px, and unmistakably "O for Orgofin."
- **App icon concept.** A filled/enclosed O reads beautifully in a rounded square (letter-in-tile is the most recognizable app-icon pattern — cf. Notion, Linear).
- **Strengths.** Most **brandable and scalable**: doubles as monogram, favicon, and app icon effortlessly; ties letter + symbol + meaning into one; enterprise-serious. Best small-size legibility.
- **Drawbacks.** "Letter-in-a-shape" is a well-trodden pattern — distinctiveness comes from the graph-inside detail, which partially simplifies at 16px (it becomes a clean ring, still clearly an O). Slightly less overt about "AI/agents" than Orbit.

---

## 3. Comparison & Recommendation

| Criterion                  | 1 Nexus | 2 Orbit | 3 Convergence | 4 Monogram |
| -------------------------- | :-----: | :-----: | :-----------: | :--------: |
| On-message (Company Brain) |  ★★★★★  |  ★★★★   |     ★★★★★     |    ★★★★    |
| Communicates _agents_      |   ★★    |  ★★★★★  |      ★★       |     ★★     |
| Uniqueness                 |   ★★★   |   ★★★   |     ★★★★★     |    ★★★★    |
| Favicon / 16px legibility  |   ★★★   |  ★★★★   |      ★★       |   ★★★★★    |
| App-icon strength          |  ★★★★   |  ★★★★   |      ★★★      |   ★★★★★    |
| Enterprise credibility     |  ★★★★   |   ★★★   |     ★★★★      |   ★★★★★    |
| Scalability as a system    |  ★★★★   |   ★★★   |      ★★★      |   ★★★★★    |

**Recommendation: Concept 4 (Monogram) as the primary identity, with Concept 1 (Nexus)'s graph language as the supporting visual system** (for section dividers, loading states, the existing `CompanyBrainGraph`, deck backgrounds). This gives Orgofin the best of both: a rock-solid, scalable letter-mark that owns "O," plus a rich graph motif that carries the Company-Brain story everywhere else. If the founders want the mark itself to shout "AI agents," **Concept 2 (Orbit)** is the alternative primary.

This is a recommendation, not a decision — all four are provided precisely so the founders can choose.

---

## 4. Shared System (applies to whichever wins)

- **Color:** align with the brand-palette experiment on `dev` (cobalt/aurum/indigo). Decide the logo and the palette together so they don't drift. Cobalt as primary, indigo for depth, aurum as the single warm accent.
- **Typography:** **Geist** (already shipped via `next/font`) — keeps the wordmark consistent with the site and avoids a new font dependency. Geist Semibold for the wordmark; consider a licensed display cut only if a distinct wordmark is later desired.
- **Clear space & min size:** reserve clear space = the mark's core diameter on all sides; minimum mark size 16px (favicon) / minimum lockup width ~120px.
- **Monochrome + reversed:** every mark must ship in full-color, single-color (black), and reversed (white) — the SVGs are structured so this is a fill swap.

---

## 5. Next Steps (post-decision)

1. Founders review [`preview.html`](./preview.html) and select a direction (+ palette).
2. Finalize the chosen mark with a designer (optical corrections, exact geometry, kerning of the wordmark).
3. Produce the asset set: `favicon.ico` (multi-size), `favicon.svg`, `apple-touch-icon.png` (180), `icon-192/512.png` (PWA), `logo.svg`/`logo.png`, and the **`/og/default.png`** social image — the last two are also **launch blockers B-01** in the [production-readiness review](../launch/production-readiness-review.md).
4. Replace `src/app/favicon.ico`, add `public/logo.png` + `public/og/default.png`, and update `siteConfig` references.
5. Roll the identity into the deck, social profiles, and (eventually) the product UI.

> **Business-fact discipline:** these are design proposals, not an adopted brand. Do not describe any of these as "the Orgofin logo" externally until the founders select and finalize one.

---

## Current Status

Four concepts delivered 2026-07-18 as viewable SVGs + a preview page, kept local (not committed) for founder review. No direction selected yet. Ties into launch blocker B-01 (missing logo/OG assets) and the open brand-palette experiment.

## Future Improvements

- Once selected: an animated version of the mark (the graph "wiring up") for the site hero / loading state, respecting reduced-motion.
- A full brand guidelines doc (spacing, misuse, co-branding) when the company scales.

## TODO

- [ ] Founders select a concept + palette.
- [ ] Commission final asset set (§5) — unblocks launch B-01.
- [ ] Replace favicon + add logo/OG assets in `public/`.

## References

- [`preview.html`](./preview.html) · [`concepts/`](./concepts/)
- [`.claude/context/design-system.md`](../../.claude/context/design-system.md), [`.claude/context/branding.md`](../../.claude/context/branding.md)
- [`docs/product/company.md`](../product/company.md) — the mission the mark must express.
- [`../launch/production-readiness-review.md`](../launch/production-readiness-review.md) — B-01.

## Related Documents

- [`logo-explorations.md`](./logo-explorations.md) — round 2 (15 concepts) · [`logo-round-3.md`](./logo-round-3.md) — round 3 (8 new concepts, 2026-07-22).
- Memory: theme-and-responsive-initiative (brand-palette experiment).

---

**Last Updated:** 2026-07-18
**Owner:** Orgofin Founders (decision) + Engineering (production)
