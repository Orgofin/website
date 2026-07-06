import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Shared validation schema for a waitlist signup. Used by both the API route
 * (request validation) and this wrapper (defense in depth), and re-exported for
 * the client form so validation rules live in exactly one place.
 */
export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  /** Optional origin tag, e.g. "home-hero" — where the signup came from. */
  source: z.string().max(120).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export type WaitlistResult = { ok: true } | { ok: false; error: string };

/**
 * Add an email to the waitlist. This is the seam (`frontend.md` §11): it calls
 * Supabase today; a future backend swaps in here without touching any caller.
 * Always returns a typed result — never throws — so callers render a friendly
 * message instead of a stack trace.
 */
export async function submitWaitlist(
  input: WaitlistInput,
): Promise<WaitlistResult> {
  const parsed = waitlistSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid submission.",
    };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("waitlist").insert({
      email: parsed.data.email,
      source: parsed.data.source ?? null,
    });

    if (error) {
      // Unique-violation = already signed up. Treat as success — the goal
      // (being on the list) is met, and it avoids leaking who is registered.
      if (error.code === "23505") {
        return { ok: true };
      }
      console.error("submitWaitlist: insert failed", error);
      return {
        ok: false,
        error: "We couldn't add you to the waitlist. Please try again.",
      };
    }

    return { ok: true };
  } catch (cause) {
    // Reaches here when Supabase isn't configured/reachable. Log for operators;
    // return a safe message for users.
    console.error("submitWaitlist: unexpected error", cause);
    return {
      ok: false,
      error: "The waitlist isn't available right now. Please try again later.",
    };
  }
}
