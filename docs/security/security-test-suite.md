# Security Test Suite & Testing Plan — Orgofin Website

> **Purpose:** A comprehensive, repeatable plan for verifying the website's security — a manual penetration-testing checklist, automated/integration/regression tests, targeted Data Room and API-abuse tests, and the tools to run before every production deployment.
> **Applies to:** engineers and anyone performing pre-deploy security verification.
> **Classification:** Internal — shareable under NDA.

---

## Responsibilities

Defines _how to verify_ the security design in [`security-architecture.md`](./security-architecture.md) and _how to confirm_ the findings in [`security-audit-report.md`](./security-audit-report.md) are remediated and stay remediated. Aligns with the project's testing philosophy ([`.claude/context/testing.md`](../../.claude/context/testing.md)) — Vitest for unit/component today; Playwright/axe are planned CI additions.

---

## 1. Testing Strategy Overview

| Layer             | Tooling (current → recommended)               | When it runs                   |
| ----------------- | --------------------------------------------- | ------------------------------ |
| Unit / component  | Vitest + Testing Library (in place)           | Every commit (Husky) + CI      |
| Schema/validation | Vitest against Zod schemas (in place)         | Every commit + CI              |
| Dependency scan   | `npm audit` (manual) → CI gate (recommended)  | Pre-deploy + CI                |
| SAST              | CodeQL / Semgrep (recommended)                | CI on PR                       |
| Secret scan       | Gitleaks / GitHub secret scanning (rec.)      | CI on PR + pre-commit          |
| Header/CSP check  | `curl` script + securityheaders.com (rec.)    | Pre-deploy + post-deploy smoke |
| E2E / a11y        | Playwright + axe (planned E1.2.3)             | CI on PR                       |
| DAST / abuse      | Manual checklist + scripted probes (this doc) | Pre-launch + quarterly         |
| Manual pen-test   | This document's §3 checklist                  | Pre-launch + on major change   |

---

## 2. Automated Tests

### 2.1 Existing coverage to preserve (regression tests)

The repo already has Vitest coverage for forms and the data seam. **These are security-relevant regression tests** — do not let them rot:

- `src/lib/api/waitlist.test.ts` — validates schema behavior, duplicate-email idempotency (23505 → success), and error mapping.
- `src/lib/api/data-room.test.ts` — validates schema, insert flow, and the signed-URL degradation path.
- `src/components/forms/WaitlistForm.test.tsx`, `DataRoomGate.test.tsx` — client validation and error rendering.

### 2.2 Security-specific tests to add

Add these as Vitest/route-handler tests (they encode the audit findings so a regression fails CI):

```ts
// Illustrative — validation & injection resistance
describe("POST /api/waitlist security", () => {
  it("rejects non-JSON body with 400 and no stack trace", async () => {
    /* ... */
  });
  it("strips unknown fields (property-level auth)", async () => {
    // { email, source, is_admin:true, role:"admin" } → only email+source persisted
  });
  it("rejects oversized inputs beyond .max() caps", async () => {
    /* ... */
  });
  it("treats SQL/script payloads as plain data (no injection, no XSS echo)", async () => {
    // email:"a@b.com'; DROP TABLE waitlist;--" → 400 invalid email, never executed
  });
  it("never returns internal error detail on Supabase failure", async () => {
    /* ... */
  });
});
```

```ts
// Illustrative — data-room specific
describe("POST /api/data-room security", () => {
  it("returns pending (null url) when service key is absent, still stores lead", async () => {});
  it("does not include storage paths or bucket names in the response", async () => {});
  it("signed URLs (when present) point to the private bucket and carry a TTL", async () => {});
});
```

```ts
// Illustrative — headers (after H-01 lands)
describe("security headers", () => {
  it("sets CSP, X-Frame-Options/frame-ancestors, HSTS, nosniff, referrer-policy", async () => {});
});
```

### 2.3 CI additions (recommended — audit M-03)

Add to `.github/workflows/ci.yml`, after unit tests:

```yaml
- name: Dependency audit (fail on high/critical)
  run: npm audit --audit-level=high

- name: SAST (CodeQL)
  uses: github/codeql-action/analyze@v3 # + init step with javascript-typescript

- name: Secret scan
  uses: gitleaks/gitleaks-action@v2
```

