import assert from "node:assert/strict";
import test from "node:test";
import { fassjagdPersonId, personVereinRaw } from "./person-id.ts";

test("fassjagdPersonId bevorzugt rrId", () => {
  assert.equal(fassjagdPersonId({ rrId: 19, bib: 19, nachname: "Schlicker" }), "rr:19");
});

test("personVereinRaw: Admin-Gruppe hat Vorrang vor RR-CLUB", () => {
  const p = { verein: "ASV Vach", rrId: 19, bib: 19, nachname: "Schlicker", vorname: "Benjamin" };
  assert.equal(personVereinRaw(p, {}), "ASV Vach");
  assert.equal(personVereinRaw(p, { "rr:19": "Schlickeria" }), "Schlickeria");
});
