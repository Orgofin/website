# Architecture (Current State)

> **Purpose:** States, in one place, what actually exists architecturally in this repository right now — so Claude never has to infer it from scratch or assume a backend exists that doesn't.
> **Applies to:** anyone (human or Claude) about to write code that touches data, routing, or infrastructure.

---

## Responsibilities

This is a short index, not a full spec. Detail lives in [`frontend.md`](./frontend.md) (the only architecture that exists today) and [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) (the long-term, not-yet-built, full Orgofin platform vision). Do not duplicate either here — if you're adding architectural detail, it belongs in one of those two files, not this one.

## The one fact to never forget

**This repository currently builds the marketing/waitlist website only.** It is not the Orgofin product (HRMS, Company Brain, AI agents) — those are the long-term platform described in [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) and are not implemented anywhere in this codebase. Do not write code that assumes a Company Brain API, an agent runtime, or a product database exists — none of it does yet.

## Current architecture, in three sentences

1. **Frontend-only, Next.js App Router, deployed to Vercel** — see [`frontend.md`](./frontend.md) for folder structure, component tiers, and the seven cross-cutting strategies.
2. **No dedicated backend.** Supabase serves as the backend-as-a-service for the waitlist, newsletter, contact, and analytics-event storage — see [`docs/product/prd.md`](../../docs/product/prd.md) §5.
3. **A deliberate migration seam exists** (`lib/api/*`, detailed in `frontend.md` §11) so that when a real backend (NestJS/Go) eventually replaces Supabase for these operations, no component or page needs to change.

## Current Status

No code exists yet. This document, `frontend.md`, and `docs/architecture/platform-overview.md` are the specification the first implementation should follow.

## Future Improvements

Once a real backend is built (post-launch, per the roadmap in `docs/product/vision.md`), this file should grow to describe the actual system boundary between the website and the product platform — today there is no such boundary to describe because the product platform doesn't exist yet.

## TODO

- [ ] When the first backend service is introduced, add a `backend.md` to this folder and update this file's "one fact to never forget" — it will no longer be true.

## References

- [`frontend.md`](./frontend.md)
- [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md)
- [`docs/adr/0001-frontend-first-no-backend-yet.md`](../../docs/adr/0001-frontend-first-no-backend-yet.md)

## Related Documents

- [`deployment.md`](./deployment.md)
- [`repository.md`](./repository.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
