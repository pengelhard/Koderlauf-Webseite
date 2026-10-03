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
  assert.equal(SPONSOR_FLAECHEN.length, 12);
  assert.equal(normalizeFlaecheId("bauzaun-stellen"), "bauzaun");
  assert.equal(normalizeFlaecheId("streckenverpflegung"), "strecke");
  assert.equal(normalizeStufe("foerderer"), "banner");
  assert.equal(normalizeStufe("partner"), "banner");
  assert.equal(normalizeStufe("hauptsponsor"), "buehne");
  assert.equal(isSachspendeFlaeche(getFlaeche("bauzaun")), true);
  assert.equal(isSachspendeFlaeche(getFlaeche("medaillen")), false);
  assert.equal(getFlaeche("restkosten"), undefined);
});

test("Stufen Liste, Banner, Bühne", () => {
  assert.equal(SPONSORING_2027.bannerAb, 150);
  assert.equal(SPONSORING_2027.buehneAb, 500);
  const json = JSON.stringify(SPONSOR_FLAECHEN);
  assert.equal(json.includes("Förderer"), false);
  assert.equal(json.includes("Partner"), false);
  assert.equal(json.includes("festpreis"), false);
});

test("Query und Komplett-Logik", () => {
  assert.equal(anfrageWegAusQuery("partner", null, null), "stufe");
  assert.equal(anfrageWegAusQuery(null, "bauzaun", null), "flaeche");
  assert.equal(bandAusQuery("sponsor", getFlaeche("startnummern")), "buehne");
  assert.equal(bandAusQuery("liste", undefined), "liste");
  assert.equal(vorschlagBand(getFlaeche("medaillen")), "buehne");
  assert.equal(isFlaecheBuchbar("medaillen"), true);
  assert.equal(getFlaeche("bauzaun")?.status, "reserviert");
  assert.match(ctaFuerFlaeche(getFlaeche("bauzaun")!).href, /flaeche=bauzaun/);
});

test("Sachspende-Validierung", () => {
  assert.ok(beitragsartWarnung(getFlaeche("ziel-bier"), "geld"));
  assert.equal(isBeitragsartGueltig(getFlaeche("bauzaun"), "geld"), false);
  assert.equal(isBeitragsartGueltig(getFlaeche("bauzaun"), "sach"), true);
  assert.equal(submitLabel("flaeche", "buehne", getFlaeche("bauzaun")), "Sachspende anfragen");
  assert.equal(submitLabel("stufe", "banner"), "Banner anfragen");
  assert.equal(submitLabel("stufe", "liste"), "Liste anfragen");
});
