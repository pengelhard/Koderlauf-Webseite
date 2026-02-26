import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyijfSKONmV-NM333bv-C_X0BrFYCQyijF3XGVvZsBINLAEsHvVLp-GPoRhzZJ3VME/exec";

export interface Teilnehmer {
  vorname: string;
  nachname: string;
  geschlecht: string;
  geburtsdatum: string;
  altersklasse: string;
  strecke: string;
}

function berechneAltersklasse(geburtsdatumStr: string, geschlecht: string): string {
  if (!geburtsdatumStr) return "–";

  const birthDate = new Date(geburtsdatumStr);
  if (isNaN(birthDate.getTime())) return "–";

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
    const res = await fetch(APPS_SCRIPT_URL, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Daten nicht erreichbar" }, { status: 502 });
    }

    const raw = await res.json();

    if (!Array.isArray(raw)) {
      return NextResponse.json({ teilnehmer: [], count: 0 });
    }

    const teilnehmer: Teilnehmer[] = raw
      .filter((r: Record<string, string>) => r.vorname && r.nachname)
      .map((r: Record<string, string>) => ({
        vorname: r.vorname?.trim(),
        nachname: r.nachname?.trim(),
        geschlecht: r.geschlecht === "weiblich" ? "W" : r.geschlecht === "männlich" ? "M" : r.geschlecht || "–",
        geburtsdatum: r.geburtsdatum || "",
        altersklasse: berechneAltersklasse(r.geburtsdatum, r.geschlecht),
        strecke: parseStrecke(r.strecke),
      }));

    return NextResponse.json({
      teilnehmer,
      count: teilnehmer.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Apps Script fetch error:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}
