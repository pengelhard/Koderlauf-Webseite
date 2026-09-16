import { getOnlineAnmeldeschlussAt } from "@/lib/event-config";

/** Wertung endet mit Online-Anmeldeschluss, Europe/Berlin. */
export function getFassjagdFreezeAt(): Date {
  return getOnlineAnmeldeschlussAt();
}

export function isFassjagdFrozen(now: Date = new Date(), manualFreeze = false): boolean {
  if (manualFreeze) return true;
  return now >= getFassjagdFreezeAt();
}
