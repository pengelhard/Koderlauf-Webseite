import { createClient } from "@/lib/supabase/client";
import { DEMO_EVENT_2027, DEMO_PARTICIPANT_COUNTS } from "./demo-data";

export async function getCurrentEvent() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("registration_open", true)
      .order("date", { ascending: true })
      .limit(1)
      .single();

    if (error || !data) return DEMO_EVENT_2027;
    return data as typeof DEMO_EVENT_2027;
  } catch {
    return DEMO_EVENT_2027;
  }
}

export async function getParticipantCounts(eventId?: string) {
  try {
    const supabase = createClient();

    if (!eventId) {
      const event = await getCurrentEvent();
      eventId = event.id;
    }

    if (eventId === "demo-2027") return DEMO_PARTICIPANT_COUNTS;

    const { data, error } = await supabase
      .from("participants")
      .select("distance")
      .eq("event_id", eventId)
      .eq("startgebuehr_paid", true);

    if (error || !data) return DEMO_PARTICIPANT_COUNTS;

    const rows = data as { distance: string }[];
    const counts = { "5km": 0, "10km": 0, kids: 0, total: rows.length };
    for (const p of rows) {
      const d = p.distance as keyof typeof counts;
      if (d in counts) counts[d]++;
    }
    return counts;
  } catch {
    return DEMO_PARTICIPANT_COUNTS;
  }
}
