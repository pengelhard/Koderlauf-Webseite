import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import {
  hasPublicSupabaseConfig,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabase/env";

export async function createServerSupabaseClient() {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!hasPublicSupabaseConfig() || !url || !key) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server component — ignore
        }
      },
    },
  });
}
