import { createClient } from "@/lib/supabase/client";
import { getPrice } from "@/lib/pricing";
import type { Distance, TShirtSize } from "@/lib/pricing";

export interface RegistrationData {
  vorname: string;
  nachname: string;
  email: string;
  geburtstag: string | null;
  verein: string | null;
  tshirtSize: TShirtSize;
  distanz: Distance;
}

export async function registerParticipant(
  data: RegistrationData
): Promise<{ success: boolean; participantId?: string; error?: string }> {
  try {
    const supabase = createClient();
    getPrice(data.distanz);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: participant, error } = await (supabase as any)
      .from("participants")
      .insert({
        vorname: data.vorname,
        nachname: data.nachname,
        email: data.email,
        geburtstag: data.geburtstag,
        verein: data.verein,
        tshirt_size: data.tshirtSize,
        distanz: data.distanz,
        startgebuehr_paid: false,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Diese E-Mail ist bereits registriert." };
      }
      return { success: false, error: error.message };
    }

    return { success: true, participantId: (participant as { id: string } | null)?.id };
  } catch {
    return { success: false, error: "Verbindungsfehler zur Datenbank." };
  }
}
