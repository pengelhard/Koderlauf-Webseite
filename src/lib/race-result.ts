/**
 * Race Result / RaceSolution Online-Anmeldung (Einbettung).
 * Keys und Event-ID kommen vom Partner.
 */

export type RaceResultFormId = "einzeln" | "sammel";

export interface RaceResultForm {
  id: RaceResultFormId;
  label: string;
  /** RRReg_name aus dem Embed-Code */
  name: string;
  /** RRReg_key aus dem Embed-Code */
  key: string;
}

export const RACE_RESULT = {
  eventId: "391760",
  server: "https://events2.raceresult.com",
  initScript: "https://events2.raceresult.com/registrations/init.js?lang=de-de",
  forms: [
    {
      id: "einzeln",
      label: "Einzel-Anmeldung",
      name: "Einzel-Anmeldung",
      key: "CCOCd0GqD8Fj",
    },
    {
      id: "sammel",
      label: "Sammel-Anmeldung",
      name: "Sammel-Anmeldung",
      key: "byl3kiDDa1BT",
    },
  ] satisfies RaceResultForm[],
} as const;

export function getRaceResultForm(id: RaceResultFormId): RaceResultForm {
  const form = RACE_RESULT.forms.find((f) => f.id === id);
  if (!form) throw new Error(`Unbekanntes Race-Result-Formular: ${id}`);
  return form;
}
