import { createClient } from "@/lib/supabase/client";
import { DEMO_RESULTS } from "./demo-data";

export type ResultRow = {
  platz_gesamt: number;
  startnummer: number;
  vorname: string;
  nachname: string;
  distanz: string;
  zeit: string;
  platz_ak: number | null;
};

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

    return (data as ResultRow[]).map((r) => ({
      platz_gesamt: r.platz_gesamt ?? 0,
      startnummer: r.startnummer ?? 0,
      vorname: r.vorname ?? "",
      nachname: r.nachname ?? "",
      distanz: r.distanz ?? "",
      zeit: r.zeit ?? "",
      platz_ak: r.platz_ak,
    }));
  } catch {
    return filterDemoResults(distanzFilter);
  }
}

function filterDemoResults(distanzFilter?: string): ResultRow[] {
  const mapped = DEMO_RESULTS.map((r) => ({
    platz_gesamt: r.rank,
    startnummer: r.bib,
    vorname: r.first_name,
    nachname: r.last_name,
    distanz: r.distance,
    zeit: r.finish_time,
    platz_ak: null,
  }));
  if (!distanzFilter) return mapped;
  return mapped.filter((r) => r.distanz === distanzFilter);
}
