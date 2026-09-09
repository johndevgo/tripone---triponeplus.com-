import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { OnboardingWizard } from "@/components/onboarding/wizard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create your website",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function Onboarding() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { count } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true });
  if (count) redirect("/dashboard");
  return (
    <main className="app-bg min-h-screen px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="ambient" />
      <div className="mx-auto mb-7 max-w-6xl">
        <Logo light />
      </div>
      <OnboardingWizard />
    </main>
  );
}
