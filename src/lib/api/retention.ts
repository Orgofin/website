import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { RetentionPurgeHealthRow } from "@/lib/supabase/types";

/**
 * Whether the 24-month retention purge is actually running.
 *
 * - `healthy` — a successful run inside the staleness window.
 * - `failing` — the most recent attempt raised. Actionable immediately, even if
 *   a success 24 hours earlier is still inside the window.
 * - `stale`   — no successful run for longer than `staleAfterHours`. The usual
 *   cause is pg_cron never having been enabled on the project, which lets the
 *   migration succeed while scheduling nothing.
 * - `unknown` — no run history at all. Only reachable if the log table was
 *   truncated, since the migration seeds a baseline row.
 *
 * The verdict is computed in SQL (`retention_purge_health()`), not here. One
 * definition of "healthy", and the threshold that produces it travels with the
 * answer as `staleAfterHours` rather than being restated in TypeScript.
 */
export type RetentionPurgeStatus = RetentionPurgeHealthRow["status"];

export type RetentionPurgeHealth = {
  status: RetentionPurgeStatus;
  lastRunAt: string | null;
  lastRunStatus: string | null;
  lastSuccessAt: string | null;
  hoursSinceSuccess: number | null;
  staleAfterHours: number;
};

export type RetentionHealthResult =
  { ok: true; health: RetentionPurgeHealth } | { ok: false; error: string };

/** Statuses that should page someone. */
const UNHEALTHY: readonly RetentionPurgeStatus[] = [
  "failing",
  "stale",
  "unknown",
];

export function isRetentionPurgeHealthy(status: RetentionPurgeStatus): boolean {
  return !UNHEALTHY.includes(status);
}

/**
 * Read the purge health verdict (`frontend.md` §11 seam — Supabase today, a
 * future backend swaps in here without touching the route handler).
 *
 * Uses the service-role client because `retention_purge_health()` is revoked
 * from `anon` and `authenticated`: it reads a table holding deleted-row counts
 * and raw database error text, none of which the public key should reach.
 *
 * Note what this function drops. The RPC returns `last_error`, and it is not
 * carried into `RetentionPurgeHealth` — raw `sqlerrm` text can name schema
 * objects and is not something an HTTP response should ever hand out. An
 * operator reads it from the database instead (see the runbook).
 *
 * Always returns a typed result; never throws.
 */
export async function getRetentionPurgeHealth(): Promise<RetentionHealthResult> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.rpc("retention_purge_health");

    if (error) {
      console.error("getRetentionPurgeHealth: rpc failed", error);
      return { ok: false, error: "Could not read retention purge health." };
    }

    const row = data?.[0];
    if (!row) {
      // The function returns exactly one row by construction, so an empty
      // result means the migration is missing or a different function is
      // installed. That is itself a monitoring failure, not a healthy state.
      return { ok: false, error: "Retention purge health is unavailable." };
    }

    return {
      ok: true,
      health: {
        status: row.status,
        lastRunAt: row.last_run_at,
        lastRunStatus: row.last_run_status,
        lastSuccessAt: row.last_success_at,
        hoursSinceSuccess: row.hours_since_success,
        staleAfterHours: row.stale_after_hours,
      },
    };
  } catch (cause) {
    // Service key absent (local, CI, preview) or Supabase unreachable.
    console.error("getRetentionPurgeHealth: unavailable", cause);
    return { ok: false, error: "Retention purge health is not configured." };
  }
}
