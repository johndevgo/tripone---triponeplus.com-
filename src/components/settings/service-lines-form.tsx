"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Check, Star } from "lucide-react";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
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

export function ServiceLinesForm({
  siteId,
  businessId,
  initialSelected,
  initialPrimary,
  action,
}: {
  siteId: string;
  businessId: string;
  initialSelected: BusinessCapability[];
  initialPrimary: BusinessCapability;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [selected, setSelected] = useState<BusinessCapability[]>(
    initialSelected.length > 0 ? initialSelected : [initialPrimary],
  );
  const [primary, setPrimary] = useState<BusinessCapability>(initialPrimary);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggle(capability: BusinessCapability) {
    setSelected((current) => {
      const next = current.includes(capability)
        ? current.filter((item) => item !== capability)
        : [...current, capability];
      if (next.length > 0 && !next.includes(primary)) setPrimary(next[0]!);
      return next;
    });
  }

  return (
    <form action={action} className="mt-8">
      <input type="hidden" name="siteId" value={siteId} />
      <input type="hidden" name="businessId" value={businessId} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/55">
          <strong className="text-white">{selected.length}</strong> of{" "}
          {businessCapabilities.length} service lines selected. There is no
          twelve-service limit.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelected([...businessCapabilities])}
            className="min-h-9 rounded-lg border border-white/12 px-3 text-xs font-medium text-white/70 hover:bg-white/[.06]"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={() => setSelected([primary])}
            className="min-h-9 rounded-lg border border-white/12 px-3 text-xs font-medium text-white/70 hover:bg-white/[.06]"
          >
            Keep primary only
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {businessCapabilities.map((capability) => {
          const checked = selectedSet.has(capability);
          return (
            <label
              key={capability}
              className="glass group relative flex min-h-24 cursor-pointer items-start gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand-300)]/35 has-[:checked]:border-[var(--brand-300)]/60 has-[:checked]:bg-[var(--brand-300)]/[.08]"
            >
              <input
                className="peer mt-1 size-4 accent-[var(--brand-500)]"
                type="checkbox"
                name="capabilities"
                value={capability}
                checked={checked}
                onChange={() => toggle(capability)}
              />
              <span>
                <span className="block font-medium">{labels[capability]}</span>
                <span className="mt-1 block text-xs text-white/40">
                  Add this capability to content and page recommendations.
                </span>
              </span>
              <Check
                className="absolute right-3 top-3 hidden text-[var(--brand-300)] peer-checked:block"
                size={16}
              />
            </label>
          );
        })}
      </div>
      <div className="glass mt-6 rounded-2xl p-5">
        <label className="text-sm text-white/70">
          <span className="flex items-center gap-2 font-medium text-white">
            <Star size={16} className="text-[var(--brand-300)]" /> Primary
            service
          </span>
          <select
            name="primaryCapability"
            value={primary}
            onChange={(event) =>
              setPrimary(event.target.value as BusinessCapability)
            }
            className="mt-3 min-h-11 w-full max-w-md rounded-xl border border-white/15 bg-[#0b3027] px-3 outline-none focus:border-[var(--brand-300)]"
          >
            {selected.map((capability) => (
              <option key={capability} value={capability}>
                {labels[capability]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-6 flex justify-end">
        <FormSubmitButton
          disabled={selected.length === 0}
          pendingLabel="Saving service lines…"
          className="min-h-11 rounded-xl bg-[var(--brand-500)] px-5 font-semibold text-[#173028] shadow-[0_10px_30px_rgba(91,205,87,.18)]"
        >
          <BriefcaseBusiness size={18} /> Save service lines
        </FormSubmitButton>
      </div>
    </form>
  );
}
