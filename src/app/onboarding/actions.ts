"use server";

import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validation";
import { generateSite } from "@/lib/site-generator";
import { slugify } from "@/lib/utils";
import { addProviderDomain } from "@/lib/domains/provider";

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
  const { data, error } = await supabase.rpc("create_generated_site", {
    payload: { ...parsed.data, experiences, generated },
  });
  if (error)
    return {
      ok: false,
      error:
        error.code === "23505"
          ? "That subdomain is already in use."
          : error.message,
    };
  const mediaUrls = [
    parsed.data.logoUrl,
    ...parsed.data.experiences.map((item) => item.featuredImageUrl),
  ].filter((url): url is string => Boolean(url));
  if (mediaUrls.length) {
    await supabase
      .from("media")
      .update({ site_id: data })
      .in("public_url", mediaUrls);
  }
  const defaultHostname = `${parsed.data.slug}.triponeplus.com`;
  try {
    const provider = await addProviderDomain(defaultHostname);
    if (provider.configured) {
      await supabase
        .from("domains")
        .update({
          provider_data: provider,
          verification_status: provider.verified ? "verified" : "pending",
          verified_at: provider.verified ? new Date().toISOString() : null,
          last_checked_at: new Date().toISOString(),
          last_error: provider.verified
            ? null
            : "Hosting verification is pending.",
        })
        .eq("site_id", data)
        .eq("domain_type", "subdomain");
    }
  } catch (cause) {
    await supabase
      .from("domains")
      .update({
        last_error:
          cause instanceof Error
            ? cause.message.slice(0, 300)
            : "Hosting provider setup failed.",
        last_checked_at: new Date().toISOString(),
      })
      .eq("site_id", data)
      .eq("domain_type", "subdomain");
  }
  return { ok: true, siteId: String(data) };
}
