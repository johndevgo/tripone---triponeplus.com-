import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteUserCompletely } from "@/lib/platform/delete-user";
import { listAllAuthUsers } from "@/lib/platform/admin";
import {
  defaultPlatformSettings,
  inactiveAccountCutoff,
  isInactiveAccount,
} from "@/lib/platform/config";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !matchesSecret(request.headers.get("authorization"), secret))
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  if (!admin)
    return Response.json(
      { error: "Admin client unavailable" },
      { status: 503 },
    );

  const { data: settings, error: settingsError } = await admin
    .from("platform_settings")
    .select("inactivity_days,retention_enabled")
    .eq("id", 1)
    .single();
  if (settingsError)
    return Response.json(
      { error: "Retention settings unavailable" },
      { status: 503 },
    );
  if (!settings.retention_enabled)
    return Response.json({ ok: true, skipped: "Retention is disabled" });

  const [{ data: members, error: memberError }, users] = await Promise.all([
    admin.from("platform_members").select("user_id"),
    listAllAuthUsers(admin),
  ]);
  if (memberError)
    return Response.json(
      { error: "Platform members unavailable" },
      { status: 503 },
    );

  const protectedIds = new Set((members ?? []).map((item) => item.user_id));
  const cutoff = inactiveAccountCutoff(
    new Date(),
    settings.inactivity_days ?? defaultPlatformSettings.inactivityDays,
  );
  const candidates = users
    .filter(
      (user) =>
        user.email &&
        !protectedIds.has(user.id) &&
        isInactiveAccount(
          { createdAt: user.created_at, lastSignInAt: user.last_sign_in_at },
          cutoff,
        ),
    )
    .slice(0, 25);

  const failures: Array<{ userId: string; message: string }> = [];
  let deleted = 0;
  for (const user of candidates) {
    try {
      await deleteUserCompletely({
        admin,
        userId: user.id,
        email: user.email!,
        reason: "inactive_60_days",
      });
      deleted += 1;
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Deletion failed";
      failures.push({ userId: user.id, message: message.slice(0, 160) });
      await admin.from("platform_audit_log").insert({
        actor_id: null,
        target_user_id: user.id,
        action: "account.deletion_failed",
        details: { reason: "inactive_60_days", message: message.slice(0, 160) },
      });
    }
  }

  return Response.json({
    ok: failures.length === 0,
    cutoff: cutoff.toISOString(),
    examined: users.length,
    candidates: candidates.length,
    deleted,
    failures,
  });
}

function matchesSecret(header: string | null, secret: string) {
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header ?? "");
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}
