import assert from "node:assert/strict";
import test from "node:test";
import { mergeOverridesForPersist, overridesFromJson } from "./persist.ts";
import type { FassjagdOverrides } from "./store.ts";

const emptyRam = (): FassjagdOverrides => ({
  aliases: {},
  excluded: [],
  personGroups: {},
  manualFreeze: false,
  freezeSnapshot: null,
  dailyCounts: {},
});

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

test("leere RAM-Aliase und personGroups überschreiben die DB nicht", () => {
  const existing = {
    aliases: { "ali schlicker": "Schlickeria" },
    personGroups: { "rr:19": "Schlickeria" },
    excluded: ["Test"],
    dailyCounts: { "2026-11-23": { Schlickeria: 3 } },
    manualFreeze: false,
    freezeSnapshot: null,
  };
  const merged = mergeOverridesForPersist(existing, emptyRam(), false);
  assert.equal(merged.aliases["ali schlicker"], "Schlickeria");
  assert.equal(merged.personGroups["rr:19"], "Schlickeria");
  assert.deepEqual(merged.excluded, ["Test"]);
  assert.equal(merged.dailyCounts["2026-11-23"]?.Schlickeria, 3);
});

test("RAM-Aliase werden ergänzt, bestehende DB-Aliase bleiben", () => {
  const existing = { aliases: { svo: "SV Obermögersheim" }, personGroups: { "rr:1": "Alt" } };
  const ram = emptyRam();
  ram.aliases = { "tv 1860 gz": "TV 1860 Gunzenhausen" };
  ram.personGroups = { "rr:2": "Neu" };
  const merged = mergeOverridesForPersist(existing, ram, false);
  assert.equal(merged.aliases.svo, "SV Obermögersheim");
  assert.equal(merged.aliases["tv 1860 gz"], "TV 1860 Gunzenhausen");
  assert.equal(merged.personGroups["rr:1"], "Alt");
  assert.equal(merged.personGroups["rr:2"], "Neu");
});

test("nach Hydrate dürfen gelöschte Personen-Gruppen aus dem RAM verschwinden", () => {
  const existing = { personGroups: { "rr:1": "A", "rr:2": "B" }, aliases: { a: "A" } };
  const ram = emptyRam();
  ram.personGroups = { "rr:2": "B" };
  ram.aliases = { a: "A" };
  const merged = mergeOverridesForPersist(existing, ram, true);
  assert.deepEqual(merged.personGroups, { "rr:2": "B" });
  assert.equal(merged.aliases.a, "A");
});
