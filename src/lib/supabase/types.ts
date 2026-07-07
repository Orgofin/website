/**
 * Supabase schema types.
 *
 * Hand-written for now. The schema is provisioned (two Supabase projects), and
 * its version-controlled source of truth is
 * `supabase/migrations/20260708000000_create_waitlist.sql` — these types mirror
 * that migration's `waitlist` table by hand (PRD §5, backlog E7.1.2).
 *
 * TODO(backlog E7.1.2): replace this file with `supabase gen types typescript`
 * output once the Supabase CLI is wired to the projects, and record the
 * generation command in the deployment runbook.
 */

export type WaitlistRow = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

export type WaitlistInsert = {
  email: string;
  source?: string | null;
};

export type Database = {
  public: {
    Tables: {
      waitlist: {
        Row: WaitlistRow;
        Insert: WaitlistInsert;
        Update: Partial<WaitlistInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
