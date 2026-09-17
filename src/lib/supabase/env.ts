/**
 * Öffentliche Keys dürfen ins Frontend. Secret-Keys nur Server.
 * Neue Supabase-Projekte liefern sb_publishable_ / sb_secret_
 * statt der alten JWT-anon / service_role-Keys.
 */

export const SUPABASE_PROJECT_REF = "rrhcoelbplyiwczzkrjl";
export const SUPABASE_PROJECT_URL = "https://rrhcoelbplyiwczzkrjl.supabase.co";
export const SUPABASE_SQL_EDITOR_URL =
  "https://supabase.com/dashboard/project/rrhcoelbplyiwczzkrjl/sql/new";

export function supabaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  return null;
}

/** Publishable (neu) oder anon JWT (alt) – beides ist öffentlich. */
export function supabasePublishableKey(): string | null {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return key || null;
}

/** Secret (neu) oder service_role JWT (alt) – nie ins Client-Bundle. */
export function supabaseSecretKey(): string | null {
  const key =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return key || null;
}

export function hasPublicSupabaseConfig(): boolean {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) return false;
  if (url.includes("placeholder")) return false;
  if (key === "placeholder") return false;
  return true;
}

export function hasAdminSupabaseConfig(): boolean {
  return Boolean(supabaseUrl() && supabaseSecretKey());
}
