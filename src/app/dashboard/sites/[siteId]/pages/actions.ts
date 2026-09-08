"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createDefaultSection } from "@/lib/sections/registry";
import { slugify } from "@/lib/utils";

const reserved = new Set([
  "dashboard",
  "api",
  "auth",
  "preview",
  "login",
  "signup",
  "sitemap.xml",
  "robots.txt",
]);
const idPair = z.object({ siteId: z.uuid(), pageId: z.uuid() });

export type MutationResult = { ok: boolean; error?: string };

async function authorizedSite(siteId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: site } = await supabase
    .from("sites")
    .select("id,status,navigation")
    .eq("id", siteId)
    .single();
  return site ? { supabase, site } : null;
}

export async function createCustomPage(input: {
  siteId: string;
  title: string;
}): Promise<MutationResult> {
  const parsed = z
    .object({ siteId: z.uuid(), title: z.string().trim().min(2).max(80) })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter a page title." };
  const auth = await authorizedSite(parsed.data.siteId);
  if (!auth) return { ok: false, error: "Access denied." };
  let slug = slugify(parsed.data.title);
  if (!slug || reserved.has(slug)) slug = `page-${slug || "custom"}`;
  const { count } = await auth.supabase
    .from("pages")
    .select("id", { count: "exact", head: true })
    .eq("site_id", parsed.data.siteId);
  const sections = [
    createDefaultSection("hero", "minimal"),
    createDefaultSection("richText"),
    createDefaultSection("finalCta"),
  ];
  const { error } = await auth.supabase.from("pages").insert({
    site_id: parsed.data.siteId,
    title: parsed.data.title,
    slug,
    page_type: "custom",
    sections,
    sort_order: count ?? 0,
    show_in_navigation: true,
  });
  if (error)
    return {
      ok: false,
      error:
        error.code === "23505"
          ? "A page with that slug already exists."
          : error.message,
    };
  await syncNavigation(auth.supabase, parsed.data.siteId);
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/pages`);
  return { ok: true };
}

export async function updatePage(input: {
  siteId: string;
  pageId: string;
  title: string;
  slug: string;
  navigationLabel: string;
  showInNavigation: boolean;
  status: "draft" | "published";
}): Promise<MutationResult> {
  const parsed = idPair
    .extend({
      title: z.string().trim().min(2).max(80),
      slug: z.string().max(100),
      navigationLabel: z.string().max(80),
      showInNavigation: z.boolean(),
      status: z.enum(["draft", "published"]),
    })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid page settings." };
  const auth = await authorizedSite(parsed.data.siteId);
  if (!auth) return { ok: false, error: "Access denied." };
  const { data: page } = await auth.supabase
    .from("pages")
    .select("id,slug,page_type")
    .eq("id", parsed.data.pageId)
    .eq("site_id", parsed.data.siteId)
    .single();
  if (!page) return { ok: false, error: "Page not found." };
  let nextSlug = page.page_type === "home" ? "" : slugify(parsed.data.slug);
  if (page.page_type !== "home" && (!nextSlug || reserved.has(nextSlug)))
    return { ok: false, error: "Choose a different page slug." };
  if (page.page_type.endsWith("_system")) nextSlug = page.slug;
  const { error } = await auth.supabase
    .from("pages")
    .update({
      title: parsed.data.title,
      slug: nextSlug,
      navigation_label: parsed.data.navigationLabel || null,
      show_in_navigation: parsed.data.showInNavigation,
      status: parsed.data.status,
    })
    .eq("id", page.id)
    .eq("site_id", parsed.data.siteId);
  if (error)
    return {
      ok: false,
      error:
        error.code === "23505"
          ? "That slug is already used on this site."
          : error.message,
    };
  if (auth.site.status === "published" && page.slug && page.slug !== nextSlug) {
    await auth.supabase.from("redirects").upsert(
      {
        site_id: parsed.data.siteId,
        source_path: `/${page.slug}`,
        destination_path: `/${nextSlug}`,
        status_code: 301,
      },
      { onConflict: "site_id,source_path" },
    );
  }
  await syncNavigation(auth.supabase, parsed.data.siteId);
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/pages`);
  return { ok: true };
}

