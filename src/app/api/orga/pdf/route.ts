import { NextResponse } from "next/server";
import { isOrgaAdmin } from "@/lib/admin/auth";
import { parseSponsorYear } from "@/lib/data/sponsors-public";
import { fetchOrgaAdressliste } from "@/lib/orga/fetch-adressliste";
import {
  buildOrgaPdf,
  pdfFilename,
  type OrgaPdfKind,
} from "@/lib/orga/pdf";
import { buildSponsorenPdf, sponsorenPdfFilename } from "@/lib/orga/pdf-sponsoren";
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

function pdfResponse(bytes: Uint8Array, filename: string) {
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: Request) {
  if (!(await isOrgaAdmin())) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") ?? "";

  if (kind === "sponsoren") {
    const year = parseSponsorYear(url.searchParams.get("year"));
    if (!year) {
      return NextResponse.json(
        { error: "Jahr fehlt oder ungültig (2026 oder 2027)" },
        { status: 400 },
      );
    }
    try {
      const bytes = await buildSponsorenPdf(year);
      return pdfResponse(bytes, sponsorenPdfFilename(year));
    } catch (e) {
      const message = e instanceof Error ? e.message : "PDF fehlgeschlagen";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

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
    return pdfResponse(bytes, filename);
  } catch (e) {
    const message = e instanceof Error ? e.message : "PDF fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