Plus enable **Dependabot** (`.github/dependabot.yml`) for weekly npm updates — the `postcss` override history shows this is already the de-facto process; make it explicit.

---

## 3. Manual Penetration-Testing Checklist

Run before public launch, after any change to an API route / header config / data-room flow, and quarterly. Mark ✅/❌/N-A and file any ❌ as an issue.

### 3.1 Transport & headers

- [ ] Site is only reachable over HTTPS; `http://` redirects to `https://`.
- [ ] `Strict-Transport-Security` present with `max-age >= 31536000; includeSubDomains; preload`.
- [ ] `Content-Security-Policy` present and enforcing (not only report-only) once tuned.
- [ ] `X-Frame-Options: DENY` **or** CSP `frame-ancestors 'none'` present — verify the site **cannot** be iframed (build a test page with `<iframe src=orgofin.com>` → should be blocked).
- [ ] `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` present.
- [ ] Grade A on securityheaders.com and SSL Labs A/A+.

### 3.2 Input validation & injection

- [ ] Submit SQL payloads in every field (`' OR 1=1--`, `'; DROP TABLE ...`) → rejected as invalid or stored inertly; no DB error surfaces.
- [ ] Submit XSS payloads (`<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>`) in name/firm/source → never rendered/executed anywhere (leads aren't rendered back, but confirm).
- [ ] Submit oversized strings (10k+ chars) → rejected by `.max()`.
- [ ] Submit malformed JSON / wrong content-type → `400`, no crash, no stack trace.
- [ ] Submit extra fields (`is_admin`, `role`, `id`) → silently dropped, not persisted.

### 3.3 Authentication / authorization / access control

- [ ] Confirm there is no login surface to attack (expected: none).
- [ ] Attempt to read the waitlist/lead tables using the public anon key directly (via Supabase REST `?select=*`) → **denied by RLS** (this is the critical test).
- [ ] Attempt `UPDATE`/`DELETE` via anon key → denied.
- [ ] Confirm the service-role key is **not** present in the client bundle (`grep` the built `.next` output / view-source / network tab → must not appear).

### 3.4 Data Room (highest-priority feature)

- [ ] Confirm `/investors/data-room` is `noindex, nofollow` and disallowed in `/robots.txt`, absent from `/sitemap.xml`.
- [ ] Confirm the storage bucket is **private** (a direct object URL without a signature → `403/400`).
- [ ] Mint a signed URL, wait > 15 minutes, retry → **expired** (`400/403`).
- [ ] Confirm the API response never leaks bucket names or storage paths for pending documents.
- [ ] Attempt to script the gate (see §4) → after rate limiting lands, should be throttled.
- [ ] Verify no more-sensitive-than-deck/one-pager document is in the catalog while the gate is self-asserted (M-01 discipline).

### 3.5 Enumeration / discovery

- [ ] Fuzz for hidden endpoints (`/admin`, `/api/*`, `/dashboard`) → only the two documented routes respond; others `404`.
- [ ] Confirm UUID PKs (no sequential IDs anywhere in responses).
- [ ] Confirm error messages are generic (no "user not found" vs "wrong password" style oracles — N/A here, but verify no info-leak).

### 3.6 Abuse / rate limiting / DoS

- [ ] Script 100 rapid POSTs to each endpoint → after H-02, expect `429` with `Retry-After`.
- [ ] Confirm bot protection (Turnstile/honeypot) blocks headless automation after M-02.
- [ ] Confirm Cloudflare WAF/rate rules active on `/api/*` after domain cutover (M-04).

### 3.7 Secrets & config

- [ ] `git log`/`git grep` for accidental secrets → none.
- [ ] Confirm `.env*` (except `.env.example`) are gitignored and no real secret sits in a committed env file.
- [ ] Confirm Vercel env vars are scoped correctly (service key = Production/Preview only; no service key in Development).

### 3.8 Error handling & logging

- [ ] Trigger a Supabase outage (bad URL) → user sees friendly message, no stack trace.
- [ ] Confirm logs don't capture full PII in error objects (audit L-03).

---

## 4. API Abuse & Load Test Scripts

Use these against a **preview/staging** environment (never production, never a third party). Purpose: verify rate limiting and abuse resistance.

```bash
# Burst test — expect 429s once rate limiting (H-02) is live
for i in $(seq 1 50); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/api/waitlist" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"bot+$i@example.com\",\"source\":\"abuse-test\"}"
done | sort | uniq -c   # want: mostly 429 after the first few 201s

# Data-room gate scripting — verify it can't be looped to harvest signed URLs
for i in $(seq 1 50); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/api/data-room" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Bot $i\",\"email\":\"bot$i@x.com\",\"firm\":\"Acme\"}"
done | sort | uniq -c

# Malformed / injection payloads — expect 400s, never 5xx with a stack trace
curl -i -X POST "$BASE/api/waitlist" -H "Content-Type: text/plain" -d 'not-json'
curl -i -X POST "$BASE/api/waitlist" -H "Content-Type: application/json" \
  -d '{"email":"x'"'"'; DROP TABLE waitlist;--@x.com"}'
curl -i -X POST "$BASE/api/waitlist" -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","role":"admin","is_admin":true}'  # extras must be dropped

# Direct RLS probe — the critical control. Expect empty/denied, NEVER lead data.
curl -s "$SUPABASE_URL/rest/v1/waitlist?select=*" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
```

```bash
# Header verification (run post-deploy)
curl -sI "$BASE/" | grep -iE 'strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy'
```

---

## 5. Recommended Tools

| Purpose               | Tool                                 | Notes / cost                          |
| --------------------- | ------------------------------------ | ------------------------------------- |
| Dependency vulns      | `npm audit`, Dependabot, Snyk        | audit/Dependabot free; Snyk free tier |
| SAST                  | GitHub CodeQL, Semgrep               | Free for many plans / OSS rules       |
| Secret scanning       | Gitleaks, GitHub secret scanning     | Free                                  |
| Header/TLS grading    | securityheaders.com, SSL Labs        | Free, web-based                       |
| DAST                  | OWASP ZAP (baseline scan)            | Free; run against staging only        |
| Accessibility (a11y)  | axe-core / Playwright + axe          | Planned CI step (E1.2.3)              |
| Lighthouse / perf-sec | Lighthouse CI                        | Planned CI gate (E1.2.4)              |
| Load/abuse            | `curl`/`hey`/`k6`                    | Staging only, coordinated             |
| Bot protection        | Cloudflare Turnstile                 | Free                                  |
| WAF / rate limit      | Cloudflare WAF + Rate Limiting Rules | Free/low tiers cover launch scale     |

---

## 6. Pre-Production Deployment Gate

**Run before every promotion to Production.** A failure blocks the deploy.

1. `npm run lint && npm run typecheck && npm run test && npm run build` — the standard gate (already CI-enforced).
2. `npm audit --audit-level=high` — zero high/critical.
3. SAST + secret scan green (CodeQL/Gitleaks).
4. Header check script (§4) passes against the **preview** build.
5. On any change to `/api/*`, the data-room flow, or headers: run the relevant §3 manual checklist section.
6. Post-deploy smoke: header check + RLS probe (§4) against Production; confirm the data room still gates and signed URLs expire.

For a **major change or quarterly**, run the _full_ §3 checklist plus an OWASP ZAP baseline scan against staging.

---

## Current Status

Unit/component + schema tests exist and are CI-enforced. Security-specific tests (§2.2), CI scanning (§2.3), Playwright/axe, and Lighthouse are recommended additions not yet wired. The manual checklist and abuse scripts are ready to run now against preview environments.

## Future Improvements

- Wire §2.3 CI steps and the planned Playwright/axe + Lighthouse gates.
- Encode each audit finding as an automated regression test as it is remediated.
- Add a scheduled (weekly) ZAP baseline scan against staging once launched.

## TODO

- [ ] Add security-specific Vitest cases (§2.2).
- [ ] Add `npm audit` + CodeQL + Gitleaks to CI (§2.3).
- [ ] Run the full §3 checklist before public launch and record results.

## References

- [`security-audit-report.md`](./security-audit-report.md)
- [`security-architecture.md`](./security-architecture.md)
- [`.claude/context/testing.md`](../../.claude/context/testing.md)
- OWASP Testing Guide; OWASP ZAP; CodeQL docs

## Related Documents

- [`../launch/launch-playbook.md`](../launch/launch-playbook.md)
- [`../engineering/quality-gates-explained.md`](../engineering/quality-gates-explained.md)

---

**Last Updated:** 2026-07-18
**Owner:** Orgofin Engineering (TODO: assign a security DRI)
