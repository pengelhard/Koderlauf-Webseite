import { createClient } from "@/lib/supabase/client";
import { DEMO_PARTICIPANT_COUNTS } from "./demo-data";

export async function getParticipantCounts(distanz?: string) {
  try {
    const supabase = createClient();

    let query = supabase
      .from("participants")
      .select("distanz")
      .eq("startgebuehr_paid", true);

    if (distanz) {
      query = query.eq("distanz", distanz);
    }

    const { data, error } = await query;

    if (error || !data) return DEMO_PARTICIPANT_COUNTS;

    const rows = data as { distanz: string }[];
    const counts = { "5km": 0, "10km": 0, kids: 0, total: rows.length };
    for (const p of rows) {
      const d = p.distanz as keyof typeof counts;
      if (d in counts) counts[d]++;
    }
    return counts;
  } catch {
    return DEMO_PARTICIPANT_COUNTS;
  }
}

export async function getTotalParticipants(): Promise<number> {
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("participants")
      .select("*", { count: "exact", head: true });

    if (error || count === null) return DEMO_PARTICIPANT_COUNTS.total;
    return count;
  } catch {
    return DEMO_PARTICIPANT_COUNTS.total;
  }
}
