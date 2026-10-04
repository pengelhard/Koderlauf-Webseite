import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getFlaeche, SACHSPENDEN_SICHTBAR, sacheMehrfach } from "@/lib/sponsoring-2027";

const STATE_ID = 1;
const KEY = "sponsorVergeben";

export function vergebenAusOverrides(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const raw = (value as Record<string, unknown>)[KEY];
  if (!Array.isArray(raw)) return [];
  const erlaubt = new Set(SACHSPENDEN_SICHTBAR.map((f) => f.id));
  return raw.filter((id): id is string => typeof id === "string" && erlaubt.has(id));
}

export async function listVergebeneSachen(): Promise<string[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("fassjagd_state")
      .select("overrides")
      .eq("id", STATE_ID)
      .maybeSingle();
    if (error || !data) return [];
    return vergebenAusOverrides((data as { overrides?: unknown }).overrides);
  } catch {
    return [];
  }
}

export function sacheDarfAutomatischSchliessen(id: string | null | undefined): boolean {
  if (!id || sacheMehrfach(id)) return false;
  return Boolean(getFlaeche(id)) && !getFlaeche(id)?.halfteVon;
}

/** true = gespeichert. false = keine Datenbank oder unbekannte Sache. */
export async function setSacheVergeben(id: string, vergeben: boolean): Promise<boolean> {
  if (!SACHSPENDEN_SICHTBAR.some((f) => f.id === id)) return false;
  const supabase = createAdminSupabaseClient();
  if (!supabase) return false;
  try {
    const { data, error } = await supabase
      .from("fassjagd_state")
      .select("overrides")
      .eq("id", STATE_ID)
      .maybeSingle();
    if (error) return false;
    const existing =
      data?.overrides && typeof data.overrides === "object" && !Array.isArray(data.overrides)
        ? { ...(data.overrides as Record<string, unknown>) }
        : {};
    const next = new Set(vergebenAusOverrides(existing));
    if (vergeben) next.add(id);
    else next.delete(id);
    existing[KEY] = [...next];
    const { error: writeError } = await supabase.from("fassjagd_state").upsert({
      id: STATE_ID,
      overrides: existing,
      updated_at: new Date().toISOString(),
    });
    return !writeError;
  } catch {
    return false;
  }
}
