import { EMPTY_FASSJAGD_CLUB, fassjagdCardResponse } from "@/lib/fassjagd/card";
import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { findFassjagdClub } from "@/lib/fassjagd/ranking";

export const runtime = "nodejs";
export const alt = "Fassjagd Teamkarte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await loadFassjagdBoard();
  const club = findFassjagdClub(board, slug);
  return fassjagdCardResponse(club ?? EMPTY_FASSJAGD_CLUB, "og");
}
