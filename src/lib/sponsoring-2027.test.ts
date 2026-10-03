import assert from "node:assert/strict";
import test from "node:test";
import {
  bandAusQuery,
  getFlaeche,
  isBeitragsartGueltig,
  isSachspendeFlaeche,
  normalizeStufe,
  SACHSPENDEN_SICHTBAR,
  SPONSORING_2027,
  stufeAusWert,
  submitLabel,
  werbeleistungKurz,
} from "./sponsoring-2027.ts";

test("Stufen aus selbst genanntem Wert", () => {
  assert.equal(stufeAusWert(50), "unter100");
  assert.equal(stufeAusWert(100), "unterstuetzer");
  assert.equal(stufeAusWert(249), "unterstuetzer");
  assert.equal(stufeAusWert(250), "sponsor");
  assert.equal(stufeAusWert(499), "sponsor");
  assert.equal(stufeAusWert(500), "hauptsponsor");
  assert.equal(SPONSORING_2027.unterstuetzerAb, 100);
  assert.equal(SPONSORING_2027.sponsorAb, 250);
  assert.equal(SPONSORING_2027.hauptsponsorAb, 500);
});

test("Werbeleistung", () => {
  assert.match(werbeleistungKurz("unter100"), /Website/);
  assert.match(werbeleistungKurz("unterstuetzer"), /Bauzaun/);
  assert.match(werbeleistungKurz("unterstuetzer"), /Zieleinlauf/);
  assert.match(werbeleistungKurz("sponsor"), /250|Mittleres|100/);
  assert.match(werbeleistungKurz("hauptsponsor"), /Siegerehrung/);
});

test("Alte Links und Sachspenden ohne Preis", () => {
  assert.equal(normalizeStufe("liste"), "unter100");
  assert.equal(normalizeStufe("partner"), "unterstuetzer");
  assert.equal(normalizeStufe("buehne"), "hauptsponsor");
  assert.equal(bandAusQuery("sponsor"), "sponsor");
  assert.equal(isSachspendeFlaeche(getFlaeche("bauzaun")), true);
  assert.equal(isBeitragsartGueltig(getFlaeche("ziel-bier"), "geld"), false);
  assert.equal(SACHSPENDEN_SICHTBAR.some((f) => f.halfteVon), false);
  const json = JSON.stringify(SACHSPENDEN_SICHTBAR);
  assert.equal(json.includes("festpreis"), false);
  assert.equal(json.includes("300"), false);
  assert.equal(submitLabel("hauptsponsor"), "Hauptsponsor anfragen");
  assert.equal(submitLabel("unter100"), "Anfragen");
});
