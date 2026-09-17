import assert from "node:assert/strict";
import test from "node:test";
import {
  anfrageWegAusQuery,
  bandAusQuery,
  bandWarnung,
  ctaFuerFlaeche,
  getFlaeche,
  isAnfrageWeg,
  isBeitragsband,
  normalizeFlaecheId,
  normalizeStufe,
  SPONSOR_FLAECHEN,
  SPONSORING_2027,
  submitLabel,
  vorschlagBand,
} from "./sponsoring-2027.ts";

test("zehn Flächen inkl. Restkosten, kein T-Shirt", () => {
  assert.equal(SPONSOR_FLAECHEN.length, 10);
  assert.ok(SPONSOR_FLAECHEN.every((f) => f.status === "offen" || f.mehrereMoeglich));
  assert.equal(
    SPONSOR_FLAECHEN.some((f) => /t-?shirt/i.test(f.titel)),
    false,
  );
  assert.ok(SPONSOR_FLAECHEN.some((f) => f.id === "bauzaun-einzelfeld"));
  assert.ok(SPONSOR_FLAECHEN.some((f) => f.id === "restkosten"));
  assert.equal(normalizeFlaecheId("bauzaun-feld"), "bauzaun-einzelfeld");
});

test("kein Sachpartner mehr im Modell", () => {
  const json = JSON.stringify(SPONSOR_FLAECHEN);
  assert.equal(json.includes("Sachpartner"), false);
  assert.equal(normalizeStufe("sachpartner"), "foerderer");
});

test("getFlaeche, Bänder und Query", () => {
  assert.equal(getFlaeche("medaillen")?.titel, "Medaillen");
  assert.equal(getFlaeche("bauzaun-feld")?.id, "bauzaun-einzelfeld");
  assert.equal(getFlaeche("restkosten")?.mehrereMoeglich, true);
  assert.equal(isAnfrageWeg("partner"), true);
  assert.equal(isAnfrageWeg("beitrag"), true);
  assert.equal(isAnfrageWeg("flaeche"), true);
  assert.equal(isBeitragsband("foerderer"), true);
  assert.equal(anfrageWegAusQuery("partner", null, null), "partner");
  assert.equal(anfrageWegAusQuery("foerderer", null, null), "beitrag");
  assert.equal(anfrageWegAusQuery("hauptsponsor", null, null), "beitrag");
  assert.equal(anfrageWegAusQuery(null, "medaillen", null), "flaeche");
  assert.equal(anfrageWegAusQuery("sachpartner", null, null), "beitrag");
  assert.equal(anfrageWegAusQuery("sachpartner", "medaillen", null), "flaeche");
  assert.equal(bandAusQuery("hauptsponsor", getFlaeche("medaillen")), "hauptsponsor");
  assert.equal(vorschlagBand(getFlaeche("medaillen")), "hauptsponsor");
  assert.equal(vorschlagBand(getFlaeche("bauzaun-einzelfeld")), "partner");
  assert.equal(vorschlagBand(getFlaeche("zielbogen")), "foerderer");
});

test("CTAs, Warnungen und Submit-Labels", () => {
  assert.equal(SPONSORING_2027.partnerPreis, 150);
  assert.equal(SPONSORING_2027.hauptsponsorAb, 800);
  assert.equal(ctaFuerFlaeche(getFlaeche("medaillen")!).label, "Diese Fläche anfragen");
  assert.match(ctaFuerFlaeche(getFlaeche("medaillen")!).href, /flaeche=medaillen/);
  assert.match(ctaFuerFlaeche(getFlaeche("medaillen")!).href, /stufe=hauptsponsor/);
  assert.ok(bandWarnung(getFlaeche("medaillen"), "partner"));
  assert.equal(bandWarnung(getFlaeche("medaillen"), "hauptsponsor"), null);
  assert.equal(submitLabel("partner", "partner"), "Partner anfragen (150 €)");
  assert.equal(submitLabel("beitrag", "foerderer"), "Förderer anfragen");
  assert.equal(submitLabel("flaeche", "partner"), "Fläche anfragen");
});
