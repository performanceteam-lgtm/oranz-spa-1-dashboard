import { createClient } from "@supabase/supabase-js";

// Used in the browser (dashboard UI) — safe to expose, respects Supabase row-level security
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Used only inside API routes (server-side) — full access, never sent to the browser
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
