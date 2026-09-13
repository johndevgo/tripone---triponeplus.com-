import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>;
type DeletionReason = "user_request" | "inactive_60_days" | "admin_action";

export async function deleteUserCompletely({
  admin,
  userId,
  email,
  reason,
  actorId,
}: {
  admin: AdminClient;
  userId: string;
  email: string;
  reason: DeletionReason;
  actorId?: string | null;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("marketing_consent")
    .eq("id", userId)
    .maybeSingle();
  if (profileError) throw profileError;

  if (profile?.marketing_consent && normalizedEmail) {
    const { error } = await admin.from("retained_contacts").upsert(
      {
        email: normalizedEmail,
        former_user_id: userId,
        marketing_consent: true,
        consent_source: "account_signup",
        deletion_reason: reason,
        last_account_deleted_at: new Date().toISOString(),
        unsubscribed_at: null,
      },
      { onConflict: "email" },
    );
    if (error) throw error;
  }

  await removeUserStorage(admin, "site-media", userId);
  await removeUserStorage(admin, "avatars", userId);

  const { error: deleteError } = await admin.auth.admin.deleteUser(
    userId,
    false,
  );
  if (deleteError) throw deleteError;

  await admin.from("platform_audit_log").insert({
    // A self-deleting user no longer exists when this event is written.
    actor_id: actorId === userId ? null : (actorId ?? null),
    target_user_id: userId,
    action: "account.deleted",
    details: {
      reason,
      retainedOptInEmail: Boolean(profile?.marketing_consent),
    },
  });
}

async function removeUserStorage(
  admin: AdminClient,
  bucket: "site-media" | "avatars",
  userId: string,
) {
  const paths = await listStoragePaths(admin, bucket, userId, 0);
  for (let index = 0; index < paths.length; index += 100) {
    const { error } = await admin.storage
      .from(bucket)
      .remove(paths.slice(index, index + 100));
    if (error) throw error;
  }
}

async function listStoragePaths(
  admin: AdminClient,
  bucket: string,
  prefix: string,
  depth: number,
): Promise<string[]> {
  if (depth > 8) throw new Error("Storage folder depth exceeds policy.");
  const paths: string[] = [];
  const limit = 1000;
  for (let offset = 0; ; offset += limit) {
    const { data, error } = await admin.storage.from(bucket).list(prefix, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw error;
    for (const item of data ?? []) {
      const path = `${prefix}/${item.name}`;
      if (item.id) paths.push(path);
      else
        paths.push(...(await listStoragePaths(admin, bucket, path, depth + 1)));
    }
    if (!data || data.length < limit) break;
  }
  return paths;
}
