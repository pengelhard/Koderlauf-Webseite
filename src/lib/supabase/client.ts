"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import {
  hasPublicSupabaseConfig,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabase/env";

export function createClient() {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!hasPublicSupabaseConfig() || !url || !key) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }
  return createBrowserClient<Database>(url, key);
}
