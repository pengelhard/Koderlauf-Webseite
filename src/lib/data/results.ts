import { createClient } from "@/lib/supabase/client";
import { DEMO_ERGEBNISSE, type DemoErgebnisRow } from "./demo-ergebnisse";

export type ResultRow = {
  platz_gesamt: number;
  startnummer: number;
  vorname: string;
  nachname: string;
  distanz: string;
  zeit: string;
  platz_ak: number | null;
  geschlecht: "M" | "W";
  altersklasse: number | null;
};

/** URL-/Kachel-ID → exakter `distanz`-String in DB & Demo-Daten */
export const STRECKE_ID_TO_DISTANZ: Record<string, string> = {
  kinderlauf: "Kinderlauf",
  kurz: "Kurz und knackig",
  koderrunde: "Koderrunde",
  trailrun: "Trailrun",
};

function mapDemoRow(r: DemoErgebnisRow): ResultRow {
  return {
    platz_gesamt: r.rank,
    startnummer: r.bib,
    vorname: r.first_name,
    nachname: r.last_name,
    distanz: r.distance,
    zeit: r.finish_time,
    platz_ak: null,
    geschlecht: r.gender,
    altersklasse: r.ak,
  };
}

export function getDemoResultsByDistance(distanz: string): ResultRow[] {
  return DEMO_ERGEBNISSE.filter((r) => r.distance === distanz).map(mapDemoRow);
}

export async function getResults(
  jahr: number = 2026,
  distanzFilter?: string
): Promise<ResultRow[]> {
  try {
    const supabase = createClient();

    let query = supabase
      .from("results")
      .select("*")
      .eq("jahr", jahr)
      .order("platz_gesamt", { ascending: true });

    if (distanzFilter) {
      query = query.eq("distanz", distanzFilter);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) return filterDemoResults(distanzFilter);

    return (data as unknown as ResultRow[]).map((r) => ({
      platz_gesamt: r.platz_gesamt ?? 0,
      startnummer: r.startnummer ?? 0,
      vorname: r.vorname ?? "",
      nachname: r.nachname ?? "",
      distanz: r.distanz ?? "",
      zeit: r.zeit ?? "",
      platz_ak: r.platz_ak ?? null,
      geschlecht: r.geschlecht ?? "M",
      altersklasse: r.altersklasse ?? null,
    }));
  } catch {
    return filterDemoResults(distanzFilter);
  }
}

function filterDemoResults(distanzFilter?: string): ResultRow[] {
  const mapped = DEMO_ERGEBNISSE.map(mapDemoRow);
  if (!distanzFilter) return mapped;
  return mapped.filter((r) => r.distanz === distanzFilter);
}
