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
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const identifiers = z.object({ siteId: z.uuid(), domainId: z.uuid() });

const domainUpdateIdentifiers = identifiers.extend({
  hostname: hostnameSchema,
});

export async function addDomain(formData: FormData) {
  const site = z.uuid().safeParse(formData.get("siteId"));
  if (!site.success) failAtAdmin("Invalid website request.");
  const siteId = site.data;
  const parsed = hostnameSchema.safeParse(
    String(formData.get("hostname") ?? ""),
  );
  if (!parsed.success)
    fail(siteId, parsed.error.issues[0]?.message ?? "Invalid hostname.");
  const hostname = parsed.data;
  const { admin } = await authorizedDomainClients(siteId);
  const { data: domain, error } = await admin
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
    await admin
      .from("domains")
      .update({
        provider_data: provider,
        // Adding a hostname never activates routing. The owner must explicitly
        // run Check DNS after reviewing the required records.
        verification_status: "pending",
        verified_at: null,
        last_checked_at: new Date().toISOString(),
        last_error: provider.configured
          ? "Review the DNS records, then run Check DNS to verify this hostname."
          : "Vercel domain integration is not configured yet.",
      })
      .eq("id", domain.id)
      .eq("site_id", siteId);
  } catch (cause) {
    await admin
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
  const { siteId, domainId } = parseIdentifiers(formData);
  const { admin } = await authorizedDomainClients(siteId);
  const { data: domain } = await admin
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
      throw new Error("Vercel domain integration is not configured yet.");
    await admin
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
    await admin
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
  const { siteId, domainId } = parseIdentifiers(formData);
  const { userClient } = await authorizedDomainClients(siteId);
  const { error } = await userClient.rpc("set_primary_domain", {
    target_domain: domainId,
  });
  if (error) fail(siteId, error.message);
  revalidatePath(`/dashboard/sites/${siteId}/domains`);
  redirect(
    `/dashboard/sites/${siteId}/domains?message=Primary%20domain%20updated`,
  );
}

export async function updateDomain(formData: FormData) {
  const parsed = domainUpdateIdentifiers.safeParse(
    Object.fromEntries(formData),
  );
  if (!parsed.success) failAtAdmin("Invalid domain update request.");
  const { siteId, domainId, hostname } = parsed.data;
  const { admin } = await authorizedDomainClients(siteId);
  const { data: domain } = await admin
    .from("domains")
    .select("hostname,domain_type")
    .eq("id", domainId)
    .eq("site_id", siteId)
    .single();
  if (!domain || domain.domain_type !== "custom")
    fail(siteId, "Custom domain not found.");
  if (domain.hostname === hostname)
    redirect(
      `/dashboard/sites/${siteId}/domains?message=No%20changes%20needed`,
    );

  let provider: Awaited<ReturnType<typeof addProviderDomain>>;
  try {
    provider = await addProviderDomain(hostname);
  } catch (cause) {
    fail(siteId, safeMessage(cause));
  }
  const { error } = await admin
    .from("domains")
    .update({
      hostname,
      provider_data: provider,
      // A changed hostname represents new ownership. Keep it pending until the
      // owner explicitly checks DNS for the exact replacement hostname.
      verification_status: "pending",
      verified_at: null,
      last_checked_at: new Date().toISOString(),
      last_error: provider.configured
        ? "Hostname changed. Review its DNS records, then run Check DNS."
        : "Vercel domain integration is not configured yet.",
      is_primary: false,
    })
    .eq("id", domainId)
    .eq("site_id", siteId);
  if (error) {
    await removeProviderDomain(hostname).catch(() => undefined);
    fail(
      siteId,
      error.code === "23505"
        ? "That hostname is already connected."
        : error.message,
    );
  }
  await removeProviderDomain(domain.hostname).catch(() => undefined);
  revalidatePath(`/dashboard/sites/${siteId}/domains`);
  redirect(`/dashboard/sites/${siteId}/domains?message=Domain%20updated`);
}

export async function deleteDomain(formData: FormData) {
  const { siteId, domainId } = parseIdentifiers(formData);
  const { admin } = await authorizedDomainClients(siteId);
  const { data: domain } = await admin
    .from("domains")
    .select("hostname,domain_type,is_primary")
    .eq("id", domainId)
    .eq("site_id", siteId)
    .single();
  if (!domain || domain.domain_type === "subdomain")
    fail(siteId, "The hosted fallback address cannot be removed.");
  let providerWarning = "";
  try {
    await removeProviderDomain(domain.hostname);
  } catch (cause) {
    // Removing the TripOne+ route is the security-critical operation. Do not
    // leave it active because a provider cleanup request was unavailable.
    providerWarning = safeMessage(cause);
  }
  const { error } = await admin
    .from("domains")
    .delete()
    .eq("id", domainId)
    .eq("site_id", siteId);
  if (error) fail(siteId, error.message);
  if (domain.is_primary) {
    const { data: replacement } = await admin
      .from("domains")
      .select("id")
      .eq("site_id", siteId)
      .eq("domain_type", "custom")
      .eq("verification_status", "verified")
      .neq("id", domainId)
      .order("created_at")
      .limit(1)
      .maybeSingle();
    if (replacement)
      await admin
        .from("domains")
        .update({ is_primary: true })
        .eq("id", replacement.id)
        .eq("site_id", siteId);
  }
  revalidatePath(`/dashboard/sites/${siteId}/domains`);
  redirect(
    `/dashboard/sites/${siteId}/domains?message=${encodeURIComponent(
      providerWarning
        ? "Domain removed from TripOne+. Vercel cleanup should be retried from the Vercel project."
        : "Domain removed",
    )}`,
  );
}

async function authorizedDomainClients(siteId: string) {
  const userClient = await createClient();
  const [authResult, { data: ownsSite, error: ownershipError }] =
    await Promise.all([
      userClient.auth.getUser(),
      userClient.rpc("owns_site", { target_site: siteId }),
    ]);
  if (authResult.error || !authResult.data.user || ownershipError || !ownsSite)
    fail(siteId, "Website not found or not authorized.");
  const admin = createAdminClient();
  if (!admin) fail(siteId, "Server domain management is not configured.");
  return { userClient, admin };
}

function fail(siteId: string, message = "Domain action failed."): never {
  redirect(
    `/dashboard/sites/${siteId}/domains?error=${encodeURIComponent(message)}`,
  );
}
function failAtAdmin(message: string): never {
  redirect(`/admin/domains?error=${encodeURIComponent(message)}`);
}
function parseIdentifiers(formData: FormData) {
  const parsed = identifiers.safeParse(Object.fromEntries(formData));
  if (!parsed.success) failAtAdmin("Invalid domain request.");
  return parsed.data;
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
