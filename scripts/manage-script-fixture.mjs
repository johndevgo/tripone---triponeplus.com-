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
  const suffix = Date.now().toString(36);
  const slug = `script-boundary-${suffix}`;
  const hostname = `isolated-script-${suffix}.triponeplus.com`;
  const { data: source, error: sourceError } = await client
    .from("sites")
    .select("published_snapshot")
    .eq("status", "published")
    .not("published_snapshot", "is", null)
    .limit(1)
    .single();
  if (sourceError || !source?.published_snapshot)
    throw sourceError ?? new Error("A published source snapshot is required.");
  const { data: account, error: accountError } =
    await client.auth.admin.createUser({
      email: `script-fixture-${suffix}@example.com`,
      password: `TripOne-Script-${suffix}!`,
      email_confirm: true,
      user_metadata: { full_name: "TripOne Script Fixture" },
    });
  if (accountError) throw accountError;
  const ownerId = account.user.id;
  try {
    const { data: business, error: businessError } = await client
      .from("businesses")
      .insert({
        owner_id: ownerId,
        name: "Script Boundary Fixture",
        slug,
        business_type: "tour_operator",
        short_description: "Disposable tenant-origin acceptance fixture.",
        country: "Nepal",
        city: "Kathmandu",
        timezone: "Asia/Kathmandu",
        currency: "NPR",
        email: `script-fixture-${suffix}@example.com`,
      })
      .select("id")
      .single();
    if (businessError) throw businessError;
    const { data: site, error: siteError } = await client
      .from("sites")
      .insert({
        business_id: business.id,
        owner_id: ownerId,
        name: "Script Boundary Fixture",
        slug,
        theme_id: "horizon",
      })
      .select("id")
      .single();
    if (siteError) throw siteError;
    const snapshot = structuredClone(source.published_snapshot);
    snapshot.site = {
      ...snapshot.site,
      id: site.id,
      name: "Script Boundary Fixture",
      slug,
      globalSettings: {
        ...(snapshot.site?.globalSettings ?? {}),
        cookieConsentMode: "disabled",
        integrations: {
          advancedScripts: [
            {
              id: "boundary_test_script",
              name: "Boundary acceptance",
              placement: "head",
              consentCategory: "essential",
              enabled: true,
              sourceUrl: "",
              code: "window.__triponeAdvancedBoundary = location.hostname;",
              includePaths: ["/*"],
              excludePaths: [],
            },
          ],
        },
      },
    };
    snapshot.business = {
      ...snapshot.business,
      name: "Script Boundary Fixture",
      email: `script-fixture-${suffix}@example.com`,
    };
    const { error: publishError } = await client
      .from("sites")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        published_snapshot: snapshot,
      })
      .eq("id", site.id);
    if (publishError) throw publishError;
    const { error: domainError } = await client.from("domains").insert({
      site_id: site.id,
      hostname,
      domain_type: "custom",
      verification_status: "verified",
      is_primary: true,
      verified_at: new Date().toISOString(),
    });
    if (domainError) throw domainError;
    console.log(JSON.stringify({ ownerId, slug, hostname }));
  } catch (cause) {
    await client.auth.admin.deleteUser(ownerId);
    throw cause;
  }
} else if (action === "delete") {
  if (!identifier)
    throw new Error("Fixture owner ID is required for deletion.");
  const { error } = await client.auth.admin.deleteUser(identifier);
  if (error) throw error;
  console.log(JSON.stringify({ deleted: identifier }));
} else {
  throw new Error(
    "Usage: manage-script-fixture.mjs <create|delete> [owner-id]",
  );
}
