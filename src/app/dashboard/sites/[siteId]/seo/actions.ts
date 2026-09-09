"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const resourceKind = z.enum([
  "page",
  "experience",
  "rental",
  "taxonomy",
  "location",
]);

export async function saveResourceSeo(input: {
  siteId: string;
  resourceId: string;
  resourceKind: z.infer<typeof resourceKind>;
  title: string;
  description: string;
  canonical: string;
  indexable: boolean;
  follow: boolean;
  noarchive: boolean;
  noimageindex: boolean;
  nosnippet: boolean;
  socialTitle: string;
  socialDescription: string;
  socialImage: string;
  breadcrumbLabel: string;
  focusTopic: string;
}) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      resourceId: z.uuid(),
      resourceKind,
      title: z.string().trim().max(160),
      description: z.string().trim().max(500),
      canonical: z.string().trim().max(500),
      indexable: z.boolean(),
      follow: z.boolean(),
      noarchive: z.boolean(),
      noimageindex: z.boolean(),
      nosnippet: z.boolean(),
      socialTitle: z.string().trim().max(160),
      socialDescription: z.string().trim().max(500),
      socialImage: z.union([z.literal(""), z.url()]),
      breadcrumbLabel: z.string().trim().max(120),
      focusTopic: z.string().trim().max(120),
    })
    .safeParse(input);
  if (
    !parsed.success ||
    (parsed.data.canonical &&
      !parsed.data.canonical.startsWith("/") &&
      !/^https:\/\//i.test(parsed.data.canonical))
  )
    return { ok: false, error: "Invalid SEO settings." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Authentication required." };
  const table = {
    page: "pages",
    experience: "experiences",
    rental: "rental_products",
    taxonomy: "taxonomy_terms",
    location: "locations",
  }[parsed.data.resourceKind];
  const { data: current } = await supabase
    .from(table)
    .select("seo_settings")
    .eq("id", parsed.data.resourceId)
    .eq("site_id", parsed.data.siteId)
    .maybeSingle();
  if (!current) return { ok: false, error: "SEO resource not found." };
  const existing =
    current.seo_settings &&
    typeof current.seo_settings === "object" &&
    !Array.isArray(current.seo_settings)
      ? (current.seo_settings as Record<string, unknown>)
      : {};
  const value = parsed.data;
  const { error } = await supabase
    .from(table)
    .update({
      seo_settings: {
        ...existing,
        title: value.title || undefined,
        description: value.description || undefined,
        canonicalPath: value.canonical || undefined,
        indexable: value.indexable,
        follow: value.follow,
        noarchive: value.noarchive,
        noimageindex: value.noimageindex,
        nosnippet: value.nosnippet,
        socialTitle: value.socialTitle || undefined,
        socialDescription: value.socialDescription || undefined,
        socialImage: value.socialImage || undefined,
        breadcrumbLabel: value.breadcrumbLabel || undefined,
        focusTopic: value.focusTopic || undefined,
      },
    })
    .eq("id", parsed.data.resourceId)
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
