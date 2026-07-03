import { NextResponse } from "next/server";
import { FROZEN_ANMELDUNGEN_2026 } from "@/lib/data/anmeldungen-2026";

/**
 * Koderlauf 2026 Registration Statistics
 *
 * This endpoint now returns a PERMANENT, FROZEN snapshot of the 2026 registrations.
 * The previous runtime dependency on the Google Apps Script has been completely removed.
 *
 * Data source (historical): Google Sheet → Apps Script
 * Current source: static data in src/lib/data/anmeldungen-2026.ts
 *
 * 2027 MIGRATION NOTE:
 * Starting 2027 we will run registrations through our partner RaceSolution:
 *   https://www.racesolution.de/
 *
 * At that point we will either extend this route with year support or create
 * a new dedicated endpoint that integrates with the RaceSolution API.
 * Do NOT re-introduce the Google Apps Script fetch for 2026 data.
 */
export async function GET() {
  // 2026 data is final — no external calls, no caching issues, always fast.
  return NextResponse.json(FROZEN_ANMELDUNGEN_2026);
}
