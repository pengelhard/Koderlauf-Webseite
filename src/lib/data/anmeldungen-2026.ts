/**
 * Koderlauf 2026 — Final, frozen registration statistics
 *
 * Diese Zahlen sind für 2026 permanent eingefroren.
 * Live-Daten ab 2027: Race Result JSON → /api/anmeldungen?jahr=2027
 */

import type { AnmeldungenStats } from "@/lib/anmeldungen/types";

export type { AnmeldungenStats };

export const STRECKEN_ORDER = ["Kinderlauf", "Kurz und knackig", "Koderrunde", "Trailrun"] as const;

export const FROZEN_ANMELDUNGEN_2026: AnmeldungenStats = {
  total: 399,
  gender: {
    m: 222,
    w: 177,
  },
  strecken: {
    Kinderlauf: { total: 63, m: 27, w: 36 },
    "Kurz und knackig": { total: 135, m: 62, w: 73 },
    Koderrunde: { total: 103, m: 54, w: 49 },
    Trailrun: { total: 98, m: 79, w: 19 },
  },
  lastUpdated: "2026-04-22T18:30:00.000Z",
  source: "frozen-2026",
};
