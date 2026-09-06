"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
const optionalUrl = z.union([
  z.literal(""),
  z.url().refine((value) => /^https?:\/\//.test(value)),
]);
const schema = z.object({
  siteId: z.uuid(),
  testimonialId: z.union([z.literal(""), z.uuid()]),
  authorName: z.string().trim().min(2).max(100),
  authorLocation: z.string().trim().max(100),
  quote: z.string().trim().min(10).max(2000),
  rating: z.union([z.literal(""), z.coerce.number().int().min(1).max(5)]),
  source: z.string().trim().max(80),
  sourceUrl: optionalUrl,
  avatarUrl: optionalUrl,
  status: z.enum(["draft", "published", "archived"]),
});
export async function saveTestimonial(formData: FormData) {
  const siteId = String(formData.get("siteId") ?? "");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    fail(siteId, parsed.error.issues[0]?.message ?? "Invalid testimonial.");
  const value = parsed.data;
  const record = {
    author_name: value.authorName,
    author_location: value.authorLocation || null,
    quote: value.quote,
    rating: value.rating === "" ? null : value.rating,
    source: value.source || null,
    source_url: value.sourceUrl || null,
    avatar_url: value.avatarUrl || null,
    status: value.status,
  };
  const supabase = await createClient();
  const operation = value.testimonialId
    ? supabase
        .from("testimonials")
        .update(record)
        .eq("id", value.testimonialId)
        .eq("site_id", value.siteId)
    : supabase
        .from("testimonials")
        .insert({ ...record, site_id: value.siteId });
  const { error } = await operation;
  if (error) fail(value.siteId, error.message);
  revalidatePath(`/dashboard/sites/${value.siteId}/testimonials`);
  redirect(
    `/dashboard/sites/${value.siteId}/testimonials?message=Testimonial%20saved`,
  );
}
export async function deleteTestimonial(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const id = z.uuid().parse(formData.get("testimonialId"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)
    .eq("site_id", siteId);
  if (error) fail(siteId, error.message);
  revalidatePath(`/dashboard/sites/${siteId}/testimonials`);
}
function fail(siteId: string, message: string): never {
  redirect(
    `/dashboard/sites/${siteId}/testimonials?error=${encodeURIComponent(message)}`,
  );
}
