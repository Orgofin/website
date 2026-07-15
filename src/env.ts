import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Typed, validated environment variables.
 *
 * The Supabase vars are provisioned (two projects — prod + non-prod, set
 * per-environment in Vercel; see docs/deployment/environment-variables.md) but
 * are kept `.optional()` here on purpose: `createEnv` validates eagerly at
 * import, and CI + local `next build` compile WITHOUT any Supabase project.
 * Making them required would break those builds for zero benefit — the deploy
 * that actually serves traffic already has them, and their absence is enforced
 * at request time by the guard in `lib/supabase/server.ts`, which throws a clear
 * error that `lib/api/waitlist.ts` turns into a safe user-facing result.
 *
 * GA4 is provisioned the same way (`NEXT_PUBLIC_GA_MEASUREMENT_ID`, Vercel
 * Production only) and stays `.optional()` for the same reason — the boot
 * component and `lib/analytics/track.ts` both no-op without it. Tighten any
 * field to `z.string().min(1)` (or `.url()`) only once EVERY build path that
 * imports this module is guaranteed to have the value.
 */
export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
    // Canonical site origin, used to build absolute URLs for metadata,
    // sitemap, and robots. Optional in dev; set per-environment in Vercel.
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
