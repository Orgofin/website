import { createClient } from "@supabase/supabase-js";

import { env } from "@/env";
import type { Database } from "@/lib/supabase/types";

/**
 * Server-side Supabase client for use inside `lib/api/*` (never a component or
 * page — that boundary is the backend-migration seam, `frontend.md` §11, and is
 * ESLint-enforced: `@supabase/*` may only be imported from `lib/supabase/**`).
 *
 * Uses the anon key with no session persistence — the public write surfaces
 * (waitlist, newsletter…) rely on row-level-security policies, not elevated
 * credentials. Throws if the project isn't configured yet; callers in `lib/api`
 * translate that into a typed, user-safe error result.
 *
 * A browser client (`client.ts`) is intentionally deferred until the first
 * client-side Supabase use exists (e.g. a live waitlist count) — see the PR/
 * backlog note — rather than shipping an unused factory.
 */
export function createSupabaseServerClient() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured (set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY — see docs/deployment/environment-variables.md).",
    );
  }

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
}
