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

function getJahrgang(geburtsdatumStr: string): number | null {
  if (!geburtsdatumStr) return null;
  const d = new Date(geburtsdatumStr);
  if (isNaN(d.getTime())) return null;
  return d.getFullYear();
}

function berechneAltersklasse(geburtsdatumStr: string, geschlecht: string, strecke: string): string {
  const jg = getJahrgang(geburtsdatumStr);
  if (!jg) return "–";

  const prefix = geschlecht === "weiblich" ? "W " : "M ";
  const s = strecke.toLowerCase();

  if (s.includes("kinderlauf")) {
    return "Kinderlauf";
  }

  if (s.includes("kurz und knackig") || s.includes("kurz")) {
    if (jg >= 2015 && jg <= 2018) return `${prefix}AK 8-11`;
    if (jg >= 2011 && jg <= 2014) return `${prefix}AK 12-15`;
    if (jg >= 1997 && jg <= 2010) return `${prefix}AK 16-29`;
    if (jg >= 1977 && jg <= 1996) return `${prefix}AK 30-49`;
    if (jg >= 1967 && jg <= 1976) return `${prefix}AK 50-59`;
    if (jg <= 1966) return `${prefix}AK 60+`;
    return "–";
  }

  if (s.includes("koderrunde")) {
    if (jg >= 2011 && jg <= 2014) return `${prefix}AK 12-15`;
    if (jg >= 1997 && jg <= 2010) return `${prefix}AK 16-29`;
    if (jg >= 1977 && jg <= 1996) return `${prefix}AK 30-49`;
    if (jg >= 1967 && jg <= 1976) return `${prefix}AK 50-59`;
    if (jg <= 1966) return `${prefix}AK 60+`;
    return "–";
  }

  if (s.includes("trailrun")) {
    if (jg >= 2009 && jg <= 2011) return `${prefix}U18`;
    if (jg >= 1997 && jg <= 2008) return `${prefix}AK 18-29`;
    if (jg >= 1977 && jg <= 1996) return `${prefix}AK 30-49`;
    if (jg >= 1967 && jg <= 1976) return `${prefix}AK 50-59`;
    if (jg <= 1966) return `${prefix}AK 60+`;
    return "–";
  }

  return "–";
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
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Daten nicht erreichbar" }, { status: 502 });
    }

    const raw = await res.json();

    if (!Array.isArray(raw)) {
      return NextResponse.json({ teilnehmer: [], count: 0 });
    }

    const teilnehmer: Teilnehmer[] = raw
      .filter((r: Record<string, string>) => (r.vorname || "").trim() || (r.nachname || "").trim() || (r.strecke || "").trim())
      .map((r: Record<string, string>) => {
        const strecke = parseStrecke(r.strecke);
        return {
          vorname: (r.vorname || "").trim(),
          nachname: (r.nachname || "").trim(),
          geschlecht: (r.geschlecht || "").trim() === "weiblich" ? "W" : (r.geschlecht || "").trim() === "männlich" ? "M" : "–",
          geburtsdatum: r.geburtsdatum || "",
          altersklasse: berechneAltersklasse(r.geburtsdatum, (r.geschlecht || "").trim(), strecke),
          strecke,
        };
      });

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
