/**
 * Verpflegungsstationen 2027 (aus GPX „Verpflegungs Stationen“).
 * Nummerierung = Reihenfolge auf der Spielerei.
 * „Nach B466“ wird auf der Spielerei zweimal passiert → Station 1 und 3.
 */

export type VerpflegungsStation = {
  id: string;
  /** Anzeige-Nummer */
  nr: number;
  name: string;
  hint: string;
  lat: number;
  lon: number;
};

const B466 = { lat: 49.036264, lon: 10.692341 } as const;
const GELBER_BERG = { lat: 49.042562, lon: 10.763018 } as const;
const WACHTLER = { lat: 49.038665, lon: 10.689033 } as const;
const JAEGERSTAND = { lat: 49.051345, lon: 10.689543 } as const;

/** Volle Liste in Spielerei-Reihenfolge (B466 erscheint zweimal). */
export const VERPFLEGUNG_SPIELEREI: readonly VerpflegungsStation[] = [
  {
    id: "v1",
    nr: 1,
    name: "Verpflegung 1",
    hint: "Nach B466 (Hinweg)",
    ...B466,
  },
  {
    id: "v2",
    nr: 2,
    name: "Verpflegung 2",
    hint: "Gelber Berg",
    ...GELBER_BERG,
  },
  {
    id: "v3",
    nr: 3,
    name: "Verpflegung 3",
    hint: "Nach B466 (Rückweg) – gleicher Ort",
    ...B466,
  },
  {
    id: "v4",
    nr: 4,
    name: "Verpflegung 4",
    hint: "Jägerstand",
    ...JAEGERSTAND,
  },
] as const;

/** Stationen auf kürzeren Strecken (ohne B466-Doppelung). */
const VERPFLEGUNG_KURZ: Record<string, readonly VerpflegungsStation[]> = {
  trailrun: [
    {
      id: "tr-wachtler",
      nr: 1,
      name: "Verpflegung 1",
      hint: "Nach dem Wachtler",
      ...WACHTLER,
    },
    {
      id: "tr-jaeger",
      nr: 2,
      name: "Verpflegung 2",
      hint: "Jägerstand",
      ...JAEGERSTAND,
    },
  ],
  koderrunde: [
    {
      id: "kr-wachtler",
      nr: 1,
      name: "Verpflegung 1",
      hint: "Nach dem Wachtler",
      ...WACHTLER,
    },
    {
      id: "kr-jaeger",
      nr: 2,
      name: "Verpflegung 2",
      hint: "Jägerstand",
      ...JAEGERSTAND,
    },
  ],
};

VERPFLEGUNG_KURZ["koderrunde-walking"] = VERPFLEGUNG_KURZ.koderrunde;

export function getVerpflegungForStrecke(streckeId: string): VerpflegungsStation[] {
  if (streckeId === "spielerei") return [...VERPFLEGUNG_SPIELEREI];
  const list = VERPFLEGUNG_KURZ[streckeId];
  return list ? [...list] : [];
}

/** Für die Karte: gleiche Koordinaten zu einem Marker zusammenfassen (B466 = 1 & 3). */
export function getMapMarkersForStations(
  stations: VerpflegungsStation[],
): Array<VerpflegungsStation & { label: string }> {
  const byKey = new Map<string, VerpflegungsStation[]>();
  for (const s of stations) {
    const key = `${s.lat.toFixed(5)},${s.lon.toFixed(5)}`;
    const group = byKey.get(key) ?? [];
    group.push(s);
    byKey.set(key, group);
  }

  return [...byKey.values()].map((group) => {
    const first = group[0];
    const nrs = group.map((g) => g.nr).sort((a, b) => a - b);
    const label = nrs.join("·");
    const name =
      nrs.length > 1
        ? `Verpflegung ${nrs.join(" & ")}`
        : first.name;
    const hint =
      nrs.length > 1 && first.hint.includes("B466")
        ? "Nach B466 (Hinweg und Rückweg – gleicher Ort)"
        : first.hint;
    return { ...first, name, hint, label, nr: nrs[0] };
  });
}
