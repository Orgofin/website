# Prompt Template: Bug Fix

> **Purpose:** A starting template for reporting/fixing a bug, so the fix addresses the root cause rather than papering over a symptom.
> **Applies to:** whoever (human) is about to ask Claude to fix a defect.

---

## Template

```
Bug: [what's observed] vs. [what's expected]

Where: [page/component/route]
Repro steps: [exact steps]
Scope check: does this affect one instance or a shared component (per frontend.md §3's inventory)? A fix to a shared component should be verified everywhere it's used, not just the reported instance.

Root cause requirement: identify why this happens before proposing a fix — do not reach for --no-verify, disabling a lint rule, or suppressing a type error as the fix unless the rule/type itself is genuinely wrong (and if so, fix the rule, don't suppress it locally).
```

## Notes

- Per `.claude/context/workflows.md`, a fix that reveals a stale/incorrect convention doc should update that doc in the same PR, not just patch the code.
- A bug fix does not need surrounding refactoring — see `.claude/context/workflows.md` "How to Refactor" for why that belongs in a separate PR.

## Current Status

Template only — no code exists yet to have bugs.

## TODO

None.

## References

- [`.claude/context/workflows.md`](../context/workflows.md)
- [`.claude/context/coding-standards.md`](../context/coding-standards.md)

## Related Documents

- [`refactor.md`](./refactor.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
