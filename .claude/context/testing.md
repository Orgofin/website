# Testing Philosophy

> **Purpose:** What "tested" means in this repository — what gets tested, at what level, and what doesn't need a test. No test suite exists yet; this document is the intended shape, heavily TODO-flagged.
> **Applies to:** anyone (human or Claude) writing code that should ship with tests.

---

## Responsibilities

Owns testing scope and philosophy. Does not own the CI pipeline that runs tests (`deployment.md`) or the accessibility-specific test requirements (`accessibility.md` — axe checks are part of this testing strategy but documented there since they're accessibility-owned).

## What Gets Tested

- **Unit tests:** pure functions in `lib/` (form validation schemas, analytics event formatting, SEO metadata builders) — anything with real logic and no rendering.
- **Component tests:** primitives and molecules in `components/ui/` and form components — rendering, prop variants, basic interaction (does the button call its handler, does the form show a validation error).
- **E2E tests (Playwright):** the critical user paths — waitlist signup end-to-end, demo request submission, theme toggle persistence, the <390px lockout screen actually appearing. Not every page, the paths that matter per `docs/product/website-strategy.md`'s CTA hierarchy.
- **Accessibility tests:** axe integrated into the Playwright E2E run — see `accessibility.md`.
- **Visual/Lighthouse:** performance, accessibility, SEO, best-practices scores gated in CI — see `deployment.md`.

## What Doesn't Need a Dedicated Test

- Static marketing copy/content sections with no logic (a `Section` component that just renders props) — covered adequately by the E2E path that renders the page, not a unit test asserting exact text.
- Framer Motion animation timing itself — trust the library; test that the reduced-motion path renders the content, not the animation curve.
- Third-party integrations' internals (Supabase, GA4) — test that _our code_ calls them correctly (mocked), not that Supabase/GA4 themselves work.

## Decision: Vitest (E15.1.1)

The unit/component runner is **Vitest** (over Jest): it reuses Vite's transform pipeline, needs no separate Babel config, and runs TS/JSX out of the box — the lowest-friction fit for this toolchain. It runs with React Testing Library + `@testing-library/jest-dom`, jsdom environment, and the SWC React plugin (mirroring Next's compiler, and sidestepping a Babel peer-dependency conflict). Config: [`vitest.config.ts`](../../vitest.config.ts); shared setup: [`vitest.setup.ts`](../../vitest.setup.ts). Run with `npm run test` (CI) or `npm run test:watch`.

## Current Status

Vitest is configured and running in CI (the `test` step in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)). Seed coverage exists: a `lib/` unit test ([`src/lib/utils.test.ts`](../../src/lib/utils.test.ts)) and a primitive component test ([`src/components/ui/Button.test.tsx`](../../src/components/ui/Button.test.tsx)). Playwright/E2E, axe, and Lighthouse are still not set up.

## Future Improvements

Broaden component coverage as primitives/molecules land (each ships with its test per the scope above), and stand up the Playwright + axe E2E layer once forms and pages exist.

## TODO

- [x] Choose and configure the unit/component test runner — Vitest (see decision above).
- [x] Add the unit/component test step to the CI pipeline — done (E1.2.2).
- [ ] Set up Playwright for E2E.
- [ ] Wire `@axe-core/playwright` into the E2E suite (see `accessibility.md`).
- [ ] Define a minimum coverage expectation, if any — not yet decided, and coverage percentage should not become a proxy for actual test quality.

## References

- [`docs/product/prd.md`](../../docs/product/prd.md) §16 ("testing-ready" codebase requirement)
- [`frontend.md`](./frontend.md)

## Related Documents

- [`accessibility.md`](./accessibility.md)
- [`deployment.md`](./deployment.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
