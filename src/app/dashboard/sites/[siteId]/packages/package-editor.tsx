import Link from "next/link";
import { ArrowLeft, Copy, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { duplicatePackage, savePackage } from "../operations-actions";
import { Feedback } from "../bookings/page";
import {
  FaqRepeater,
  ItineraryRepeater,
  PackageItemsRepeater,
} from "./package-repeaters";

type PackageItemValue = {
  day_number?: number;
  experience_id?: string | null;
  rental_product_id?: string | null;
  title?: string;
  description?: string;
  optional?: boolean;
};
type ItineraryDay = {
  title?: string;
  description?: string;
  accommodation?: string;
  meals?: string;
  distance?: string;
  hours?: string;
};
type FaqValue = { question?: string; answer?: string };
type PackageValue = Record<string, unknown> & {
  id: string;
  package_items?: PackageItemValue[];
};

const field =
  "min-h-11 w-full rounded-xl border border-white/10 bg-white/[.055] px-3 outline-none transition focus:border-[#FFC857]/70 focus:ring-2 focus:ring-[#FFC857]/15";

export async function PackageEditor({
  siteId,
  value,
  message,
  error,
}: {
  siteId: string;
  value?: PackageValue;
  message?: string;
  error?: string;
}) {
  const supabase = await createClient();
  const [{ data: experiences }, { data: rentals }] = await Promise.all([
    supabase
      .from("experiences")
      .select("id,name")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("rental_products")
      .select("id,name")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
  ]);
  const itinerary = Array.isArray(value?.itinerary)
    ? (value.itinerary as ItineraryDay[])
    : [];
  const faqs = Array.isArray(value?.faqs) ? (value.faqs as FaqValue[]) : [];
  const details =
    value?.details && typeof value.details === "object"
      ? (value.details as Record<string, unknown>)
      : {};
  const lines = (key: string) =>
    Array.isArray(value?.[key]) ? (value[key] as string[]).join("\n") : "";

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href={`/dashboard/sites/${siteId}/packages`}
        className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
      >
        <ArrowLeft size={16} /> Packages
      </Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#FFC857]">
            Package workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            {value ? "Edit package" : "Create a package"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Compose existing services, day plans, practical details, imagery and
            search metadata in one reusable product.
          </p>
        </div>
        {value && (
          <form action={duplicatePackage}>
            <input type="hidden" name="siteId" value={siteId} />
            <input type="hidden" name="packageId" value={value.id} />
            <button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-sm text-white/65 transition hover:bg-white/[.06] hover:text-white">
              <Copy size={16} /> Duplicate as draft
            </button>
          </form>
        )}
      </div>
      <Feedback message={message} error={error} />
      <nav
        aria-label="Package editor sections"
        className="sticky top-3 z-20 mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-[#08241d]/90 p-1.5 shadow-xl backdrop-blur-xl"
      >
        {[
          ["overview", "Overview"],
          ["sales", "Sales"],
          ["contents", "Contents"],
          ["itinerary", "Itinerary"],
          ["details", "Details"],
          ["media", "Media"],
          ["seo", "SEO & publish"],
        ].map(([anchor, label]) => (
          <a
            key={anchor}
            href={`#${anchor}`}
            className="shrink-0 rounded-xl px-3 py-2 text-xs font-medium text-white/55 transition hover:bg-white/[.07] hover:text-white"
          >
            {label}
          </a>
        ))}
      </nav>

      <form action={savePackage} className="mt-6 grid gap-6">
        <input type="hidden" name="siteId" value={siteId} />
        <input type="hidden" name="id" value={value?.id ?? ""} />

        <Panel id="overview" title="Overview & sales copy">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Package name"
              name="name"
              required
              value={String(value?.name ?? "")}
            />
            <Field
              label="URL slug"
              name="slug"
              value={String(value?.slug ?? "")}
              helper="Lowercase words separated with hyphens."
            />
            <label className="text-sm sm:col-span-2">
              Short description
              <textarea
                name="shortDescription"
                required
                maxLength={280}
                defaultValue={String(value?.short_description ?? "")}
                rows={3}
                className={`${field} mt-2 py-3`}
              />
              <span className="mt-1 block text-xs text-white/35">
                A concise promise for cards and search previews.
              </span>
            </label>
            <label className="text-sm sm:col-span-2">
              Full description
              <textarea
                name="description"
                maxLength={20000}
                defaultValue={String(value?.description ?? "")}
                rows={8}
                className={`${field} mt-2 py-3`}
              />
            </label>
          </div>
        </Panel>

        <Panel id="sales" title="Pricing & booking">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Duration (days)"
              name="durationDays"
              type="number"
              min="1"
              value={String(value?.duration_days ?? "")}
            />
            <Field
              label="Starting price"
              name="priceFrom"
              type="number"
              min="0"
              step="0.01"
              value={String(value?.price_from ?? "")}
            />
            <Field
              label="Currency"
              name="currency"
              required
              maxLength={3}
              value={String(value?.currency ?? "USD")}
            />
            <Field
              label="Pricing label"
              name="pricingLabel"
              value={String(value?.pricing_label ?? "From")}
            />
            <label className="text-sm">
              Booking mode
              <select
                name="bookingMode"
                defaultValue={String(value?.booking_mode ?? "request")}
                className={`${field} mt-2`}
              >
                <option value="request">Booking request</option>
                <option value="enquiry">Enquiry</option>
                <option value="external">External URL</option>
              </select>
            </label>
            <Field
              label="Button label"
              name="bookingButtonLabel"
              required
              maxLength={60}
              value={String(
                value?.booking_button_label ?? "Request this package",
              )}
            />
            <Field
              label="External booking URL"
              name="bookingUrl"
              type="url"
              value={String(value?.booking_url ?? "")}
              span
            />
          </div>
        </Panel>

        <Panel
          id="contents"
          title="Package contents"
          copy="Reference an existing service or add package-only items such as transfers, hotels or meals."
        >
          <PackageItemsRepeater
            initialItems={value?.package_items ?? []}
            experiences={experiences ?? []}
            rentals={rentals ?? []}
          />
        </Panel>

        <Panel
          id="itinerary"
          title="Day-by-day itinerary"
          copy="Build the readable trip story and include details guests need to compare options."
        >
          <ItineraryRepeater initialDays={itinerary} />
        </Panel>

        <Panel id="details" title="Trip facts, inclusions & policies">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ["startPoint", "Starts in"],
                ["endPoint", "Ends in"],
                ["difficulty", "Difficulty"],
                ["bestSeason", "Best season"],
                ["groupSize", "Group size"],
                ["maxAltitude", "Maximum altitude"],
                ["accommodation", "Accommodation"],
                ["meals", "Meals"],
              ] as Array<[string, string]>
            ).map(([name, label]) => (
              <Field
                key={name}
                name={name}
                label={label}
                value={String(details[name] ?? "")}
              />
            ))}
          </div>
          <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
            {(
              [
                ["highlights", "Highlights"],
                ["inclusions", "Inclusions"],
                ["exclusions", "Exclusions"],
                ["policies", "Policies"],
              ] as Array<[string, string]>
            ).map(([name, label]) => (
              <label key={name} className="text-sm">
                {label}
                <textarea
                  name={name}
                  defaultValue={lines(name)}
                  rows={5}
                  placeholder="One item per line"
                  className={`${field} mt-2 py-3`}
                />
              </label>
            ))}
          </div>
          <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="font-semibold">Frequently asked questions</h3>
            <p className="mt-1 text-sm text-white/40">
              Answer practical questions before they become booking friction.
            </p>
            <div className="mt-4">
              <FaqRepeater initialFaqs={faqs} />
            </div>
          </div>
        </Panel>

        <Panel
          id="media"
          title="Package media"
          copy="Use high-resolution landscape images with honest alt-worthy subject matter."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Featured image URL"
              name="featuredImageUrl"
              type="url"
              value={String(value?.featured_image_url ?? "")}
              span
            />
            <label className="text-sm sm:col-span-2">
              Gallery image URLs
              <textarea
                name="galleryUrls"
                defaultValue={lines("gallery")}
                rows={6}
                placeholder="One image URL per line"
                className={`${field} mt-2 py-3`}
              />
            </label>
          </div>
        </Panel>

        <Panel id="seo" title="SEO & publishing">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="SEO title"
              name="seoTitle"
              maxLength={70}
              value={String(
                (value?.seo_settings as Record<string, unknown> | undefined)
                  ?.title ?? "",
              )}
            />
            <Field
              label="Meta description"
              name="seoDescription"
              maxLength={180}
              value={String(
                (value?.seo_settings as Record<string, unknown> | undefined)
                  ?.description ?? "",
              )}
            />
            <label className="text-sm">
              Status
              <select
                name="status"
                defaultValue={String(value?.status ?? "draft")}
                className={`${field} mt-2`}
              >
                <option value="draft">Draft</option>
                <option value="published">Active</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="flex items-center gap-2 self-end rounded-xl border border-white/10 px-3 py-3 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={Boolean(value?.featured)}
                className="size-4 accent-[#F5A623]"
              />
              Feature this package on the website
            </label>
          </div>
        </Panel>

        <div className="sticky bottom-4 z-20 flex justify-end">
          <button className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#F5A623] px-6 font-semibold text-[#173028] shadow-xl transition hover:bg-[#FFC857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC857]">
            <Save size={18} /> Save package
          </button>
        </div>
      </form>
    </div>
  );
}

function Panel({
  id,
  title,
  copy,
  children,
}: {
  id: string;
  title: string;
  copy?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="glass scroll-mt-24 rounded-3xl p-5 sm:p-7">
      <h2 className="text-lg font-semibold">{title}</h2>
      {copy && (
        <p className="mt-1 max-w-3xl text-sm leading-6 text-white/40">{copy}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  required,
  span,
  helper,
  min,
  step,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  span?: boolean;
  helper?: string;
  min?: string;
  step?: string;
  maxLength?: number;
}) {
  return (
    <label className={`text-sm ${span ? "sm:col-span-2" : ""}`}>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={value}
        min={min}
        step={step}
        maxLength={maxLength}
        className={`${field} mt-2`}
      />
      {helper && (
        <span className="mt-1 block text-xs text-white/35">{helper}</span>
      )}
    </label>
  );
}
