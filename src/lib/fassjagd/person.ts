import type { AnmeldungParticipant } from "@/lib/anmeldungen/types";
import { resolveVerein } from "@/lib/anmeldungen/vereine";
import { fassjagdPersonId, personVereinRaw } from "@/lib/fassjagd/person-id";
import { getFassjagdOverrides, type FassjagdOverrides } from "@/lib/fassjagd/store";
import type { FassjagdPerson } from "@/lib/fassjagd/types";

export { fassjagdPersonId, personVereinRaw } from "@/lib/fassjagd/person-id";

export function listFassjagdPeople(
  participants: AnmeldungParticipant[],
  overrides: FassjagdOverrides = getFassjagdOverrides(),
): FassjagdPerson[] {
  return participants
    .map((p) => {
      const originalGroup = (p.verein ?? "").trim();
      const raw = personVereinRaw(p, overrides.personGroups);
      const resolved = resolveVerein(raw, overrides.aliases);
      const currentGroup = resolved.empty ? "" : resolved.canonical;
      const id = fassjagdPersonId(p);
      return {
        id,
        vorname: p.vorname,
        nachname: p.nachname,
        strecke: p.strecke,
        originalGroup,
        currentGroup,
        overridden: Object.prototype.hasOwnProperty.call(overrides.personGroups, id),
      };
    })
    .sort((a, b) => {
      const n = a.nachname.localeCompare(b.nachname, "de");
      if (n !== 0) return n;
      const v = a.vorname.localeCompare(b.vorname, "de");
      if (v !== 0) return v;
      return a.strecke.localeCompare(b.strecke, "de");
    });
}
