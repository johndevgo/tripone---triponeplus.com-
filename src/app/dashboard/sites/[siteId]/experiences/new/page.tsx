import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/experiences/experience-form";
import { createClient } from "@/lib/supabase/server";
import type { BusinessType } from "@/lib/types";

export default async function NewExperience({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { siteId } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("id,businesses(business_type)")
    .eq("id", siteId)
    .single();
  if (!site) notFound();
  const business = Array.isArray(site.businesses)
    ? site.businesses[0]
    : site.businesses;
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href={`/dashboard/sites/${siteId}/experiences`}
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to experiences
      </Link>
      <h1 className="mt-5 text-3xl font-semibold">Add an experience</h1>
      <p className="mt-2 text-white/45">
        Create a complete, conversion-ready tour, activity, rental or package.
      </p>
      <ExperienceForm
        siteId={siteId}
        businessType={(business?.business_type ?? "other") as BusinessType}
        error={error}
      />
    </div>
  );
}
