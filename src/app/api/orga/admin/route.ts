import { NextResponse } from "next/server";
import {
  adminSecret,
  clearAdminCookie,
  isOrgaAdmin,
  setAdminCookie,
} from "@/lib/admin/auth";
import { fetchOrgaAdressliste } from "@/lib/orga/fetch-adressliste";
import { toAdminPayload } from "@/lib/orga/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
}

export async function GET() {
  if (!(await isOrgaAdmin())) return unauthorized();
  try {
    const { stats } = await fetchOrgaAdressliste();
    return NextResponse.json(toAdminPayload(stats));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const s = adminSecret();
  const body = (await request.json().catch(() => null)) as
    | { action?: string; password?: string }
    | null;
  const action = body?.action;

  if (action === "login") {
    if (!s) {
      return NextResponse.json(
        {
          error:
            "Admin-Secret ist nicht gesetzt (FASSJAGD_ADMIN_SECRET oder ADMIN_SECRET in Vercel).",
        },
        { status: 503 },
      );
    }
    if (!body?.password || body.password !== s) {
      return NextResponse.json({ error: "Passwort falsch" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    setAdminCookie(res, s);
    return res;
  }

  if (!(await isOrgaAdmin())) return unauthorized();

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    clearAdminCookie(res);
    return res;
  }

  return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 });
}
