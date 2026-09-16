import { EMPTY_FASSJAGD_CLUB } from "@/lib/fassjagd/card";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { fassjagdOgJpegResponse } from "@/lib/fassjagd/og-jpeg";
import { findFassjagdClub } from "@/lib/fassjagd/ranking";

export const runtime = "nodejs";
export const revalidate = 120;

/** JPEG mit .jpg-Endung – WhatsApp erkennt opengraph-image?v= oft nicht als Bild. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const board = await loadFassjagdBoard();
  const club = findFassjagdClub(board, slug);
  return fassjagdOgJpegResponse(club ?? EMPTY_FASSJAGD_CLUB);
}
