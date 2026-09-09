"use client";

import Link from "next/link";
import { useState } from "react";
import { MediaUploadField } from "@/components/media/media-manager";
import { saveExperience } from "@/app/dashboard/sites/[siteId]/actions";
import type { BusinessType } from "@/lib/types";

export type ExperienceRecord = Record<string, unknown> & {
  id?: string;
  name?: string;
  slug?: string;
};
const input =
  "mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-white/[.06] px-3.5 text-white outline-none focus:border-[#FFC857]";
const experienceTypeOptions = [
  "tour",
  "day_tour",
  "multi_day_tour",
  "package",
  "excursion",
  "adventure_activity",
  "local_guide",
  "jetski",
  "boat_tour",
  "safari",
  "trekking",
  "hiking",
  "diving",
  "snorkelling",
  "rafting",
  "atv_buggy",
  "water_sports",
  "motorcycle_tour",
  "other",
];

export function ExperienceForm({
  siteId,
  businessType,
  experience,
  error,
}: {
  siteId: string;
  businessType: BusinessType;
  experience?: ExperienceRecord;
  error?: string;
}) {
  const v = (key: string, fallback = "") =>
    experience?.[key] == null ? fallback : String(experience[key]);
  const extra = (experience?.extra_details ?? {}) as Record<string, unknown>;
  const seo = (experience?.seo_settings ?? {}) as Record<string, unknown>;
  const storedType = v("experience_type", businessType);
  const [experienceType, setExperienceType] = useState(storedType);
  const typeOptions = experienceTypeOptions.includes(storedType)
    ? experienceTypeOptions
    : [storedType, ...experienceTypeOptions];
  const textArray = (key: string) =>
    Array.isArray(experience?.[key])
      ? (experience![key] as Array<string | Record<string, unknown>>)
          .map((item) =>
            typeof item === "string" ? item : String(item.url ?? ""),
          )
          .join("\n")
      : "";
  return (
    <form action={saveExperience} className="mt-8 space-y-6">
      <input type="hidden" name="siteId" value={siteId} />
      <input type="hidden" name="experienceId" value={experience?.id ?? ""} />
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-400/10 p-3 text-sm text-red-100"
        >
          {error}
        </p>
      )}
      <Group title="Basic">
        <Field label="Name" name="name" defaultValue={v("name")} span />
        <Field label="Slug" name="slug" defaultValue={v("slug")} />
        <Select
          label="Experience type"
          name="experienceType"
          value={experienceType}
          options={typeOptions}
          onChange={setExperienceType}
        />
        <Select
          label="Status"
          name="status"
          value={v("status", "draft")}
          options={["draft", "published", "archived"]}
        />
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={Boolean(experience?.featured)}
          />{" "}
          Featured
        </label>
      </Group>
      <Group title="Content">
        <Area
          label="Short description"
          name="shortDescription"
          defaultValue={v("short_description")}
          rows={3}
          span
        />
        <Area
          label="Long description"
          name="description"
          defaultValue={v("description")}
          rows={7}
          span
        />
        <Area
          label="Highlights"
          help="One per line"
          name="highlights"
          defaultValue={textArray("highlights")}
        />
        <MediaUploadField
          siteId={siteId}
          name="featuredImageUrl"
          defaultValue={v("featured_image_url")}
        />
        <Area
          label="Gallery image URLs"
          help="One per line"
          name="gallery"
          defaultValue={textArray("gallery")}
          span
        />
      </Group>
      <Group title="Pricing & duration">
        <Field
          label="Price from"
          name="priceFrom"
          type="number"
          step="0.01"
          defaultValue={v("price_from")}
          optional
        />
        <Field
          label="Currency"
          name="currency"
          defaultValue={v("currency", "USD")}
        />
        <Field
          label="Pricing label"
          name="pricingLabel"
          defaultValue={v("pricing_label")}
          optional
        />
        <Field
          label="Duration value"
          name="durationValue"
          type="number"
          step="0.25"
          defaultValue={v("duration_value")}
          optional
        />
        <Select
          label="Duration unit"
          name="durationUnit"
          value={v("duration_unit", "hours")}
          options={["minutes", "hours", "days", "weeks"]}
        />
      </Group>
      <Group title="Location & capacity">
        <Field
          label="Location"
          name="locationName"
          defaultValue={v("location_name")}
        />
        <Field
          label="Meeting point"
          name="meetingPoint"
          defaultValue={v("meeting_point")}
        />
        <Field
          label="Latitude"
          name="latitude"
          type="number"
          step="any"
          defaultValue={v("latitude")}
          optional
        />
        <Field
          label="Longitude"
          name="longitude"
          type="number"
          step="any"
          defaultValue={v("longitude")}
          optional
        />
        <Field
          label="Minimum guests"
          name="minGuests"
          type="number"
          defaultValue={v("min_guests")}
          optional
        />
        <Field
          label="Maximum guests"
          name="maxGuests"
          type="number"
          defaultValue={v("max_guests")}
          optional
        />
        <Field
          label="Minimum age"
          name="minimumAge"
          type="number"
          defaultValue={v("minimum_age")}
          optional
        />
        <Field
          label="Difficulty"
          name="difficulty"
          defaultValue={v("difficulty")}
          optional
        />
      </Group>
      <Group title="Booking">
        <Field
          label="Booking URL"
          name="bookingUrl"
          type="url"
          defaultValue={v("booking_url")}
          optional
          span
        />
        <Field
          label="Button label"
          name="bookingButtonLabel"
          defaultValue={v("booking_button_label", "Book now")}
        />
      </Group>
      <Group title="Trip details">
        <Area
          label="What's included"
          help="One per line"
          name="inclusions"
          defaultValue={textArray("inclusions")}
        />
        <Area
          label="What's excluded"
          help="One per line"
          name="exclusions"
          defaultValue={textArray("exclusions")}
        />
        <Area
          label="Itinerary"
          help="One step per line: Title | Description | Duration"
          name="itinerary"
          defaultValue={formatItinerary(experience?.itinerary)}
          span
        />
        <Area
          label="FAQ"
          help="One per line: Question | Answer"
          name="faqs"
          defaultValue={formatFaq(experience?.faqs)}
          span
        />
        <Area
          label="Cancellation policy"
          name="cancellationPolicy"
          defaultValue={v("cancellation_policy")}
          span
        />
      </Group>
      <CategoryFields type={experienceType} extra={extra} />
      <Group title="SEO overrides">
        <Field
          label="SEO title"
          name="seoTitle"
          defaultValue={String(seo.title ?? "")}
          span
        />
        <Area
          label="Meta description"
          name="seoDescription"
          defaultValue={String(seo.description ?? "")}
          span
        />
      </Group>
      <div className="sticky bottom-4 flex justify-end gap-3 rounded-2xl border border-white/10 bg-[#07271f]/95 p-3 backdrop-blur-xl">
        <Link
          href={`/dashboard/sites/${siteId}/experiences`}
          className="inline-flex min-h-11 items-center px-4 text-sm text-white/55"
        >
          Cancel
        </Link>
        <button className="min-h-11 rounded-xl bg-[#F5A623] px-6 text-sm font-semibold text-[#173028]">
          Save experience
        </button>
      </div>
    </form>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="glass grid gap-5 rounded-3xl p-6 sm:grid-cols-2">
      <legend className="px-2 text-lg font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}
