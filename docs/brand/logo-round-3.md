# Orgofin — Logo Round 3 (8 new directions)

> **Purpose:** A third, focused round of **original** logo directions, prompted by the founders' dissatisfaction with the currently shipped mark (Round-2 "Eclipse", the F-in-a-disc — see [`logo-explorations.md`](./logo-explorations.md) #07, live in `src/components/layout/Logo.tsx`). This round does **not** rehash the earlier 19; every concept here is new, and pushes harder toward the restraint of Anthropic / OpenAI / Stripe / Linear / Notion — taking their _design philosophy_, never their appearance.
> **How to view:** open [`round-3/preview.html`](./round-3/preview.html) in a browser — all 8 rendered as lockup, monochrome, app icon, and 32/16px favicons, on light and dark. Individual marks are in [`round-3/`](./round-3/).
> **Classification:** Internal (pre-decision). Proposals only — not an adopted brand.

---

## Responsibilities

Owns the third-round exploration and its per-concept rationale. Does **not** select the final mark (founder decision), own the design tokens ([`.claude/context/design-system.md`](../../.claude/context/design-system.md)) or the brand voice ([`.claude/context/branding.md`](../../.claude/context/branding.md)), or replace the two earlier rounds — it extends them. Each mark is a single `currentColor` SVG on a 48-unit grid, so it recolors and exports to mono/reversed without redrawing (the way a real icon system ships).

---

## Design principles applied (same discipline as Round 2)

- **One idea, one shape.** A viewer should be able to "get" each mark. No composite busyness.
- **Favicon-first & mono-native.** Every mark is checked at 16px and designed in one color; the cobalt gradient is an enhancement, not a crutch.
- **Geometric construction** on a 48-grid from circles, lines, and simple paths — reproducible, scalable, timeless.
- **No finance/AI clichés.** No dollar signs, coins, charts, robots, or generic neural swirls. Trust, intelligence, unification, and autonomy are expressed _abstractly_.

The cobalt gradient (`#3d7fff → #1a4fc4`, matching the shipped logo tokens) and the Geist wordmark in the preview are **placeholders** — decide them alongside the mark and the brand-palette work.

---

## The 8 concepts

### Restraint / single-primitive

**01 · Throughline** — `round-3/r3-01-throughline.svg`

- **Symbolism.** The whole mark is one continuous stroke that closes into an implied **O**, with a single bright node riding the line — an agent at work.
- **Story.** _"Everything your company knows, on one line."_ Forty fragmented tools become one unbroken thread of context; the line has no start and no end — memory that compounds.
- **Construction / motion.** One path; the O lives in negative space. On load, the line _draws itself_ in a single stroke (reduced-motion: static). The traveling dot loops endlessly.
- **Becomes an asset.** The "one line" graduates into a whole brand device — section dividers, loaders, deck underlines, the wordmark's crossbar. _Originality ★★★★ · Simplicity ★★★★ · Scalability ★★★★_

**02 · Seam** — `round-3/r3-02-seam.svg` _(strong app-icon route)_

- **Symbolism.** A single solid tile (the operating system) split by one luminous vertical **seam** — the place where fragmentation resolves into one. Also reads as a doorway into the OS.
- **Story.** _"The seam where forty tools become one."_
- **Construction / motion.** Filled rounded tile with the seam in negative space (fill-rule); the seam pulses like a thinking cursor. Owns the app tile natively (Notion/Linear filled-tile instinct).
- **Becomes an asset.** The most "Enterprise OS" and most Anthropic-restrained mark here; unmistakable at 16px because it is one line of light on a solid form. _Originality ★★★★ · Simplicity ★★★★★ · Scalability ★★★★★_

**03 · Origin** — `round-3/r3-03-origin.svg` _(strongest for iconicity)_

- **Symbolism.** One dominant core, ringed by smaller points emerging from it.
- **Story.** Literally the founding line — _"Build the brain first; the products emerge from it."_ The core is the Company Brain; the outer points are suites and agents coming online.
- **Construction / motion.** Radical minimalism (the OpenAI/Anthropic move toward a single primitive); the core "breathes," an outer point occasionally brightens.
- **Becomes an asset.** Dead-simple, ownable, scales from favicon to billboard, and animates naturally as a "thinking"/loading state. _Originality ★★★★ · Simplicity ★★★★★ · Scalability ★★★★★_

### The agent / intelligence story

**04 · Recur** — `round-3/r3-04-recur.svg`

- **Symbolism.** A continuous cycle wrapping a solid core — the AGaaS loop (observe → act → learn) turning around the Company Brain.
- **Story.** _"A company that never stops learning about itself."_ Autonomy and self-improvement without a literal robot.
- **Construction / motion.** Open ring + arrowhead + core; the ring is a ready-made loading/thinking state.
- **Becomes an asset.** Clean, kinetic, legible small; reads instantly as "always working." _Originality ★★★ · Simplicity ★★★★ · Scalability ★★★★_

**05 · Wildcard** — `round-3/r3-05-wildcard.svg` _(best hidden meaning)_

- **Symbolism.** An asterisk with a solid core. In code, `*` is the wildcard that means _everything / all_.
- **Story.** _"One symbol for every function."_ Exactly Orgofin's promise — one system standing in for every company function. A hidden meaning for the technical audience; a bright north-star intelligence mark for everyone else.
- **Construction / motion.** Six rays from a core; rays can radiate outward on load.
- **Becomes an asset.** Radiant and distinctive at any size; pairs with a confident wordmark. _Originality ★★★★ · Simplicity ★★★★ · Scalability ★★★★_

