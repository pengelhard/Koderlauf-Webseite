import { NextResponse } from "next/server";

const SHEET_ID = "1A7vdAiOWQ0ZP1VnStvOD3YAlgR_xYN70A0eTPvZXaa4";
const GID = "769374861";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export interface Teilnehmer {
  vorname: string;
  nachname: string;
  geschlecht: string;
  geburtsdatum: string;
  altersklasse: string;
  strecke: string;
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (ch === '"') {
      if (inQuotes && csv[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if (ch === "\n" && !inQuotes) {
      row.push(current.trim());
      rows.push(row);
      row = [];
      current = "";
    } else {
      current += ch;
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }
  return rows;
}

function berechneAltersklasse(geburtsdatumStr: string, geschlecht: string): string {
  if (!geburtsdatumStr) return "–";

  const parts = geburtsdatumStr.split(".");
  if (parts.length !== 3) return "–";

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const birthDate = new Date(year, month, day);

  const eventDate = new Date(2026, 3, 4);
  let age = eventDate.getFullYear() - birthDate.getFullYear();
  const m = eventDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && eventDate.getDate() < birthDate.getDate())) age--;

  const prefix = geschlecht === "weiblich" ? "W" : "M";

  if (age < 10) return `${prefix}U10`;
  if (age < 14) return `${prefix}U14`;
  if (age < 16) return `${prefix}U16`;
  if (age < 18) return `${prefix}U18`;
  if (age < 20) return `${prefix}U20`;
  if (age < 30) return `${prefix}20`;
  if (age < 35) return `${prefix}30`;
  if (age < 40) return `${prefix}35`;
  if (age < 45) return `${prefix}40`;
  if (age < 50) return `${prefix}45`;
  if (age < 55) return `${prefix}50`;
  if (age < 60) return `${prefix}55`;
  if (age < 65) return `${prefix}60`;
  if (age < 70) return `${prefix}65`;
  if (age < 75) return `${prefix}70`;
  return `${prefix}75+`;
}

function parseStrecke(raw: string): string {
  if (!raw) return "–";
  if (raw.includes("Trailrun")) return "Trailrun";
  if (raw.includes("Koderrunde")) return "Koderrunde";
  if (raw.includes("Kurz und knackig")) return "Kurz und knackig";
  if (raw.includes("Kinderlauf")) return "Kinderlauf";
  return raw.split("(")[0].trim();
}

export async function GET() {
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Sheet nicht erreichbar" }, { status: 502 });
    }

    const csv = await res.text();
    const rows = parseCSV(csv);

    if (rows.length < 2) {
      return NextResponse.json({ teilnehmer: [], count: 0 });
    }

    const teilnehmer: Teilnehmer[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 10) continue;

      const vorname = row[2]?.trim();
      const nachname = row[3]?.trim();
      const geschlecht = row[8]?.trim();
      const geburtsdatum = row[9]?.trim();
      const streckeRaw = row[10]?.trim();

      if (!vorname || !nachname) continue;

      teilnehmer.push({
        vorname,
        nachname,
        geschlecht: geschlecht === "weiblich" ? "W" : geschlecht === "männlich" ? "M" : geschlecht,
        geburtsdatum,
        altersklasse: berechneAltersklasse(geburtsdatum, geschlecht),
        strecke: parseStrecke(streckeRaw),
      });
    }

    return NextResponse.json({
      teilnehmer,
      count: teilnehmer.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Google Sheets fetch error:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}
