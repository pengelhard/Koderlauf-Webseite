/**
 * Koderlauf 2026 — Final, frozen registration statistics
 *
 * These numbers are PERMANENT for 2026.
 * The previous live Google Apps Script / Google Sheet integration has been completely removed.
 *
 * Data captured on 2026-04-22 from the live Google Sheet (final state).
 * Source: Live production API + Google Apps Script (now decommissioned for 2026).
 *
 * 2027 PLAN:
 * Registration will be handled through our partner RaceSolution:
 *   https://www.racesolution.de/
 *
 * When we switch to RaceSolution in 2027, we will either:
 * - Add year-based routing (?year=2027) here, or
 * - Create a new dedicated endpoint /api/anmeldungen/2027
 *   that fetches from the RaceSolution API.
 *
 * Do not restore the old Google Apps Script fetch for 2026.
 */

export interface AnmeldungenStats {
  total: number;
  gender: { m: number; w: number };
  strecken: Record<string, { total: number; m: number; w: number }>;
  lastUpdated: string;
}

export const STRECKEN_ORDER = ["Kinderlauf", "Kurz und knackig", "Koderrunde", "Trailrun"] as const;

export const FROZEN_ANMELDUNGEN_2026: AnmeldungenStats = {
  total: 399,
  gender: {
    m: 222,
    w: 177,
  },
  strecken: {
    "Kinderlauf":        { total: 63,  m: 27, w: 36 },
    "Kurz und knackig":  { total: 135, m: 62, w: 73 },
    "Koderrunde":        { total: 103, m: 54, w: 49 },
    "Trailrun":          { total: 98,  m: 79, w: 19 },
  },
  // Final numbers captured from the live Google Sheet / Apps Script on 2026-04-22.
  // 2026 registrations are now permanently frozen — no more external calls.
  lastUpdated: "2026-04-22T18:30:00.000Z",
};
