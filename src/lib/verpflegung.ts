/**
 * Verpflegungsstationen 2027 (aus GPX „Verpflegungs Stationen“).
 * Zuordnung je Strecke nach Nähe zur Route.
 */

export type VerpflegungsStation = {
  id: string;
  name: string;
  hint: string;
  lat: number;
  lon: number;
};

export const VERPFLEGUNGS_STATIONEN: readonly VerpflegungsStation[] = [
  {
    id: "v1",
    name: "Verpflegung 1",
    hint: "Nach dem Wachtler",
    lat: 49.038665,
    lon: 10.689033,
  },
  {
    id: "v2",
    name: "Verpflegung 2",
    hint: "Nach B466",
    lat: 49.036264,
    lon: 10.692341,
  },
  {
    id: "v3",
    name: "Verpflegung 3",
    hint: "Gelber Berg",
    lat: 49.042562,
    lon: 10.763018,
  },
  {
    id: "v4",
    name: "Verpflegung 4",
    hint: "Jägerstand",
    lat: 49.051345,
    lon: 10.689543,
  },
] as const;

/** Welche Stationen liegen auf welcher Strecke (plus Zielverpflegung am Sportheim). */
const STRECKEN_STATION_IDS: Record<string, readonly string[]> = {
  spielerei: ["v1", "v2", "v3", "v4"],
  trailrun: ["v1", "v2", "v4"],
  koderrunde: ["v1", "v4"],
  "koderrunde-walking": ["v1", "v4"],
};

export function getVerpflegungForStrecke(streckeId: string): VerpflegungsStation[] {
  const ids = STRECKEN_STATION_IDS[streckeId];
  if (!ids?.length) return [];
  return VERPFLEGUNGS_STATIONEN.filter((s) => ids.includes(s.id));
}
