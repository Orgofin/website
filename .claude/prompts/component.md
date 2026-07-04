# Prompt Template: New Reusable Component

> **Purpose:** A starting template for requesting a new primitive, molecule, or organism component.
> **Applies to:** whoever (human) is about to ask Claude to build a component intended for reuse (if it's a one-off page section, use `landing-page.md` instead).

---

## Template

```
Build a [component name] component.

Tier: [primitive / molecule / organism] — per .claude/context/frontend.md §2

Check first:
- Does something like this already exist in .claude/context/frontend.md §3's inventory? If yes, extend/parametrize it instead of creating a new one.
- Does it need a "teaser"/"full" variant (per frontend.md §3's reuse pattern) because it appears in more than one place?

Requirements:
- Props typed explicitly, no anonymous inline prop types (coding-standards.md)
- Styled only from .claude/context/design-system.md tokens
- If interactive: accessibility requirements per .claude/context/accessibility.md (focus ring, keyboard, ARIA)
- If animated: .claude/context/animations.md — one signature motion, reduced-motion equivalent

After building: update .claude/context/frontend.md §3's component inventory table with the new component.
```

## Notes

- The inventory table in `frontend.md` §3 is the source of truth for "does this already exist" — check it before building, update it after.
- A primitive (`components/ui/`) must never import copy content or business logic — if it needs to, it's actually a molecule or organism; reconsider its tier.

## Current Status

Template only — no components have been built yet.

## TODO

None.

## References

- [`.claude/context/frontend.md`](../context/frontend.md) §2, §3

## Related Documents

- [`feature.md`](./feature.md)
- [`refactor.md`](./refactor.md)

---
**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
