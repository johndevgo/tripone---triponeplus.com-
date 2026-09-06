"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hostnameSchema } from "@/lib/domains/validation";
import {
  addProviderDomain,
  removeProviderDomain,
  verifyProviderDomain,
} from "@/lib/domains/provider";
import { createClient } from "@/lib/supabase/server";

const identifiers = z.object({ siteId: z.uuid(), domainId: z.uuid() });

export async function addDomain(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const parsed = hostnameSchema.safeParse(
    String(formData.get("hostname") ?? ""),
  );
  if (!parsed.success)
    fail(siteId, parsed.error.issues[0]?.message ?? "Invalid hostname.");
  const hostname = parsed.data;
  const supabase = await createClient();
  const { data: domain, error } = await supabase
    .from("domains")
    .insert({ site_id: siteId, hostname, domain_type: "custom" })
    .select("id")
    .single();
  if (error || !domain)
    fail(
      siteId,
      error?.code === "23505"
        ? "That hostname is already connected."
        : error?.message,
    );
  try {
    const provider = await addProviderDomain(hostname);
    await supabase
      .from("domains")
      .update({
        provider_data: provider,
        verification_status: provider.verified ? "verified" : "pending",
        verified_at: provider.verified ? new Date().toISOString() : null,
        last_checked_at: new Date().toISOString(),
        last_error: null,
      })
      .eq("id", domain.id)
      .eq("site_id", siteId);
  } catch (cause) {
    await supabase
      .from("domains")
      .update({
        last_error: safeMessage(cause),
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", domain.id)
      .eq("site_id", siteId);
  }
  revalidatePath(`/dashboard/sites/${siteId}/domains`);
  redirect(`/dashboard/sites/${siteId}/domains?message=Domain%20added`);
}

export async function verifyDomain(formData: FormData) {
  const { siteId, domainId } = identifiers.parse(Object.fromEntries(formData));
  const supabase = await createClient();
  const { data: domain } = await supabase
    .from("domains")
    .select("hostname,last_checked_at,domain_type,provider_data")
    .eq("id", domainId)
    .eq("site_id", siteId)
    .single();
  if (!domain) fail(siteId, "Domain not found.");
  if (
    domain.last_checked_at &&
    Date.now() - new Date(domain.last_checked_at).getTime() < 15_000
  )
    fail(siteId, "Please wait a few seconds before checking again.");
  try {
    const savedProvider = object(domain.provider_data);
    const provider =
      domain.domain_type === "subdomain" && savedProvider.configured !== true
        ? await addProviderDomain(domain.hostname)
        : await verifyProviderDomain(domain.hostname);
    if (!provider.configured)
      fail(siteId, "Vercel domain integration is not configured yet.");
    await supabase
      .from("domains")
      .update({
        provider_data: provider,
        verification_status: provider.verified ? "verified" : "pending",
        verified_at: provider.verified ? new Date().toISOString() : null,
        last_checked_at: new Date().toISOString(),
        last_error: provider.verified
          ? null
          : "DNS verification is still pending.",
      })
      .eq("id", domainId)
      .eq("site_id", siteId);
  } catch (cause) {
    await supabase
      .from("domains")
      .update({
        last_error: safeMessage(cause),
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", domainId)
      .eq("site_id", siteId);
    fail(siteId, safeMessage(cause));
  }
  revalidatePath(`/dashboard/sites/${siteId}/domains`);
  redirect(`/dashboard/sites/${siteId}/domains?message=Verification%20checked`);
}

export async function setPrimaryDomain(formData: FormData) {
  const { siteId, domainId } = identifiers.parse(Object.fromEntries(formData));
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_primary_domain", {
    target_domain: domainId,
  });
  if (error) fail(siteId, error.message);
  revalidatePath(`/dashboard/sites/${siteId}/domains`);
  redirect(
    `/dashboard/sites/${siteId}/domains?message=Primary%20domain%20updated`,
  );
}

export async function deleteDomain(formData: FormData) {
  const { siteId, domainId } = identifiers.parse(Object.fromEntries(formData));
  const supabase = await createClient();
  const { data: domain } = await supabase
    .from("domains")
    .select("hostname,domain_type,is_primary")
    .eq("id", domainId)
    .eq("site_id", siteId)
    .single();
  if (!domain || domain.domain_type === "subdomain" || domain.is_primary)
    fail(siteId, "The fallback or primary domain cannot be removed.");
  try {
    await removeProviderDomain(domain.hostname);
  } catch (cause) {
    fail(siteId, safeMessage(cause));
  }
  const { error } = await supabase
    .from("domains")
    .delete()
    .eq("id", domainId)
    .eq("site_id", siteId);
  if (error) fail(siteId, error.message);
  revalidatePath(`/dashboard/sites/${siteId}/domains`);
  redirect(`/dashboard/sites/${siteId}/domains?message=Domain%20removed`);
}

function fail(siteId: string, message = "Domain action failed."): never {
  redirect(
    `/dashboard/sites/${siteId}/domains?error=${encodeURIComponent(message)}`,
  );
}
function safeMessage(cause: unknown) {
  return cause instanceof Error
    ? cause.message.slice(0, 300)
    : "Domain provider request failed.";
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
