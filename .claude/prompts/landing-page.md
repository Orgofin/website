# Prompt Template: Landing Page / Marketing Section

> **Purpose:** A starting template for requesting a new marketing page or Home chapter section, so the request carries enough context in one shot instead of requiring back-and-forth.
> **Applies to:** whoever (human) is about to ask Claude to build a new page or section from `docs/product/copy.md` / `.claude/context/information-architecture.md`.

---

## Template

```
Build the [page name / chapter name] section, per:
- Copy: docs/product/copy.md § [section]
- IA/route: .claude/context/information-architecture.md § [section]
- Component tier: this is a [Section/organism] per .claude/context/frontend.md §2

Constraints:
- Use only tokens from .claude/context/design-system.md — no raw hex/px values
- Animation per .claude/context/animations.md — one signature motion, reduced-motion equivalent required
- Voice per .claude/context/branding.md — [confirm tone matches, especially if copy needs adaptation]

Reuse check: does this duplicate a block that already exists elsewhere (e.g., teaser vs. full-page pattern per frontend.md §3)? If yes, parametrize the existing component instead of creating a new one.
```

## Notes

- Always name the exact copy-deck section — don't paraphrase copy from memory, pull it from `docs/product/copy.md` directly.
- If the copy deck doesn't have a section for what's being requested, that's a signal to update `docs/product/copy.md` first, not to improvise copy inline.

## Current Status

Template only — no landing pages have been built yet.

## TODO

None.

## References

- [`docs/product/copy.md`](../../docs/product/copy.md)
- [`.claude/context/information-architecture.md`](../context/information-architecture.md)

## Related Documents

- [`component.md`](./component.md)
- [`animation.md`](./animation.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
