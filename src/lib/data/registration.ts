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

/**
 * Legacy-Pfad. Live-Anmeldung läuft über /anmeldung.
 * Kein Client-Insert mehr – sonst PII über den Anon-Key.
 */
export async function registerParticipant(
  _data: RegistrationData,
): Promise<{ success: boolean; participantId?: string; error?: string }> {
  return {
    success: false,
    error: "Bitte die Anmeldung unter /anmeldung nutzen.",
  };
}
