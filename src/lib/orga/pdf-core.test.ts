import assert from "node:assert/strict";
import test from "node:test";
import { mapHeaders } from "./adressliste-headers.ts";
import { bibLabel } from "./pdf-core.ts";

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
