import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const [action, identifier] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret)
  throw new Error("Supabase server environment is required.");
const client = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

if (action === "create") {
  const email = process.env.TRIPONE_E2E_EMAIL;
  const password = process.env.TRIPONE_E2E_PASSWORD;
  if (!email || !password)
    throw new Error("QA email and password are required.");
  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "TripOne QA" },
  });
  if (error) throw error;
  console.log(JSON.stringify({ id: data.user.id, email: data.user.email }));
} else if (action === "delete") {
  if (!identifier) throw new Error("A QA user ID is required for deletion.");
  const { error } = await client.auth.admin.deleteUser(identifier);
  if (error) throw error;
  console.log(JSON.stringify({ deleted: identifier }));
} else {
  throw new Error("Usage: manage-qa-user.mjs <create|delete> [user-id]");
}
