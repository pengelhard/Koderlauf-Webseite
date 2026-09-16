import type {
  AnmeldungParticipant,
  AnmeldungenStats,
  RaceResultParticipantRaw,
  StreckeCount,
} from "@/lib/anmeldungen/types";
import { resolveVerein, rankVereine } from "@/lib/anmeldungen/vereine";
import { getFassjagdOverrides } from "@/lib/fassjagd/store";

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
  "koderunde ( walking)": "Koderrunde (Walking)",
  "koderunde (walking)": "Koderrunde (Walking)",
  "koderunde ( lauf)": "Koderrunde (Lauf)",
  "koderunde (lauf)": "Koderrunde (Lauf)",
  trailrun: "Trailrun",
  "trail run": "Trailrun",
  "10,5 km": "Trailrun",
  spielerei: "Spielerei",
  "25 km": "Spielerei",
  "24 km": "Spielerei",
  "24,7 km": "Spielerei",
  "24.7 km": "Spielerei",
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
    vereine: { ranking: [], ausrichter: null, ohneAngabe: 0 },
  };
}

function pickNumber(row: RaceResultParticipantRaw, keys: string[]): number | undefined {
  const s = pickString(row, keys);
  if (!s) return undefined;
  const n = Number.parseInt(s.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : undefined;
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
  if (!key) return "";
  if (CONTEST_ALIASES[key]) return CONTEST_ALIASES[key];
  // Teiltreffer
  for (const [alias, label] of Object.entries(CONTEST_ALIASES)) {
    if (key.includes(alias) || alias.includes(key)) return label;
  }
  // Titel-Case beibehalten falls unbekannt
  return raw.trim();
}

/** RR-Listenfeld „Nachname, Vorname“ oder „Vorname Nachname“. */
export function splitAnzeigeName(raw: string): { nachname: string; vorname: string } {
  const s = raw.trim();
  if (!s) return { nachname: "", vorname: "" };
  if (s.includes(",")) {
    const [nachname, ...rest] = s.split(",");
    return { nachname: nachname.trim(), vorname: rest.join(",").trim() };
  }
  const parts = s.split(/\s+/);
  if (parts.length === 1) return { nachname: parts[0], vorname: "" };
  return { nachname: parts[parts.length - 1], vorname: parts.slice(0, -1).join(" ") };
}

export function mapRaceResultRow(
  row: RaceResultParticipantRaw,
  contestById?: Record<string, string>,
): AnmeldungParticipant {
  const vereinRaw = pickString(row, ["Club", "CLUB", "Verein", "Team"]) || undefined;
  const vereinResolved = resolveVerein(vereinRaw);

  let nachname = pickString(row, ["LastName", "Nachname", "FamilyName"]);
  let vorname = pickString(row, ["FirstName", "Vorname", "GivenName"]);
  if (!nachname && !vorname) {
    const split = splitAnzeigeName(pickString(row, ["AnzeigeName", "DisplayName", "Name"]));
    nachname = split.nachname;
    vorname = split.vorname;
  }

  const contestRaw = pickString(row, [
    "Contest",
    "CONTEST",
    "CONTEST.NAME",
    "ContestName",
    "Wettbewerb",
    "Competition",
    "Event",
    // Aus Listen-Metadaten bzw. RR-Gruppenkopf (#1_Trailrun)
    "__listContest",
    "__groupContest",
  ]);
  const contestNamed =
    (contestRaw && contestById?.[contestRaw]) || contestById?.[contestRaw.replace(/^0+/, "")] || contestRaw;

  return {
    nachname,
    vorname,
    geschlecht: normalizeGender(
      pickString(row, ["Gender", "Sex", "Geschlecht", "GeschlechtMW", "MaleFemale", "MF"]),
    ),
    strecke: normalizeContest(contestNamed),
    jahrgang:
      pickString(row, ["YB", "YEAR", "YearOfBirth", "Jahrgang", "DateOfBirth", "DOB"]) || undefined,
    verein: vereinResolved.empty ? undefined : vereinResolved.display,
    nation: pickString(row, ["Nation", "Nationality", "Country"]) || undefined,
    bib: pickNumber(row, ["BIB", "Bib", "Startnummer", "StartNo", "Startnumber"]),
    rrId: pickNumber(row, ["ID", "Id", "ContestantId", "PID"]),
  };
}

/** RR-Gruppenkopf z. B. `#1_Trailrun` → `Trailrun`. */
export function parseRrGroupLabel(key: string): string {
  const match = key.match(/^#\d+_(.*)$/);
  return (match?.[1] ?? key).trim();
}

function isCountOnlyRow(row: unknown[], fieldCount: number): boolean {
  return fieldCount > 0 && row.length > 0 && row.length !== fieldCount;
}

/**
 * RR liefert `data` oft gruppiert: `{ "#1_Trailrun": { "#1_Männlich": [rows] } }`.
 * Die erste Gruppe ist der Wettbewerb/die Strecke.
 */
export function flattenRrListData(
  data: unknown,
  fields: string[],
  groups: string[] = [],
): RaceResultParticipantRaw[] {
  if (Array.isArray(data)) {
    const rows: RaceResultParticipantRaw[] = [];
    for (const row of data) {
      if (Array.isArray(row)) {
        if (isCountOnlyRow(row, fields.length)) continue;
        const rec: RaceResultParticipantRaw = {};
        fields.forEach((f, i) => {
          rec[f] = row[i];
        });
        if (groups[0]) rec.__groupContest = groups[0];
        rows.push(rec);
        continue;
      }
      if (row && typeof row === "object") {
        const rec = { ...(row as RaceResultParticipantRaw) };
        if (groups[0] && rec.__groupContest == null) rec.__groupContest = groups[0];
        rows.push(rec);
      }
    }
    return rows;
  }

  if (data && typeof data === "object") {
    const out: RaceResultParticipantRaw[] = [];
    for (const [key, value] of Object.entries(data)) {
      const label = parseRrGroupLabel(key);
      out.push(...flattenRrListData(value, fields, [...groups, label]));
    }
    return out;
  }

  return [];
}

function asRowArray(payload: unknown): RaceResultParticipantRaw[] {
  if (Array.isArray(payload)) {
    return payload as RaceResultParticipantRaw[];
  }
  if (!payload || typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;
  const fields = Array.isArray(obj.DataFields) ? obj.DataFields.map(String) : [];
  if (obj.data !== undefined && fields.length > 0) {
    return flattenRrListData(obj.data, fields);
  }

  for (const key of ["data", "participants", "Participants", "list", "rows", "Items"]) {
    if (Array.isArray(obj[key])) {
      const arr = obj[key] as unknown[];
      if (arr.length === 0) return [];
      if (arr[0] && typeof arr[0] === "object" && !Array.isArray(arr[0])) {
        return arr as RaceResultParticipantRaw[];
      }
    }
  }
  return [];
}

/**
 * Baut Statistik (+ normalisierte Teilnehmer) aus einer RR-JSON-Liste.
 * `contestById` mappt RR-Contest-IDs (z. B. "1") auf Namen aus der Publish-Config.
 */
export function aggregateFromRaceResultJson(
  payload: unknown,
  contestById?: Record<string, string>,
): AnmeldungenStats {
  const rows = asRowArray(payload);
  const participants = rows
    .map((row) => mapRaceResultRow(row, contestById))
    .filter((p) => p.nachname || p.vorname || p.strecke);

  const strecken = emptyStrecken();
  let m = 0;
  let w = 0;

  for (const p of participants) {
    if (p.geschlecht === "m") m += 1;
    else if (p.geschlecht === "w") w += 1;

    if (!p.strecke) continue;
    const label = STRECKEN_ORDER_2027.includes(p.strecke as Strecke2027)
      ? p.strecke
      : p.strecke;

    if (!strecken[label]) strecken[label] = { total: 0, m: 0, w: 0 };
    strecken[label].total += 1;
    if (p.geschlecht === "m") strecken[label].m += 1;
    else if (p.geschlecht === "w") strecken[label].w += 1;
  }

  // Sortierte Participants für die Liste
  const sorted = [...participants].sort((a, b) => {
    const s = a.strecke.localeCompare(b.strecke, "de");
    if (s !== 0) return s;
    const n = a.nachname.localeCompare(b.nachname, "de");
    if (n !== 0) return n;
    return a.vorname.localeCompare(b.vorname, "de");
  });

  const vereinStats = rankVereine(sorted, getFassjagdOverrides().aliases);

  return {
    total: participants.length,
    gender: { m, w },
    strecken,
    lastUpdated: new Date().toISOString(),
    participants: sorted,
    source: "race-result",
    vereine: {
      ranking: vereinStats.ranking.map(({ name, total }) => ({ name, total })),
      ausrichter: vereinStats.ausrichter
        ? { name: vereinStats.ausrichter.name, total: vereinStats.ausrichter.total }
        : null,
      ohneAngabe: vereinStats.ohneAngabe,
    },
  };
}