**06 · Synapse** — `round-3/r3-06-synapse.svg`

- **Symbolism.** Two facing crescents almost meeting, with a spark in the gap — an implied **O** broken only by the moment a connection fires.
- **Story.** _"Where fragmentation becomes connection."_ Intelligence lives in the connections competitors leave open — the product thesis as a glyph.
- **Construction / motion.** Two arcs + a central spark; the spark can pulse.
- **Becomes an asset.** Warm, human, and a superb favicon. _Originality ★★★★ · Simplicity ★★★★ · Scalability ★★★★_

### Structure / enterprise

**07 · Bracket** — `round-3/r3-07-bracket.svg`

- **Symbolism.** A core held inside two brackets — the OS that wraps everything a company runs on. Brackets also read as `[ ]` from code: structured data, one array holding it all.
- **Story.** _"The container that holds the brain."_
- **Construction / motion.** Two brackets + core; the brackets can "close" inward, snapping the company into one place.
- **Becomes an asset.** Enterprise-serious and minimal; strong in mono. _Originality ★★★ · Simplicity ★★★★ · Scalability ★★★★_

**08 · Spine** — `round-3/r3-08-spine.svg` _(minimalist outlier)_

- **Symbolism.** A single load-bearing column (an I-beam of structural steel) — the OS spine every suite and agent rests on.
- **Story.** _"The one column everything stands on."_
- **Construction / motion.** Cap–spine–cap; caps can illuminate top-to-bottom like a system booting.
- **Becomes an asset.** The most Linear-like restraint here. **Caveat:** it reads as an abstract spine, not an O or F, so it leans hardest on the wordmark for the Orgofin tie — included as the minimalist outlier, not a front-runner. _Originality ★★★ · Simplicity ★★★★★ · Scalability ★★★★_

---

## Shortlist & recommendation

For a mark that is **original, dead-simple, and scales forever**, my top four to take into refinement:

1. **03 Origin** — the strongest _iconicity_ route; a single primitive that literally states the founding thesis and animates beautifully.
2. **02 Seam** — the strongest _app-icon / Enterprise-OS_ route; owns the tile and the favicon.
3. **01 Throughline** — the strongest _system_ (a device to use everywhere), and the best pairing partner for either of the above.
4. **05 Wildcard** — the most _distinctive idea_ if the founders want a mark that rewards a second look.

A powerful combination: pick **Origin or Seam as the primary mark**, and use **Throughline's line** as the supporting visual system (dividers, loaders, deck motifs). This is a recommendation — all 8 (and the earlier 19) are provided so the founders can compare and choose.

---

## Next steps (post-decision)

1. Founders review [`round-3/preview.html`](./round-3/preview.html) alongside rounds 1–2 and shortlist 2–3 across all three rounds.
2. Refine the chosen mark with a designer: optical corrections, exact grid, wordmark kerning, locked color/gradient (decide with the palette work).
3. Produce the asset set — `favicon.ico` (multi-size), `favicon.svg`, `apple-touch-icon.png` (180), PWA `icon-192/512.png`, `logo.svg`/`logo.png`, and **`/og/default.png`** — the last two also close launch blocker **B-01** ([production-readiness review](./../launch/production-readiness-review.md)).
4. Replace the shipped Round-2 "Eclipse" mark: update `src/components/layout/Logo.tsx`, `src/app/icon.svg`, `public/logo.svg`, `public/logo-mono.svg`, `public/logo.png`, and `siteConfig` references.

> **Business-fact discipline:** these are proposals. Do not present any as "the Orgofin logo" externally until the founders select and finalize one.

---

## Current Status

8 new exploration marks + a side-by-side `preview.html` delivered 2026-07-22 for founder review, extending the earlier 19 (rounds 1–2) to 27 total directions. The currently _shipped_ mark remains Round-2 "Eclipse" until the founders select a replacement. Ties to launch blocker B-01 (logo/OG assets) and the brand-palette work. SVGs validated as well-formed; visual render is via the same CSS-mask mechanism as the round-2 preview (not yet screenshot-verified in-repo — open the preview to review).

## Future Improvements

- Once shortlisted: animated variants (the line drawing itself, the seam pulsing, the origin breathing, the cycle turning) respecting reduced-motion.
- Full brand guidelines (clear space, misuse, co-branding, motion) after selection.

## TODO

- [ ] Founders shortlist 2–3 concepts across rounds 1–3.
- [ ] Refine + produce the final asset set (unblocks B-01) and swap the shipped Eclipse mark.

## References

- [`round-3/preview.html`](./round-3/preview.html) · [`round-3/`](./round-3/) (8 SVGs)
- [`logo-concepts.md`](./logo-concepts.md) — round 1 (4 concepts) · [`logo-explorations.md`](./logo-explorations.md) — round 2 (15 concepts)
- [`docs/product/company.md`](../product/company.md) — the mission the mark must express.

## Related Documents

- [`.claude/context/design-system.md`](../../.claude/context/design-system.md), [`.claude/context/branding.md`](../../.claude/context/branding.md)

---

**Last Updated:** 2026-07-22
**Owner:** Orgofin Founders (decision) + Engineering (production)
