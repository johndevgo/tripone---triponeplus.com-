import { notFound } from "next/navigation";
import { BriefcaseBusiness, Check, Star } from "lucide-react";
import { saveCapabilities } from "../multi-service-actions";
import { createClient } from "@/lib/supabase/server";
import { businessCapabilities, type BusinessCapability } from "@/lib/types";

const labels: Record<BusinessCapability, string> = {
  jetski: "Jet ski experiences",
  boat_rental: "Boat rentals",
  day_tour: "Day tours",
  tour_operator: "Tour operator",
  travel_agency: "Travel agency",
  safari: "Safaris",
  trekking: "Trekking",
  hiking: "Hiking",
  diving: "Diving",
  snorkelling: "Snorkelling",
  rafting: "Rafting",
  atv_buggy: "ATV & buggy",
  adventure_activity: "Adventure activities",
  local_guide: "Local guide",
  multi_day_tour: "Multi-day tours",
  excursion: "Excursions",
  water_sports: "Water sports",
  motorcycle_tour: "Motorcycle tours",
  motorcycle_rental: "Motorcycle rentals",
  vehicle_rental: "Vehicle & jeep rentals",
  equipment_rental: "Equipment rentals",
  other: "Other tourism service",
};

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
      <p className="text-sm font-medium text-[#FFC857]">Business model</p>
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
      <form action={saveCapabilities} className="mt-8">
        <input type="hidden" name="siteId" value={siteId} />
        <input type="hidden" name="businessId" value={site.business_id} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {businessCapabilities.map((capability) => (
            <label
              key={capability}
              className="glass group relative flex min-h-24 cursor-pointer items-start gap-3 rounded-2xl p-4 transition hover:border-[#FFC857]/35 has-[:checked]:border-[#FFC857]/60 has-[:checked]:bg-[#FFC857]/[.08]"
            >
              <input
                className="peer mt-1 size-4 accent-[#F5A623]"
                type="checkbox"
                name="capabilities"
                value={capability}
                defaultChecked={selected.has(capability)}
              />
              <span>
                <span className="block font-medium">{labels[capability]}</span>
                <span className="mt-1 block text-xs text-white/40">
                  Add this capability to page and content recommendations.
                </span>
              </span>
              <Check
                className="absolute right-3 top-3 hidden text-[#FFC857] peer-checked:block"
                size={16}
              />
            </label>
          ))}
        </div>
        <div className="glass mt-6 rounded-2xl p-5">
          <label className="text-sm text-white/70">
            <span className="flex items-center gap-2 font-medium text-white">
              <Star size={16} className="text-[#FFC857]" /> Primary service
            </span>
            <select
              name="primaryCapability"
              defaultValue={primary}
              className="mt-3 min-h-11 w-full max-w-md rounded-xl border border-white/15 bg-[#0b3027] px-3 outline-none focus:border-[#FFC857]"
            >
              {businessCapabilities.map((capability) => (
                <option key={capability} value={capability}>
                  {labels[capability]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F5A623] px-5 font-semibold text-[#173028]">
            <BriefcaseBusiness size={18} /> Save service lines
          </button>
        </div>
      </form>
    </div>
  );
}
