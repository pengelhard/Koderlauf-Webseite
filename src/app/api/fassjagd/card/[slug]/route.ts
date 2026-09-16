import { DEMO_TEAM_CLUB, fassjagdCardResponse } from "@/lib/fassjagd/card";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { findFassjagdClub } from "@/lib/fassjagd/ranking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "story" ? "story" : "og";
  const club =
    searchParams.get("demo") === "team"
      ? DEMO_TEAM_CLUB
      : findFassjagdClub(await loadFassjagdBoard(), slug);
  if (!club) {
    return new Response("Team nicht gefunden", { status: 404 });
  }
  const img = await fassjagdCardResponse(club, format);
  const filename = `fassjagd-${club.slug}-${format}.png`;
  img.headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  img.headers.set("Cache-Control", "public, max-age=60");
  return img;
}
