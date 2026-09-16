/**
 * Race Result Simple API – Adressliste (Event 391760).
 *
 * Live-Response (Stand 16.09.2026): kein JSON, sondern XLSX
 * Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 * Dateiname: Adressliste.xlsx
 *
 * Spalten (Zeile 1):
 * Startnr. | Name | Jg. | m/w | Verein | Wettbewerb | Straße | PLZ | Ort |
 * Mail | TShirt | Abendkarte Tape Jam
 *
 * Name = „Nachname, Vorname“. TShirt = Größe (S/M/… oder Kinder 140).
 * Abendkarte Tape Jam = Zahl (0 = keine Karte). Mail ist enthalten.
 * Kein Bezahlstatus. Straße/PLZ/Ort sind in der Datei, werden intern nicht
 * in PDFs oder die Admin-JSON übernommen.
 */
import { RACE_RESULT } from "@/lib/race-result";
import { parseXlsxSheet } from "@/lib/orga/xlsx";
import { rowsToParticipants } from "@/lib/orga/parse-adressliste";
import { buildOrgaStats, emptyOrgaStats } from "@/lib/orga/stats";
import type { OrgaParticipant, OrgaStats } from "@/lib/orga/types";
import { flattenRrListData } from "@/lib/anmeldungen/aggregate";

export function resolveRaceResultApiUrl(): string | null {
  const full = process.env.RACERESULT_API_URL?.trim();
  if (full) return full;
  const eventId = process.env.RACERESULT_EVENT_ID?.trim() || RACE_RESULT.eventId;
  const key = process.env.RACERESULT_API_KEY?.trim();
  if (eventId && key) return `https://api.raceresult.com/${eventId}/${key}`;
  return null;
}

function objectsToRows(records: Record<string, unknown>[]): string[][] {
  if (records.length === 0) return [];
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const rec of records) {
    for (const k of Object.keys(rec)) {
      if (k.startsWith("__") || seen.has(k)) continue;
      seen.add(k);
      keys.push(k);
    }
  }
  const rows = [keys];
  for (const rec of records) {
    rows.push(keys.map((k) => (rec[k] == null ? "" : String(rec[k]))));
  }
  return rows;
}

function payloadToRows(payload: unknown): string[][] {
  if (Array.isArray(payload)) {
    if (payload.length === 0) return [];
    if (Array.isArray(payload[0])) {
      return (payload as unknown[][]).map((r) => r.map((c) => (c == null ? "" : String(c))));
    }
    if (payload[0] && typeof payload[0] === "object") {
      return objectsToRows(payload as Record<string, unknown>[]);
    }
  }
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    const fields = Array.isArray(obj.DataFields) ? obj.DataFields.map(String) : [];
    if (obj.data !== undefined && fields.length > 0) {
      const recs = flattenRrListData(obj.data, fields);
      return objectsToRows(recs);
    }
  }
  return [];
}

function parseCsv(text: string): string[][] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return [];
  const sep = lines[0].includes(";") && !lines[0].includes(",") ? ";" : ",";
  return lines.map((line) => {
    const out: string[] = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (q && line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else q = !q;
      } else if (ch === sep && !q) {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out;
  });
}

async function parseBody(buf: Buffer, contentType: string, filename: string): Promise<string[][]> {
  const ct = contentType.toLowerCase();
  const name = filename.toLowerCase();
  const looksZip = buf.length >= 2 && buf[0] === 0x50 && buf[1] === 0x4b;
  if (
    looksZip ||
    ct.includes("spreadsheet") ||
    ct.includes("excel") ||
    name.endsWith(".xlsx")
  ) {
    return parseXlsxSheet(buf);
  }
  const text = buf.toString("utf8").replace(/^\uFEFF/, "");
  if (ct.includes("json") || text.startsWith("{") || text.startsWith("[")) {
    try {
      return payloadToRows(JSON.parse(text));
    } catch {
      throw new Error("Race-Result-Antwort ist kein gültiges JSON");
    }
  }
  return parseCsv(text);
}

function filenameFromDisposition(header: string | null): string {
  if (!header) return "";
  const m = /filename\*?=(?:UTF-8''|"?)([^";]+)/i.exec(header);
  return m ? decodeURIComponent(m[1].replace(/"/g, "")) : "";
}

export async function fetchOrgaAdressliste(): Promise<{
  stats: OrgaStats;
  participants: OrgaParticipant[];
}> {
  const url = resolveRaceResultApiUrl();
  if (!url) {
    return {
      stats: emptyOrgaStats(
        "RACERESULT_API_URL (oder RACERESULT_API_KEY) ist nicht gesetzt.",
      ),
      participants: [],
    };
  }

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json, text/csv, */*",
      "User-Agent": "Koderlauf-Webseite/1.0 (orga-admin)",
    },
  });
  if (!res.ok) {
    return {
      stats: emptyOrgaStats(`Race Result API nicht erreichbar (${res.status})`),
      participants: [],
    };
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const rows = await parseBody(
    buf,
    res.headers.get("content-type") ?? "",
    filenameFromDisposition(res.headers.get("content-disposition")),
  );
  const { participants, present, cols } = rowsToParticipants(rows);
  const stats = buildOrgaStats(participants, present, cols);
  return { stats, participants };
}
