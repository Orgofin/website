import { NextResponse } from "next/server";

import {
  getRetentionPurgeHealth,
  isRetentionPurgeHealthy,
} from "@/lib/api/retention";
import {
  checkRateLimit,
  clientIpFromHeaders,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";

/**
 * GET /api/health/retention — is the 24-month lead purge actually running?
 *
 * This exists to be polled by the external uptime monitor (launch-playbook
 * gate), which is the alerting mechanism: **200 = healthy, 503 = someone needs
 * to look**. A purge that silently stopped means the site keeps publishing the
 * retention promise in /privacy §8 while nothing enforces it, and until now the
 * only way to notice was to go and read `cron.job_run_details`.
 *
 * Why it is unauthenticated. The payload is a status word and two timestamps —
 * no personal data, no deleted-row counts, and no database error text (the seam
 * drops `last_error` deliberately). That /privacy publishes the retention
 * window already makes its existence public. Weighed against that, a shared
 * token would have to live in the monitor's config and in Vercel, and a health
 * check nobody can point a monitor at without credential plumbing is a health
 * check that does not get wired up. `/api/` is robots-disallowed, the response
 * is `no-store`, and the same per-IP rate limit as the write routes applies.
 *
 * Node runtime (default) — it uses the service-role Supabase client.
 */
const RATE_LIMIT = { limit: 30, windowMs: 60_000 }; // 30 checks / minute / IP

/** Never prerendered or cached: a stale "healthy" is worse than no answer. */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  const limit = await checkRateLimit(`health-retention:${ip}`, RATE_LIMIT);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { ...rateLimitHeaders(limit), ...NO_STORE } },
    );
  }

  const headers = { ...rateLimitHeaders(limit), ...NO_STORE };
  const result = await getRetentionPurgeHealth();

  // Not configured, or the RPC failed. 503 rather than 500: the check itself is
  // what is unavailable, and it must not read as healthy. This is also the
  // local/CI/preview response, where there is no service-role key — which is
  // why the monitor is pointed at production only.
  if (!result.ok) {
    return NextResponse.json(
      { status: "unavailable", error: result.error },
      { status: 503, headers },
    );
  }

  const { health } = result;
  return NextResponse.json(health, {
    status: isRetentionPurgeHealthy(health.status) ? 200 : 503,
    headers,
  });
}