export async function duplicatePage(input: {
  siteId: string;
  pageId: string;
}): Promise<MutationResult> {
  const parsed = idPair.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid page." };
  const auth = await authorizedSite(parsed.data.siteId);
  if (!auth) return { ok: false, error: "Access denied." };
  const { data: page } = await auth.supabase
    .from("pages")
    .select("title,slug,page_type,sections,seo_settings,sort_order")
    .eq("id", parsed.data.pageId)
    .eq("site_id", parsed.data.siteId)
    .single();
  if (!page || page.page_type === "home" || page.page_type.endsWith("_system"))
    return { ok: false, error: "This system page cannot be duplicated." };
  const suffix = crypto.randomUUID().slice(0, 6);
  const { error } = await auth.supabase.from("pages").insert({
    ...page,
    title: `${page.title} copy`,
    slug: `${page.slug}-copy-${suffix}`,
    page_type: "custom",
    sort_order: page.sort_order + 1,
    show_in_navigation: false,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/pages`);
  return { ok: true };
}

export async function deleteCustomPage(input: {
  siteId: string;
  pageId: string;
}): Promise<MutationResult> {
  const parsed = idPair.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid page." };
  const auth = await authorizedSite(parsed.data.siteId);
  if (!auth) return { ok: false, error: "Access denied." };
  const { data: page } = await auth.supabase
    .from("pages")
    .select("page_type")
    .eq("id", parsed.data.pageId)
    .eq("site_id", parsed.data.siteId)
    .single();
  if (page?.page_type !== "custom")
    return { ok: false, error: "Only custom pages can be deleted." };
  const { error } = await auth.supabase
    .from("pages")
    .delete()
    .eq("id", parsed.data.pageId)
    .eq("site_id", parsed.data.siteId);
  if (error) return { ok: false, error: error.message };
  await syncNavigation(auth.supabase, parsed.data.siteId);
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/pages`);
  return { ok: true };
}

export async function saveNavigation(input: {
  siteId: string;
  items: Array<{ label: string; href: string; type?: string }>;
}): Promise<MutationResult> {
  const parsed = z
    .object({
      siteId: z.uuid(),
      items: z
        .array(
          z.object({
            label: z.string().trim().min(1).max(60),
            href: z.string().trim().min(1).max(500),
            type: z.enum(["page", "external"]).optional(),
          }),
        )
        .max(12),
    })
    .safeParse(input);
  if (
    !parsed.success ||
    parsed.data.items.some(
      (item) =>
        /^(javascript|data):/i.test(item.href) ||
        (item.type === "external" && !/^https?:\/\//i.test(item.href)),
    )
  )
    return {
      ok: false,
      error: "Navigation contains an unsafe or invalid link.",
    };
  const auth = await authorizedSite(parsed.data.siteId);
  if (!auth) return { ok: false, error: "Access denied." };
  const { error } = await auth.supabase
    .from("sites")
    .update({ navigation: parsed.data.items })
    .eq("id", parsed.data.siteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/pages`);
  return { ok: true };
}

export async function saveFooter(input: {
  siteId: string;
  description: string;
  copyright: string;
  variant: string;
  bookingCta: string;
  bookingHref: string;
}): Promise<MutationResult> {
  const parsed = z
    .object({
      siteId: z.uuid(),
      description: z.string().max(300),
      copyright: z.string().max(160),
      variant: z.enum(["columns", "compact", "editorial"]),
      bookingCta: z.string().max(60),
      bookingHref: z.string().max(500),
    })
    .safeParse(input);
  if (!parsed.success || /^(javascript|data):/i.test(parsed.data.bookingHref))
    return { ok: false, error: "Invalid footer settings." };
  const auth = await authorizedSite(parsed.data.siteId);
  if (!auth) return { ok: false, error: "Access denied." };
  const { siteId, ...footer } = parsed.data;
  const { error } = await auth.supabase
    .from("sites")
    .update({ footer_settings: footer })
    .eq("id", siteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${siteId}/pages`);
  return { ok: true };
}

export async function saveHeader(input: {
  siteId: string;
  variant: "standard" | "centered" | "compact";
  logoSize: "small" | "medium" | "large";
  ctaLabel: string;
  ctaHref: string;
  sticky: boolean;
  transparentOverHero: boolean;
  showContactBar: boolean;
}): Promise<MutationResult> {
  const parsed = z
    .object({
      siteId: z.uuid(),
      variant: z.enum(["standard", "centered", "compact"]),
      logoSize: z.enum(["small", "medium", "large"]),
      ctaLabel: z.string().trim().max(60),
      ctaHref: z.string().trim().max(500),
      sticky: z.boolean(),
      transparentOverHero: z.boolean(),
      showContactBar: z.boolean(),
    })
    .safeParse(input);
  if (!parsed.success || /^(javascript|data):/i.test(parsed.data.ctaHref))
    return { ok: false, error: "Invalid header settings." };
  const auth = await authorizedSite(parsed.data.siteId);
  if (!auth) return { ok: false, error: "Access denied." };
  const { data: current } = await auth.supabase
    .from("sites")
    .select("global_settings")
    .eq("id", parsed.data.siteId)
    .single();
  const globalSettings = object(current?.global_settings);
  const { siteId, ...header } = parsed.data;
  const { error } = await auth.supabase
    .from("sites")
    .update({ global_settings: { ...globalSettings, header } })
    .eq("id", siteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${siteId}/pages`);
  revalidatePath(`/preview/${siteId}`);
  return { ok: true };
}

async function syncNavigation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  siteId: string,
) {
  const { data: pages } = await supabase
    .from("pages")
    .select("title,slug,navigation_label")
    .eq("site_id", siteId)
    .eq("show_in_navigation", true)
    .neq("page_type", "experience_detail_system")
    .order("sort_order");
  await supabase
    .from("sites")
    .update({
      navigation: (pages ?? []).map((page) => ({
        label: page.navigation_label || page.title,
        href: page.slug ? `/${page.slug}` : "/",
        type: "page",
      })),
    })
    .eq("id", siteId);
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
