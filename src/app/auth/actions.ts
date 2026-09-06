"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getAppUrl } from "@/lib/app-url";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}
const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});
const signupSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(100),
});

function localPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard";
}

export async function login(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: value(formData, "email"),
    password: value(formData, "password"),
  });
  if (!parsed.success)
    redirect("/login?error=Enter%20a%20valid%20email%20and%20password");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  const { count } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true });
  redirect(count ? localPath(value(formData, "next")) : "/onboarding");
}

export async function signup(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: value(formData, "email"),
    password: value(formData, "password"),
    name: value(formData, "name"),
  });
  if (!parsed.success)
    redirect(
      `/signup?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Check your details")}`,
    );
  const supabase = await createClient();
  const email = parsed.data.email;
  const origin = getAppUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
    },
  });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  if (data.session) redirect("/onboarding");
  redirect(
    `/login?message=${encodeURIComponent("Check your email to confirm your account.")}`,
  );
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const origin = getAppUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(
    value(formData, "email"),
    { redirectTo: `${origin}/auth/callback?next=/reset-password` },
  );
  if (error)
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  redirect(
    `/forgot-password?message=${encodeURIComponent("If that account exists, a reset link is on its way.")}`,
  );
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const password = value(formData, "password");
  if (password.length < 8)
    redirect(
      "/reset-password?error=Password%20must%20be%20at%20least%208%20characters",
    );
  const { error } = await supabase.auth.updateUser({ password });
  if (error)
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  redirect("/dashboard");
}
