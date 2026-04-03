import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyijfSKONmV-NM333bv-C_X0BrFYCQyijF3XGVvZsBINLAEsHvVLp-GPoRhzZJ3VME/exec";

const STRECKEN_ORDER = ["Kinderlauf", "Kurz und knackig", "Koderrunde", "Trailrun"] as const;

function parseStrecke(raw: string): string {
  if (!raw) return "–";
  if (raw.includes("Trailrun")) return "Trailrun";
  if (raw.includes("Koderrunde")) return "Koderrunde";
  if (raw.includes("Kurz und knackig")) return "Kurz und knackig";
  if (raw.includes("Kinderlauf")) return "Kinderlauf";
  return raw.split("(")[0].trim();
}

function parseGeschlecht(raw: string): "M" | "W" | "–" {
  const g = (raw || "").trim().toLowerCase();
  if (g === "weiblich") return "W";
  if (g === "männlich") return "M";
  return "–";
}

export interface AnmeldungenStats {
  total: number;
  gender: { m: number; w: number };
  strecken: Record<string, { total: number; m: number; w: number }>;
  lastUpdated: string;
}

const APPS_SCRIPT_REVALIDATE_SEC = 45;

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      next: { revalidate: APPS_SCRIPT_REVALIDATE_SEC },
      signal: controller.signal,
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Daten nicht erreichbar" }, { status: 502 });
    }

    const raw = await res.json();

    if (!Array.isArray(raw)) {
      const empty: AnmeldungenStats = {
        total: 0,
        gender: { m: 0, w: 0 },
        strecken: Object.fromEntries(STRECKEN_ORDER.map((s) => [s, { total: 0, m: 0, w: 0 }])),
        lastUpdated: new Date().toISOString(),
      };
      return NextResponse.json(empty);
    }

    const strecken: Record<string, { total: number; m: number; w: number }> = {};
    STRECKEN_ORDER.forEach((s) => (strecken[s] = { total: 0, m: 0, w: 0 }));

    let total = 0;
    let gM = 0;
    let gW = 0;

    for (const r of raw as Record<string, string>[]) {
      const hasData =
        (r.vorname || "").trim() || (r.nachname || "").trim() || (r.strecke || "").trim();
      if (!hasData) continue;

      total++;

      const geschlecht = parseGeschlecht(r.geschlecht);
      if (geschlecht === "M") gM++;
      if (geschlecht === "W") gW++;

      const strecke = parseStrecke(r.strecke);
      if (!strecken[strecke]) strecken[strecke] = { total: 0, m: 0, w: 0 };
      strecken[strecke].total++;
      if (geschlecht === "M") strecken[strecke].m++;
      if (geschlecht === "W") strecken[strecke].w++;
    }

    const stats: AnmeldungenStats = {
      total,
      gender: { m: gM, w: gW },
      strecken,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("abort") || message.includes("Abort")) {
      console.error("Apps Script timeout");
      return NextResponse.json({ error: "Zeitüberschreitung – bitte erneut versuchen" }, { status: 504 });
    }
    console.error("Apps Script fetch error:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}
