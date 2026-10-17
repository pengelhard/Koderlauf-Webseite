import { EVENT, parseDistanzKm } from "@/lib/event-config";

/**
 * Teamnamen normalisieren + Wertung (Fass Bier).
 * SV Obermögersheim ist Ausrichter und nicht in der Wertung.
 * Teamwertung gilt für Verein, Firma und andere Gruppen.
 */

export const VEREINS_WERTUNG = {
  /** Kurztitel für Überschriften */
  titel: "Fassjagd",
  preis: "ein Fass Bier",
  /** Klarer Einzeiler */
  kurz: "Das Team mit den meisten Startern gewinnt ein Fass Bier. Verein, Firma oder Gruppe.",
  stimme: "1 Person = 1 Stimme, auch Kinderlauf und Walking.",
  ausrichterCanonical: "SV Obermögersheim",
  /** Wie der Name bei der Anmeldung eingetragen werden soll */
  angabe: "Bei der Anmeldung denselben Namen angeben, sonst zählt es nicht.",
  ausrichterHinweis: "SV Obermögersheim ist Ausrichter und nicht in der Wertung.",
  /** Gleiche Kurzregeln für FAQ, Anmeldung und Tafel */
  punkte: [
    "Das Team mit den meisten Startern gewinnt ein Fass Bier. Verein, Firma oder Gruppe.",
    "1 Person = 1 Stimme, auch Kinderlauf und Walking.",
    "Bei Gleichstand zählen die gelaufenen Kilometer der Gruppe, danach wer zuerst angemeldet hat.",
    `Zählt bis zum Online-Anmeldeschluss (${EVENT.onlineAnmeldeschlussAnzeige}) – danach bleibt der Stand stehen.`,
    "SV Obermögersheim ist Ausrichter und nicht in der Wertung.",
  ],
  hinweis:
    "Das Team mit den meisten Startern gewinnt ein Fass Bier. Verein, Firma oder Gruppe. 1 Person = 1 Stimme, auch Kinderlauf und Walking. Bei Gleichstand zählen die gelaufenen Kilometer der Gruppe, danach wer zuerst angemeldet hat. Bei der Anmeldung denselben Namen angeben, sonst zählt es nicht. SV Obermögersheim ist Ausrichter und nicht in der Wertung.",
} as const;

/** Kanonische Vereinsnamen → bekannte Schreibweisen (kleingeschrieben, normalisiert). */
const VEREIN_ALIASES: Record<string, string[]> = {
  "SV Obermögersheim": [
    "svo",
    "sv o",
    "sv obermogersheim",
    "sv obermögersheim",
    "svo obermogersheim",
    "svo obermögersheim",
    "sportverein obermogersheim",
    "sportverein obermögersheim",
    "sv obermogersheim e.v",
    "sv obermögersheim e.v",
    "sv obermogersheim e.v.",
    "sv obermögersheim e.v.",
    "s.v. obermogersheim",
    "s.v. obermögersheim",
  ],
  "TV 1860 Gunzenhausen": [
    "tv 1860 gz",
    "tv 1860 gunzenhausen",
    "tv1860 gunzenhausen",
    "tv 1860 gunzenhausen e.v",
    "turnverein 1860 gunzenhausen",
  ],
};

export function normalizeVereinKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // Umlaute → Basisbuchstaben für Matching
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .replace(/e\.?\s*v\.?/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Alias-Lookup mit normalisierten Keys (ohne Umlaute). */
const ALIAS_TO_CANONICAL = (() => {
  const map = new Map<string, string>();
  for (const [canonical, aliases] of Object.entries(VEREIN_ALIASES)) {
    map.set(normalizeVereinKey(canonical), canonical);
    for (const a of aliases) {
      map.set(normalizeVereinKey(a), canonical);
    }
  }
  return map;
})();

export function resolveVerein(
  raw: string | undefined | null,
  extraAliases?: Record<string, string>,
): {
  display: string;
  canonical: string;
  isAusrichter: boolean;
  empty: boolean;
} {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) {
    return { display: "", canonical: "", isAusrichter: false, empty: true };
  }
  const key = normalizeVereinKey(trimmed);
  const canonical =
    extraAliases?.[key] ||
    ALIAS_TO_CANONICAL.get(key) ||
    trimmed.replace(/\s+/g, " ").trim();
  const isAusrichter = canonical === VEREINS_WERTUNG.ausrichterCanonical;
  return {
    display: canonical,
    canonical,
    isAusrichter,
    empty: false,
  };
}

