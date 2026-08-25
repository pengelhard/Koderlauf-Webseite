import type {
  AnmeldungParticipant,
  AnmeldungenStats,
  RaceResultParticipantRaw,
  StreckeCount,
} from "@/lib/anmeldungen/types";

/** Anzeige-Reihenfolge der Strecken 2027 */
export const STRECKEN_ORDER_2027 = [
  "Kinderlauf",
  "Kurz und knackig",
  "Koderrunde (Lauf)",
  "Koderrunde (Walking)",
  "Trailrun",
  "Spielerei",
] as const;

export type Strecke2027 = (typeof STRECKEN_ORDER_2027)[number];

/** Mappt RR-Contest-Namen auf unsere Anzeige-Labels */
const CONTEST_ALIASES: Record<string, Strecke2027> = {
  kinderlauf: "Kinderlauf",
  "800 m": "Kinderlauf",
  "800m": "Kinderlauf",
  "kurz und knackig": "Kurz und knackig",
  "kurz & knackig": "Kurz und knackig",
  "4 km": "Kurz und knackig",
  "4km": "Kurz und knackig",
  koderrunde: "Koderrunde (Lauf)",
  "koderrunde (lauf)": "Koderrunde (Lauf)",
  "koderrunde lauf": "Koderrunde (Lauf)",
  "8,5 km lauf": "Koderrunde (Lauf)",
  "koderrunde (walking)": "Koderrunde (Walking)",
  "koderrunde walking": "Koderrunde (Walking)",
  walking: "Koderrunde (Walking)",
  trailrun: "Trailrun",
  "trail run": "Trailrun",
  "10,5 km": "Trailrun",
  spielerei: "Spielerei",
  "25 km": "Spielerei",
};

function emptyStrecken(): Record<string, StreckeCount> {
  return Object.fromEntries(
    STRECKEN_ORDER_2027.map((s) => [s, { total: 0, m: 0, w: 0 }]),
  );
}

export function emptyStats2027(): AnmeldungenStats {
  return {
    total: 0,
    gender: { m: 0, w: 0 },
    strecken: emptyStrecken(),
    lastUpdated: "",
    participants: [],
    source: "empty",
  };
}

function pickString(row: RaceResultParticipantRaw, keys: string[]): string {
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  // case-insensitive fallback
  const lowerMap = new Map(
    Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]),
  );
  for (const key of keys) {
    const v = lowerMap.get(key.toLowerCase());
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return "";
}

function normalizeGender(raw: string): AnmeldungParticipant["geschlecht"] {
  const s = raw.trim().toLowerCase();
  if (!s) return "u";
  if (s === "m" || s === "male" || s.startsWith("männ") || s.startsWith("mann")) return "m";
  if (s === "w" || s === "f" || s === "female" || s.startsWith("weib")) return "w";
  if (s === "d" || s.startsWith("divers") || s === "x") return "d";
  // RR oft: m/w als "m" / "w" oder "Male"/"Female"
  if (s.includes("männ") || s === "man") return "m";
  if (s.includes("weib") || s === "woman") return "w";
  return "u";
}

export function normalizeContest(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!key) return "Unbekannt";
  if (CONTEST_ALIASES[key]) return CONTEST_ALIASES[key];
  // Teiltreffer
  for (const [alias, label] of Object.entries(CONTEST_ALIASES)) {
    if (key.includes(alias) || alias.includes(key)) return label;
  }
  // Titel-Case beibehalten falls unbekannt
  return raw.trim();
}

export function mapRaceResultRow(row: RaceResultParticipantRaw): AnmeldungParticipant {
  return {
    nachname: pickString(row, ["LastName", "Nachname", "Name", "FamilyName"]),
    vorname: pickString(row, ["FirstName", "Vorname", "GivenName"]),
    geschlecht: normalizeGender(
      pickString(row, ["Gender", "Sex", "Geschlecht", "MaleFemale", "MF"]),
    ),
    strecke: normalizeContest(
      pickString(row, ["Contest", "ContestName", "Wettbewerb", "Competition", "Event"]),
    ),
    jahrgang: pickString(row, ["YB", "YearOfBirth", "Jahrgang", "DateOfBirth", "DOB"]) || undefined,
    verein: pickString(row, ["Club", "Verein", "Team"]) || undefined,
    nation: pickString(row, ["Nation", "Nationality", "Country"]) || undefined,
  };
}

function asRowArray(payload: unknown): RaceResultParticipantRaw[] {
  if (Array.isArray(payload)) return payload as RaceResultParticipantRaw[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of ["data", "participants", "Participants", "list", "rows", "Items"]) {
      if (Array.isArray(obj[key])) return obj[key] as RaceResultParticipantRaw[];
    }
  }
  return [];
}

/**
 * Baut Statistik (+ normalisierte Teilnehmer) aus einer RR-JSON-Liste.
 */
export function aggregateFromRaceResultJson(payload: unknown): AnmeldungenStats {
  const rows = asRowArray(payload);
  const participants = rows.map(mapRaceResultRow).filter((p) => p.nachname || p.vorname || p.strecke);

  const strecken = emptyStrecken();
  let m = 0;
  let w = 0;

  for (const p of participants) {
    const label = STRECKEN_ORDER_2027.includes(p.strecke as Strecke2027)
      ? p.strecke
      : p.strecke || "Unbekannt";

    if (!strecken[label]) strecken[label] = { total: 0, m: 0, w: 0 };
    strecken[label].total += 1;
    if (p.geschlecht === "m") {
      strecken[label].m += 1;
      m += 1;
    } else if (p.geschlecht === "w") {
      strecken[label].w += 1;
      w += 1;
    }
  }

  // Sortierte Participants für die Liste
  const sorted = [...participants].sort((a, b) => {
    const s = a.strecke.localeCompare(b.strecke, "de");
    if (s !== 0) return s;
    const n = a.nachname.localeCompare(b.nachname, "de");
    if (n !== 0) return n;
    return a.vorname.localeCompare(b.vorname, "de");
  });

  return {
    total: participants.length,
    gender: { m, w },
    strecken,
    lastUpdated: new Date().toISOString(),
    participants: sorted,
    source: "race-result",
  };
}
