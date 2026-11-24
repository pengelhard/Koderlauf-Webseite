import { createAdminSupabaseClient } from "../supabase/admin.ts";
import {
  exportOverrides,
  importOverrides,
  type FassjagdOverrides,
} from "./store.ts";

const STATE_ID = 1;

function asRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "string" && k) out[k] = v;
  }
  return out;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string");
}

function asDailyCounts(value: unknown): Record<string, Record<string, number>> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, Record<string, number>> = {};
  for (const [day, groups] of Object.entries(value as Record<string, unknown>)) {
    if (!groups || typeof groups !== "object" || Array.isArray(groups)) continue;
    const inner: Record<string, number> = {};
    for (const [name, n] of Object.entries(groups as Record<string, unknown>)) {
      if (typeof n === "number" && Number.isFinite(n)) inner[name] = n;
    }
    out[day] = inner;
  }
  return out;
}

function isEmptyRecord(value: Record<string, unknown> | undefined): boolean {
  return !value || Object.keys(value).length === 0;
}

/** JSON aus der DB → Store-Form (unbekannte Felder werden ignoriert). */
export function overridesFromJson(value: unknown): Partial<FassjagdOverrides> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const next: Partial<FassjagdOverrides> = {};
  if ("aliases" in row) next.aliases = asRecord(row.aliases);
  if ("excluded" in row) next.excluded = asStringArray(row.excluded);
  if ("personGroups" in row) next.personGroups = asRecord(row.personGroups);
  if (typeof row.manualFreeze === "boolean") next.manualFreeze = row.manualFreeze;
  if ("freezeSnapshot" in row) {
    next.freezeSnapshot = row.freezeSnapshot
      ? (row.freezeSnapshot as FassjagdOverrides["freezeSnapshot"])
      : null;
  }
  if ("dailyCounts" in row) next.dailyCounts = asDailyCounts(row.dailyCounts);
  return next;
}

/**
 * Verbindet RAM-Stand und DB-Stand zum Schreiben.
 * Leere RAM-Maps (Aliase, Personen-Gruppen, Tagesstände) dürfen DB-Werte
 * nicht überschreiben. Nach erfolgreichem Hydrate ist der RAM der
 * Quellstand für personGroups (damit Zuweisungen auch gelöscht werden können).
 */
export function mergeOverridesForPersist(
  existing: unknown,
  ram: FassjagdOverrides,
  hydrateOk: boolean,
): FassjagdOverrides {
  const db = overridesFromJson(existing);
  const dbAliases = db.aliases ?? {};
  const dbGroups = db.personGroups ?? {};
  const dbCounts = db.dailyCounts ?? {};
  const dbExcluded = db.excluded ?? [];

  const aliases = isEmptyRecord(ram.aliases)
    ? dbAliases
    : { ...dbAliases, ...ram.aliases };

  const personGroups = hydrateOk
    ? ram.personGroups
    : isEmptyRecord(ram.personGroups)
      ? dbGroups
      : { ...dbGroups, ...ram.personGroups };

  const excluded =
    hydrateOk || ram.excluded.length > 0 ? ram.excluded : dbExcluded;

  const dailyCounts = isEmptyRecord(ram.dailyCounts)
    ? dbCounts
    : { ...dbCounts, ...ram.dailyCounts };

  const useRamFreeze = hydrateOk || ram.manualFreeze || ram.freezeSnapshot;
  return {
    aliases,
    excluded,
    personGroups,
    manualFreeze: useRamFreeze ? ram.manualFreeze : (db.manualFreeze ?? false),
    freezeSnapshot: useRamFreeze
      ? ram.freezeSnapshot
      : (db.freezeSnapshot ?? null),
    dailyCounts,
  };
}

let lastHydrateOk = false;
let lastPersistError: string | null = null;

export function wasFassjagdHydrated(): boolean {
  return lastHydrateOk;
}

export function lastFassjagdPersistError(): string | null {
  return lastPersistError;
}

export async function readFassjagdOverridesFromDb(): Promise<{
  ok: boolean;
  overrides: Partial<FassjagdOverrides>;
  raw: unknown;
}> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return { ok: false, overrides: {}, raw: null };
  try {
    const { data, error } = await supabase
      .from("fassjagd_state")
      .select("overrides")
      .eq("id", STATE_ID)
      .maybeSingle();
    if (error || !data) return { ok: false, overrides: {}, raw: null };
    const raw = (data as { overrides?: unknown }).overrides;
    return { ok: true, overrides: overridesFromJson(raw), raw: raw ?? {} };
  } catch {
    return { ok: false, overrides: {}, raw: null };
  }
}

export async function hydrateFassjagdFromDb(): Promise<boolean> {
  const read = await readFassjagdOverridesFromDb();
  if (!read.ok) {
    lastHydrateOk = false;
    return false;
  }
  importOverrides(read.overrides);
  lastHydrateOk = true;
  return true;
}

export async function persistFassjagdToDb(): Promise<boolean> {
  lastPersistError = null;
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    lastPersistError = "Supabase-Admin ist nicht konfiguriert.";
    return false;
  }
  try {
    const read = await readFassjagdOverridesFromDb();
    if (!lastHydrateOk && read.ok) {
      // RAM-Änderungen behalten, fehlende Keys aus der DB ergänzen.
      const ram = exportOverrides();
      const db = read.overrides;
      importOverrides({
        aliases: { ...(db.aliases ?? {}), ...ram.aliases },
        personGroups: { ...(db.personGroups ?? {}), ...ram.personGroups },
        excluded: ram.excluded.length > 0 ? ram.excluded : (db.excluded ?? []),
        dailyCounts: { ...(db.dailyCounts ?? {}), ...ram.dailyCounts },
        manualFreeze: ram.manualFreeze || db.manualFreeze,
        freezeSnapshot: ram.freezeSnapshot ?? db.freezeSnapshot ?? null,
      });
      lastHydrateOk = true;
    }

    const merged = mergeOverridesForPersist(read.raw ?? {}, exportOverrides(), lastHydrateOk);
    const existing =
      read.raw && typeof read.raw === "object" && !Array.isArray(read.raw)
        ? (read.raw as Record<string, unknown>)
        : {};
    const { error } = await supabase.from("fassjagd_state").upsert({
      id: STATE_ID,
      overrides: { ...existing, ...merged },
      updated_at: new Date().toISOString(),
    });
    if (error) {
      lastPersistError = error.message || "Speichern in der Datenbank fehlgeschlagen.";
      return false;
    }
    importOverrides(merged);
    return true;
  } catch (e) {
    lastPersistError = e instanceof Error ? e.message : "Speichern in der Datenbank fehlgeschlagen.";
    return false;
  }
}
