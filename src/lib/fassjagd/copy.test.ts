import assert from "node:assert/strict";
import test from "node:test";
import type { FassjagdClub } from "./types.ts";
import {
  teamOgImageUrl,
  teamShareUrl,
  whatsappShareHref,
  whatsappText,
} from "./copy.ts";

const club: FassjagdClub = {
  name: "TV 1860 Gunzenhausen",
  slug: "tv-1860-gunzenhausen",
  total: 12,
  place: 1,
  ausgeschlossen: false,
  hausherr: false,
  trailSpielerei: 2,
  firstReg: 1,
  weekDelta: 3,
  flaming: true,
  gapToLeader: 0,
  gapToAbove: null,
  gapToBelow: 4,
  leadBy: 4,
  strecken: {},
  starters: [],
};

const hausherr: FassjagdClub = { ...club, name: "SV Obermögersheim", slug: "sv-obermoegersheim", hausherr: true, place: null, total: 3 };

test("WhatsApp-Text hat https-URL in eigener Zeile", () => {
  const url = "https://test.koderlauf.de/fassjagd/tv-1860-gunzenhausen?v=4";
  const text = whatsappText(club, url);
  assert.match(text, /\nhttps:\/\/test\.koderlauf\.de\/fassjagd\/tv-1860-gunzenhausen\?v=4$/);
  assert.equal(text.startsWith("1. Platz: TV 1860 Gunzenhausen\n12 Starter"), true);
  assert.equal(text.split("\n").length, 3);
});

test("Hausherr-WhatsApp-Text ebenfalls mit URL-Zeile", () => {
  const url = "https://test.koderlauf.de/fassjagd/sv-obermoegersheim?v=4";
  const text = whatsappText(hausherr, url);
  assert.match(text, /^Hausherr: SV Obermögersheim\n3 Starter · außer Wertung/);
  assert.equal(text.endsWith(`\n${url}`), true);
});

test("wa.me-Link nutzt den übergebenen Origin, nicht Production", () => {
  const href = whatsappShareHref(club, "https://test.koderlauf.de");
  assert.match(href, /^https:\/\/wa\.me\/\?text=/);
  const text = decodeURIComponent(new URL(href).searchParams.get("text") ?? "");
  assert.match(text, /\nhttps:\/\/test\.koderlauf\.de\/fassjagd\/tv-1860-gunzenhausen\?v=4$/);
  assert.equal(text.includes("https://koderlauf.de/"), false);
});

test("OG-Image-URL endet auf .jpg ohne Query", () => {
  assert.equal(
    teamShareUrl("https://test.koderlauf.de", "sv-obermoegersheim"),
    "https://test.koderlauf.de/fassjagd/sv-obermoegersheim?v=4",
  );
  assert.equal(
    teamOgImageUrl("https://test.koderlauf.de", "sv-obermoegersheim"),
    "https://test.koderlauf.de/fassjagd/sv-obermoegersheim/og.jpg",
  );
});
