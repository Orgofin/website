<!--
  Orgofin website PR template.
  Keep PRs small: one PR does one thing (workflows.md). Delete sections that
  don't apply, but do not delete the checklists — an unchecked box is a signal,
  not an inconvenience.
-->

## What & why

<!-- One or two sentences: what this change does and the reason for it.
     Link the backlog task ID if there is one, e.g. "E1.2.1". -->

## Scope check — one PR does one thing

- [ ] This PR does a single thing (a refactor is its own PR, not bundled into a feature/fix — `workflows.md`).

## Documentation synchronization

Per `.claude/context/workflows.md`, a code change that leaves docs stale is an
**incomplete PR**, not a follow-up. Check every row you touched:

- [ ] **Architecture** (folders, component tiers, strategies) → updated `.claude/context/frontend.md` (+ `architecture.md` if the current-state summary changed)
- [ ] **Visual design** (tokens, colors, spacing) → updated `.claude/context/design-system.md`
- [ ] **Copy voice / brand direction** → updated `.claude/context/branding.md`
- [ ] **A component's shape/contract** → updated where it's documented in `frontend.md` §3
- [ ] **Routes / pages / nav** → updated `.claude/context/information-architecture.md`
- [ ] **A workflow or process** → updated `.claude/context/workflows.md`
- [ ] **A deployment / CI step** → updated `.claude/context/deployment.md` (+ `docs/deployment/` if runbook-level)
- [ ] None of the above changed — no doc update needed.

## Quality gate

- [ ] `npm run lint` clean (zero warnings)
- [ ] `npm run format:check` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` succeeds
- [ ] Self-reviewed the diff as if reviewing someone else's PR
- [ ] No invented business facts — missing facts are visible `TODO`s (`workflows.md`)

<!-- CI (.github/workflows/ci.yml) re-runs the gate above on every PR. -->
