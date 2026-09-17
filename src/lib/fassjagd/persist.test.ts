import assert from "node:assert/strict";
import test from "node:test";
import { overridesFromJson } from "./persist.ts";

test("overridesFromJson liest Aliase, Ausschlüsse und Personen-Gruppen", () => {
  const next = overridesFromJson({
    aliases: { svo: "SV Obermögersheim" },
    excluded: ["Hausherr"],
    personGroups: { "rr:1": "Laufgruppe Test" },
    manualFreeze: false,
    freezeSnapshot: null,
    dailyCounts: { "2026-09-01": { "Laufgruppe Test": 3 } },
  });
  assert.equal(next.aliases?.svo, "SV Obermögersheim");
  assert.deepEqual(next.excluded, ["Hausherr"]);
  assert.equal(next.personGroups?.["rr:1"], "Laufgruppe Test");
  assert.equal(next.manualFreeze, false);
  assert.equal(next.freezeSnapshot, null);
  assert.equal(next.dailyCounts?.["2026-09-01"]?.["Laufgruppe Test"], 3);
});

test("overridesFromJson ignoriert Schrott", () => {
  assert.deepEqual(overridesFromJson(null), {});
  assert.deepEqual(overridesFromJson("x"), {});
  const next = overridesFromJson({ aliases: ["nope"], excluded: "x", personGroups: 1 });
  assert.deepEqual(next.aliases, {});
  assert.deepEqual(next.excluded, []);
  assert.deepEqual(next.personGroups, {});
});
