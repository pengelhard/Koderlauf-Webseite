import { NextResponse } from "next/server";
import { isOrgaAdmin } from "@/lib/admin/auth";
import { fetchOrgaAdressliste } from "@/lib/orga/fetch-adressliste";
import {
  buildOrgaPdf,
  pdfFilename,
  type OrgaPdfKind,
} from "@/lib/orga/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = new Set<OrgaPdfKind>(["produktion", "ausgabe", "abendkarten"]);

export async function GET(request: Request) {
  if (!(await isOrgaAdmin())) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  const kind = new URL(request.url).searchParams.get("kind") ?? "";
  if (!KINDS.has(kind as OrgaPdfKind)) {
    return NextResponse.json({ error: "Unbekanntes PDF" }, { status: 400 });
  }
  try {
    const { stats } = await fetchOrgaAdressliste();
    const bytes = await buildOrgaPdf(kind as OrgaPdfKind, stats);
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfFilename(kind as OrgaPdfKind)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "PDF fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
