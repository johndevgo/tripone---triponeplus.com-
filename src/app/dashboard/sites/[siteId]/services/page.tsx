import { notFound } from "next/navigation";
import { saveCapabilities } from "../multi-service-actions";
import { createClient } from "@/lib/supabase/server";
import type { BusinessCapability } from "@/lib/types";
import { ServiceLinesForm } from "@/components/settings/service-lines-form";

export default async function ServicesPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const feedback = await searchParams;
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("id,business_id")
    .eq("id", siteId)
    .single();
  if (!site) notFound();
  const { data } = await supabase
    .from("business_capabilities")
    .select("capability,is_primary")
    .eq("business_id", site.business_id)
    .order("sort_order");
  const selected = new Set((data ?? []).map((item) => item.capability));
  const primary =
    data?.find((item) => item.is_primary)?.capability ??
    data?.[0]?.capability ??
    "other";
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-[#95EE8E]">Business model</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Your service lines
      </h1>
      <p className="mt-2 max-w-2xl text-white/50">
        Select everything this business genuinely offers. The primary service
        guides recommendations; every experience and rental still keeps its own
        subtype.
      </p>
      {feedback.message && (
        <p className="mt-5 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-200">
          {feedback.message}
        </p>
      )}
      {feedback.error && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-400/10 p-3 text-sm text-red-100"
        >
          {feedback.error}
        </p>
      )}
      <ServiceLinesForm
        siteId={siteId}
        businessId={site.business_id}
        initialSelected={[...selected] as BusinessCapability[]}
        initialPrimary={primary as BusinessCapability}
        action={saveCapabilities}
      />
    </div>
  );
}
