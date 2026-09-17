export type PersonKeySource = {
  rrId?: number;
  bib?: number;
  nachname?: string;
  vorname?: string;
  jahrgang?: string;
  strecke?: string;
};

function digits(n: number | undefined): number | undefined {
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) return undefined;
  return n;
}

/**
 * Stabile Personen-ID für Gruppen-Overrides.
 * Vorrang: Race-Result ContId/rrId, sonst Name + Jahrgang + Strecke.
 */
export function fassjagdPersonId(p: PersonKeySource): string {
  const rr = digits(p.rrId);
  if (rr) return `rr:${rr}`;
  const name = `${(p.nachname ?? "").trim()}|${(p.vorname ?? "").trim()}|${(p.jahrgang ?? "").trim()}|${(p.strecke ?? "").trim()}`
    .toLowerCase()
    .replace(/\s+/g, " ");
  return `n:${name}`;
}

/** Roh-Vereinsname nach Personen-Override, sonst Original aus der Quelle. */
export function personVereinRaw(
  p: { verein?: string } & PersonKeySource,
  personGroups: Record<string, string>,
): string | undefined {
  const id = fassjagdPersonId(p);
  if (Object.prototype.hasOwnProperty.call(personGroups, id)) {
    const g = personGroups[id].trim();
    return g || undefined;
  }
  const original = (p.verein ?? "").trim();
  return original || undefined;
}
