import { NextResponse } from "next/server";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { fassjagdWeekResponse } from "@/lib/fassjagd/card";
import {
  fassjagdAdminSecret,
  isFassjagdAdmin,
  setAdminCookie,
  clearAdminCookie,
} from "@/lib/fassjagd/admin-auth";
import {
  exportOverrides,
  mergeAlias,
  setExcluded,
  setManualFreeze,
} from "@/lib/fassjagd/store";
import { normalizeVereinKey } from "@/lib/anmeldungen/vereine";

function unauthorized() {
  return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
}

export async function GET() {
  if (!(await isFassjagdAdmin())) return unauthorized();
  const board = await loadFassjagdBoard();
  return NextResponse.json({ board, overrides: exportOverrides() });
}

export async function POST(request: Request) {
  const s = fassjagdAdminSecret();
  if (!s) {
    return NextResponse.json(
      { error: "FASSJAGD_ADMIN_SECRET ist nicht gesetzt." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { action?: string; password?: string; from?: string; to?: string; name?: string }
    | null;
  const action = body?.action;

  if (action === "login") {
    if (!body?.password || body.password !== s) {
      return NextResponse.json({ error: "Passwort falsch" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    setAdminCookie(res, s);
    return res;
  }

  if (!(await isFassjagdAdmin())) return unauthorized();

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    clearAdminCookie(res);
    return res;
  }

  if (action === "merge") {
    mergeAlias(body?.from ?? "", body?.to ?? "", normalizeVereinKey);
    const board = await loadFassjagdBoard();
    return NextResponse.json({ ok: true, board, overrides: exportOverrides() });
  }

  if (action === "exclude" || action === "include") {
    setExcluded(body?.name ?? "", action === "exclude");
    const board = await loadFassjagdBoard();
    return NextResponse.json({ ok: true, board, overrides: exportOverrides() });
  }

  if (action === "freeze") {
    const board = await loadFassjagdBoard();
    setManualFreeze(true, { ...board, frozen: true, status: "offiziell" });
    return NextResponse.json({ ok: true, board: { ...board, frozen: true, status: "offiziell" } });
  }

  if (action === "unfreeze") {
    setManualFreeze(false, null);
    const board = await loadFassjagdBoard();
    return NextResponse.json({ ok: true, board });
  }

  if (action === "week-image") {
    const board = await loadFassjagdBoard();
    return await fassjagdWeekResponse(board.ranking);
  }

  return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 });
}
