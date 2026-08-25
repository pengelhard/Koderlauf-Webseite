/**
 * Hilfspreise / Legacy-Stripe.
 * Öffentliche Preise und Anmeldung laufen über EVENT + RaceSolution.
 * Diese Datei bleibt nur für optionale Legacy-Checkout-Aufrufe konsistent zu EVENT.
 */

import { EVENT, getAktuellePreisPhase } from "@/lib/event-config";

export type Distance =
  | "kinderlauf"
  | "kurz-knackig"
  | "koderrunde"
  | "koderrunde-walking"
  | "trailrun"
  | "spielerei"
  /** @deprecated Legacy-Aliases */
  | "5km"
  | "10km"
  | "kids";

export type PriceTier = "early_bird" | "normal" | "nachmeldung" | "vor_ort";

export interface PriceInfo {
  amount: number; // Cent
  label: string;
  tier: PriceTier;
}

const LEGACY_DISTANCE_MAP: Record<string, string> = {
  "5km": "kurz-knackig",
  "10km": "trailrun",
  kids: "kinderlauf",
};

/** T-Shirt-Größen 2027 (Kinder + Erwachsene). */
export const TSHIRT_SIZES = [
  "116",
  "128",
  "140",
  "152",
  "164",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
] as const;
export type TShirtSize = (typeof TSHIRT_SIZES)[number];

export const GENDER_OPTIONS = [
  { value: "M", label: "Männlich" },
  { value: "W", label: "Weiblich" },
  { value: "D", label: "Divers" },
] as const;
export type Gender = (typeof GENDER_OPTIONS)[number]["value"];

export const DISTANCE_LABELS: Record<string, string> = Object.fromEntries(
  EVENT.strecken.map((s) => [s.id, `${s.name} (${s.distanz})`]),
);

export function getCurrentTier(date: Date = new Date()): PriceTier {
  const phase = getAktuellePreisPhase(date);
  if (phase.id === "fruehbucher") return "early_bird";
  if (phase.id === "normal") return "normal";
  if (phase.id === "spaet") return "nachmeldung";
  return "vor_ort";
}

export function getPrice(distance: Distance, date?: Date): PriceInfo {
  const streckeId = LEGACY_DISTANCE_MAP[distance] ?? distance;
  const phase = getAktuellePreisPhase(date);
  const euros = streckeId === "kinderlauf" ? phase.kinderlauf : phase.andere;
  return {
    amount: euros * 100,
    label: phase.name,
    tier: getCurrentTier(date),
  };
}

export function getAllPrices(distance: Distance): Record<string, number> {
  const streckeId = LEGACY_DISTANCE_MAP[distance] ?? distance;
  const out: Record<string, number> = {};
  for (const phase of EVENT.preise.phasen) {
    const euros = streckeId === "kinderlauf" ? phase.kinderlauf : phase.andere;
    out[phase.id] = euros * 100;
  }
  return out;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function isKidsAgeValid(
  birthDate: Date,
  eventDate: Date = new Date(EVENT.datum),
): boolean {
  const age =
    eventDate.getFullYear() -
    birthDate.getFullYear() -
    (eventDate <
    new Date(eventDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())
      ? 1
      : 0);
  return age <= 8;
}
