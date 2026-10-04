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
  SPONSOR_STUFEN,
  stufeAusWert,
  sacheMehrfach,
  stufeHinweis,
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
  assert.equal(werbeleistungKurz("unterstuetzer").includes("Instagram"), false);
  assert.equal(werbeleistungKurz("unterstuetzer").includes("Zieleinlauf"), false);
  assert.match(werbeleistungKurz("sponsor"), /Zieleinlauf/);
  assert.match(werbeleistungKurz("sponsor"), /Instagram/);
  assert.match(werbeleistungKurz("unter100"), /Logo/);
  assert.match(werbeleistungKurz("hauptsponsor"), /Siegerehrung/);
  assert.match(werbeleistungKurz("hauptsponsor"), /Bühne/);
  assert.equal(werbeleistungKurz("hauptsponsor").includes("Eigene Erwähnung"), false);
  assert.equal(getFlaeche("bauzaun")?.status, "offen");
  assert.equal(getFlaeche("medaillen")?.status, "offen");
});

test("Alte Links und Sachspenden ohne Preis", () => {
  assert.equal(normalizeStufe("liste"), "unter100");
  assert.equal(normalizeStufe("partner"), "unterstuetzer");
  assert.equal(normalizeStufe("buehne"), "hauptsponsor");
  assert.equal(bandAusQuery("sponsor"), "sponsor");
  assert.equal(isSachspendeFlaeche(getFlaeche("bauzaun")), true);
  assert.equal(isSachspendeFlaeche(getFlaeche("zielbogen")), true);
  assert.equal(isBeitragsartGueltig(getFlaeche("ziel-bier"), "geld"), true);
  assert.equal(getFlaeche("zielverpflegung")?.id, "verpflegung");
  assert.equal(getFlaeche("strecke")?.id, "verpflegung");
  assert.match(getFlaeche("medaillen")?.kurz ?? "", /Kodermedaille/);
  assert.match(getFlaeche("medaillen")?.kurz ?? "", /Leinenband/);
  assert.match(getFlaeche("startnummern")?.kurz ?? "", /Name/);
  assert.equal(SACHSPENDEN_SICHTBAR.some((f) => f.halfteVon), false);
  const json = JSON.stringify(SACHSPENDEN_SICHTBAR);
  assert.equal(json.includes("festpreis"), false);
  assert.equal(json.includes("300"), false);
  assert.equal(submitLabel("hauptsponsor"), "Hauptsponsor anfragen");
  assert.equal(submitLabel("unter100"), "Anfragen");
  assert.match(getFlaeche("bauzaun")?.kurz ?? "", /Absperren/);
  assert.match(getFlaeche("bauzaun")?.kurz ?? "", /Zieleinlauf/);
  assert.match(getFlaeche("medaillen")?.beschreibung ?? "", /wie 2026/);
  assert.match(getFlaeche("ziel-bier")?.beschreibung ?? "", /Partnerbrauerei/);
  assert.match(getFlaeche("preise")?.beschreibung ?? "", /36 Platzierungspreise/);
  assert.match(getFlaeche("verpflegung")?.beschreibung ?? "", /600 Liter/);
  assert.equal(sacheMehrfach("preise"), true);
  assert.equal(sacheMehrfach("verpflegung"), true);
  assert.equal(sacheMehrfach("bauzaun"), false);
  assert.match(getFlaeche("ziel-bier")?.kurz ?? "", /Brauerei/);
  assert.match(SPONSOR_STUFEN.find((s) => s.id === "hauptsponsor")?.leistungen.join(" ") ?? "", /Bühne/);
  assert.match(getFlaeche("preise")?.beschreibung ?? "", /euch/);
  assert.match(getFlaeche("verpflegung")?.beschreibung ?? "", /euch/);
  assert.match(SPONSOR_STUFEN.find((s) => s.id === "unterstuetzer")?.info ?? "", /Auch Spenden unter 100/);
  assert.match(SPONSOR_STUFEN.find((s) => s.id === "unterstuetzer")?.info ?? "", /3,40 m/);
  assert.match(SPONSOR_STUFEN.find((s) => s.id === "sponsor")?.info ?? "", /2,33 m/);
  assert.match(SPONSOR_STUFEN.find((s) => s.id === "hauptsponsor")?.info ?? "", /Zeltwand/);
  assert.match(SPONSOR_STUFEN.find((s) => s.id === "hauptsponsor")?.leistungen.join(" ") ?? "", /Zeltwand/);
  assert.match(stufeHinweis(80), /Website/);
  assert.match(stufeHinweis(250), /Sponsor/);
  assert.match(SPONSORING_2027.wertHinweis, /legt die Stufe fest/);
  assert.match(SPONSORING_2027.wertHinweis, /schätzt/);
});
