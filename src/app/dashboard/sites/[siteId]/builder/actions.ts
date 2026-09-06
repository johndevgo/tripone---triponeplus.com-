"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sectionsSchema, type SiteSection } from "@/lib/types";
import { validateSection } from "@/lib/sections/registry";

const saveInput = z.object({
  siteId: z.uuid(),
  pageId: z.uuid(),
  sections: sectionsSchema.max(60),
});

export type SaveResult =
  { ok: true; savedAt: string } | { ok: false; error: string };

export async function savePageDraft(input: {
  siteId: string;
  pageId: string;
  sections: SiteSection[];
}): Promise<SaveResult> {
  const parsed = saveInput.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "The page contains invalid section data." };
  for (const section of parsed.data.sections) {
    if (!validateSection(section).success)
      return {
        ok: false,
        error: `The ${section.type} section contains invalid settings.`,
      };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { ok: false, error: "Your session expired. Sign in and try again." };
  const { data: page } = await supabase
    .from("pages")
    .select("id,site_id")
    .eq("id", parsed.data.pageId)
    .eq("site_id", parsed.data.siteId)
    .single();
  if (!page) return { ok: false, error: "Page not found or access denied." };
  const { error } = await supabase
    .from("pages")
    .update({ sections: parsed.data.sections })
    .eq("id", page.id)
    .eq("site_id", parsed.data.siteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/builder`);
  revalidatePath(`/preview/${parsed.data.siteId}`);
  return { ok: true, savedAt: new Date().toISOString() };
}

export async function publishFromBuilder(siteId: string): Promise<SaveResult> {
  const id = z.uuid().safeParse(siteId);
  if (!id.success) return { ok: false, error: "Invalid website." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Authentication required." };
  const { error } = await supabase.rpc("publish_site", {
    target_site: id.data,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${id.data}`);
  revalidatePath(`/preview/${id.data}`);
  return { ok: true, savedAt: new Date().toISOString() };
}
