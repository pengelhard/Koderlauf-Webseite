import assert from "node:assert/strict";
import test from "node:test";
import { fehlerAusDatenbank } from "./sponsor-sachen-fehler.ts";

test("Datenbank ohne Schreibrecht erklärt den Grant", () => {
  const result = fehlerAusDatenbank("42501", "permission denied for table fassjagd_state");
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /SQL-Editor/);
    assert.match(result.sql ?? "", /fassjagd_state/);
    assert.match(result.sql ?? "", /service_role/);
  }
});

test("Sonstiger Datenbankfehler bleibt lesbar", () => {
  const result = fehlerAusDatenbank("42P01", "relation fassjagd_state does not exist");
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /does not exist/);
    assert.equal(result.sql, undefined);
  }
});
