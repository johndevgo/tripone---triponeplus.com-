import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import { publishedSnapshotSchema } from "./published-site";

const slug = process.env.TRIPONE_PUBLISHED_SITE_SLUG;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

describe.skipIf(!slug || !url || !key)("published site delivery", () => {
  it("returns a snapshot accepted by the production decoder", async () => {
    const client = createClient(url!, key!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await client.rpc("get_published_site_snapshot", {
      identifier: slug!,
    });
    expect(error).toBeNull();
    const parsed = publishedSnapshotSchema.safeParse(data);
    if (!parsed.success)
      throw new Error(JSON.stringify(parsed.error.issues, null, 2));
    expect(parsed.data.site.slug).toBe(slug);
  });
});
