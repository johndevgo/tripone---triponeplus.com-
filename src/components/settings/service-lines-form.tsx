"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Check,
  Compass,
  PackageOpen,
  Shapes,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import type { BusinessCapability } from "@/lib/types";
import {
  businessModelForCapability,
  businessModels,
  representativesForModels,
  representativeForModel,
  type BusinessModel,
} from "@/lib/business-models";

const modelIcons: Record<BusinessModel, LucideIcon> = {
  tours: Compass,
  rentals: Truck,
  packages: PackageOpen,
  other: Shapes,
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
  const initialModels = businessModels
    .filter((model) =>
      model.capabilities.some((capability) =>
        initialSelected.includes(capability),
      ),
    )
    .map((model) => model.id);
  const initialPrimaryModel = businessModelForCapability(initialPrimary);
  const [selected, setSelected] = useState<BusinessModel[]>(
    initialModels.length > 0 ? initialModels : [initialPrimaryModel],
  );
  const [primary, setPrimary] = useState<BusinessModel>(initialPrimaryModel);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const representatives = useMemo(
    () => representativesForModels(selected),
    [selected],
  );
  const primaryCapability = representativeForModel(primary);

  function toggle(model: BusinessModel) {
    setSelected((current) => {
      const next = current.includes(model)
        ? current.filter((item) => item !== model)
        : [...current, model];
      if (next.length > 0 && !next.includes(primary)) setPrimary(next[0]!);
      return next;
    });
  }

  return (
    <form action={action} className="mt-8">
      <input type="hidden" name="siteId" value={siteId} />
      <input type="hidden" name="businessId" value={businessId} />
      {representatives.map((capability) => (
        <input
          key={capability}
          type="hidden"
          name="capabilities"
          value={capability}
        />
      ))}
      <input
        type="hidden"
        name="primaryCapability"
        value={primaryCapability ?? ""}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {businessModels.map((model) => {
          const checked = selectedSet.has(model.id);
          const Icon = modelIcons[model.id];
          return (
            <button
              key={model.id}
              type="button"
              aria-pressed={checked}
              onClick={() => toggle(model.id)}
              className={`glass group relative min-h-40 rounded-3xl p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--brand-300)]/40 ${checked ? "border-[var(--brand-300)]/65 bg-[var(--brand-300)]/[.09]" : ""}`}
            >
              <span className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[.07] text-[var(--brand-300)]">
                <Icon size={21} />
              </span>
              <span className="mt-4 block text-lg font-semibold">
                {model.label}
              </span>
              <span className="mt-1.5 block max-w-md text-sm leading-6 text-white/48">
                {model.description}
              </span>
              {checked && (
                <span className="absolute right-5 top-5 grid size-7 place-items-center rounded-full bg-[var(--brand-500)] text-[#173028]">
                  <Check size={16} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="glass mt-6 grid gap-5 rounded-3xl p-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] md:items-end">
        <div>
          <p className="flex items-center gap-2 font-medium text-white">
            <Star size={16} className="text-[var(--brand-300)]" /> Primary
            business model
          </p>
          <p className="mt-2 text-sm leading-6 text-white/45">
            This shapes the first website draft. Activities, destinations,
            travel styles and categories stay flexible in Collections.
          </p>
        </div>
        <label className="text-sm text-white/70">
          <span className="sr-only">Primary business model</span>
          <select
            value={primary}
            onChange={(event) =>
              setPrimary(event.target.value as BusinessModel)
            }
            className="min-h-11 w-full rounded-xl border border-white/15 bg-[#0b3027] px-3 text-white outline-none focus:border-[var(--brand-300)]"
          >
            {selected.map((modelId) => (
              <option key={modelId} value={modelId}>
                {businessModels.find((model) => model.id === modelId)?.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <FormSubmitButton
          disabled={selected.length === 0}
          pendingLabel="Saving business model…"
          className="min-h-11 rounded-xl bg-[var(--brand-500)] px-5 font-semibold text-[#173028] shadow-[0_10px_30px_rgba(91,205,87,.18)]"
        >
          <BriefcaseBusiness size={18} /> Save business model
        </FormSubmitButton>
      </div>
    </form>
  );
}
