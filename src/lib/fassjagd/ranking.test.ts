import assert from "node:assert/strict";
import test from "node:test";
import { fassjagdPersonId, personVereinRaw } from "./person-id.ts";

test("Personen-ID bevorzugt Race-Result ContId", () => {
  assert.equal(fassjagdPersonId({ rrId: 391760, nachname: "A", vorname: "B" }), "rr:391760");
});

test("Personen-ID fällt auf Name+Jahrgang+Strecke zurück", () => {
  assert.equal(
    fassjagdPersonId({ nachname: "Müller", vorname: "Anna", jahrgang: "1990", strecke: "Trailrun" }),
    "n:müller|anna|1990|trailrun",
  );
});

test("Personen-Override ersetzt den Original-Verein", () => {
  const p = { verein: "Team A", rrId: 2, nachname: "Beta", vorname: "Max" };
  assert.equal(personVereinRaw(p, {}), "Team A");
  assert.equal(personVereinRaw(p, { "rr:2": "Team C" }), "Team C");
  assert.equal(personVereinRaw(p, {}), "Team A");
});
