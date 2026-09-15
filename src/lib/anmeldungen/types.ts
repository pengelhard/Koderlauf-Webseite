/**
 * Gemeinsame Typen für Anmeldestatistik (2026 Archiv + 2027 live).
 */

export interface StreckeCount {
  total: number;
  m: number;
  w: number;
}

export interface AnmeldungenStats {
  total: number;
  gender: { m: number; w: number };
  strecken: Record<string, StreckeCount>;
  lastUpdated: string;
  /** optional Rohdaten für Teilnehmerliste */
  participants?: AnmeldungParticipant[];
  source?: "race-result" | "frozen-2026" | "empty";
  /** Vereinswertung (Fass Bier), ohne Ausrichter in ranking */
  vereine?: {
    ranking: { name: string; total: number }[];
    ausrichter: { name: string; total: number } | null;
    ohneAngabe: number;
  };
}

export interface AnmeldungParticipant {
  nachname: string;
  vorname: string;
  geschlecht: "m" | "w" | "d" | "u";
  strecke: string;
  jahrgang?: string;
  verein?: string;
  nation?: string;
}

/** Erwartete Felder einer Race-Result JSON-Liste (flexibel benannt). */
export type RaceResultParticipantRaw = Record<string, unknown>;
