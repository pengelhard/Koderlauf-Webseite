import { fetchAnmeldungen2027 } from "@/lib/anmeldungen/fetch-2027";
import { emptyStats2027 } from "@/lib/anmeldungen/aggregate";
import { listFassjagdPeople } from "@/lib/fassjagd/person";
import { buildFassjagdBoard } from "@/lib/fassjagd/ranking";
import type { FassjagdBoard, FassjagdPerson } from "@/lib/fassjagd/types";

export async function loadFassjagdBoard(): Promise<FassjagdBoard> {
  const { board } = await loadFassjagdAdmin();
  return board;
}

export async function loadFassjagdAdmin(): Promise<{
  board: FassjagdBoard;
  people: FassjagdPerson[];
}> {
  try {
    const stats = await fetchAnmeldungen2027();
    const participants = stats.participants ?? [];
    const lastUpdated = stats.lastUpdated || new Date().toISOString();
    return {
      board: buildFassjagdBoard(participants, lastUpdated),
      people: listFassjagdPeople(participants),
    };
  } catch {
    const empty = emptyStats2027();
    return {
      board: buildFassjagdBoard([], empty.lastUpdated || new Date().toISOString()),
      people: [],
    };
  }
}
