# Animation Philosophy

> **Purpose:** The philosophy behind Orgofin's motion — why it exists and when to say no to it. For the actual duration/easing token values, see [`design-system.md`](./design-system.md) §5. For how motion is implemented in code, see [`frontend.md`](./frontend.md) §10.
> **Applies to:** anyone (human or Claude) adding any transition, reveal, or animated visual.

---

## Responsibilities

This file owns the _judgment call_ — should this thing animate, and why. It does not own token values (durations/easings live in `design-system.md`) or implementation (component structure lives in `frontend.md`). If you're choosing a duration in milliseconds, you're in the wrong document.

## The founding principle

The original, and still the test every animation decision should pass:

> Animations should:
>
> - Enhance usability
> - Not distract
> - Be subtle
> - Respect reduced motion preferences
> - Prefer Framer Motion

Everything below is an elaboration of this, not a replacement for it.

## Elaboration

- **No random floating elements.** An animation must be _about_ something — revealing content, indicating a relationship, confirming an action. "It looked cool in isolation" is not a reason to ship it.
- **One signature motion per section.** If a section combines parallax and stagger and a 3D transform simultaneously, that's a defect, not richness — see `design-system.md` §5 principle 3.
- **`prefers-reduced-motion` is not an afterthought toggle.** It's a first-class rendering path — every `motion-cinematic`/`motion-slow` transition has a defined, equally complete reduced-motion equivalent (opacity-only, at `motion-fast` duration). See `frontend.md` §7 and §10.
- **Framer Motion is the only animation library.** Not GSAP, not raw CSS keyframes scattered through components, not a second library for "just this one effect." Consistency of implementation is what keeps 40+ future sections maintainable.
- **The Company Brain graph visualization is the one deliberate exception** — it's a physics/data visualization, not a UI transition, and isn't driven by Framer Motion's transition system (see `frontend.md` §10). Framer Motion still handles its entrance/exit.

## Current Status

Reusable motion primitives are implemented (Phase 10): `LazyMotionProvider`, `FadeIn`, `Slide`/`SlideUp`/`SlideDown`, `Scale`, `Reveal`, `Stagger`/`StaggerItem`, `PageTransition`, and `Hoverable` in `components/motion/`, all reading tokens from `lib/motion/tokens.ts` and routing reduced-motion through the single `useReducedMotion` hook. See [`docs/architecture/frontend-infrastructure.md`](../../docs/architecture/frontend-infrastructure.md). Section signature motions exist across the Home chapters and `/vision`/`/investors` organisms (one per section, via the shared primitives), and the one deliberate exception above is now real: `CompanyBrainGraph` (`components/graph/`, E9.3.2) runs a d3-force assembly + ambient drift outside Framer Motion, with Framer handling only its entrance.

## Future Improvements

Once the first chapter animations are built, consider whether this document needs real examples (screen recordings or Framer Motion code snippets) rather than only prose — revisit after the first implementation pass, not before.

## TODO

- [ ] None currently — this document is complete as a philosophy statement. Token-level and implementation-level TODOs live in `design-system.md` and `frontend.md` respectively.

## References

- [`design-system.md`](./design-system.md) §5 — duration/easing tokens
- [`frontend.md`](./frontend.md) §10 — implementation strategy
- [`accessibility.md`](./accessibility.md) — reduced-motion requirements

## Related Documents

- [`design-system.md`](./design-system.md)
- [`frontend.md`](./frontend.md)

---

**Last Updated:** 2026-07-15 (Current Status refreshed: chapter signature motions + the shipped `CompanyBrainGraph` exception)
**Owner:** Orgofin Design/Engineering (TODO: assign a DRI)
