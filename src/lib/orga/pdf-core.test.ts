import assert from "node:assert/strict";
import test from "node:test";
import { mapHeaders } from "./adressliste-headers.ts";
import { A4_PORTRAIT, PdfWriter, bibLabel } from "./pdf-core.ts";
import { PDFDocument } from "pdf-lib";

test("Startnummer-Header-Aliase inkl. Contest.Bib und BibNo", () => {
  const { cols } = mapHeaders(["Name", "Contest.Bib", "TShirt"]);
  assert.equal(cols.bib, 1);
  const alt = mapHeaders(["Startnr.", "BibNo", "Startnummer"]);
  assert.equal(alt.cols.bib, 0);
});

test("bibLabel zeigt Platzhalter statt 0 oder leer", () => {
  assert.equal(bibLabel(""), "–");
  assert.equal(bibLabel("0"), "–");
  assert.equal(bibLabel(0), "–");
  assert.equal(bibLabel("unassigned"), "–");
  assert.equal(bibLabel("42"), "42");
});

test("Ausgabe-Liste im Hochformat mit größerer Schrift", async () => {
  const w = new PdfWriter({
    bodySize: 10.5,
    headerSize: 9.5,
    rowHeight: 22,
    lineHeight: 13.5,
    margin: 36,
  });
  await w.init("Koderlauf Test");
  w.tableWithDivider(
    [
      { key: "bib", header: "Startnr.", width: 56 },
      { key: "nachname", header: "Nachname", width: 118 },
      { key: "vorname", header: "Vorname", width: 102 },
      { key: "jg", header: "Jahrgang", width: 42 },
      { key: "shirt", header: "Größe", width: 42 },
      { key: "okShirt", header: "Shirt", width: 36, checkbox: true },
      { key: "karte", header: "Karten", width: 42 },
      { key: "okKarte", header: "Karte", width: 38, checkbox: true },
      { key: "sn", header: "Nr. aus", width: 47, checkbox: true },
    ],
    [
      { bib: "–", nachname: "Müller", vorname: "Anna", jg: "1990", shirt: "M", karte: "1" },
      { bib: "42", nachname: "Schmidt", vorname: "Tim", jg: "1988", shirt: "L", karte: "–" },
    ],
    4,
    "Teilnehmer",
    "Ausgabe",
  );
  const pdf = await w.save();
  const doc = await PDFDocument.load(pdf);
  const page = doc.getPages()[0];
  assert.ok(page.getHeight() > page.getWidth());
  assert.ok(Math.abs(page.getWidth() - A4_PORTRAIT[0]) < 1);
});
