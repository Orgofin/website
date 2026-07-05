# Coding Standards

> **Purpose:** Concrete, checkable engineering conventions for TypeScript, React, Next.js, Tailwind, and Framer Motion in this repository — so code style is never a per-PR debate.
> **Applies to:** anyone (human or Claude) writing or reviewing code in this repository.

---

## Responsibilities

Owns: language/framework conventions, naming, imports, styling, error handling, and state/data-fetching patterns. Does not own folder structure or component tiering (`frontend.md`), visual tokens (`design-system.md`), or git/PR process (`workflows.md`).

## TypeScript

- **Strict mode on, always.** `tsconfig.json` uses `"strict": true`. No `any` — use `unknown` and narrow, or define the real type. If a type is genuinely unknown (e.g., a third-party payload), model it explicitly rather than silencing the compiler.
- **No type assertions (`as`) to work around a type error.** If a type doesn't fit, the type is wrong — fix the type, don't cast past it.
- **Prefer `type` for data shapes, `interface` only when declaration merging is actually needed** (rare in application code — mostly relevant for extending third-party types).
- **No enums.** Use string union types (`"primary" | "secondary" | "ghost"`) — they're simpler, tree-shake better, and match how variant props are already modeled in `design-system.md`.

## React / Components

- **Function components only.** No class components anywhere in this codebase.
- **Server Components by default** (App Router). `"use client"` is opt-in and must be justified — interactivity, browser APIs, or animation state are the only valid reasons (see `frontend.md` §8).
- **One component per file**, file name matches the component name (`WaitlistForm.tsx` exports `WaitlistForm`).
- **Props are always typed explicitly** with a `{ComponentName}Props` type — no inline anonymous prop types on anything reused more than once.
- **No prop drilling past two levels.** If a third level needs a value, it's a sign the value belongs in context or the component tree is too deep — reconsider the composition (see `frontend.md` §2's tier rules) before adding a third drill-through prop.

## Naming Conventions

| What                                    | Convention                                                                       | Example                                                                                                          |
| --------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Component files                         | PascalCase                                                                       | `WaitlistForm.tsx`                                                                                               |
| Non-component files (hooks, utils, lib) | camelCase                                                                        | `useReducedMotion.ts`, `trackEvent.ts`                                                                           |
| Route folders (App Router)              | kebab-case                                                                       | `app/(marketing)/company-brain/`                                                                                 |
| CSS/Tailwind — no custom class names    | n/a                                                                              | utility classes only, no bespoke `.hero-title { }`                                                               |
| Design tokens                           | kebab-case, role-based (see `design-system.md` §11)                              | `color-accent`, `space-6`                                                                                        |
| Markdown docs                           | kebab-case                                                                       | `frontend-architecture.md` → now `frontend.md`                                                                   |
| Environment variables                   | SCREAMING_SNAKE_CASE, `NEXT_PUBLIC_` prefix only if genuinely needed client-side | `SUPABASE_SERVICE_ROLE_KEY` (server-only, no prefix), `NEXT_PUBLIC_GA_MEASUREMENT_ID` (client-visible, prefixed) |

## Imports

- **Absolute imports via the `@/` alias** (`@/components/ui/Button`), never relative paths crossing more than one directory up (`../../../lib/utils` is a sign the file is in the wrong place).
- **Import order:** external packages → `@/` absolute imports → relative imports → styles. Enforced by ESLint's import-order rule, not left to habit.
- **No default exports for anything except Next.js special files** (`page.tsx`, `layout.tsx`, `route.ts` require them). Everything else uses named exports — better refactor safety, better autocomplete.

## Styling (Tailwind)

- **Utility classes only** — no CSS Modules, no styled-components, no bespoke class names in `globals.css` beyond resets and font-face declarations.
- **Class order enforced by `prettier-plugin-tailwindcss`**, not manually — don't hand-order classes and don't argue about it in review.
- **No arbitrary values (`w-[137px]`) unless the value is a genuine one-off** (e.g., matching a specific illustration's dimensions). Anything reused twice becomes a token in `design-system.md`, not a repeated arbitrary value.
- **Conditional classes via a `cn()` helper** (`clsx` + `tailwind-merge`), never manual string concatenation or template-literal class assembly.

## Error Handling

- **Forms surface errors inline, next to the field**, via the `FormField` molecule (see `frontend.md` §3) — never a generic top-of-page alert for a field-level validation error.
- **API route handlers always return a typed error shape** (`{ error: string }` at minimum), never leak a raw exception message or stack trace to the client.
- **No silent catches.** A `catch` block either handles the error meaningfully (retry, fallback UI, user-facing message) or re-throws — never an empty `catch {}` that swallows a failure silently.
- **No `console.log` left in committed code.** `console.error`/`console.warn` are acceptable for genuine operational logging; anything used for debugging during development is removed before the PR.

## State & Data Fetching

See `frontend.md` §9 for the full state-management philosophy. In short: Server Components fetch data directly; client state is local (`useState`/`useReducer`) or a small purpose-built context (theme, scroll progress); no global store (Redux/Zustand/Jotai) until there's an authenticated, stateful surface that actually needs one.

## Current Status

Standards defined; no code exists yet to audit against them. ESLint/Prettier configuration enforcing these rules automatically is part of the first implementation PR, not yet written.

## Future Improvements

Once the first components exist, add a short "before/after" example section here for the two or three rules most likely to be violated by habit (default exports, arbitrary Tailwind values) — real examples teach faster than prose.

## TODO

- [ ] Write the actual ESLint config (`eslint-config-next` + custom rules for import order, no-default-export, no-console) — this document states the rules; the config is what enforces them and doesn't exist yet.
- [ ] Write the Prettier config (`prettier-plugin-tailwindcss` included) matching the rules above.

## References

- [`frontend.md`](./frontend.md) — where these conventions apply structurally
- [`design-system.md`](./design-system.md) — the tokens styling conventions must use

## Related Documents

- [`repository.md`](./repository.md)
- [`workflows.md`](./workflows.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
