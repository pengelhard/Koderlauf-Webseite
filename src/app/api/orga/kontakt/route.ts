import { NextResponse } from "next/server";
import { isOrgaAdmin } from "@/lib/admin/auth";
import { fetchOrgaAdressliste } from "@/lib/orga/fetch-adressliste";
import { kontaktCsvFilename, tshirtKontaktCsv } from "@/lib/orga/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isOrgaAdmin())) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  try {
    const { participants } = await fetchOrgaAdressliste();
    const csv = tshirtKontaktCsv(participants);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${kontaktCsvFilename()}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "CSV fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
