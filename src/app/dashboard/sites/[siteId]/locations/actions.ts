"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

const optionalUrl = z.union([
  z.literal(""),
  z.url().refine((value) => /^https?:\/\//.test(value)),
]);
const schema = z.object({
  siteId: z.uuid(),
  locationId: z.union([z.literal(""), z.uuid()]),
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().max(120),
  description: z.string().trim().min(40).max(10_000),
  city: z.string().trim().max(100),
  region: z.string().trim().max(100),
  country: z.string().trim().max(100),
  latitude: z.union([z.literal(""), z.coerce.number().min(-90).max(90)]),
  longitude: z.union([z.literal(""), z.coerce.number().min(-180).max(180)]),
  imageUrl: optionalUrl,
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(180),
});
export async function saveLocation(formData: FormData) {
  const siteId = String(formData.get("siteId") ?? "");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    fail(siteId, parsed.error.issues[0]?.message ?? "Invalid location.");
  const value = parsed.data;
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("business_id")
    .eq("id", value.siteId)
    .single();
  if (!site) fail(value.siteId, "Website not found.");
  const record = {
    name: value.name,
    slug: slugify(value.slug || value.name),
    description: value.description,
    city: value.city || null,
    region: value.region || null,
    country: value.country || null,
    latitude: value.latitude === "" ? null : value.latitude,
    longitude: value.longitude === "" ? null : value.longitude,
    image_url: value.imageUrl || null,
    seo_settings: {
      title: value.seoTitle || undefined,
      description: value.seoDescription || undefined,
      indexable: value.description.length >= 120,
    },
  };
  const operation = value.locationId
    ? supabase
        .from("locations")
        .update(record)
        .eq("id", value.locationId)
        .eq("site_id", value.siteId)
    : supabase.from("locations").insert({
        ...record,
        site_id: value.siteId,
        business_id: site.business_id,
      });
  const { error } = await operation;
  if (error)
    fail(
      value.siteId,
      error.code === "23505"
        ? "That location slug is already used."
        : error.message,
    );
  revalidatePath(`/dashboard/sites/${value.siteId}/locations`);
  redirect(
    `/dashboard/sites/${value.siteId}/locations?message=Location%20saved`,
  );
}
export async function deleteLocation(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const id = z.uuid().parse(formData.get("locationId"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("locations")
    .delete()
    .eq("id", id)
    .eq("site_id", siteId);
  if (error) fail(siteId, error.message);
  revalidatePath(`/dashboard/sites/${siteId}/locations`);
}
function fail(siteId: string, message: string): never {
  redirect(
    `/dashboard/sites/${siteId}/locations?error=${encodeURIComponent(message)}`,
  );
}
