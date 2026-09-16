export type FassjagdStarter = {
  vorname: string;
  nachname: string;
  strecke: string;
};

export type FassjagdClub = {
  name: string;
  slug: string;
  total: number;
  /** Platz in der Wertung, null wenn ausgeschlossen */
  place: number | null;
  ausgeschlossen: boolean;
  hausherr: boolean;
  trailSpielerei: number;
  firstReg: number;
  weekDelta: number;
  flaming: boolean;
  /** Abstand auf Platz 1 (0 wenn selbst führend) */
  gapToLeader: number;
  /** Starter, die zum Team davor fehlen */
  gapToAbove: number | null;
  /** Vorsprung auf das Team dahinter */
  gapToBelow: number | null;
  /** Vorsprung auf Platz 2, nur Platz 1 */
  leadBy: number | null;
  strecken: Record<string, number>;
  starters: FassjagdStarter[];
};

export type FassjagdStatus = "live" | "offiziell";

export type FassjagdBoard = {
  status: FassjagdStatus;
  freezeAt: string;
  frozen: boolean;
  lastUpdated: string;
  ranking: FassjagdClub[];
  hausherr: FassjagdClub | null;
  ohneAngabe: number;
  names: string[];
};
