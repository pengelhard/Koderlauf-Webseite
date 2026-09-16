import { fetchAnmeldungen2027 } from "@/lib/anmeldungen/fetch-2027";
import { emptyStats2027 } from "@/lib/anmeldungen/aggregate";
import { buildFassjagdBoard } from "@/lib/fassjagd/ranking";
import type { FassjagdBoard } from "@/lib/fassjagd/types";

export async function loadFassjagdBoard(): Promise<FassjagdBoard> {
  try {
    const stats = await fetchAnmeldungen2027();
    return buildFassjagdBoard(stats.participants ?? [], stats.lastUpdated || new Date().toISOString());
  } catch {
    const empty = emptyStats2027();
    return buildFassjagdBoard([], empty.lastUpdated || new Date().toISOString());
  }
}
