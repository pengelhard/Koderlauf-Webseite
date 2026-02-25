import { createClient } from "@/lib/supabase/client";
import { getPrice } from "@/lib/pricing";
import type { Distance, Gender, TShirtSize } from "@/lib/pricing";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: Gender;
  distance: Distance;
  club: string | null;
  tshirtSize: TShirtSize;
  emergencyName: string;
  emergencyPhone: string;
  photoConsent: boolean;
}

export async function registerParticipant(
  eventId: string,
  data: RegistrationData
): Promise<{ success: boolean; participantId?: string; error?: string }> {
  try {
    const supabase = createClient();
    const priceInfo = getPrice(data.distance);

    const insertPayload = {
      event_id: eventId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      birth_date: data.birthDate,
      gender: data.gender,
      distance: data.distance,
      club: data.club,
      tshirt_size: data.tshirtSize,
      emergency_contact_name: data.emergencyName,
      emergency_contact_phone: data.emergencyPhone,
      photo_consent: data.photoConsent,
      privacy_accepted: true,
      price_cents: priceInfo.amount,
      price_tier: priceInfo.tier,
      startgebuehr_paid: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: participant, error } = await (supabase as any)
      .from("participants")
      .insert(insertPayload)
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Diese E-Mail ist bereits für dieses Event registriert." };
      }
      return { success: false, error: error.message };
    }

    return { success: true, participantId: participant?.id };
  } catch {
    return { success: false, error: "Verbindungsfehler zur Datenbank." };
  }
}

export async function markParticipantPaid(
  participantId: string,
  stripeSessionId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("participants")
      .update({
        startgebuehr_paid: true,
        stripe_session_id: stripeSessionId,
      })
      .eq("id", participantId);

    return !error;
  } catch {
    return false;
  }
}
