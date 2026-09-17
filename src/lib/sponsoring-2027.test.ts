import assert from "node:assert/strict";
import test from "node:test";
import { getKostenposten, isSponsorStufe, KOSTENPARTNERSCHAFTEN } from "./sponsoring-2027.ts";

test("acht Kostenpartnerschaften, alle offen, kein T-Shirt", () => {
  assert.equal(KOSTENPARTNERSCHAFTEN.length, 8);
  assert.ok(KOSTENPARTNERSCHAFTEN.every((p) => p.status === "offen"));
  assert.equal(
    KOSTENPARTNERSCHAFTEN.some((p) => /t-?shirt/i.test(p.titel)),
    false,
  );
});

test("getKostenposten und Stufen", () => {
  assert.equal(getKostenposten("medaillen")?.titel, "Medaillen");
  assert.equal(getKostenposten("unbekannt"), undefined);
  assert.equal(isSponsorStufe("partner"), true);
  assert.equal(isSponsorStufe("premium"), false);
});
