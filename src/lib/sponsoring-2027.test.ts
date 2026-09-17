import assert from "node:assert/strict";
import test from "node:test";
import {
  anfrageArtAusQuery,
  ctaFuerPosten,
  getKostenposten,
  isAnfrageArt,
  isPostenRolle,
  KOSTENPARTNERSCHAFTEN,
  rolleAusQuery,
  SPONSORING_2027,
} from "./sponsoring-2027.ts";

test("neun Kostenpartnerschaften, alle offen, kein T-Shirt", () => {
  assert.equal(KOSTENPARTNERSCHAFTEN.length, 9);
  assert.ok(KOSTENPARTNERSCHAFTEN.every((p) => p.status === "offen"));
  assert.equal(
    KOSTENPARTNERSCHAFTEN.some((p) => /t-?shirt/i.test(p.titel)),
    false,
  );
  assert.ok(KOSTENPARTNERSCHAFTEN.some((p) => p.id === "bauzaun-feld"));
  assert.ok(KOSTENPARTNERSCHAFTEN.some((p) => p.id === "bauzaun-buendel"));
});

test("getKostenposten, Rollen und Query", () => {
  assert.equal(getKostenposten("medaillen")?.titel, "Medaillen");
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
  assert.equal(rolleAusQuery(null, getKostenposten("medaillen")), "hauptsponsor");
});

test("Hauptsponsor-Schwelle und CTAs ohne Tickets", () => {
  assert.equal(SPONSORING_2027.partnerPreis, 150);
  assert.equal(SPONSORING_2027.hauptsponsorAb, 500);
  assert.equal(ctaFuerPosten(getKostenposten("medaillen")!).label, "Als Hauptsponsor anfragen");
  assert.equal(ctaFuerPosten(getKostenposten("bauzaun-feld")!).label, "Als Sachpartner anfragen");
  assert.equal(ctaFuerPosten(getKostenposten("zielbogen")!).label, "Diesen Posten anfragen");
});
