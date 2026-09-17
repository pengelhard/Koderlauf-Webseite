#!/usr/bin/env node
/**
 * Orga-Stammdaten auf das neue Supabase-Projekt bringen.
 *
 * Option 1 (einfach): SQL-Editor
 *   https://supabase.com/dashboard/project/rrhcoelbplyiwczzkrjl/sql/new
 *   Datei: supabase/migrations/20260917_orga_stammdaten.sql → Run
 *
 * Option 2: Connection-String (Database-Passwort, nicht der Publishable-Key)
 *   SUPABASE_DB_URL='postgresql://postgres:PASS@db.rrhcoelbplyiwczzkrjl.supabase.co:5432/postgres' \
 *     node scripts/setup-db.mjs
 */

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const PROJECT_REF = "rrhcoelbplyiwczzkrjl";
const SQL_EDITOR = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;
const migrationPath = "supabase/migrations/20260917_orga_stammdaten.sql";
const dbUrl = process.env.SUPABASE_DB_URL?.trim();

if (!dbUrl) {
  const sql = readFileSync(migrationPath, "utf-8");
  console.log("Koderlauf – Supabase-Setup (neues Projekt)");
  console.log("");
  console.log("Kein SUPABASE_DB_URL. Tabellen so anlegen:");
  console.log(`  1. ${SQL_EDITOR}`);
  console.log(`  2. Inhalt von ${migrationPath} einfügen`);
  console.log("  3. Run");
  console.log("");
  console.log("Oder mit Datenbank-Passwort:");
  console.log(
    `  SUPABASE_DB_URL='postgresql://postgres:PASS@db.${PROJECT_REF}.supabase.co:5432/postgres' node scripts/setup-db.mjs`,
  );
  console.log("");
  console.log("SQL folgt:\n");
  console.log(sql);
  process.exit(1);
}

console.log("Verbinde mit Supabase…");
try {
  execFileSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", migrationPath], {
    stdio: "inherit",
  });
  console.log("Stammdaten-Tabellen sind angelegt (sponsors, fassjagd_state).");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error(`Bitte SQL manuell ausführen: ${SQL_EDITOR}`);
  process.exit(1);
}
