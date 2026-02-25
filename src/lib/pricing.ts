export type Distance = "5km" | "10km" | "kids";
export type PriceTier = "early_bird" | "normal" | "nachmeldung";

export interface PriceInfo {
  amount: number;
  label: string;
  tier: PriceTier;
}

const EARLY_BIRD_DEADLINE = new Date("2027-02-28T23:59:59");
const EVENT_DATE = new Date("2027-06-15T09:00:00");

const PRICES: Record<Distance, Record<PriceTier, number>> = {
  "5km": { early_bird: 1500, normal: 2000, nachmeldung: 3000 },
  "10km": { early_bird: 2500, normal: 3000, nachmeldung: 4000 },
  kids: { early_bird: 800, normal: 1000, nachmeldung: 2000 },
};

const TIER_LABELS: Record<PriceTier, string> = {
  early_bird: "Early Bird",
  normal: "Normalpreis",
  nachmeldung: "Nachmeldung",
};

export const DISTANCE_LABELS: Record<Distance, string> = {
  "5km": "5 km (Erwachsene)",
  "10km": "10 km (Erwachsene)",
  kids: "Kids-Lauf (~2 km, bis 14 Jahre)",
};

export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type TShirtSize = (typeof TSHIRT_SIZES)[number];

export const GENDER_OPTIONS = [
  { value: "M", label: "Männlich" },
  { value: "W", label: "Weiblich" },
  { value: "D", label: "Divers" },
] as const;
export type Gender = (typeof GENDER_OPTIONS)[number]["value"];

export function getCurrentTier(date: Date = new Date()): PriceTier {
  if (date <= EARLY_BIRD_DEADLINE) return "early_bird";
  if (date < EVENT_DATE) return "normal";
  return "nachmeldung";
}

export function getPrice(distance: Distance, date?: Date): PriceInfo {
  const tier = getCurrentTier(date);
  return {
    amount: PRICES[distance][tier],
    label: TIER_LABELS[tier],
    tier,
  };
}

export function getAllPrices(distance: Distance): Record<PriceTier, number> {
  return PRICES[distance];
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function isKidsAgeValid(birthDate: Date, eventDate: Date = EVENT_DATE): boolean {
  const age =
    eventDate.getFullYear() -
    birthDate.getFullYear() -
    (eventDate < new Date(eventDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
  return age < 15;
}
