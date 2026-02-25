import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_TARGET = "2027-05-08T08:30:00.000Z";

export interface CountdownSettings {
  targetTimestamp: string;
  label: string | null;
}

export async function getCountdownSettings(eventKey = "koderlauf-2027"): Promise<CountdownSettings> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("countdown_settings")
      .select("target_timestamp,label")
      .eq("event_key", eventKey)
      .maybeSingle();

    return {
      targetTimestamp: data?.target_timestamp ?? DEFAULT_TARGET,
      label: data?.label ?? "Bis zum Start",
    };
  } catch {
    return {
      targetTimestamp: DEFAULT_TARGET,
      label: "Bis zum Start",
    };
  }
}
