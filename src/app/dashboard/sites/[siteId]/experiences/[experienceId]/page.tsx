import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/experiences/experience-form";
import { createClient } from "@/lib/supabase/server";
import type { BusinessType } from "@/lib/types";

export default async function EditExperience({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string; experienceId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { siteId, experienceId } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const [{ data: site }, { data: experience }] = await Promise.all([
    supabase
      .from("sites")
      .select("id,businesses(business_type)")
      .eq("id", siteId)
      .single(),
    supabase
      .from("experiences")
      .select("*")
      .eq("id", experienceId)
      .eq("site_id", siteId)
      .single(),
  ]);
  if (!site || !experience) notFound();
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
      <h1 className="mt-5 text-3xl font-semibold">Edit {experience.name}</h1>
      <p className="mt-2 text-white/45">
        Changes remain in the working draft until you publish them.
      </p>
      <ExperienceForm
        siteId={siteId}
        businessType={(business?.business_type ?? "other") as BusinessType}
        experience={experience}
        error={error}
      />
    </div>
  );
}
