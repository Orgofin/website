/**
 * Supabase schema types.
 *
 * Hand-written for now — the Supabase project is not provisioned yet, so these
 * cannot be generated with `supabase gen types typescript`. They mirror the
 * intended `waitlist` table (PRD §5, backlog E7.1.2).
 *
 * TODO(backlog E7.1.2): replace this file with generated types once the schema
 * exists, and keep the generation command in the deployment runbook.
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
