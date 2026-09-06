"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const optionalUrl = z.union([
  z.literal(""),
  z.url().refine((value) => /^https?:\/\//i.test(value), "Use an http(s) URL."),
]);
const settingsSchema = z.object({
  siteId: z.uuid(),
  siteName: z.string().trim().min(2).max(100),
  locale: z
    .string()
    .trim()
    .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  timezone: z.string().trim().min(2).max(80),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/),
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(40),
  email: z.email(),
  address: z.string().trim().max(300),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  tripadvisorUrl: optionalUrl,
  defaultBookingCta: z.string().trim().min(1).max(60),
  bookingUrl: optionalUrl,
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
  ogImageUrl: optionalUrl,
  cookieConsentMode: z.enum(["disabled", "basic"]),
  googleTagManagerId: z.union([
    z.literal(""),
    z.string().regex(/^GTM-[A-Z0-9]+$/i),
  ]),
  googleAnalyticsId: z.union([
    z.literal(""),
    z.string().regex(/^G-[A-Z0-9]+$/i),
  ]),
  metaPixelId: z.union([z.literal(""), z.string().regex(/^\d{5,30}$/)]),
  tiktokPixelId: z.union([
    z.literal(""),
    z.string().regex(/^[A-Z0-9]{8,30}$/i),
  ]),
});

export async function saveSettings(formData: FormData) {
  const siteId = String(formData.get("siteId") ?? "");
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    fail(siteId, parsed.error.issues[0]?.message ?? "Invalid settings.");
  const value = parsed.data;
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("business_id,global_settings,cro_settings")
    .eq("id", value.siteId)
    .single();
  if (!site) fail(value.siteId, "Website not found.");
  const global = object(site.global_settings);
  const cro = object(site.cro_settings);
  const [{ error: siteError }, { error: businessError }] = await Promise.all([
    supabase
      .from("sites")
      .update({
        name: value.siteName,
        favicon_url: empty(value.faviconUrl),
        default_og_image_url: empty(value.ogImageUrl),
        global_settings: {
          ...global,
          locale: value.locale,
          bookingUrl: empty(value.bookingUrl),
          openBookingInNewTab: formData.get("openBookingInNewTab") === "on",
          cookieConsentMode: value.cookieConsentMode,
          integrations: {
            googleTagManagerId: value.googleTagManagerId,
            googleAnalyticsId: value.googleAnalyticsId,
            metaPixelId: value.metaPixelId,
            tiktokPixelId: value.tiktokPixelId,
          },
        },
        cro_settings: {
          ...cro,
          defaultBookingCta: value.defaultBookingCta,
          stickyMobileCta: formData.get("stickyMobileCta") === "on",
          whatsappEnabled: formData.get("whatsappEnabled") === "on",
          phoneEnabled: formData.get("phoneEnabled") === "on",
        },
      })
      .eq("id", value.siteId),
    supabase
      .from("businesses")
      .update({
        timezone: value.timezone,
        currency: value.currency,
        phone: empty(value.phone),
        whatsapp: empty(value.whatsapp),
        email: value.email,
        address: empty(value.address),
        instagram_url: empty(value.instagramUrl),
        facebook_url: empty(value.facebookUrl),
        youtube_url: empty(value.youtubeUrl),
        tripadvisor_url: empty(value.tripadvisorUrl),
        logo_url: empty(value.logoUrl),
      })
      .eq("id", site.business_id),
  ]);
  if (siteError || businessError)
    fail(
      value.siteId,
      siteError?.message ?? businessError?.message ?? "Save failed.",
    );
  revalidatePath(`/dashboard/sites/${value.siteId}`, "layout");
  redirect(
    `/dashboard/sites/${value.siteId}/settings?message=Settings%20saved`,
  );
}

export async function unpublishSite(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("sites")
    .update({ status: "draft" })
    .eq("id", siteId);
  if (error) fail(siteId, error.message);
  revalidatePath(`/dashboard/sites/${siteId}`, "layout");
  redirect(`/dashboard/sites/${siteId}/settings?message=Website%20unpublished`);
}

export async function archiveSite(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const confirmation = String(formData.get("confirmation") ?? "");
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("name")
    .eq("id", siteId)
    .single();
  if (!site || confirmation !== site.name)
    fail(siteId, "Type the exact website name to archive it.");
  const { error } = await supabase
    .from("sites")
    .update({ status: "archived" })
    .eq("id", siteId);
  if (error) fail(siteId, error.message);
  redirect("/dashboard/sites?message=Website%20archived");
}

export async function deleteSite(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const confirmation = String(formData.get("confirmation") ?? "");
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("name")
    .eq("id", siteId)
    .single();
  if (!site || confirmation !== `DELETE ${site.name}`)
    fail(siteId, `Type DELETE ${site?.name ?? "website"} exactly.`);
  const { error } = await supabase.from("sites").delete().eq("id", siteId);
  if (error) fail(siteId, error.message);
  redirect("/dashboard/sites?message=Website%20deleted");
}

function fail(siteId: string, message: string): never {
  redirect(
    `/dashboard/sites/${siteId}/settings?error=${encodeURIComponent(message)}`,
  );
}
function empty(value: string) {
  return value || null;
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
