import { NextResponse } from "next/server";
import { isOrgaAdmin } from "@/lib/admin/auth";
import { fetchOrgaAdressliste } from "@/lib/orga/fetch-adressliste";
import {
  buildOrgaPdf,
  pdfFilename,
  type OrgaPdfKind,
} from "@/lib/orga/pdf";
import { streckeLabelFromSlug } from "@/lib/orga/startunterlagen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = new Set<OrgaPdfKind>([
  "produktion",
  "ausgabe",
  "abendkarten",
  "start-standard",
  "start-ausgabe",
  "start-gesamt",
]);

export async function GET(request: Request) {
  if (!(await isOrgaAdmin())) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") ?? "";
  if (!KINDS.has(kind as OrgaPdfKind)) {
    return NextResponse.json({ error: "Unbekanntes PDF" }, { status: 400 });
  }

  const streckeSlug = url.searchParams.get("strecke")?.trim() ?? "";
  let streckeLabel: string | undefined;

  if (kind === "start-standard" || kind === "start-ausgabe") {
    streckeLabel = streckeLabelFromSlug(streckeSlug) ?? undefined;
    if (!streckeLabel) {
      return NextResponse.json({ error: "Strecke unbekannt" }, { status: 400 });
    }
  }

  try {
    const { stats } = await fetchOrgaAdressliste();
    const bytes = await buildOrgaPdf(kind as OrgaPdfKind, stats, { strecke: streckeLabel });
    const filename = pdfFilename(kind as OrgaPdfKind, { strecke: streckeLabel });
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "PDF fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
