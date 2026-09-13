import "server-only";

import type { User } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type PlatformRole = "super_admin" | "support" | "analyst";

export async function requirePlatformMember(
  roles: PlatformRole[] = ["super_admin"],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/super-admin");

  const admin = createAdminClient();
  if (!admin)
    throw new Error(
      "Platform administration requires SUPABASE_SECRET_KEY on the server.",
    );
  const { data: membership, error } = await admin
    .from("platform_members")
    .select("role,created_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw new Error("Platform authorization is not available.");
  if (!membership || !roles.includes(membership.role as PlatformRole))
    notFound();
  return {
    user,
    admin,
    role: membership.role as PlatformRole,
  };
}

export async function listAllAuthUsers(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  maxPages = 20,
) {
  const users: User[] = [];
  const perPage = 1000;
  for (let page = 1; page <= maxPages; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < perPage) break;
  }
  return users;
}

export async function findAuthUserByEmail(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  email: string,
) {
  const normalized = email.trim().toLowerCase();
  const users = await listAllAuthUsers(admin);
  return users.find((user) => user.email?.toLowerCase() === normalized) ?? null;
}
