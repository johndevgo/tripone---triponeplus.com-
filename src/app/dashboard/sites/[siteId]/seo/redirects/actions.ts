"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  redirectInputSchema,
  wouldCreateRedirectLoop,
} from "@/lib/domains/validation";
import { createClient } from "@/lib/supabase/server";

export async function addRedirect(formData: FormData) {
  const siteId = String(formData.get("siteId") ?? "");
  const parsed = redirectInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    fail(siteId, parsed.error.issues[0]?.message ?? "Invalid redirect.");
  const value = parsed.data;
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("redirects")
    .select("source_path,destination_path")
    .eq("site_id", value.siteId);
  if (
    wouldCreateRedirectLoop(
      value.sourcePath,
      value.destinationPath,
      existing ?? [],
    )
  )
    fail(value.siteId, "That rule would create a redirect loop.");
  const { error } = await supabase.from("redirects").insert({
    site_id: value.siteId,
    source_path: value.sourcePath,
    destination_path: value.destinationPath,
    status_code: value.statusCode,
  });
  if (error)
    fail(
      value.siteId,
      error.code === "23505"
        ? "That source path already has a redirect."
        : error.message,
    );
  revalidatePath(`/dashboard/sites/${value.siteId}/seo/redirects`);
  redirect(
    `/dashboard/sites/${value.siteId}/seo/redirects?message=Redirect%20created`,
  );
}

export async function deleteRedirect(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const redirectId = z.uuid().parse(formData.get("redirectId"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("redirects")
    .delete()
    .eq("id", redirectId)
    .eq("site_id", siteId);
  if (error) fail(siteId, error.message);
  revalidatePath(`/dashboard/sites/${siteId}/seo/redirects`);
  redirect(
    `/dashboard/sites/${siteId}/seo/redirects?message=Redirect%20removed`,
  );
}

function fail(siteId: string, message: string): never {
  redirect(
    `/dashboard/sites/${siteId}/seo/redirects?error=${encodeURIComponent(message)}`,
  );
}
