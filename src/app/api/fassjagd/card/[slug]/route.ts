import { DEMO_PLACE2_CLUB, DEMO_TEAM_CLUB, fassjagdCardResponse } from "@/lib/fassjagd/card";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { findFassjagdClub } from "@/lib/fassjagd/ranking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

function demoClub(demo: string | null) {
  if (demo === "team") return DEMO_TEAM_CLUB;
  if (demo === "place2") return DEMO_PLACE2_CLUB;
  return null;
}

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "story" ? "story" : "og";
  const club =
    demoClub(searchParams.get("demo")) ??
    findFassjagdClub(await loadFassjagdBoard(), slug);
  if (!club) {
    return new Response("Team nicht gefunden", { status: 404 });
  }
  const img = await fassjagdCardResponse(club, format);
  const filename = `fassjagd-${club.slug}-${format}.png`;
  img.headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  img.headers.set("Cache-Control", "public, max-age=60");
  return img;
}
