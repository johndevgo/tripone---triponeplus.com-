"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAppUrl } from "@/lib/app-url";
import {
  findAuthUserByEmail,
  requirePlatformMember,
} from "@/lib/platform/admin";
import { deleteUserCompletely } from "@/lib/platform/delete-user";

const settingsSchema = z.object({
  foundingFreeYears: z.coerce.number().int().min(1).max(10),
  inactivityDays: z.coerce.number().int().min(30).max(3650),
  annualPrice: z.coerce.number().min(0).max(1_000_000),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/),
  retentionEnabled: z.string().optional(),
});

const entitlementSchema = z.object({
  userId: z.uuid(),
  status: z.enum(["active", "grace", "expired", "suspended"]),
  freeUntil: z.iso.date(),
});

export async function updatePlatformSettings(formData: FormData) {
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    fail(parsed.error.issues[0]?.message ?? "Invalid settings.");
  const { admin, user } = await requirePlatformMember(["super_admin"]);
  const { error } = await admin
    .from("platform_settings")
    .update({
      founding_free_years: parsed.data.foundingFreeYears,
      inactivity_days: parsed.data.inactivityDays,
      annual_price: parsed.data.annualPrice,
      currency: parsed.data.currency,
      retention_enabled: parsed.data.retentionEnabled === "on",
      updated_by: user.id,
    })
    .eq("id", 1);
  if (error) fail(error.message);
  await audit(admin, user.id, null, "platform.settings_updated", {
    inactivityDays: parsed.data.inactivityDays,
    retentionEnabled: parsed.data.retentionEnabled === "on",
  });
  done("Platform settings updated.");
}

export async function updateEntitlement(formData: FormData) {
  const parsed = entitlementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    fail(parsed.error.issues[0]?.message ?? "Invalid entitlement.");
  const { admin, user } = await requirePlatformMember(["super_admin"]);
  const { error } = await admin
    .from("account_entitlements")
    .update({
      status: parsed.data.status,
      free_until: `${parsed.data.freeUntil}T23:59:59.999Z`,
      updated_by: user.id,
    })
    .eq("user_id", parsed.data.userId);
  if (error) fail(error.message);
  await audit(admin, user.id, parsed.data.userId, "entitlement.updated", {
    status: parsed.data.status,
    freeUntil: parsed.data.freeUntil,
  });
  done("Account access updated.");
}

export async function grantPlatformRole(formData: FormData) {
  const email = z.email().parse(String(formData.get("email") ?? "").trim());
  const role = z
    .enum(["super_admin", "support", "analyst"])
    .parse(formData.get("role"));
  const { admin, user } = await requirePlatformMember(["super_admin"]);
  const target = await findAuthUserByEmail(admin, email);
  if (!target) fail("No confirmed account uses that email address.");
  const { error } = await admin.from("platform_members").upsert({
    user_id: target.id,
    role,
    created_by: user.id,
  });
  if (error) fail(error.message);
  await audit(admin, user.id, target.id, "platform.role_granted", { role });
  done("Platform role granted.");
}

export async function revokePlatformRole(formData: FormData) {
  const targetId = z.uuid().parse(formData.get("userId"));
  const { admin, user } = await requirePlatformMember(["super_admin"]);
  if (targetId === user.id) fail("You cannot remove your own platform access.");
  const { data: target } = await admin
    .from("platform_members")
    .select("role")
    .eq("user_id", targetId)
    .single();
  if (target?.role === "super_admin") {
    const { count } = await admin
      .from("platform_members")
      .select("user_id", { count: "exact", head: true })
      .eq("role", "super_admin");
    if ((count ?? 0) <= 1) fail("The final super admin cannot be removed.");
  }
  const { error } = await admin
    .from("platform_members")
    .delete()
    .eq("user_id", targetId);
  if (error) fail(error.message);
  await audit(admin, user.id, targetId, "platform.role_revoked", {});
  done("Platform role removed.");
}

export async function sendManagedPasswordReset(formData: FormData) {
  const userId = z.uuid().parse(formData.get("userId"));
  const { admin, user } = await requirePlatformMember(["super_admin"]);
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user.email) fail("User email is unavailable.");
  const { error: resetError } = await admin.auth.resetPasswordForEmail(
    data.user.email,
    { redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password` },
  );
  if (resetError) fail(resetError.message);
  await audit(admin, user.id, userId, "account.password_reset_sent", {});
  done("Secure password reset email sent.");
}

export async function deleteManagedAccount(formData: FormData) {
  const userId = z.uuid().parse(formData.get("userId"));
  const confirmation = String(formData.get("confirmation") ?? "").trim();
  const { admin, user } = await requirePlatformMember(["super_admin"]);
  if (userId === user.id)
    fail("Use your account page to delete your own account.");
  const [{ data }, { data: membership }] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    admin
      .from("platform_members")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);
  const email = data.user?.email?.toLowerCase();
  if (!email || confirmation.toLowerCase() !== email)
    fail("Enter the account email exactly to confirm deletion.");
  if (membership)
    fail("Remove the platform role before deleting this account.");
  await deleteUserCompletely({
    admin,
    userId,
    email,
    reason: "admin_action",
    actorId: user.id,
  });
  done("Account and owned workspace data deleted.");
}

export async function unsubscribeRetainedContact(formData: FormData) {
  const email = z.email().parse(String(formData.get("email") ?? "").trim());
  const { admin, user } = await requirePlatformMember(["super_admin"]);
  const { error } = await admin
    .from("retained_contacts")
    .update({
      marketing_consent: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("email", email.toLowerCase());
  if (error) fail(error.message);
  await audit(admin, user.id, null, "contact.unsubscribed", {
    email: email.toLowerCase(),
  });
  done("Contact unsubscribed.");
}

async function audit(
  admin: Awaited<ReturnType<typeof requirePlatformMember>>["admin"],
  actorId: string,
  targetUserId: string | null,
  action: string,
  details: Record<string, unknown>,
) {
  const { error } = await admin.from("platform_audit_log").insert({
    actor_id: actorId,
    target_user_id: targetUserId,
    action,
    details,
  });
  if (error) throw error;
}

function done(message: string): never {
  revalidatePath("/super-admin");
  redirect(`/super-admin?message=${encodeURIComponent(message)}`);
}

function fail(message: string): never {
  redirect(`/super-admin?error=${encodeURIComponent(message.slice(0, 240))}`);
}
