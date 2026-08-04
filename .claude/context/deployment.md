# Deployment Conventions

> **Purpose:** The standing CI/CD rules and environment conventions for this repository. For the actual production runbook (URLs, rollback steps, on-call), see [`docs/deployment/`](../../docs/deployment/) — that's the human-facing operational doc; this is the policy Claude should assume when touching CI config or deployment-adjacent code.
> **Applies to:** anyone (human or Claude) writing a GitHub Actions workflow, touching environment variables, or changing anything deploy-related.

---

## Responsibilities

Owns: CI pipeline conventions, branch-to-environment mapping, and the backend-migration boundary as it relates to deployment. Does not own the actual runbook (`docs/deployment/`) or the frontend's internal architecture (`frontend.md` §11 has the detailed version of most of what's summarized here).

## Environment Mapping

| Branch             | Vercel environment  | Purpose                             |
| ------------------ | ------------------- | ----------------------------------- |
| `main`             | Production          | Live site                           |
| `uat`              | Staging/UAT         | Pre-production acceptance testing   |
| `dev`              | Development preview | Active development                  |
| any feature branch | PR preview          | Automatic per-PR preview deployment |

## CI Pipeline (GitHub Actions)

Required, in order, before merge: lint (ESLint) → format check (Prettier) → type-check (`tsc --noEmit`) → unit tests → dependency audit → **build** → Playwright E2E + axe accessibility pass → Lighthouse CI gate. A regression at any step blocks merge; there is no "merge now, fix later" path for this pipeline.

**The E2E and Lighthouse steps run _after_ the build, not before it.** This document specified the reverse until 2026-08-02, which was not implementable: both drive the built output through `npm start`, so neither can precede the thing it tests. The order above is what `ci.yml` actually does.

The workflow implementing this pipeline is [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml), on every PR to `dev`/`uat`/`main`. All steps are now wired: the base gate (E1.2.1), Vitest (E1.2.2), **Playwright E2E + axe (E1.2.3, added 2026-08-02)** and the **Lighthouse gate (E1.2.4, added 2026-08-02)**. A plain-English explainer of the whole gate lives at [`docs/engineering/quality-gates-explained.md`](../../docs/engineering/quality-gates-explained.md).

**What the Lighthouse gate enforces is narrower than the PRD targets, deliberately** — accessibility/SEO/best-practices and byte-weight ceilings are hard errors, while the performance _score_ is a warning, because a shared CI runner cannot measure the production performance target (the same commit scores 91–98 on production and ~84 on a local build). Read [`docs/engineering/lighthouse-gate.md`](../../docs/engineering/lighthouse-gate.md) before changing any threshold; **a green CI run is not evidence the 95+ performance target is met.**

**Security scanning (audit M-03, added 2026-07-19).** Three layers, only the first merge-blocking:

- **Dependency audit** — two steps in the `ci.yml` quality gate (after tests, before build), split by whether the code reaches a visitor. **`npm audit --omit=dev --audit-level=high` is merge-blocking**: anything shipped to the browser or executed in an API route must be clean, and no-fix advisories there are pinned via `package.json` `overrides` (as the postcss GHSA was), never by relaxing the gate. **`npm audit --audit-level=high` over the full tree runs `continue-on-error`** — build and lint tooling never ships, so a dev-only advisory is surfaced in the log but cannot block a release. The split was introduced 2026-07-25; see the ESLint 9 note below for the case that forced it.
- **CodeQL SAST** — [`.github/workflows/codeql.yml`](../../.github/workflows/codeql.yml), `javascript-typescript` + `security-extended` queries, on PRs to the release branches + push to `main` + weekly. Advisory (findings surface in the Security tab / PR annotations), not gated.
- **Secret scanning + push protection** — GitHub-native (repo Settings → Code security), enabled 2026-07-19; free for this public repo, so no workflow. Dependabot **security** updates are on, and [`.github/dependabot.yml`](../../.github/dependabot.yml) adds weekly npm + actions **version** updates targeting `dev`.

