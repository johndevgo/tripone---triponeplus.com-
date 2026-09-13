import process from "node:process";
import { Client } from "pg";

const databaseUrl = process.env.TRIPONE_DATABASE_URL;
if (!databaseUrl)
  throw new Error(
    "Set TRIPONE_DATABASE_URL to an explicitly authorized Supabase PostgreSQL connection string.",
  );

const client = new Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost")
    ? undefined
    : { rejectUnauthorized: false },
});
await client.connect();
try {
  const tables = await client.query<{
    platform_settings: string | null;
    packages: string | null;
    analytics_events: string | null;
  }>(`select
    to_regclass('public.platform_settings')::text as platform_settings,
    to_regclass('public.packages')::text as packages,
    to_regclass('public.analytics_events')::text as analytics_events`);
  const migrations = await client.query<{ version: string }>(
    "select version from supabase_migrations.schema_migrations order by version desc limit 12",
  );
  console.log(
    JSON.stringify({
      tables: tables.rows[0],
      migrations: migrations.rows.map((row) => row.version),
    }),
  );
} finally {
  await client.end();
}
