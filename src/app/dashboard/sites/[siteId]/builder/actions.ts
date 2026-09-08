"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sectionSchema, sectionsSchema, type SiteSection } from "@/lib/types";
import { validateSection } from "@/lib/sections/registry";

const saveInput = z.object({
  siteId: z.uuid(),
  pageId: z.uuid(),
  expectedRevision: z.number().int().positive(),
  sections: sectionsSchema.max(60),
});
const saveTemplateInput = z.object({
  siteId: z.uuid(),
  templateId: z.uuid(),
  expectedVersion: z.number().int().positive(),
  sections: sectionsSchema.max(60),
});

export type SaveResult =
  | { ok: true; savedAt: string; revision: number }
  | { ok: false; error: string };

export async function savePageDraft(input: {
  siteId: string;
  pageId: string;
  expectedRevision: number;
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
  const { data, error } = await supabase.rpc("save_page_draft", {
    target_site: parsed.data.siteId,
    target_page: parsed.data.pageId,
    expected_revision: parsed.data.expectedRevision,
    new_sections: parsed.data.sections,
  });
  if (error) return { ok: false, error: error.message };
  const saved = Array.isArray(data) ? data[0] : data;
  if (!saved)
    return {
      ok: false,
      error: "The page could not be saved. Refresh and try again.",
    };
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/builder`);
  revalidatePath(`/preview/${parsed.data.siteId}`);
  return {
    ok: true,
    savedAt: String(saved.saved_at ?? new Date().toISOString()),
    revision: Number(saved.revision),
  };
}

export async function saveTemplateDraft(input: {
  siteId: string;
  templateId: string;
  expectedVersion: number;
  sections: SiteSection[];
}): Promise<SaveResult> {
  const parsed = saveTemplateInput.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "The template contains invalid section data." };
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
  const { data, error } = await supabase.rpc("save_site_template_draft", {
    target_site: parsed.data.siteId,
    target_template: parsed.data.templateId,
    expected_version: parsed.data.expectedVersion,
    new_sections: parsed.data.sections,
  });
  if (error) return { ok: false, error: error.message };
  const saved = Array.isArray(data) ? data[0] : data;
  if (!saved)
    return {
      ok: false,
      error: "The template could not be saved. Refresh and try again.",
    };
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/builder`);
  revalidatePath(`/preview/${parsed.data.siteId}`);
  return {
    ok: true,
    savedAt: String(saved.saved_at ?? new Date().toISOString()),
    revision: Number(saved.version),
  };
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
  return { ok: true, savedAt: new Date().toISOString(), revision: 1 };
}

export type SavedSectionRecord = {
  id: string;
  name: string;
  section_type: SiteSection["type"];
  variant: string;
  settings: Record<string, unknown>;
  save_mode: "copy" | "linked";
  revision: number;
};

export async function saveReusableSection(input: {
  siteId: string;
  name: string;
  section: SiteSection;
  mode: "copy" | "linked";
}): Promise<
  { ok: true; section: SavedSectionRecord } | { ok: false; error: string }
> {
  const parsed = z
    .object({
      siteId: z.uuid(),
      name: z.string().trim().min(2).max(120),
      section: sectionSchema,
      mode: z.enum(["copy", "linked"]),
    })
    .safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Enter a valid reusable section name." };
  if (!validateSection(parsed.data.section).success)
    return { ok: false, error: "This section has invalid settings." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Authentication required." };
  const { data, error } = await supabase
    .from("saved_sections")
    .insert({
      site_id: parsed.data.siteId,
      name: parsed.data.name,
      section_type: parsed.data.section.type,
      variant: parsed.data.section.variant,
      settings: parsed.data.section.settings,
      save_mode: parsed.data.mode,
    })
    .select("id,name,section_type,variant,settings,save_mode,revision")
    .single();
  if (error || !data)
    return { ok: false, error: error?.message ?? "Could not save section." };
  return { ok: true, section: data as SavedSectionRecord };
}