function Field({
  label,
  name,
  type = "text",
  defaultValue,
  optional,
  span,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  optional?: boolean;
  span?: boolean;
  step?: string;
}) {
  return (
    <label className={`text-sm text-white/70 ${span ? "sm:col-span-2" : ""}`}>
      {label}
      {optional ? " (optional)" : ""}
      <input
        className={input}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        required={!optional}
      />
    </label>
  );
}
function Area({
  label,
  help,
  name,
  defaultValue,
  rows = 4,
  span,
}: {
  label: string;
  help?: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  span?: boolean;
}) {
  return (
    <label className={`text-sm text-white/70 ${span ? "sm:col-span-2" : ""}`}>
      {label}
      {help && <span className="ml-2 text-xs text-white/35">{help}</span>}
      <textarea
        className={`${input} py-3`}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
      />
    </label>
  );
}
function Select({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
}) {
  return (
    <label className="text-sm text-white/70">
      {label}
      <select
        className={input}
        name={name}
        value={onChange ? value : undefined}
        defaultValue={onChange ? undefined : value}
        onChange={
          onChange ? (event) => onChange(event.target.value) : undefined
        }
      >
        {options.map((option) => (
          <option className="text-black" key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CategoryFields({
  type,
  extra,
}: {
  type: string;
  extra: Record<string, unknown>;
}) {
  const configs: Record<
    string,
    Array<[string, string, "text" | "number" | "checkbox"]>
  > = {
    jetski: [
      ["maximumRiders", "Maximum riders", "number"],
      ["driverMinimumAge", "Driver minimum age", "number"],
      ["passengerMinimumAge", "Passenger minimum age", "number"],
      ["licenseRequired", "License required", "checkbox"],
      ["safetyEquipment", "Safety equipment", "text"],
      ["instructorIncluded", "Instructor included", "checkbox"],
    ],
    trekking: [
      ["maximumAltitude", "Maximum altitude", "number"],
      ["accommodation", "Accommodation", "text"],
      ["meals", "Meals", "text"],
      ["guideIncluded", "Guide included", "checkbox"],
      ["permits", "Permits", "text"],
      ["packingInformation", "Packing information", "text"],
    ],
    hiking: [
      ["maximumAltitude", "Maximum altitude", "number"],
      ["guideIncluded", "Guide included", "checkbox"],
      ["packingInformation", "Packing information", "text"],
    ],
    safari: [
      ["pickupIncluded", "Pickup included", "checkbox"],
      ["pickupLocation", "Pickup location", "text"],
      ["vehicleType", "Vehicle type", "text"],
      ["mealInclusion", "Meal inclusion", "text"],
    ],
    boat_rental: [
      ["boatType", "Boat type", "text"],
      ["capacity", "Boat capacity", "number"],
      ["captainIncluded", "Captain included", "checkbox"],
      ["fuelIncluded", "Fuel included", "checkbox"],
    ],
    motorcycle_tour: [
      ["routeSummary", "Route summary", "text"],
      ["distance", "Distance", "text"],
      ["licenseRequired", "License required", "checkbox"],
      ["minimumLicenseYears", "Minimum licence years", "number"],
      ["supportVehicle", "Support vehicle", "checkbox"],
      ["ridingEquipment", "Riding equipment", "text"],
    ],
  };
  const fields = configs[type];
  if (!fields) return null;
  return (
    <Group title="Category-specific details">
      {fields.map(([name, label, fieldType]) =>
        fieldType === "checkbox" ? (
          <label
            className="flex items-center gap-2 self-end pb-3 text-sm"
            key={name}
          >
            <input
              type="checkbox"
              name={`extra_${name}`}
              defaultChecked={Boolean(extra[name])}
            />{" "}
            {label}
          </label>
        ) : (
          <Field
            key={name}
            label={label}
            name={`extra_${name}`}
            type={fieldType}
            defaultValue={extra[name] == null ? "" : String(extra[name])}
            optional
          />
        ),
      )}
    </Group>
  );
}
function formatItinerary(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((item) => {
          const row = item as Record<string, unknown>;
          return [row.title, row.description, row.duration]
            .filter(Boolean)
            .join(" | ");
        })
        .join("\n")
    : "";
}
function formatFaq(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((item) => {
          const row = item as Record<string, unknown>;
          return [row.question, row.answer].filter(Boolean).join(" | ");
        })
        .join("\n")
    : "";
}
