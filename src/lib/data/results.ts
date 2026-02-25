import { createClient } from "@/lib/supabase/client";
import { DEMO_RESULTS } from "./demo-data";

export type ResultRow = {
  rank: number;
  bib: number;
  first_name: string;
  last_name: string;
  gender: string;
  distance: string;
  finish_time: string;
  pace: string;
  age_class: string;
};

export async function getResults(
  eventSlug: string = "koderlauf-2026",
  distanceFilter?: string
): Promise<ResultRow[]> {
  try {
    const supabase = createClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("slug", eventSlug)
      .single();

    if (eventError || !event) return filterDemoResults(distanceFilter);

    const eventId = (event as { id: string }).id;

    let query = supabase
      .from("results")
      .select(`
        rank,
        finish_time,
        category_rank,
        distance,
        age_class,
        participants!inner (
          first_name,
          last_name,
          gender,
          bib_number
        )
      `)
      .eq("event_id", eventId)
      .order("rank", { ascending: true });

    if (distanceFilter) {
      query = query.eq("distance", distanceFilter);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) return filterDemoResults(distanceFilter);

    return (data as Record<string, unknown>[]).map((r) => {
      const p = r.participants as Record<string, unknown>;
      const totalSeconds = parseInterval(r.finish_time as string);
      const dist = r.distance as string;
      const paceSeconds = totalSeconds / (dist === "5km" ? 5 : dist === "10km" ? 10 : 2);

      return {
        rank: r.rank as number,
        bib: p.bib_number as number,
        first_name: p.first_name as string,
        last_name: p.last_name as string,
        gender: p.gender as string,
        distance: dist,
        finish_time: formatTime(totalSeconds),
        pace: formatPace(paceSeconds),
        age_class: (r.age_class as string) || "",
      };
    });
  } catch {
    return filterDemoResults(distanceFilter);
  }
}

function filterDemoResults(distanceFilter?: string): ResultRow[] {
  if (!distanceFilter) return DEMO_RESULTS;
  return DEMO_RESULTS.filter((r) => r.distance === distanceFilter);
}

function parseInterval(interval: string): number {
  const parts = interval.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatPace(secondsPerKm: number): string {
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.floor(secondsPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}/km`;
}
