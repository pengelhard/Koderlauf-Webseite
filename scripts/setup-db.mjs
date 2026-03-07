#!/usr/bin/env node
/**
 * Koderlauf Database Setup Script
 *
 * Runs the migration SQL against Supabase.
 * Usage: node scripts/setup-db.mjs
 *
 * Requires SUPABASE_DB_URL environment variable:
 *   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
 *
 * Or run the SQL manually in Supabase Dashboard > SQL Editor
 */

import { readFileSync } from "fs";
import { execSync } from "child_process";

const migrationPath = "supabase/migrations/20260225_init_schema.sql";

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.log("=".repeat(60));
  console.log("KODERLAUF DATENBANK SETUP");
  console.log("=".repeat(60));
  console.log("");
  console.log("Kein SUPABASE_DB_URL gefunden.");
  console.log("");
  console.log("Option 1: SQL direkt im Supabase Dashboard ausführen");
  console.log("  1. Öffne: https://supabase.com/dashboard/project/dulsyqvhylxljdntbzbw/sql");
  console.log("  2. Kopiere den Inhalt von:", migrationPath);
  console.log("  3. Klicke 'Run'");
  console.log("");
  console.log("Option 2: Dieses Script mit DB-URL ausführen");
  console.log("  SUPABASE_DB_URL='postgresql://postgres.[ref]:[pw]@...pooler.supabase.com:6543/postgres' node scripts/setup-db.mjs");
  console.log("");
  console.log("Die DB-URL findest du unter:");
  console.log("  Dashboard > Settings > Database > Connection string > URI");
  console.log("=".repeat(60));

  console.log("\n\nHier ist das SQL zum Kopieren:\n");
  console.log("-".repeat(60));
  const sql = readFileSync(migrationPath, "utf-8");
  console.log(sql);
  console.log("-".repeat(60));

  process.exit(1);
}

console.log("Verbinde mit Supabase-Datenbank...");

try {
  const sql = readFileSync(migrationPath, "utf-8");
  execSync(`psql "${dbUrl}" -c "${sql.replace(/"/g, '\\"')}"`, {
    stdio: "inherit",
    timeout: 30000,
  });
  console.log("\n✅ Datenbank-Tabellen erfolgreich erstellt!");
} catch (error) {
  console.error("\n❌ Fehler:", error.message);
  console.log("\nBitte führe das SQL manuell im Supabase Dashboard aus:");
  console.log("https://supabase.com/dashboard/project/dulsyqvhylxljdntbzbw/sql");
  process.exit(1);
}
