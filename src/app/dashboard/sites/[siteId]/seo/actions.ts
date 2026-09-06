"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export async function savePageSeo(input: {
  siteId: string;
  pageId: string;
  title: string;
  description: string;
  canonical: string;
  indexable: boolean;
}) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      pageId: z.uuid(),
      title: z.string().max(70),
      description: z.string().max(180),
      canonical: z.string().max(300),
      indexable: z.boolean(),
    })
    .safeParse(input);
  if (
    !parsed.success ||
    (parsed.data.canonical && !parsed.data.canonical.startsWith("/"))
  )
    return { ok: false, error: "Invalid SEO settings." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Authentication required." };
  const { error } = await supabase
    .from("pages")
    .update({
      seo_settings: {
        title: parsed.data.title || undefined,
        description: parsed.data.description || undefined,
        canonicalPath: parsed.data.canonical || undefined,
        indexable: parsed.data.indexable,
      },
    })
    .eq("id", parsed.data.pageId)
    .eq("site_id", parsed.data.siteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/seo`);
  return { ok: true };
}

export async function saveSiteSeo(input: {
  siteId: string;
  siteTitle: string;
  titleSuffix: string;
  description: string;
  indexingEnabled: boolean;
  ogImage: string;
}) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      siteTitle: z.string().max(100),
      titleSuffix: z.string().max(50),
      description: z.string().max(180),
      indexingEnabled: z.boolean(),
      ogImage: z.union([z.literal(""), z.url()]),
    })
    .safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Invalid site SEO settings." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Authentication required." };
  const { error } = await supabase
    .from("sites")
    .update({
      seo_settings: {
        siteTitle: parsed.data.siteTitle,
        titleSuffix: parsed.data.titleSuffix,
        defaultDescription: parsed.data.description,
        indexingEnabled: parsed.data.indexingEnabled,
      },
      default_og_image_url: parsed.data.ogImage || null,
    })
    .eq("id", parsed.data.siteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/seo`);
  return { ok: true };
}

export async function saveCroSettings(input: {
  siteId: string;
  primaryCta: string;
  stickyMobileCta: boolean;
  whatsappEnabled: boolean;
  phoneEnabled: boolean;
  trustBarEnabled: boolean;
}) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      primaryCta: z.string().min(1).max(60),
      stickyMobileCta: z.boolean(),
      whatsappEnabled: z.boolean(),
      phoneEnabled: z.boolean(),
      trustBarEnabled: z.boolean(),
    })
    .safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Invalid conversion settings." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Authentication required." };
  const { error } = await supabase
    .from("sites")
    .update({ cro_settings: parsed.data })
    .eq("id", parsed.data.siteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/seo`);
  return { ok: true };
}
