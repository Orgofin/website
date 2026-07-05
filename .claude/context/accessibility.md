# Accessibility Requirements

> **Purpose:** The accessibility rules that apply to every piece of UI, stated as checkable requirements rather than a general goal. For implementation mechanics, see [`frontend.md`](./frontend.md) §7.
> **Applies to:** anyone (human or Claude) building or reviewing any interactive UI.

---

## Responsibilities

Owns the _requirement_ (what must be true, at what standard). `frontend.md` §7 owns the implementation approach. `design-system.md` §8 owns the specific contrast/sizing values these requirements are checked against.

## Non-Negotiable Rules

- **Target: WCAG 2.1 AA**, Lighthouse Accessibility score of 100 (per `docs/product/prd.md` §6) — not a stretch goal, a merge-blocking CI gate (see `deployment.md`).
- **Contrast:** body text ≥ 4.5:1, large text/UI components ≥ 3:1, checked against the actual background it renders on (a card, not just the page) — see `design-system.md` §8.
- **Focus states:** every interactive element has a visible 2px focus ring. `outline: none` without an equivalent replacement is never acceptable, regardless of how it looks in a hover-only mockup.
- **Touch targets:** minimum 44×44px hit area, even where the visible icon is smaller — pad invisibly, don't enlarge the visible icon.
- **`prefers-reduced-motion` is a first-class rendering path**, not a toggle bolted on after — see `animations.md` and `frontend.md` §7/§10.
- **Color is never the sole indicator of state** — status (success/error/available/roadmap) pairs color with an icon and/or text label.
- **Semantic HTML first.** Real `<button>`/`<a>` elements, headings in document order, ARIA only to fill genuine gaps.
- **The Company Brain graph visualization requires a real accessible alternative** — a visually-hidden, structured text/table description of the same entity relationships, toggleable via a visible control. A canvas/SVG visualization with only an `aria-label` is not sufficient.
- **Keyboard parity:** anything that reveals on scroll-into-view or hover must also be reachable and fully renderable via keyboard navigation alone — a keyboard user who tabs directly to a chapter must see its full content, not a blank pre-animation state.
- **Automated regression:** `@axe-core/react` in development, an axe pass in the Playwright E2E suite in CI — an accessibility regression fails the build the same way a broken test does.

## Current Status

Requirements defined. No UI exists yet to test against them.

## Future Improvements

Once components exist, consider a periodic manual screen-reader pass (VoiceOver/NVDA) in addition to automated axe checks — automated tools catch a meaningful subset of issues, not all of them.

## TODO

- [ ] Wire `@axe-core/react` into the dev build once the first components exist.
- [ ] Add the axe Playwright integration to the CI pipeline (see `deployment.md` TODO).

## References

- [`docs/product/prd.md`](../../docs/product/prd.md) §13
- [`design-system.md`](./design-system.md) §8
- [`frontend.md`](./frontend.md) §7

## Related Documents

- [`animations.md`](./animations.md)
- [`testing.md`](./testing.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
