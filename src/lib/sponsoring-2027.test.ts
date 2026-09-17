import assert from "node:assert/strict";
import test from "node:test";
import {
  anfrageArtAusQuery,
  ctaFuerPosten,
  getKostenposten,
  isAnfrageArt,
  isPostenRolle,
  KOSTENPARTNERSCHAFTEN,
  normalizePostenId,
  rolleAusQuery,
  rolleWarnung,
  SPONSORING_2027,
  vorschlagRolle,
} from "./sponsoring-2027.ts";

test("neun offene Posten, kein T-Shirt, bauzaun-einzelfeld", () => {
  assert.equal(KOSTENPARTNERSCHAFTEN.length, 9);
  assert.ok(KOSTENPARTNERSCHAFTEN.every((p) => p.status === "offen"));
  assert.equal(
    KOSTENPARTNERSCHAFTEN.some((p) => /t-?shirt/i.test(p.titel)),
    false,
  );
  assert.ok(KOSTENPARTNERSCHAFTEN.some((p) => p.id === "bauzaun-einzelfeld"));
  assert.equal(normalizePostenId("bauzaun-feld"), "bauzaun-einzelfeld");
});

test("getKostenposten, Rollen und Query", () => {
  assert.equal(getKostenposten("medaillen")?.titel, "Medaillen");
  assert.equal(getKostenposten("bauzaun-feld")?.id, "bauzaun-einzelfeld");
  assert.equal(getKostenposten("unbekannt"), undefined);
  assert.equal(isAnfrageArt("partner"), true);
  assert.equal(isAnfrageArt("posten"), true);
  assert.equal(isAnfrageArt("hauptsponsor"), false);
  assert.equal(isPostenRolle("sachpartner"), true);
  assert.equal(anfrageArtAusQuery("partner", null), "partner");
  assert.equal(anfrageArtAusQuery("hauptsponsor", null), "posten");
  assert.equal(anfrageArtAusQuery(null, "medaillen"), "posten");
  assert.equal(rolleAusQuery("hauptsponsor", getKostenposten("siegerpreise")), "hauptsponsor");
  assert.equal(rolleAusQuery(null, getKostenposten("siegerpreise")), "sachpartner");
  assert.equal(vorschlagRolle(getKostenposten("medaillen")), "hauptsponsor");
});

test("CTAs und Rollen-Warnung", () => {
  assert.equal(SPONSORING_2027.partnerPreis, 150);
  assert.equal(SPONSORING_2027.hauptsponsorAb, 500);
  assert.equal(ctaFuerPosten(getKostenposten("medaillen")!).label, "Diesen Posten anfragen");
  assert.match(ctaFuerPosten(getKostenposten("medaillen")!).href, /posten=medaillen/);
  assert.ok(rolleWarnung(getKostenposten("siegerpreise"), "hauptsponsor"));
  assert.equal(rolleWarnung(getKostenposten("medaillen"), "hauptsponsor"), null);
});
