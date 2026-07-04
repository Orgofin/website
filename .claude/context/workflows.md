# Workflows

> **Purpose:** How work actually gets done in this repository — git/branch strategy, PR expectations, the task workflow Claude follows, and the rules for when to ask questions versus proceed.
> **Applies to:** anyone (human or Claude) making a change, from a one-line copy fix to a new feature.

---

## Responsibilities

Owns: branch strategy, PR expectations, the step-by-step task workflow, question/uncertainty handling, technical-debt policy, and documentation-synchronization rules. Does not own commit message format (`repository.md`) or CI pipeline steps (`deployment.md`).

## Branch Strategy

Per `README.md`, three long-lived branches:

- **`main`** → production. Never committed to directly.
- **`uat`** → user acceptance testing / staging.
- **`dev`** → active development.

Feature work happens on short-lived branches off `dev`, merged via PR. Promotion flows `dev → uat → main`, never sideways or backwards without an explicit, deliberate revert.

## Pull Request Expectations

- A PR does one thing. A copy fix and a new component are two PRs, not one.
- A PR that changes architecture, design tokens, conventions, or folder structure **updates the relevant `.claude/context/` or `docs/` file in the same PR** — see Documentation Synchronization below. A code change that leaves documentation stale is an incomplete PR, not a follow-up task.
- CI must pass (lint, type-check, tests, Lighthouse gate — see `deployment.md`) before merge; no merging on a red build with an intention to "fix it after."

## The Task Workflow

For any non-trivial task:

1. **Understand the request.** Restate it in your own words if the ask is ambiguous — don't guess silently.
2. **Read the relevant context documents** before writing anything — check `CLAUDE.md`'s index for which `.claude/context/`, `.claude/knowledge/`, or `docs/` files apply.
3. **Explain the plan** before implementing anything non-trivial — surface assumptions and risks up front, not after the fact.
4. **Implement incrementally.** Small, reviewable steps over one large undifferentiated change.
5. **Self-review** before presenting work as done — read the diff as if reviewing someone else's PR.
6. **Run quality checks** where applicable (lint, type-check, tests) — don't hand back unverified work.
7. **Update documentation** in the same pass if the change affects architecture, design, conventions, or structure.
8. **Summarize the change and the logical next step** — don't just stop.

## When to Ask Questions

Ask before proceeding when:

- A requirement is genuinely ambiguous and guessing wrong is expensive to undo (e.g., which of two conflicting TAM figures to publish — see `docs/product/prd.md` §22).
- An action is destructive or hard to reverse (force-push, deleting a file with unclear ownership, dropping data).
- A business fact is missing and inventing it would be dishonest (founder bios, legal entity name, pricing not yet decided) — see "How to Handle Uncertainty" below.
- The user's instruction conflicts with an established, documented decision (e.g., a request that contradicts a recorded ADR) — surface the conflict rather than silently picking one.

## When NOT to Ask Questions

Proceed without asking when:

- The answer is already documented somewhere in `.claude/` or `docs/` — read first, ask second.
- The decision is a reasonable, reversible engineering judgment call within established conventions (e.g., which utility function to extract, how to name a local variable).
- The user has explicitly granted latitude ("you're free to improve this," "execute everything") — in that case, make the call, document the reasoning, and move on.

## How to Handle Uncertainty

- **Never invent business facts.** If a founder bio, a legal name, a finalized price, or a metric doesn't exist in source material, write a `TODO` placeholder — never a plausible-sounding fabrication. See `docs/product/copy.md`'s Team page section for the pattern.
- **Flag synthesized content as synthesized.** If a judgment call fills a gap the source material didn't cover (e.g., brand personality inferred from tone), say so explicitly and mark it as a draft pending confirmation — see `branding.md`.
- **Prefer a documented assumption over a silent one.** If a plan depends on an assumption, write it down where the next reader will see it, not just in the moment's reasoning.

## How to Avoid Technical Debt

- Don't add abstractions for a single use case — three similar lines beat a premature helper.
- Don't leave a `TODO` in code without a corresponding entry in the relevant doc's **TODO** section — an undocumented TODO is debt that's invisible until someone trips over it.
- A shortcut taken under time pressure gets written down (in the PR description and the relevant doc's Future Improvements section), not silently absorbed into "how things are."

## How to Refactor

- Refactor in a dedicated PR, never bundled silently into a feature or fix PR — a reviewer should never have to guess which lines are behavior change and which are cleanup.
- A refactor that changes a documented convention updates the convention doc in the same PR (see Documentation Synchronization).

## Documentation Synchronization

The rule, stated once so it doesn't need repeating per-task:

| If this changes... | ...update this |
|---|---|
| Architecture (folders, component tiers, strategies) | `.claude/context/frontend.md` (and `architecture.md` if the "current state" summary changes) |
| Visual design (tokens, colors, spacing) | `.claude/context/design-system.md` |
| Copy voice or brand direction | `.claude/context/branding.md` |
| A component's shape/contract | wherever that component is documented in `frontend.md` §3 |
| Routes/pages/nav | `.claude/context/information-architecture.md` |
| A workflow or process | this document |
| A deployment/CI step | `.claude/context/deployment.md` and, if it's a runbook-level change, `docs/deployment/` |

If none of these obviously fit, that's a signal a new doc is needed — not a reason to skip documenting the change.

## Current Status

This is the current, intended workflow. No PRs have been merged under it yet (repository has one commit — the initial README).

## Future Improvements

Once real PRs start flowing, consider whether a PR template (`.github/PULL_REQUEST_TEMPLATE.md`) should encode the Documentation Synchronization table as a checklist — turns a documented rule into an enforced one.

## TODO

- [ ] Create `.github/PULL_REQUEST_TEMPLATE.md` once CI exists (see `deployment.md` TODO).

## References

- [`README.md`](../../README.md) — branch names this document assumes

## Related Documents

- [`repository.md`](./repository.md)
- [`deployment.md`](./deployment.md)

---
**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
