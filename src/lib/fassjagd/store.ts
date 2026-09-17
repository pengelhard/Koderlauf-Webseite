import type { FassjagdBoard } from "@/lib/fassjagd/types";

export type FassjagdOverrides = {
  /** normalisierter Alias → kanonischer Anzeigename */
  aliases: Record<string, string>;
  /** zusätzliche Vereine außer Wertung (kanonischer Name) */
  excluded: string[];
  /** Personen-ID → Gruppenname (Fassjagd Verein/Firma/Gruppe) */
  personGroups: Record<string, string>;
  manualFreeze: boolean;
  freezeSnapshot: FassjagdBoard | null;
  /** ISO-Tag → Vereinsname → Anzahl (für 7-Tage-Flamme) */
  dailyCounts: Record<string, Record<string, number>>;
};

const EMPTY: FassjagdOverrides = {
  aliases: {},
  excluded: [],
  personGroups: {},
  manualFreeze: false,
  freezeSnapshot: null,
  dailyCounts: {},
};

type GlobalFassjagd = typeof globalThis & { __koderFassjagd?: FassjagdOverrides };

function store(): FassjagdOverrides {
  const g = globalThis as GlobalFassjagd;
  if (!g.__koderFassjagd) {
    g.__koderFassjagd = structuredClone(EMPTY);
  }
  if (!g.__koderFassjagd.personGroups) g.__koderFassjagd.personGroups = {};
  return g.__koderFassjagd;
}

export function getFassjagdOverrides(): FassjagdOverrides {
  return store();
}

export function mergeAlias(fromDisplay: string, toDisplay: string, normalizeKey: (s: string) => string) {
  const s = store();
  const fromKey = normalizeKey(fromDisplay);
  const toName = toDisplay.trim();
  if (!fromKey || !toName) return;
  s.aliases[fromKey] = toName;
}

export function setExcluded(name: string, excluded: boolean) {
  const s = store();
  const n = name.trim();
  if (!n) return;
  s.excluded = s.excluded.filter((x) => x !== n);
  if (excluded) s.excluded.push(n);
}

export function lockFreezeSnapshot(snapshot: FassjagdBoard) {
  const s = store();
  if (!s.freezeSnapshot) s.freezeSnapshot = snapshot;
}

export function setManualFreeze(on: boolean, snapshot: FassjagdBoard | null) {
  const s = store();
  s.manualFreeze = on;
  if (on && snapshot) s.freezeSnapshot = snapshot;
  if (!on) s.freezeSnapshot = null;
}

export function rememberDailyCounts(counts: Record<string, number>, now = new Date()) {
  const s = store();
  const day = now.toISOString().slice(0, 10);
  if (!s.dailyCounts[day]) s.dailyCounts[day] = { ...counts };
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - 16);
  const minDay = cutoff.toISOString().slice(0, 10);
  for (const key of Object.keys(s.dailyCounts)) {
    if (key < minDay) delete s.dailyCounts[key];
  }
}

export function weekAgoCounts(now = new Date()): Record<string, number> | null {
  const s = store();
  const ago = new Date(now);
  ago.setUTCDate(ago.getUTCDate() - 7);
  const key = ago.toISOString().slice(0, 10);
  return s.dailyCounts[key] ?? null;
}

export function exportOverrides(): FassjagdOverrides {
  return structuredClone(store());
}

export function importOverrides(next: Partial<FassjagdOverrides>) {
  const s = store();
  if (next.aliases) s.aliases = next.aliases;
  if (next.excluded) s.excluded = next.excluded;
  if (next.personGroups) s.personGroups = next.personGroups;
  if (typeof next.manualFreeze === "boolean") s.manualFreeze = next.manualFreeze;
  if (next.freezeSnapshot !== undefined) s.freezeSnapshot = next.freezeSnapshot;
  if (next.dailyCounts) s.dailyCounts = next.dailyCounts;
}
