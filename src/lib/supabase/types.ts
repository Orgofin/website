/**
 * Supabase schema types.
 *
 * Hand-written for now. The schema is provisioned (two Supabase projects), and
 * its version-controlled source of truth is the files in
 * `supabase/migrations/` — these types mirror those tables by hand
 * (PRD §5, backlog E7.1.2).
 *
 * TODO(backlog E7.1.2): replace this file with `supabase gen types typescript`
 * output once the Supabase CLI is wired to the projects, and record the
 * generation command in the deployment runbook.
 */

/**
 * The two retention columns on both lead tables are set by an operator, never
 * by this application — nothing in `lib/api/*` writes them, and the anon key
 * couldn't anyway (INSERT-only RLS). They appear here because the row type must
 * mirror the table, not because the site uses them. See
 * `supabase/migrations/20260724120000_lead_retention_expiry.sql`.
 */
type RetentionColumns = {
  /** Exempts the row from the 24-month purge until this moment. */
  retained_until: string | null;
  /** Why the row is exempt. */
  retained_reason: string | null;
};

export type WaitlistRow = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
} & RetentionColumns;

export type WaitlistInsert = {
  email: string;
  source?: string | null;
};

/** Mirrors `supabase/migrations/20260715120000_create_data_room_requests.sql`. */
export type DataRoomRequestRow = {
  id: string;
  name: string;
  email: string;
  firm: string;
  check_size: string | null;
  created_at: string;
} & RetentionColumns;

export type DataRoomRequestInsert = {
  name: string;
  email: string;
  firm: string;
  check_size?: string | null;
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
      data_room_requests: {
        Row: DataRoomRequestRow;
        Insert: DataRoomRequestInsert;
        Update: Partial<DataRoomRequestInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
