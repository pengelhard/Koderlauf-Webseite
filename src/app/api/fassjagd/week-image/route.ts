import { NextResponse } from "next/server";
import { isFassjagdAdmin } from "@/lib/fassjagd/admin-auth";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { fassjagdWeekResponse } from "@/lib/fassjagd/card";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isFassjagdAdmin())) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  const board = await loadFassjagdBoard();
  const img = fassjagdWeekResponse(board.ranking);
  img.headers.set("Content-Disposition", 'attachment; filename="fassjagd-wochenstand.png"');
  return img;
}
