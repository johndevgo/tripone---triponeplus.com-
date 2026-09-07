"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  capabilitiesFormSchema,
  parseLineList,
  parseSpecifications,
  rentalProductFormSchema,
  taxonomyTermFormSchema,
} from "@/lib/multi-service/schemas";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function messagePath(path: string, kind: "error" | "message", message: string) {
  return `${path}?${kind}=${encodeURIComponent(message)}`;
}

async function authenticatedClient(next: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return supabase;
}

export async function saveCapabilities(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const path = `/dashboard/sites/${siteId}/services`;
  const parsed = capabilitiesFormSchema.safeParse({
    businessId: formData.get("businessId"),
    capabilities: formData.getAll("capabilities"),
    primaryCapability: formData.get("primaryCapability"),
  });
  if (!parsed.success)
    redirect(
      messagePath(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Invalid services",
      ),
    );
  const supabase = await authenticatedClient(path);
  const { error } = await supabase.rpc("set_business_capabilities", {
    target_business: parsed.data.businessId,
    selected_capabilities: parsed.data.capabilities,
    primary_capability: parsed.data.primaryCapability,
  });
  if (error) redirect(messagePath(path, "error", error.message));
  revalidatePath(path);
  redirect(messagePath(path, "message", "Service lines updated"));
}

export async function saveRentalProduct(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const id = String(formData.get("id") ?? "");
  const editorPath = `/dashboard/sites/${siteId}/rentals/${id || "new"}`;
  const rateLabels = formData.getAll("rateLabel");
  const rateAmounts = formData.getAll("rateAmount");
  const rateUnits = formData.getAll("rateUnit");
  const rateMinimums = formData.getAll("rateMinimum");
  const rateMaximums = formData.getAll("rateMaximum");
  const currency = String(formData.get("currency") ?? "USD");
  const rates = rateLabels
    .map((label, index) => ({
      label: String(label).trim(),
      amount: String(rateAmounts[index] ?? ""),
      currency,
      pricingUnit: String(rateUnits[index] ?? "day"),
      minimumQuantity: String(rateMinimums[index] ?? ""),
      maximumQuantity: String(rateMaximums[index] ?? ""),
      sortOrder: index,
    }))
    .filter((rate) => rate.label);
  const name = String(formData.get("name") ?? "");
  const payload = {
    ...Object.fromEntries(formData),
    siteId,
    id,
    slug: slugify(String(formData.get("slug") || name)),
    licenseRequired: formData.get("licenseRequired") === "on",
    quoteOnly: formData.get("quoteOnly") === "on",
    featured: formData.get("featured") === "on",
    gallery: parseLineList(formData.get("gallery"), 30).map((url) => ({
      url,
      alt: name,
    })),
    specifications: parseSpecifications(
      formData.getAll("specLabel"),
      formData.getAll("specValue"),
    ),
    inclusions: parseLineList(formData.get("inclusions")),
    exclusions: parseLineList(formData.get("exclusions")),
    rentalTerms: parseLineList(formData.get("rentalTerms")),
    seoSettings: {
      title: String(formData.get("seoTitle") ?? ""),
      description: String(formData.get("seoDescription") ?? ""),
    },
    rates,
  };
  const parsed = rentalProductFormSchema.safeParse(payload);
  if (!parsed.success)
    redirect(
      messagePath(
        editorPath,
        "error",
        parsed.error.issues[0]?.message ?? "Invalid rental product",
      ),
    );
  const supabase = await authenticatedClient(editorPath);
  let previousSlug: string | null = null;
  if (id) {
    const { data } = await supabase
      .from("rental_products")
      .select("slug")
      .eq("id", id)
      .eq("site_id", siteId)
      .single();
    previousSlug = data?.slug ?? null;
  }
  const { data: savedId, error } = await supabase.rpc("save_rental_product", {
    payload: parsed.data,
  });
  if (error) {
    const friendly =
      error.code === "23505"
        ? "That rental slug is already used."
        : error.message;
    redirect(messagePath(editorPath, "error", friendly));
  }
  if (previousSlug && previousSlug !== parsed.data.slug) {
    await supabase.from("redirects").upsert(
      {
        site_id: siteId,
        source_path: `/rentals/${previousSlug}`,
        destination_path: `/rentals/${parsed.data.slug}`,
        status_code: 301,
      },
      { onConflict: "site_id,source_path" },
    );
  }
  revalidatePath(`/dashboard/sites/${siteId}/rentals`);
  redirect(
    messagePath(
      `/dashboard/sites/${siteId}/rentals/${savedId}`,
      "message",
      "Rental product saved",
    ),
  );
}

export async function archiveRentalProduct(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const productId = z.uuid().parse(formData.get("productId"));
  const path = `/dashboard/sites/${siteId}/rentals`;
  const supabase = await authenticatedClient(path);
  const { error } = await supabase
    .from("rental_products")
    .update({ status: "archived" })
    .eq("id", productId)
    .eq("site_id", siteId);
  if (error) redirect(messagePath(path, "error", error.message));
  revalidatePath(path);
  redirect(messagePath(path, "message", "Rental product archived"));
}

export async function createTaxonomyTerm(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const taxonomyType = String(formData.get("taxonomyType") ?? "activity");
  const path = `/dashboard/sites/${siteId}/taxonomies?type=${encodeURIComponent(taxonomyType)}`;
  const parsed = taxonomyTermFormSchema.safeParse({
    ...Object.fromEntries(formData),
    siteId,
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
  });
  if (!parsed.success)
    redirect(
      `${path}&error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid term")}`,
    );
  const supabase = await authenticatedClient(path);
  const { error } = await supabase.from("taxonomy_terms").insert({
    site_id: parsed.data.siteId,
    taxonomy_id: parsed.data.taxonomyId,
    parent_id: parsed.data.parentId || null,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    listing_mode: parsed.data.listingMode,
    status: parsed.data.status,
  });
  if (error)
    redirect(
      `${path}&error=${encodeURIComponent(error.code === "23505" ? "That term slug is already used." : error.message)}`,
    );
  revalidatePath(`/dashboard/sites/${siteId}/taxonomies`);
  redirect(`${path}&message=Taxonomy%20term%20created`);
}

export async function archiveTaxonomyTerm(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const termId = z.uuid().parse(formData.get("termId"));
  const supabase = await authenticatedClient(
    `/dashboard/sites/${siteId}/taxonomies`,
  );
  await supabase
    .from("taxonomy_terms")
    .update({ status: "archived" })
    .eq("id", termId)
    .eq("site_id", siteId);
  revalidatePath(`/dashboard/sites/${siteId}/taxonomies`);
}
