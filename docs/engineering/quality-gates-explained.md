# Quality Gates, Explained

> **Purpose:** A plain-English guide to the automated "guardrails" that protect the Orgofin website codebase — what each one is, why it exists, and what it looks like in practice. Written so a founder, a new engineer, or a future Claude session can understand the whole safety net without prior context.
> **Applies to:** anyone who wants to understand _why_ a pull request got blocked, what the red ✗ next to their PR means, or how we keep quality high without slowing down.

---

## Responsibilities

Owns: the conceptual explanation of the repository's linting, formatting, type-checking, git-hook, and CI/CD guardrails, aimed at a non-specialist reader. Does **not** own the enforced rules themselves — those live in [`.claude/context/coding-standards.md`](../../.claude/context/coding-standards.md) (code style), [`.claude/context/deployment.md`](../../.claude/context/deployment.md) (CI policy), and [`.claude/context/workflows.md`](../../.claude/context/workflows.md) (git/PR process). When this guide and one of those disagree, the rule doc wins and this guide is corrected.

---

## The one-paragraph version

Every time an engineer proposes a change, a set of automated checks runs — some on their own laptop, some on GitHub's servers. These checks catch mistakes (typos, broken types, style drift, forbidden shortcuts) **before** the change reaches the live website. Think of them as spell-check and a co-pilot's pre-flight checklist, but for code. If any check fails, the change cannot be merged until it's fixed. This is deliberate: it's far cheaper to catch a bug on a laptop than after it's live in front of an investor.

---

## The four checks, in plain English

Each check answers one question about a proposed change.

### 1. Linting — "Does this code follow our rules?"

A **linter** (we use **ESLint**) reads the code and flags patterns we've agreed not to allow — not because they're always broken, but because they cause bugs or confusion over time.

A concrete example from _our_ rules: the website is allowed to talk to our database (Supabase) **only** through one specific folder (`lib/api/`). This keeps a promise — that we can swap the backend later without rewriting the whole site. The linter enforces it:

```ts
// ❌ ESLint blocks this in a normal page/component:
import { createClient } from "@supabase/supabase-js";
//   Error: Import @supabase/* only inside src/lib/supabase/**.
//          Everywhere else, call through lib/api/*.

// ✅ This is the intended way — go through the seam:
import { submitWaitlist } from "@/lib/api/waitlist";
```

Other examples the linter catches: leftover `console.log` debugging statements, and imports listed in a messy order. Full list: [`coding-standards.md`](../../.claude/context/coding-standards.md).

### 2. Formatting — "Is this code laid out consistently?"

A **formatter** (we use **Prettier**) rewrites the _layout_ of code — spacing, line breaks, quotes — to one consistent style. It changes how code _looks_, never what it _does_. This ends every "tabs vs. spaces" argument permanently: there's one correct format, and a tool applies it automatically.

<!-- prettier-ignore -->
```text
// What you might type (messy spacing, mixed quotes):
const button = { size: 'lg', variant: "primary", disabled:false }

// What Prettier saves it as (one canonical style):
const button = { size: "lg", variant: "primary", disabled: false };
```

The **format check** in CI simply asks: "is every file already in this canonical format?" If not, the fix is one command: `npm run format`.

### 3. Type-checking — "Do the pieces fit together?"

We write the site in **TypeScript**, which lets us label what kind of data each piece of code expects — a number here, an email string there. The **type-checker** then verifies those labels are consistent across the entire codebase. It catches a whole class of bugs before the code ever runs:

```ts
function greet(name: string) {
  return `Hi ${name}`;
}

greet(42);
// ❌ Type error: '42' is a number, but greet expects a string.
//    Caught on the laptop — never reaches a user.
```

This is the single highest-value check: it finds "this can't possibly work" mistakes automatically.

### 4. Build — "Does the whole site actually compile?"

Finally, we run the real production **build** (`next build`) — the exact process that produces the deployable website. If the site can't build, it can't ship, so we prove it builds on every change.

---

## Where the checks run: two layers

The same checks run in two places, forming a safety net with two rings.

### Layer 1 — On your laptop (Git hooks, via Husky)

**Git hooks** are scripts that run automatically at certain git moments. We use a tool called **Husky** to manage them. They give you feedback in _seconds_, before anything leaves your machine:

| Moment       | Hook file                                      | What runs                                 | Why here                                                    |
| ------------ | ---------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| `git commit` | [`.husky/pre-commit`](../../.husky/pre-commit) | Lint + format the files you're committing | Fix style/rule issues instantly, on just your changed files |
| `git push`   | [`.husky/pre-push`](../../.husky/pre-push)     | Type-check the whole project              | Don't push code that doesn't type-check                     |

If a hook fails, the commit or push is stopped and you see exactly what to fix. This is a feature, not an obstacle — it's the cheapest possible place to catch a mistake.

### Layer 2 — On GitHub's servers (CI/CD)

**CI/CD** stands for **Continuous Integration / Continuous Delivery**. The idea: every proposed change is automatically integrated with the main codebase and tested on a clean, neutral machine — not "it worked on my laptop," but "it provably works anywhere."

