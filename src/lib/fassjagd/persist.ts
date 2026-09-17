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

export async function hydrateFassjagdFromDb(): Promise<boolean> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return false;
  try {
    const { data, error } = await supabase
      .from("fassjagd_state")
      .select("overrides")
      .eq("id", STATE_ID)
      .maybeSingle();
    if (error || !data) return false;
    importOverrides(overridesFromJson(data.overrides));
    return true;
  } catch {
    return false;
  }
}

export async function persistFassjagdToDb(): Promise<boolean> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("fassjagd_state").upsert({
      id: STATE_ID,
      overrides: exportOverrides(),
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}
