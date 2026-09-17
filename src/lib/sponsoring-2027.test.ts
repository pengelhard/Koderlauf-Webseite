import assert from "node:assert/strict";
import test from "node:test";
import {
  anfrageWegAusQuery,
  bandAusQuery,
  bandWarnung,
  ctaFuerFlaeche,
  getEffectiveStatus,
  getFlaeche,
  isAnfrageWeg,
  isBeitragsband,
  isFlaecheBuchbar,
  normalizeFlaecheId,
  normalizeStufe,
  SPONSOR_FLAECHEN,
  SPONSORING_2027,
  submitLabel,
  vorschlagBand,
} from "./sponsoring-2027.ts";

test("13 Flächen-Slots inkl. Hälften und Restkosten", () => {
  assert.equal(SPONSOR_FLAECHEN.length, 13);
  assert.ok(SPONSOR_FLAECHEN.some((f) => f.id === "medaillen-a"));
  assert.ok(SPONSOR_FLAECHEN.some((f) => f.id === "preise-2"));
  assert.ok(SPONSOR_FLAECHEN.some((f) => f.id === "bauzaun-stellen"));
  assert.ok(SPONSOR_FLAECHEN.some((f) => f.id === "restkosten"));
  assert.equal(normalizeFlaecheId("siegerpreise"), "preise");
  assert.equal(normalizeFlaecheId("bauzaun-feld"), "bauzaun-stellen");
});

test("Bänder 150 / 300 / 500", () => {
  assert.equal(SPONSORING_2027.partnerPreis, 150);
  assert.equal(SPONSORING_2027.foerdererAb, 300);
  assert.equal(SPONSORING_2027.hauptsponsorAb, 500);
  assert.equal(normalizeStufe("sachpartner"), "foerderer");
  const json = JSON.stringify(SPONSOR_FLAECHEN);
  assert.equal(json.includes("Sachpartner"), false);
  assert.equal(json.includes("800"), false);
});

test("getFlaeche, Query und Festpreise", () => {
  assert.equal(getFlaeche("medaillen")?.festpreis, 1000);
  assert.equal(getFlaeche("medaillen-a")?.festpreis, 500);
  assert.equal(getFlaeche("preise-1")?.festpreis, 300);
  assert.equal(isAnfrageWeg("flaeche"), true);
  assert.equal(isBeitragsband("foerderer"), true);
  assert.equal(anfrageWegAusQuery("partner", null, null), "partner");
  assert.equal(anfrageWegAusQuery(null, "medaillen-a", null), "flaeche");
  assert.equal(bandAusQuery("hauptsponsor", getFlaeche("medaillen")), "hauptsponsor");
  assert.equal(vorschlagBand(getFlaeche("medaillen")), "hauptsponsor");
  assert.equal(vorschlagBand(getFlaeche("startnummern")), "foerderer");
});

test("Komplett/Hälften-Logik", () => {
  assert.equal(getEffectiveStatus(getFlaeche("medaillen")!), "offen");
  assert.equal(isFlaecheBuchbar("medaillen"), true);
  assert.equal(isFlaecheBuchbar("medaillen-a"), true);
  assert.match(ctaFuerFlaeche(getFlaeche("medaillen")!).href, /flaeche=medaillen/);
  assert.ok(bandWarnung(getFlaeche("medaillen-a"), "foerderer"));
  assert.equal(bandWarnung(getFlaeche("medaillen-a"), "hauptsponsor"), null);
  assert.equal(submitLabel("partner", "partner"), "Partner anfragen (150 €)");
  assert.equal(submitLabel("beitrag", "foerderer"), "Förderer anfragen");
});
