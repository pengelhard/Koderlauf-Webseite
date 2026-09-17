import { fetchAnmeldungen2027 } from "@/lib/anmeldungen/fetch-2027";
import { emptyStats2027 } from "@/lib/anmeldungen/aggregate";
import { buildFassjagdBoard } from "@/lib/fassjagd/ranking";
import { hydrateFassjagdFromDb, persistFassjagdToDb } from "@/lib/fassjagd/persist";
import type { FassjagdBoard } from "@/lib/fassjagd/types";

export async function loadFassjagdBoard(): Promise<FassjagdBoard> {
  await hydrateFassjagdFromDb();
  try {
    const stats = await fetchAnmeldungen2027();
    const board = buildFassjagdBoard(
      stats.participants ?? [],
      stats.lastUpdated || new Date().toISOString(),
    );
    await persistFassjagdToDb();
    return board;
  } catch {
    const empty = emptyStats2027();
    return buildFassjagdBoard([], empty.lastUpdated || new Date().toISOString());
  }
}
