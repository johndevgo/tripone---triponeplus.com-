"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAppUrl } from "@/lib/app-url";
import { deleteUserCompletely } from "@/lib/platform/delete-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  avatarUrl: z.union([
    z.literal(""),
    z.url().refine((value) => /^https?:\/\//.test(value)),
  ]),
  marketingConsent: z.string().optional(),
});
export async function saveProfile(formData: FormData) {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    fail(parsed.error.issues[0]?.message ?? "Invalid profile.");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      avatar_url: parsed.data.avatarUrl || null,
      marketing_consent: parsed.data.marketingConsent === "on",
    })
    .eq("id", user.id);
  if (error) fail(error.message);
  revalidatePath("/admin/account");
  redirect("/admin/account?message=Profile%20saved");
}
export async function sendPasswordReset() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");
  const origin = getAppUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${origin}/reset-password`,
  });
  if (error) fail(error.message);
  redirect("/admin/account?message=Password%20reset%20email%20sent");
}
export async function deleteAccount(formData: FormData) {
  const confirmation = String(formData.get("confirmation") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");
  if (confirmation !== `DELETE ${user.email}`)
    fail(`Type DELETE ${user.email} exactly.`);
  const admin = createAdminClient();
  if (!admin)
    fail("Account deletion requires SUPABASE_SECRET_KEY on the server.");
  try {
    await deleteUserCompletely({
      admin,
      userId: user.id,
      email: user.email,
      reason: "user_request",
      actorId: user.id,
    });
  } catch (cause) {
    fail(cause instanceof Error ? cause.message : "Account deletion failed.");
  }
  await supabase.auth.signOut();
  redirect("/?message=Account%20deleted");
}
function fail(message: string): never {
  redirect(`/admin/account?error=${encodeURIComponent(message)}`);
}
