import { NextResponse } from "next/server";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";

export const dynamic = "force-dynamic";

/** GET /api/fassjagd – Tafel inkl. Teamnamen für Namenssuche */
export async function GET() {
  const board = await loadFassjagdBoard();
  return NextResponse.json(board, {
    headers: {
      "Cache-Control": board.frozen
        ? "public, s-maxage=3600, stale-while-revalidate=86400"
        : "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
