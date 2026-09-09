"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  experienceDetailsSchema,
  experienceFaqSchema,
  itinerarySchema,
  repeatableTextSchema,
} from "@/lib/experiences/schemas";
import { slugify } from "@/lib/utils";

const optionalNumber = z.union([
  z.literal(""),
  z.coerce.number().nonnegative(),
]);
const experienceForm = z.object({
  siteId: z.uuid(),
  experienceId: z.union([z.literal(""), z.uuid()]).optional(),
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().max(120),
  experienceType: z.string().trim().min(2).max(60),
  status: z.enum(["draft", "published", "archived"]),
  shortDescription: z.string().trim().min(10).max(240),
  description: z.string().max(10000),
  priceFrom: optionalNumber,
  currency: z.string().length(3),
  pricingLabel: z.string().max(80),
  durationValue: optionalNumber,
  durationUnit: z.string().max(20),
  locationName: z.string().max(120),
  meetingPoint: z.string().max(300),
  latitude: z.union([z.literal(""), z.coerce.number().min(-90).max(90)]),
  longitude: z.union([z.literal(""), z.coerce.number().min(-180).max(180)]),
  minGuests: optionalNumber,
  maxGuests: optionalNumber,
  minimumAge: optionalNumber,
  difficulty: z.string().max(80),
  bookingUrl: z.union([z.literal(""), z.url()]),
  bookingButtonLabel: z.string().trim().min(1).max(60),
  featuredImageUrl: z.union([z.literal(""), z.url()]),
  cancellationPolicy: z.string().max(4000),
  highlights: z.string().max(5000),
  inclusions: z.string().max(5000),
  exclusions: z.string().max(5000),
  gallery: z.string().max(10000),
  itinerary: z.string().max(10000),
  faqs: z.string().max(10000),
  seoTitle: z.string().max(70),
  seoDescription: z.string().max(180),
});

export async function saveExperience(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = experienceForm.safeParse(raw);
  const siteId = String(formData.get("siteId") ?? "");
  if (!parsed.success)
    redirect(
      `/dashboard/sites/${siteId}/experiences/${String(formData.get("experienceId") || "new")}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid experience")}`,
    );
  const value = parsed.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    redirect(`/login?next=/dashboard/sites/${value.siteId}/experiences`);
  const { data: site } = await supabase
    .from("sites")
    .select("id,business_id,status")
    .eq("id", value.siteId)
    .single();
  if (!site) redirect(`/dashboard?error=Access%20denied`);
  const detailsRaw = Object.fromEntries(
    [...formData.entries()]
      .filter(([key]) => key.startsWith("extra_"))
      .map(([key, field]) => [
        key.slice(6),
        field === "on" ? true : String(field),
      ]),
  );
  const details = experienceDetailsSchema(value.experienceType).safeParse(
    detailsRaw,
  );
  if (!details.success)
    redirect(
      `/dashboard/sites/${value.siteId}/experiences/${value.experienceId || "new"}?error=Invalid%20category-specific%20details`,
    );
  const slug = slugify(value.slug || `${value.name} ${value.locationName}`);
  const { data: previous } = value.experienceId
    ? await supabase
        .from("experiences")
        .select("slug,seo_settings")
        .eq("id", value.experienceId)
        .eq("site_id", value.siteId)
        .single()
    : { data: null };
  const previousSeo = object(previous?.seo_settings);
  const record = {
    name: value.name,
    slug,
    experience_type: value.experienceType,
    status: value.status,
    featured: formData.get("featured") === "on",
    short_description: value.shortDescription,
    description: value.description,
    price_from: empty(value.priceFrom),
    currency: value.currency.toUpperCase(),
    pricing_label: value.pricingLabel || null,
    duration_value: empty(value.durationValue),
    duration_unit: value.durationUnit || null,
    location_name: value.locationName || null,
    meeting_point: value.meetingPoint || null,
    latitude: empty(value.latitude),
    longitude: empty(value.longitude),
    min_guests: empty(value.minGuests),
    max_guests: empty(value.maxGuests),
    minimum_age: empty(value.minimumAge),
    difficulty: value.difficulty || null,
    booking_url: value.bookingUrl || null,
    booking_button_label: value.bookingButtonLabel,
    featured_image_url: value.featuredImageUrl || null,
    cancellation_policy: value.cancellationPolicy || null,
    highlights: lines(value.highlights),
    inclusions: lines(value.inclusions),
    exclusions: lines(value.exclusions),
    gallery: lines(value.gallery).map((url) => ({ url, alt: value.name })),
    itinerary: itinerary(value.itinerary),
    faqs: faq(value.faqs),
    extra_details: details.data,
    seo_settings: {
      ...previousSeo,
      title: value.seoTitle || undefined,
      description: value.seoDescription || undefined,
    },
  };
  let error: { message: string; code?: string } | null = null;
  if (value.experienceId) {
    ({ error } = await supabase
      .from("experiences")
      .update(record)
      .eq("id", value.experienceId)
      .eq("site_id", value.siteId));
    if (!error && site.status === "published" && previous?.slug !== slug)
      await supabase.from("redirects").upsert(
        {
          site_id: value.siteId,
          source_path: `/experiences/${previous?.slug}`,
          destination_path: `/experiences/${slug}`,
          status_code: 301,
        },
        { onConflict: "site_id,source_path" },
      );
  } else {
    ({ error } = await supabase.from("experiences").insert({
      ...record,
      site_id: value.siteId,
      business_id: site.business_id,
    }));
  }
  if (error)
    redirect(
      `/dashboard/sites/${value.siteId}/experiences/${value.experienceId || "new"}?error=${encodeURIComponent(error.code === "23505" ? "That experience slug is already used." : error.message)}`,
    );
  revalidatePath(`/dashboard/sites/${value.siteId}/experiences`);
  redirect(
    `/dashboard/sites/${value.siteId}/experiences?message=Experience%20saved`,
  );
}

export async function archiveExperience(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const experienceId = z.uuid().parse(formData.get("experienceId"));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase
    .from("experiences")
    .update({ status: "archived" })
    .eq("id", experienceId)
    .eq("site_id", siteId);
  revalidatePath(`/dashboard/sites/${siteId}/experiences`);
}

export async function publishSite(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.rpc("publish_site", { target_site: siteId });
  if (error)
    redirect(
      `/dashboard/sites/${siteId}/settings?error=${encodeURIComponent(error.message)}`,
    );
  revalidatePath(`/dashboard/sites/${siteId}`);
  revalidatePath("/tenant-sites/[hostname]/[[...path]]", "page");
  revalidatePath("/tenant-sites/[hostname]/sitemap", "page");
  revalidatePath("/tenant-sites/[hostname]/robots.txt", "page");
  redirect(`/dashboard/sites/${siteId}/settings?message=Website%20published`);
}

function empty(value: string | number) {
  return value === "" ? null : value;
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function lines(value: string) {
  return repeatableTextSchema.parse(
    value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean),
  );
}
function itinerary(value: string) {
  return itinerarySchema.parse(
    value
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [title = "", description = "", duration = ""] = line
          .split("|")
          .map((item) => item.trim());
        return { title, description, duration: duration || undefined };
      }),
  );
}
function faq(value: string) {
  return experienceFaqSchema.parse(
    value
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [question = "", answer = ""] = line
          .split("|")
          .map((item) => item.trim());
        return { question, answer };
      }),
  );
}