**Actions are referenced by floating major tag, and `github/codeql-action` is ignored for minor/patch (2026-08-03).** Every `uses:` in this repo pins a bare major (`actions/checkout@v7`, `github/codeql-action@v4`, …) and never a full version — the publisher advances that tag in place, which is how patches arrive without a PR. Dependabot nonetheless proposed `github/codeql-action@v4` → `@v4.37.4` (PR #177, closed): for CodeQL that tag also carries the **query bundle**, so the "upgrade" would have frozen the security queries until someone merged the next bump — the opposite of what a SAST gate wants. `dependabot.yml` therefore ignores minor/patch for that action only. **Majors are not ignored** and still open individually for deliberate review, which is how `actions/cache` v4 → v6 (#176) and `actions/upload-artifact` v4 → v7 (#175) were assessed.

**Why the audit is split, and what `package.json`'s `overrides` are doing (2026-07-25).** GHSA-mh99-v99m-4gvg (`brace-expansion`, DoS) was fixed **only** in the 5.x line — at the time, the 1.x/2.x/3.x maintenance lines had not been patched. But 5.x moved to a named export, which breaks `minimatch@3`'s `require()` call, so a blanket pin takes ESLint down entirely (`TypeError: expand is not a function`). The overrides therefore pin `brace-expansion` to the 5.x line and carve `minimatch@3` back to 1.x: that patches the `ts-morph` and `typescript-eslint` paths while leaving ESLint 9's own bundled `minimatch@3` on an export shape it can actually load — **ESLint 9 is the last major to ship `minimatch@3`**. That is the structural reason the blocking gate is scoped to the production tree, and it still holds. `shadcn` moved to `devDependencies` in the same change — it is a scaffolding CLI, never imported from `src/`, and keeping it in `dependencies` put `@hono/node-server` and `ts-morph` in the shipped tree.

**The follow-up `brace-expansion` advisory, and the 1.x line getting patched after all (2026-08-04).** GHSA-rgw5-rvv9-x895 (high, DoS via unbounded intermediate arrays) **bypasses the CVE-2026-14257 mitigation** and covers `4.0.0 – 5.0.8` — i.e. it made the exact version the previous fix pinned to, `^5.0.8`, the vulnerable one. It reached the production tree through `@sentry/nextjs → @sentry/bundler-plugin-core → glob@13 → minimatch@10`, so the blocking gate went red on every open PR until the floor moved to **`^5.0.9`**.

The same advisory also covers `<=1.1.17` on the maintenance line — but unlike last time **1.x was patched**, in `1.1.18`. The `minimatch@3` carve-out therefore moved to `^1.1.18`, which **retires the "permanently unfixable dev-only advisory"** this document previously described: `brace-expansion` is now clean at every severity in both trees, and `1.1.18` keeps the CommonJS default export, so ESLint still loads (verified — `npm run lint` clean). The deferred ESLint 10 migration is still the right long-term fix, but it is no longer holding back a security finding.

**The `fast-uri` advisory the same day, and why the floor went to `^3.1.5` and not 4.x (2026-08-04).** GHSA-7p8r-x3mc-p8w7 (high, host confusion via a backslash authority introducer) landed hours after the `brace-expansion` one and took the blocking gate red a second time, in the identical way: the repo already pinned `fast-uri` to `^3.1.4`, and the advisory's 3.x range is `>=3.0.0 <3.1.5`. The existing floor _was_ the vulnerable version.

The advisory patches three lines (`2.4.4`, `3.1.5`, `4.1.2`), so 4.x is available — but **`ajv@8.20.0` declares `fast-uri: ^3.0.1`**, and this reaches production through `@hookform/resolvers → ajv`. Pinning 4.x would force an unsanctioned major on a consumer that never agreed to it, which is exactly the mistake the `@hono/node-server` note above exists to prevent. `^3.1.5` patches it inside a range `ajv` declares. **Unlike `brace-expansion` (build-time only, via Sentry's bundler plugin), this one is on a genuine runtime path** — form-validation code — so it mattered more than the red gate suggested.

**The recurring shape: a fix pinned to an exact floor becomes the next advisory's vulnerable version.** Both 2026-08-04 advisories broke the gate this way, on overrides added specifically to fix an earlier advisory in the same package. This is inherent to the approach and not a reason to abandon it — a caret floor still floats upward within its line — but **when the audit gate fails on an unchanged diff, check the existing `overrides` floors first.** It is far more likely than a real regression.

**What the two trees look like as of 2026-08-04.** The production tree is clean at high/critical (the blocking gate), carrying one **moderate** finding: `postcss` GHSA-fxqj-rqcc-2cmp via `next`. It is only fixable by moving off the pinned `next@16.2.12` (`npm audit fix --force` proposes `next@16.3.0`), so it is deferred to a deliberate Next upgrade rather than taken as a side effect. The full tree additionally carries `tmp` (high) and `uuid` (moderate), **both reached only through `@lhci/cli`** — the Lighthouse runner added 2026-08-02, which executes in CI and ships nothing. Those are precisely the case the `continue-on-error` full-tree step exists to surface without blocking; do not "fix" them by relaxing the blocking gate.

**The `@hono/node-server` override (2026-07-28).** Dependabot alert #2 (moderate — path traversal in `serve-static` via an encoded backslash on Windows) reached us at `1.19.14` through `shadcn → @modelcontextprotocol/sdk`. It is **dev-tree only and unreachable** — we never start the SDK's HTTP server — so it never blocked the gate. It is pinned anyway, because a one-line override is cheaper than re-deciding this every time the alert resurfaces.

The fix is **two** overrides, not one: the advisory is first patched in `2.0.5`, but the installed SDK `1.29.0` declares `^1.19.9` and does not sanction a 2.x major. Pinning `@hono/node-server` alone would silently force an unsupported major on a dependency that never agreed to it. `@modelcontextprotocol/sdk` is therefore pinned to `^1.30.0` — the first release whose range reads `^1.19.9 || ^2.0.5` — so the hono pin lands inside a range its own consumer declares. **Both overrides must be removed together**, once `shadcn` resolves the SDK to `>=1.30.0` on its own. Verified after the bump: lint, typecheck, 148 tests, build all green, every route still statically prerendered, and the `shadcn` CLI still executes.

**Node version (2026-07-27).** CI runs **Node 24**, the current Active LTS (maintenance from Oct 2026, EOL Apr 2028 per the [Node release schedule](https://github.com/nodejs/Release)). Pinned in three places that must agree: [`ci.yml`](../../.github/workflows/ci.yml)'s `node-version`, `package.json` `engines` (`>=24.15.0`), and [`.nvmrc`](../../.nvmrc) for local dev.

It was `20` until this change, and **Node 20 reached EOL on 2026-04-30** — so CI spent roughly three months building on a runtime receiving no security patches, on a repo that otherwise gates hard on dependency advisories. Nothing flagged it: `npm audit` scans dependencies, not the interpreter, and CodeQL does not check runtime lifecycle either. What surfaced it was an unrelated Dependabot PR (jsdom 30, whose `engines` excludes Node 20) failing with `webidl.util.markAsUncloneable is not a function` — a message that names neither Node nor the version.

The floor is `>=24.15.0` rather than `>=24` because that is what jsdom 30 requires; anything lower reintroduces the same failure. **Vercel's runtime Node is configured in project settings, not in this repo** — it is a separate dial and does not follow `engines` automatically. Check it when changing this.

### Branch protection (repository rulesets)

Enforced server-side by GitHub **rulesets**, not the older "branch protection" API — note that `gh api repos/Orgofin/website/branches/<b>/protection` returns **404 Branch not protected** even for fully protected branches. Read them with `gh api repos/Orgofin/website/rules/branches/<b>`.

| Branch | PR required | Approvals | CI gate required | Strict |
| ------ | ----------- | --------- | ---------------- | ------ |
| `main` | yes         | **1**     | ⚠️ no            | —      |
| `uat`  | yes         | 0         | yes              | yes    |
| `dev`  | yes         | 0         | yes              | yes    |

All three also block deletion and non-fast-forward pushes. The required check is the `ci.yml` job **`Lint, format, typecheck, test, build`**; CodeQL stays advisory by design (see the security section above), and the Vercel checks are deployment signal rather than a quality gate, so neither is required.

**Why `strict` is on (2026-07-27).** Strict means a PR must be up to date with its base before merging, so its checks are re-run against what will actually land. Without it a check result can be stale: #123 (jsdom 30) was merged into `dev` carrying a **failing** run from before the Node 24 bump — the result was accurate when produced and meaningless by the time it merged. `dev` also had no `pull_request` rule at all until this change, so direct pushes bypassed CI entirely.

**Closed 2026-08-02: `main` now requires the `ci.yml` status check**, like `dev` and `uat`. It previously had none, so production merges were gated by one human approval and nothing else and a red build could reach `main` if the reviewer did not look at the checks.

**`strict` is deliberately OFF for `main`, and should stay off.** `dev` and `uat` both set it, which is exactly what forces a zero-change back-merge PR on every promotion cycle (see `workflows.md` § Promotion Procedure). Enabling it on `main` would create a _second_ recurring sync — `main` → `uat` after every production merge — in exchange for no real safety, since `uat` is already required to be current with `dev` and what reaches `main` is byte-identical to what `uat` verified. `main` still has no bypass actors.

Local pre-commit/pre-push (Husky): [`.husky/pre-commit`](../../.husky/pre-commit) runs `lint-staged` (ESLint + Prettier on staged files) at commit; [`.husky/pre-push`](../../.husky/pre-push) runs `npm run typecheck` at push — catching most issues before they reach CI at all.

## Environment Variables — Convention

- Never committed. Managed per-environment in Vercel's dashboard.
- `NEXT_PUBLIC_` prefix only for values genuinely needed client-side (e.g., GA4 measurement ID) — server-only secrets (Supabase service role key, if ever used server-side) never get this prefix.
- See [`docs/deployment/environment-variables.md`](../../docs/deployment/environment-variables.md) for the actual variable list (TODO-heavy until implementation).

## Supabase Environment Isolation

**Decided (2026-07-08): two separate Supabase projects.** A **prod** project backs Production (`main`); a shared **non-prod** project backs `uat`, `dev`, and PR previews. The split is enforced by per-environment scoping of `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` in Vercel, so test waitlist submissions never pollute the real, investor-facing signup count. Variable-level detail: [`docs/deployment/environment-variables.md`](../../docs/deployment/environment-variables.md); schema: [`supabase/migrations/`](../../supabase/migrations/).

## The Backend-Migration Boundary

Deployment conventions must preserve the seam described in `frontend.md` §11: today, `lib/api/*` calls Supabase directly from Vercel-hosted API routes. When a NestJS/Go backend eventually exists, deployment changes to _where that backend is hosted and how it's deployed_ — it should never require changing how the Next.js app itself is deployed or configured.

## Current Status

CI live: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) gates PRs on lint → format check → typecheck → unit tests → dependency audit → build; CodeQL SAST and GitHub-native secret scanning run alongside (security layer, above); Husky pre-commit/pre-push hooks run the local gate. The Vercel project is connected (2026-07-07): production builds from `main`, live on the custom apex domain **https://orgofin.com** (www 308-redirects to apex; `NEXT_PUBLIC_SITE_URL` set in Production), with automatic Preview deploys for `uat`/`dev`/PRs — see [`docs/deployment/README.md`](../../docs/deployment/README.md). The Playwright/axe + Lighthouse CI steps are still pending their underlying infrastructure.

## Future Improvements

Wire the remaining pipeline steps (Playwright/axe, Lighthouse gate) into `ci.yml` as their infrastructure lands. Vercel is connected and the custom apex domain is live; remaining deployment polish: give `uat`/`dev` stable Staging/Development URLs via Custom Environments, and consider Cloudflare orange-cloud/WAF in front of the apex (security audit M-04).

## TODO

- [x] Write the actual GitHub Actions workflow file(s). — first slice done in `ci.yml`; test/E2E/Lighthouse steps still pending (E1.2.2–E1.2.4).
- [x] Set up the Vercel project and connect branch environments — done 2026-07-07 (production branch `main`); guide: [`docs/deployment/vercel-setup.md`](../../docs/deployment/vercel-setup.md).
- [x] Attach a custom production domain / configure DNS (E13.1.3) and set `NEXT_PUBLIC_SITE_URL` — **done**: apex `orgofin.com` live, www 308→apex, canonicals/OG resolve to the apex, security headers served (verified 2026-07-19). Runbook: [`docs/deployment/custom-domain-setup.md`](../../docs/deployment/custom-domain-setup.md).
- [x] Wire CI security scanning (audit M-03) — done 2026-07-19: `npm audit` gate + CodeQL + native secret scanning/push protection + Dependabot.
- [x] Decide Supabase environment isolation strategy — done 2026-07-08: two projects (prod + non-prod), see above.
- [x] Populate `docs/deployment/environment-variables.md` with the real Supabase variables (done 2026-07-08); GA4 vars still pending its property.
- [ ] Remove the `package.json` `overrides` entry forcing `next`'s nested `postcss` to `^8.5.10` (added 2026-07-15 for the Dependabot XSS alert, GHSA postcss < 8.5.10) once a Next release stops pinning `postcss@8.4.31` — check on each Next upgrade.
- [ ] **Deferred toolchain majors (2026-07-19):** TypeScript **7.x** and ESLint **10.x** are `ignore`d for `semver-major` in `.github/dependabot.yml` — both broke `typecheck`/`lint` on the first Dependabot bump (TS 7 is the native-compiler jump past 6.x; ESLint 10 is a flat-config-breaking major) and are gated on ecosystem support. Do each as its own deliberate migration PR (verify the toolchain + Next.js/plugins are ready), then remove the corresponding `ignore` rule. Minor/patch for both still auto-update. **The security reason to move has now lapsed (2026-08-04):** ESLint 10 was previously the only way to clear GHSA-mh99-v99m-4gvg from the dev tree, but `brace-expansion@1.1.18` patched the maintenance line, so ESLint 9's bundled `minimatch@3` is no longer carrying an advisory (see the audit note above). This is once again a pure ecosystem-readiness migration — still worth doing, no longer security-driven.
- [ ] Re-tighten the dependency audit if the full tree ever goes clean: collapse the two audit steps back into one blocking `npm audit --audit-level=high` and drop the `brace-expansion` overrides. **The blocker is no longer ESLint 9 (2026-08-04)** — `brace-expansion` is clean in both trees now. What holds the split open is `@lhci/cli`, which drags in `tmp` (high) and `uuid` (moderate) and has no fix that does not require `--force`. Re-check on each `@lhci/cli` upgrade.
- [ ] Drop the `@hono/node-server` **and** `@modelcontextprotocol/sdk` overrides together (added 2026-07-28, see above) once `shadcn` resolves the SDK to `>=1.30.0` unaided — check on each `shadcn` upgrade.

## References

- [`docs/product/prd.md`](../../docs/product/prd.md) §6 (performance targets), §4 (tech stack)
- [`frontend.md`](./frontend.md) §11

## Related Documents

- [`docs/deployment/`](../../docs/deployment/)
- [`workflows.md`](./workflows.md)

---

**Last Updated:** 2026-08-04 (advisories cleared; action version-pinning convention recorded)
**Owner:** Orgofin Engineering (TODO: assign a DRI)
