"use server";

import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validation";
import { generateSite } from "@/lib/site-generator";
import { slugify } from "@/lib/utils";
import { publicGenerationError } from "@/lib/onboarding-errors";

export type ActionResult = { ok: boolean; siteId?: string; error?: string };

export async function checkSlug(slug: string) {
  const parsed = onboardingSchema.shape.slug.safeParse(slug);
  if (!parsed.success)
    return {
      available: false,
      error: "Use lowercase letters, numbers and hyphens.",
    };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("site_slug_is_available", {
    candidate: slug,
  });
  return { available: !error && data === true, error: error?.message };
}

export async function buildWebsite(raw: unknown): Promise<ActionResult> {
  const parsed = onboardingSchema.safeParse(raw);
  if (!parsed.success)
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { ok: false, error: "Your session expired. Please sign in again." };
  const generated = generateSite(parsed.data);
  const experiences = parsed.data.experiences.map((item) => ({
    ...item,
    slug: slugify(`${item.name} ${item.locationName ?? ""}`),
  }));
  const rentals = parsed.data.rentals.map((item) => ({
    ...item,
    slug: slugify(`${item.name} ${item.locationName ?? ""}`),
  }));
  const { data, error } = await supabase.rpc("create_generated_site", {
    payload: { ...parsed.data, experiences, rentals, generated },
  });
  if (error) {
    const correlationReference = crypto.randomUUID();
    console.error("Website generation failed", {
      correlationReference,
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      userId: user.id,
    });
    return {
      ok: false,
      error: publicGenerationError(error, correlationReference),
    };
  }
  const mediaUrls = [
    parsed.data.logoUrl,
    ...parsed.data.experiences.map((item) => item.featuredImageUrl),
    ...parsed.data.rentals.map((item) => item.featuredImageUrl),
  ].filter((url): url is string => Boolean(url));
  if (mediaUrls.length) {
    await supabase
      .from("media")
      .update({ site_id: data })
      .in("public_url", mediaUrls);
  }
  return { ok: true, siteId: String(data) };
}
