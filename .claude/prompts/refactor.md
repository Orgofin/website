# Prompt Template: Refactor

> **Purpose:** A starting template for requesting a refactor, keeping it separate from feature/behavior changes per the repository's workflow rules.
> **Applies to:** whoever (human) is about to ask Claude to restructure existing code without changing its behavior.

---

## Template

```
Refactor [component/area] to [goal — e.g., "extract shared logic," "fix tier violation," "reduce duplication"].

Confirm scope: this changes structure, not behavior. If behavior needs to change too, that's a separate PR (per .claude/context/workflows.md).

Convention check: does this refactor change a documented convention (component tier, folder structure, naming)? If yes, update the relevant .claude/context/ file in the same change — a refactor that silently establishes a new pattern without documenting it is incomplete.
```

## Notes

- The most common refactor triggers to watch for: a component that grew business logic it shouldn't have for its tier (see `frontend.md` §2), or duplicated content that should have used the `variant="teaser"|"full"` pattern (`frontend.md` §3) from the start.
- Never bundle a refactor into a feature or bugfix PR — see `.claude/context/workflows.md` "How to Refactor."

## Current Status

Template only — no code exists yet to refactor.

## TODO

None.

## References

- [`.claude/context/workflows.md`](../context/workflows.md)
- [`.claude/context/frontend.md`](../context/frontend.md) §2, §3

## Related Documents

- [`bugfix.md`](./bugfix.md)
- [`component.md`](./component.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
