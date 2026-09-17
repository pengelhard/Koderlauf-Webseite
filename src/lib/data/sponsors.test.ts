import assert from "node:assert/strict";
import test from "node:test";
import { PDFDocument } from "pdf-lib";
import {
  formatSponsorAdresse,
  formatSponsorLinks,
  formatSponsorSocial,
  getSponsorsFromCode,
  pdfDash,
} from "./sponsors.ts";
import { getPublicSponsors, parseSponsorYear } from "./sponsors-public.ts";
import { buildSponsorenPdf, renderSponsorenPdf, sponsorenPdfFilename } from "../orga/pdf-sponsoren.ts";

test("2026 hat die Website-Sponsoren, 2027 ist noch leer", () => {
  const y26 = getPublicSponsors(2026);
  const y27 = getPublicSponsors(2027);
  assert.equal(y26.length, 37);
  assert.equal(y27.length, 0);
  assert.ok(y26.some((s) => s.firma === "Bittig IT"));
  assert.ok(y26.some((s) => s.firma === "Stache Fitness"));
  assert.equal(getSponsorsFromCode(2026).length, 37);
  assert.equal(getSponsorsFromCode(2027).length, 0);
});

test("parseSponsorYear akzeptiert nur 2026 und 2027", () => {
  assert.equal(parseSponsorYear("2026"), 2026);
  assert.equal(parseSponsorYear(2027), 2027);
  assert.equal(parseSponsorYear("2025"), null);
  assert.equal(parseSponsorYear(null), null);
});

test("PDF-Felder: fehlende Werte als Gedankenstrich, Ort als Adresse", () => {
  assert.equal(pdfDash(""), "–");
  assert.equal(pdfDash(null), "–");
  assert.equal(pdfDash("  Max  "), "Max");
  const sample = getSponsorsFromCode(2026).find((s) => s.firma === "Bittig IT");
  assert.ok(sample);
  assert.equal(formatSponsorAdresse(sample), "Obermögersheim");
  assert.equal(pdfDash(sample.telefon), "–");
  assert.equal(pdfDash(sample.email), "–");
  assert.equal(pdfDash(sample.ansprechpartner), "–");
  assert.match(formatSponsorLinks(sample), /bittig-it\.de/);
});

test("Instagram-Website gilt als Social Media, wenn kein Extra-Feld da ist", () => {
  const blatt = getSponsorsFromCode(2026).find((s) => s.firma === "Blattwerkbauer");
  assert.ok(blatt);
  assert.match(formatSponsorSocial(blatt), /instagram/i);
});

test("Sponsoren-PDF 2026 ist mehrseitig, 2027 enthält den Leer-Hinweis", async () => {
  const pdf2026 = await renderSponsorenPdf({
    year: 2026,
    sponsors: getSponsorsFromCode(2026),
    source: "code",
  });
  const pdf2027 = await renderSponsorenPdf({
    year: 2027,
    sponsors: getSponsorsFromCode(2027),
    source: "code",
  });
  assert.equal(Buffer.from(pdf2026.subarray(0, 4)).toString("ascii"), "%PDF");
  assert.equal(Buffer.from(pdf2027.subarray(0, 4)).toString("ascii"), "%PDF");
  const doc26 = await PDFDocument.load(pdf2026);
  const doc27 = await PDFDocument.load(pdf2027);
  assert.ok(doc26.getPageCount() >= 5, `erwartet mehrere Seiten, war ${doc26.getPageCount()}`);
  assert.equal(doc27.getPageCount(), 1);
  assert.ok(pdf2026.byteLength > pdf2027.byteLength);
  assert.equal(sponsorenPdfFilename(2026), "koderlauf-2026-sponsoren.pdf");
  assert.equal(sponsorenPdfFilename(2027), "koderlauf-2027-sponsoren.pdf");
  const viaApiHelper = await buildSponsorenPdf(2027);
  assert.equal(Buffer.from(viaApiHelper.subarray(0, 4)).toString("ascii"), "%PDF");
});
