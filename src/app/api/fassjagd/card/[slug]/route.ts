import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { findFassjagdClub } from "@/lib/fassjagd/ranking";
import { fassjagdCardResponse } from "@/lib/fassjagd/card";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "story" ? "story" : "og";
  const board = await loadFassjagdBoard();
  const club = findFassjagdClub(board, slug);
  if (!club) {
    return new Response("Verein nicht gefunden", { status: 404 });
  }
  const img = fassjagdCardResponse(club, format);
  const filename = `fassjagd-${slug}-${format}.png`;
  img.headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  img.headers.set("Cache-Control", "public, max-age=60");
  return img;
}
