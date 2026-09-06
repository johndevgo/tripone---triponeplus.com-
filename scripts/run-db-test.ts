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
  process.argv
    .slice(2)
    .find((argument) => argument !== "--" && argument !== "--rollback") ??
  "supabase/tests/create_generated_site_repair.sql";
const rollbackOnly = process.argv.includes("--rollback");
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
  if (rollbackOnly) await client.query("begin");
  try {
    await client.query(sql);
  } finally {
    if (rollbackOnly) await client.query("rollback");
  }
  console.log(
    `Database ${rollbackOnly ? "rollback validation" : "integration test"} passed: ${path.relative(process.cwd(), file)}`,
  );
} finally {
  await client.end();
}
