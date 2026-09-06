import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Client } from "pg";

const databaseUrl = process.env.TRIPONE_DATABASE_URL;
if (!databaseUrl)
  throw new Error(
    "Set TRIPONE_DATABASE_URL to a disposable or explicitly authorized PostgreSQL database.",
  );

const input =
  process.argv.slice(2).find((argument) => argument !== "--") ??
  "supabase/tests/create_generated_site_repair.sql";
const file = path.resolve(process.cwd(), input);
const sql = await readFile(file, "utf8");
const client = new Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost")
    ? undefined
    : { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log(
    `Database integration test passed: ${path.relative(process.cwd(), file)}`,
  );
} finally {
  await client.end();
}