export type VereinRankEntry = {
  name: string;
  total: number;
  /** Summe der Kilometer aller Starter (für Gleichstand-Regelung) */
  totalKm: number;
  /** Niedrigste Startnummer/rrId (für Gleichstand-Regelung) */
  firstReg: number;
  /** true = Ausrichter, nicht in der Fass-Bier-Wertung */
  ausgeschlossen: boolean;
};

function calculateTotalKmForVerein(participants: { strecke?: string }[]): number {
  let total = 0;
  for (const p of participants) {
    if (!p.strecke) continue;
    const km = parseDistanzKm(getDistanzForStrecke(p.strecke));
    total += km;
  }
  return total;
}

function getDistanzForStrecke(strecke: string): string {
  const normalized = strecke.toLowerCase().trim();
  if (normalized.includes("spielerei")) return "25 km";
  if (normalized.includes("trail")) return "10,5 km";
  if (normalized.includes("koderrunde")) return "8,5 km";
  if (normalized.includes("kurz") || normalized.includes("knackig")) return "4 km";
  if (normalized.includes("kinder")) return "800 m";
  return "0 km";
}

function getFirstRegKey(participants: { bib?: number; rrId?: number }[]): number {
  let min = Number.POSITIVE_INFINITY;
  for (const p of participants) {
    const n = p.bib ?? p.rrId;
    if (typeof n === "number" && n > 0 && n < min) min = n;
  }
  return min;
}

/**
 * Zählt Teams (Verein, Firma, Gruppe); sortiert Wertung (ohne Ausrichter) nach Teilnehmerzahl.
 * Bei Gleichstand: erst Kilometer-Summe, dann früheste Anmeldung (niedrigste Startnummer).
 * Ausrichter wird separat zurückgegeben (nur Info).
 */
export function rankVereine(
  participants: { verein?: string; strecke?: string; bib?: number; rrId?: number }[],
  extraAliases?: Record<string, string>,
): { ranking: VereinRankEntry[]; ausrichter: VereinRankEntry | null; ohneAngabe: number } {
  const byName = new Map<string, { verein?: string; strecke?: string; bib?: number; rrId?: number }[]>();
  let ohneAngabe = 0;

  for (const p of participants) {
    const r = resolveVerein(p.verein, extraAliases);
    if (r.empty) {
      ohneAngabe += 1;
      continue;
    }
    const arr = byName.get(r.canonical) ?? [];
    arr.push(p);
    byName.set(r.canonical, arr);
  }

  let ausrichter: VereinRankEntry | null = null;
  const ranking: VereinRankEntry[] = [];

  for (const [name, group] of byName) {
    const entry: VereinRankEntry = {
      name,
      total: group.length,
      totalKm: calculateTotalKmForVerein(group),
      firstReg: getFirstRegKey(group),
      ausgeschlossen: name === VEREINS_WERTUNG.ausrichterCanonical,
    };
    if (entry.ausgeschlossen) ausrichter = entry;
    else ranking.push(entry);
  }

  ranking.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.totalKm !== a.totalKm) return b.totalKm - a.totalKm;
    const fa = Number.isFinite(a.firstReg) ? a.firstReg : Number.MAX_SAFE_INTEGER;
    const fb = Number.isFinite(b.firstReg) ? b.firstReg : Number.MAX_SAFE_INTEGER;
    if (fa !== fb) return fa - fb;
    return a.name.localeCompare(b.name, "de");
  });

  return { ranking, ausrichter, ohneAngabe };
}
