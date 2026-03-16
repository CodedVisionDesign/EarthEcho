import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = resolve(__dirname, "..", "init-postgres.sql");

const sql = neon(process.env.DATABASE_URL);
const migration = readFileSync(sqlPath, "utf8");
console.log(`Read ${migration.length} bytes from ${sqlPath}`);

// Split on semicolons, strip comments, filter empty
const statements = migration
  .split(";")
  .map((s) => s.replace(/^--[^\n]*$/gm, "").trim())
  .filter((s) => s.length > 0);

console.log(`Executing ${statements.length} statements...`);

let success = 0;
for (const stmt of statements) {
  try {
    await sql.query(stmt);
    success++;
    // Print short summary of what was executed
    const firstLine = stmt.split("\n")[0].slice(0, 60);
    console.log(`  [${success}/${statements.length}] ${firstLine}...`);
  } catch (e) {
    console.error(`  FAILED: ${stmt.split("\n")[0].slice(0, 60)}`);
    console.error(`  Error: ${e.message}`);
  }
}

console.log(`\nDone: ${success}/${statements.length} statements executed.`);
