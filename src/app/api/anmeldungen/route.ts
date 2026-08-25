import { NextResponse } from "next/server";
import { FROZEN_ANMELDUNGEN_2026 } from "@/lib/data/anmeldungen-2026";
import { fetchAnmeldungen2027 } from "@/lib/anmeldungen/fetch-2027";
import { emptyStats2027 } from "@/lib/anmeldungen/aggregate";

/**
 * GET /api/anmeldungen?jahr=2027|2026
 * Default: 2027 (live Race-Result JSON, sobald Env gesetzt).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jahr = searchParams.get("jahr") ?? "2027";

  if (jahr === "2026") {
    return NextResponse.json({
      ...FROZEN_ANMELDUNGEN_2026,
      source: "frozen-2026",
      participants: undefined,
    });
  }

  try {
    const stats = await fetchAnmeldungen2027();
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unbekannter Fehler";
    return NextResponse.json(
      { ...emptyStats2027(), error: message },
      { status: 502 },
    );
  }
}
