import { EVENT } from "@/lib/event-config";

/** Wertung endet mit Online-Anmeldeschluss (Spätmeldung), Europe/Berlin. */
export function getFassjagdFreezeAt(): Date {
  const spaet = EVENT.preise.phasen.find((p) => p.id === "spaet");
  const raw = spaet?.bis ?? "2027-05-27T23:59:59";
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(raw)) return new Date(raw);
  // Mai = MESZ (UTC+2)
  return new Date(`${raw}+02:00`);
}

export function isFassjagdFrozen(now: Date = new Date(), manualFreeze = false): boolean {
  if (manualFreeze) return true;
  return now >= getFassjagdFreezeAt();
}
