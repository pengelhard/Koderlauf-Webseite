import assert from "node:assert/strict";
import test from "node:test";
import {
  EVENT,
  getOnlineAnmeldeschlussAt,
  isOnlineAnmeldungOffen,
  parseEventLocalDateTime,
} from "./event-config.ts";

test("Online-Anmeldeschluss ist 27.05.2027 8:00 MESZ", () => {
  assert.equal(EVENT.onlineAnmeldeschlussAnzeige, "27.05.2027 um 8:00 Uhr");
  const at = getOnlineAnmeldeschlussAt();
  assert.equal(at.toISOString(), "2027-05-27T06:00:00.000Z");
});

test("isOnlineAnmeldungOffen vor und nach Schluss", () => {
  const vorher = parseEventLocalDateTime("2027-05-27T07:59:59");
  const danach = parseEventLocalDateTime("2027-05-27T08:00:00");
  assert.equal(isOnlineAnmeldungOffen(vorher), true);
  assert.equal(isOnlineAnmeldungOffen(danach), false);
});
