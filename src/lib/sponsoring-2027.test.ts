import assert from "node:assert/strict";
import test from "node:test";
import {
  anfrageWegAusQuery,
  bandAusQuery,
  beitragsartWarnung,
  ctaFuerFlaeche,
  getFlaeche,
  isBeitragsartGueltig,
  isFlaecheBuchbar,
  isSachspendeFlaeche,
  normalizeFlaecheId,
  normalizeStufe,
  SPONSOR_FLAECHEN,
  SPONSORING_2027,
  submitLabel,
  vorschlagBand,
} from "./sponsoring-2027.ts";

test("Flächen-Slugs und Typen", () => {
  assert.equal(SPONSOR_FLAECHEN.length, 13);
  assert.equal(normalizeFlaecheId("bauzaun-stellen"), "bauzaun");
  assert.equal(normalizeFlaecheId("streckenverpflegung"), "strecke");
  assert.equal(normalizeStufe("foerderer"), "sponsor");
  assert.equal(isSachspendeFlaeche(getFlaeche("bauzaun")), true);
  assert.equal(isSachspendeFlaeche(getFlaeche("medaillen")), false);
});

test("Pakete 150 / 300 / 500", () => {
  assert.equal(SPONSORING_2027.partnerPreis, 150);
  assert.equal(SPONSORING_2027.sponsorAb, 300);
  assert.equal(SPONSORING_2027.hauptsponsorAb, 500);
  const json = JSON.stringify(SPONSOR_FLAECHEN);
  assert.equal(json.includes("Förderer"), false);
});

test("Query und Komplett-Logik", () => {
  assert.equal(anfrageWegAusQuery("partner", null, null), "paket");
  assert.equal(anfrageWegAusQuery(null, "bauzaun", null), "flaeche");
  assert.equal(bandAusQuery("sponsor", getFlaeche("startnummern")), "sponsor");
  assert.equal(vorschlagBand(getFlaeche("medaillen")), "hauptsponsor");
  assert.equal(isFlaecheBuchbar("medaillen"), true);
  assert.match(ctaFuerFlaeche(getFlaeche("bauzaun")!).href, /flaeche=bauzaun/);
});

test("Sachspende-Validierung", () => {
  assert.ok(beitragsartWarnung(getFlaeche("ziel-bier"), "geld"));
  assert.equal(isBeitragsartGueltig(getFlaeche("bauzaun"), "geld"), false);
  assert.equal(isBeitragsartGueltig(getFlaeche("bauzaun"), "sach"), true);
  assert.equal(submitLabel("flaeche", "sponsor", getFlaeche("bauzaun")), "Sachspende anfragen");
  assert.equal(submitLabel("paket", "sponsor"), "Sponsor anfragen");
});
