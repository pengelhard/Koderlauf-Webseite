import { NextResponse } from "next/server";
import { isOrgaAdmin } from "@/lib/admin/auth";
import { listVergebeneSachen, setSacheVergeben } from "@/lib/sponsor-sachen-status";
import { SACHSPENDEN_SICHTBAR, sacheMehrfach } from "@/lib/sponsoring-2027";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const vergeben = await listVergebeneSachen();
  return NextResponse.json({
    sachen: SACHSPENDEN_SICHTBAR.map((f) => ({
      id: f.id,
      titel: f.titel,
      mehrfach: sacheMehrfach(f.id),
      vergeben: vergeben.includes(f.id),
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isOrgaAdmin())) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { id?: string; vergeben?: boolean } | null;
  if (!body?.id || typeof body.vergeben !== "boolean") {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const ok = await setSacheVergeben(body.id, body.vergeben);
  if (!ok) {
    return NextResponse.json(
      { error: "Speichern klappt gerade nicht. Ist die Datenbank erreichbar?" },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true });
}
