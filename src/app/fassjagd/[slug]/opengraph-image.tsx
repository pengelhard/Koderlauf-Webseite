import { loadFassjagdBoard } from "@/lib/fassjagd/load";
import { findFassjagdClub } from "@/lib/fassjagd/ranking";
import { fassjagdCardResponse } from "@/lib/fassjagd/card";

export const runtime = "nodejs";
export const alt = "Fassjagd Vereinskarte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await loadFassjagdBoard();
  const club = findFassjagdClub(board, slug);
  if (!club) {
    return fassjagdCardResponse(
      {
        name: "Fassjagd",
        slug: "fassjagd",
        total: 0,
        place: null,
        ausgeschlossen: false,
        hausherr: false,
        trailSpielerei: 0,
        firstReg: Number.POSITIVE_INFINITY,
        weekDelta: 0,
        flaming: false,
        gapToLeader: 0,
        gapToAbove: null,
        gapToBelow: null,
        leadBy: null,
        strecken: {},
        starters: [],
      },
      "og",
    );
  }
  return fassjagdCardResponse(club, "og");
}
