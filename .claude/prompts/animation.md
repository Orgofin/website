# Prompt Template: Animation / Motion Work

> **Purpose:** A starting template for requesting a new animation, transition, or scroll-driven effect.
> **Applies to:** whoever (human) is about to ask Claude to add or change motion on a page or component.

---

## Template

```
Add [animation description] to [component/section].

Which shared primitive does this use? (.claude/context/frontend.md §10: Reveal / Stagger / Parallax / ChapterTransition, or "none of these — justify a new one")

Tokens: pull duration/easing from .claude/context/design-system.md §5 — do not hardcode a duration/easing value inline.

Reduced-motion equivalent: [describe the opacity-only fallback — this is not optional, see .claude/context/animations.md]

Signature-motion check: does this section already have one animated idea? If yes, this addition may violate the "one signature motion per section" rule (design-system.md §5 principle 3) — flag it rather than stacking effects.
```

## Notes

- The Company Brain graph is the one exception to "use a shared Framer Motion primitive" — it's a physics/data visualization, not a UI transition (see `frontend.md` §10).
- If a genuinely new motion primitive seems needed, propose adding it to `components/motion/` and documenting it in `frontend.md` §10 — don't write one-off Framer Motion code inline in a section component.

## Current Status

Template only — no animations have been built yet.

## TODO

None.

## References

- [`.claude/context/animations.md`](../context/animations.md)
- [`.claude/context/design-system.md`](../context/design-system.md) §5
- [`.claude/context/frontend.md`](../context/frontend.md) §10

## Related Documents

- [`component.md`](./component.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
