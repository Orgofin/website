# Prompt Template: New Feature

> **Purpose:** A starting template for requesting a new feature (a form, an integration, a new piece of functionality beyond static content).
> **Applies to:** whoever (human) is about to ask Claude to build something with actual logic/state, not just a content section.

---

## Template

```
Build [feature name].

Context:
- Why this exists / what problem it solves: [link to docs/product/prd.md section, or explain]
- Where it lives in the IA: .claude/context/information-architecture.md § [page]
- Data it reads/writes: [Supabase table, or "none yet"]

Constraints:
- Follow .claude/context/coding-standards.md (strict TS, no `any`, named exports, etc.)
- State management per .claude/context/frontend.md §9 — local/form state by default, no global store unless justified
- Never call @supabase/* directly from a component — go through lib/api/* per frontend.md §11
- Accessibility per .claude/context/accessibility.md — especially form label/error/aria-live requirements
- Analytics: does this need a tracked event? Check docs/product/prd.md §10 for the expected event list

Before implementing: explain the plan and flag any assumption (e.g., which Supabase table/columns, whether this needs a new API route).
```

## Notes

- Every new form (waitlist, demo request, partner application, newsletter) should look structurally identical — same validation approach (React Hook Form + Zod), same success/error microcopy pattern from `docs/product/copy.md` §18.
- If the feature seems to need global state, that's worth flagging explicitly per `.claude/context/frontend.md` §9's "no Redux/Zustand/Jotai" stance — don't introduce one silently.

## Current Status

Template only — no features have been built yet.

## TODO

None.

## References

- [`.claude/context/frontend.md`](../context/frontend.md) §9, §11
- [`.claude/context/coding-standards.md`](../context/coding-standards.md)

## Related Documents

- [`component.md`](./component.md)
- [`bugfix.md`](./bugfix.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
