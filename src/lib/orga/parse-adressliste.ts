import { splitAnzeigeName } from "@/lib/anmeldungen/aggregate";
import { TSHIRT_SIZES } from "@/lib/pricing";
import type { OrgaParticipant } from "@/lib/orga/types";

function normHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .replace(/[.]/g, "")
    .replace(/\s+/g, " ");
}

const HEADER_ALIASES: Record<string, keyof MappedCols> = {
  startnr: "bib",
  startnummer: "bib",
  bib: "bib",
  startno: "bib",
  name: "name",
  anzeigename: "name",
  nachname: "nachname",
  lastname: "nachname",
  vorname: "vorname",
  firstname: "vorname",
  "jg": "jahrgang",
  jahrgang: "jahrgang",
  yb: "jahrgang",
  "m/w": "geschlecht",
  geschlecht: "geschlecht",
  gender: "geschlecht",
  verein: "verein",
  club: "verein",
  wettbewerb: "wettbewerb",
  contest: "wettbewerb",
  strecke: "wettbewerb",
  mail: "mail",
  email: "mail",
  "e-mail": "mail",
  "e mail": "mail",
  tshirt: "tshirt",
  "t-shirt": "tshirt",
  "t shirt": "tshirt",
  shirt: "tshirt",
  groesse: "tshirt",
  größe: "tshirt",
  size: "tshirt",
  "abendkarte tape jam": "abendkarte",
  abendkarte: "abendkarte",
  "tape jam": "abendkarte",
  tapejam: "abendkarte",
  "abendkarten": "abendkarte",
  bezahlt: "payment",
  status: "payment",
  paid: "payment",
  payment: "payment",
  zahlstatus: "payment",
};

type MappedCols = {
  bib?: number;
  name?: number;
  nachname?: number;
  vorname?: number;
  jahrgang?: number;
  geschlecht?: number;
  verein?: number;
  wettbewerb?: number;
  mail?: number;
  tshirt?: number;
  abendkarte?: number;
  payment?: number;
};

export function mapHeaders(headers: string[]): { cols: MappedCols; present: string[] } {
  const cols: MappedCols = {};
  const present: string[] = [];
  headers.forEach((h, i) => {
    const raw = h.trim();
    if (!raw) return;
    present.push(raw);
    const key = HEADER_ALIASES[normHeader(raw)];
    if (key && cols[key] == null) cols[key] = i;
  });
  return { cols, present };
}

const NO_VALUE = new Set([
  "",
  "-",
  "–",
  "—",
  "0",
  "nein",
  "no",
  "n",
  "false",
  "kein",
  "keine",
  "keiner",
  "ohne",
  "kein t-shirt",
  "kein tshirt",
]);

const YES_VALUE = new Set(["ja", "yes", "true", "x", "1"]);

const SIZE_ORDER = [...TSHIRT_SIZES];

function mapLetterSize(s: string): string {
  const u = s.toUpperCase().replace(/\s+/g, "");
  const aliases: Record<string, string> = {
    XXXXL: "4XL",
    "4XL": "4XL",
    XXXL: "3XL",
    "3XL": "3XL",
    XXL: "XXL",
    "2XL": "XXL",
    XL: "XL",
    L: "L",
    M: "M",
    S: "S",
    XS: "XS",
  };
  return aliases[u] ?? u;
}

/** Normalisiert Race-Result-Größen (Kinder 116–164, Erwachsene S–4XL). */
export function normalizeTshirtSize(raw: string): string | null {
  const s = raw.trim();
  if (!s || NO_VALUE.has(s.toLowerCase())) return null;
  if (YES_VALUE.has(s.toLowerCase())) return "ohne Größe";
  if (/^\d{3}$/.test(s)) return s;
  const letter = mapLetterSize(s);
  if (SIZE_ORDER.includes(letter as (typeof SIZE_ORDER)[number])) return letter;
  if (/^(XS|S|M|L|XL|XXL|[2-5]XL)$/i.test(letter)) return letter;
  return s;
}

export function parseAbendkarten(raw: string): number {
  const s = raw.trim();
  if (!s || NO_VALUE.has(s.toLowerCase())) return 0;
  if (YES_VALUE.has(s.toLowerCase())) return 1;
  const n = Number.parseInt(s.replace(",", "."), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function cell(row: string[], idx: number | undefined): string {
  if (idx == null) return "";
  return (row[idx] ?? "").trim();
}

export function rowsToParticipants(
  rows: string[][],
): { participants: OrgaParticipant[]; present: string[]; cols: MappedCols } {
  if (rows.length === 0) return { participants: [], present: [], cols: {} };
  const headerRow = rows[0].map((h) => String(h ?? ""));
  const { cols, present } = mapHeaders(headerRow);
  const participants: OrgaParticipant[] = [];

  for (const row of rows.slice(1)) {
    if (!row.some((c) => String(c ?? "").trim())) continue;
    const nameRaw = cell(row, cols.name);
    let nachname = cell(row, cols.nachname);
    let vorname = cell(row, cols.vorname);
    if (!nachname && !vorname && nameRaw) {
      const split = splitAnzeigeName(nameRaw);
      nachname = split.nachname;
      vorname = split.vorname;
    }
    const name =
      nameRaw ||
      [nachname, vorname].filter(Boolean).join(", ") ||
      [vorname, nachname].filter(Boolean).join(" ");
    if (!name && !cell(row, cols.bib) && !cell(row, cols.mail)) continue;

    const tshirtRaw = cell(row, cols.tshirt);
    participants.push({
      bib: cell(row, cols.bib),
      name,
      nachname,
      vorname,
      jahrgang: cell(row, cols.jahrgang),
      geschlecht: cell(row, cols.geschlecht),
      verein: cell(row, cols.verein),
      wettbewerb: cell(row, cols.wettbewerb),
      mail: cell(row, cols.mail),
      tshirtRaw,
      tshirtSize: normalizeTshirtSize(tshirtRaw),
      abendkarten: parseAbendkarten(cell(row, cols.abendkarte)),
      paymentStatus: cell(row, cols.payment),
    });
  }

  return { participants, present, cols };
}
