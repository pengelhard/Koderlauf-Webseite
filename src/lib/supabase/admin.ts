import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";
import {
  hasAdminSupabaseConfig,
  supabaseSecretKey,
  supabaseUrl,
} from "./env.ts";

/** Server-only: umgeht RLS. Für Orga-PDF und Fassjagd-Persistenz. */
export function createAdminSupabaseClient() {
  const url = supabaseUrl();
  const secret = supabaseSecretKey();
  if (!url || !secret) return null;

  return createClient<Database>(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export { hasAdminSupabaseConfig };