We run this on **GitHub Actions** (GitHub's built-in automation). Our configuration lives in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml). Whenever someone opens a pull request targeting our `dev`, `uat`, or `main` branches, GitHub spins up a fresh computer and runs, in order:

```
1. Install dependencies   (npm ci)
2. Lint                    (npm run lint)
3. Format check            (npm run format:check)
4. Type-check              (npm run typecheck)
5. Unit + component tests  (npm run test)
6. Build                   (npm run build)
```

If **any** step fails, the pull request shows a red ✗ and **cannot be merged**. If all pass, a green ✓. There is deliberately no "merge now, fix later" path — see [`deployment.md`](../../.claude/context/deployment.md).

> **Why run the same checks twice?** The laptop layer is fast feedback for the individual. The CI layer is the impartial referee: it can't be skipped or forgotten, it runs on a clean machine (catching "works only because of something installed on my laptop" bugs), and it's the same for everyone. The laptop layer makes CI rarely fail; the CI layer guarantees it never gets bypassed.

---

## The pull request checklist

When an engineer opens a pull request, GitHub pre-fills a template ([`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md)) with checkboxes. The most important one enforces a rule unique to this repo: **if you change how something works, you update the document that describes it, in the same change.** A code change that leaves the documentation stale is considered incomplete. This is what keeps our docs as trustworthy as our code — a core goal stated in [`CLAUDE.md`](../../CLAUDE.md).

The automated checks (layers 1 and 2) verify the _code_. The checklist verifies the _judgment_ a machine can't: "did you keep the docs in sync?", "is this really one focused change?", "did you invent any facts you shouldn't have?"

---

## What "quality gate" means, all together

Put the pieces in sequence and you get the **quality gate** — the full bar a change must clear to become part of the live site:

```
 write code
     │
     ▼
 git commit ──▶ [Husky pre-commit: lint + format]   ← seconds, your laptop
     │
     ▼
 git push ────▶ [Husky pre-push: type-check]         ← seconds, your laptop
     │
     ▼
 open PR ─────▶ [GitHub Actions CI:                  ← minutes, clean server
     │            lint → format → type-check → test → build]
     │           [PR checklist: docs synced?]         ← human judgment
     ▼
 all green ──▶ merge ──▶ deploy
```

The eventual target adds two more CI steps — accessibility/end-to-end checks and a performance budget (Lighthouse) — but those need infrastructure we haven't built yet. See "Current Status."

---

## Design Decisions

- **Two layers, same checks.** Fast local feedback (Husky) plus an un-skippable server referee (CI). The redundancy is the point: local hooks keep CI green, CI keeps quality non-negotiable.
- **Zero-warning lint.** `npm run lint` fails on _warnings_, not just errors, so "small" issues can't quietly accumulate. Local and CI behave identically.
- **The gate blocks merges, with no override.** A red build cannot merge "temporarily." Debt that's allowed in "just this once" is the debt that never leaves.
- **Docs ride with code.** The PR checklist makes documentation sync a merge condition, not a good intention — the mechanism behind this repo's "never merge with a documentation gap" rule.
- **This guide is separate from the rules.** The enforced rules live in `.claude/context/`; this file only _explains_ them, so the two never duplicate each other (a repo-wide rule). If you want to change a rule, change it there — this guide follows.

---

## Current Status

The **lint → format → type-check → test → build** gate is live, in both layers (Husky hooks + GitHub Actions). Automated **unit + component tests** run via Vitest (`npm run test`) — see [`testing.md`](../../.claude/context/testing.md) for what's tested. Two planned CI steps are **not yet wired up** because they depend on infrastructure that doesn't exist yet:

- **Accessibility checks** (axe) and **end-to-end tests** (Playwright) — depend on forms and pages being built.
- **Performance budget** (Lighthouse: Performance ≥95, Accessibility/SEO/Best-Practices 100) — depends on real pages to measure.

Each will slot into `ci.yml` (after tests, before build) as it becomes possible. Deployment to Vercel is also not connected yet.

## Future Improvements

- Add a short "I got blocked — how do I fix it?" troubleshooting section once real PRs surface the most common failures (e.g., "format check failed → run `npm run format`").
- Link this guide from the new-engineer onboarding path once one exists.
- Update the sequence diagram above as the test, accessibility, and Lighthouse steps come online.

## TODO

- [ ] Add the troubleshooting/FAQ section after the first few weeks of real PRs.
- [ ] Revisit once the E2E/axe and Lighthouse CI steps land, so this guide matches the full pipeline described in `deployment.md`.

## References

- [`.claude/context/deployment.md`](../../.claude/context/deployment.md) — the CI pipeline policy this guide explains
- [`.claude/context/coding-standards.md`](../../.claude/context/coding-standards.md) — the code-style rules the linter enforces
- [`.claude/context/workflows.md`](../../.claude/context/workflows.md) — git/branch/PR process and the documentation-sync rule
- [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — the actual CI workflow
- [`docs/product/implementation-backlog.md`](../product/implementation-backlog.md) — Epic 1 (Engineering Foundation & CI/CD), where these tasks are tracked

## Related Documents

- [`docs/deployment/`](../deployment/) — operational/runbook side of deployment
- [`CLAUDE.md`](../../CLAUDE.md) — the engineering constitution these gates enforce

---

**Last Updated:** 2026-07-06
**Owner:** Orgofin Engineering (TODO: assign a DRI)
