# ADR-0001: Frontend-First Architecture, No Dedicated Backend Yet

**Status:** Accepted
**Date:** 2026-07-04

## Context

The Orgofin website (waitlist, marketing content, investor materials) needs to launch quickly and cheaply, well before the actual product (HRMS, Company Brain, AI agents) has any backend of its own. The website needs to persist waitlist signups, newsletter subscriptions, contact/demo requests, and analytics events — real data, not a static site — but building a dedicated backend service for a pre-launch marketing site would be premature investment for what is, at this stage, a content and lead-capture surface.

## Decision

Build the website as a Next.js (App Router) frontend-first application. Use Supabase as a backend-as-a-service for all data persistence needs (waitlist, newsletter, contact/demo forms, analytics events) rather than standing up a dedicated backend service (e.g., NestJS or Go). Enforce a strict internal boundary — components and pages call an internal `lib/api/*` wrapper, never `@supabase/*` directly (see `.claude/context/frontend.md` §11) — so that when a real backend eventually exists for the actual product, this website's data operations can be repointed at it without touching any component, page, or form.

## Alternatives Considered

- **Build a dedicated backend (NestJS/Go) now.** Rejected: disproportionate engineering investment for a pre-launch marketing site whose data needs (a handful of form submissions) don't require custom backend logic yet.
- **No backend at all — client-side-only forms posting to a third-party form service (e.g., Formspree, Airtable).** Rejected: less control over data shape, weaker fit with the eventual need to query/export the waitlist (per `docs/product/prd.md` §11), and no natural migration path to a real backend later.
- **Supabase without an internal abstraction layer (components call Supabase directly).** Rejected: would make a future backend migration require touching every component/form that currently calls Supabase, defeating the point of deferring the backend decision in the first place.

## Consequences

**Easier:** fast to build, cheap to run, no infrastructure to maintain beyond Vercel + Supabase, and the team can focus entirely on the website experience rather than backend engineering for a pre-launch product.

**Harder / trade-offs:** Supabase's Row Level Security and schema become the de facto data contract until a migration happens — any modeling mistake here has to be unwound later. Environment isolation (dev/preview data polluting production waitlist counts) needs explicit attention (see `.claude/context/deployment.md` TODO) since there's no backend layer to enforce it structurally.

**Enables later:** when the actual Orgofin product platform (see `docs/architecture/platform-overview.md`) needs a real backend, this website's data operations migrate by changing only the internals of `lib/api/*` — no frontend rewrite required.

## Current Status

Accepted and reflected in `.claude/context/frontend.md` and `.claude/context/architecture.md`.

## TODO

- [ ] Revisit this ADR's "Consequences" section once a real backend migration actually happens — record what was and wasn't as painless as predicted.

## References

- [`docs/product/prd.md`](../product/prd.md) §5
- [`../../.claude/context/frontend.md`](../../.claude/context/frontend.md) §11

## Related Documents

- [`../../.claude/context/architecture.md`](../../.claude/context/architecture.md)
- [`README.md`](./README.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
