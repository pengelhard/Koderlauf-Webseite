import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { fehlerAusDatenbank, type SacheSaveResult } from "@/lib/sponsor-sachen-fehler";
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
  const result = await saveSacheVergeben(id, vergeben);
  if (!result.ok) console.error("Sponsor-Sache speichern:", result.error);
  return result.ok;
}

export async function saveSacheVergeben(id: string, vergeben: boolean): Promise<SacheSaveResult> {
  if (!SACHSPENDEN_SICHTBAR.some((f) => f.id === id)) {
    return { ok: false, error: "Diese Sache gibt es nicht." };
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Auf dem Server fehlt der Datenbank-Schlüssel (SUPABASE_SECRET_KEY). Deshalb bleibt der Haken nicht gespeichert.",
    };
  }
  try {
    const { data, error } = await supabase
      .from("fassjagd_state")
      .select("overrides")
      .eq("id", STATE_ID)
      .maybeSingle();
    if (error) return fehlerAusDatenbank(error.code, error.message);
    const existing =
      data?.overrides && typeof data.overrides === "object" && !Array.isArray(data.overrides)
        ? { ...(data.overrides as Record<string, unknown>) }
        : {};
    const next = new Set(vergebenAusOverrides(existing));
    if (vergeben) next.add(id);
    else next.delete(id);
    existing[KEY] = [...next];
    const { error: writeError } = await supabase.from("fassjagd_state").upsert(
      {
        id: STATE_ID,
        overrides: existing,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (writeError) return fehlerAusDatenbank(writeError.code, writeError.message);
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return fehlerAusDatenbank(undefined, message);
  }
}
