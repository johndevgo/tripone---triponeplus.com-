"use client";

import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Binoculars,
  Check,
  Compass,
  Footprints,
  LoaderCircle,
  Map,
  Mountain,
  Plus,
  Sailboat,
  Ship,
  Trash2,
  Upload,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { themeMarketingImages } from "@/content/marketing-assets";
import {
  businessCapabilities,
  businessTypes,
  rentalProductTypes,
  type BusinessCapability,
  type BusinessType,
  type OnboardingInput,
  type WebsitePageSelection,
} from "@/lib/types";
import { onboardingSchema } from "@/lib/validation";
import {
  businessPresets,
  recommendedPageSelections,
  themes,
} from "@/lib/site-generator";
import { slugify, cn } from "@/lib/utils";
import { buildWebsite, checkSlug } from "@/app/onboarding/actions";

const icons: Record<BusinessCapability, typeof Compass> = {
  jetski: Waves,
  boat_rental: Sailboat,
  day_tour: Map,
  tour_operator: Compass,
  travel_agency: Ship,
  safari: Binoculars,
  trekking: Mountain,
  hiking: Footprints,
  diving: Waves,
  snorkelling: Waves,
  rafting: Waves,
  atv_buggy: Bike,
  adventure_activity: Mountain,
  local_guide: Compass,
  multi_day_tour: Map,
  excursion: Ship,
  water_sports: Waves,
  motorcycle_tour: Bike,
  motorcycle_rental: Bike,
  vehicle_rental: Map,
  equipment_rental: Compass,
  other: Compass,
};
const descriptions: Record<BusinessCapability, string> = {
  jetski: "High-energy guided rides and rentals",
  boat_rental: "Charters, cruises and self-drive rentals",
  day_tour: "Memorable trips completed in a day",
  tour_operator: "Curated tours across one or more regions",
  travel_agency: "Travel packages and trip planning",
  safari: "Wildlife and wilderness journeys",
  trekking: "Multi-stage treks and mountain routes",
  hiking: "Guided walks and trail experiences",
  diving: "Diving courses, trips and charters",
  snorkelling: "Accessible reef and marine outings",
  rafting: "River adventures for every ability",
  atv_buggy: "Off-road motorized experiences",
  adventure_activity: "Outdoor and adrenaline activities",
  local_guide: "Personal, locally led experiences",
  multi_day_tour: "Complete itineraries over several days",
  excursion: "Focused trips from a destination",
  water_sports: "On-water activities and rentals",
  motorcycle_tour: "Guided road and trail journeys",
  motorcycle_rental: "Motorcycles and scooters for hire",
  vehicle_rental: "Cars, jeeps and specialist vehicles",
  equipment_rental: "Outdoor and activity equipment for hire",
  other: "Another kind of tourism business",
};
const capabilityLabels: Record<BusinessCapability, string> = {
  jetski: "Jet Ski Rental",
  boat_rental: "Boat Rental",
  day_tour: "Day Tours",
  tour_operator: "Tour Operator",
  travel_agency: "Travel Agency",
  safari: "Safari",
  trekking: "Trekking",
  hiking: "Hiking",
  diving: "Diving",
  snorkelling: "Snorkelling",
  rafting: "Rafting",
  atv_buggy: "ATV / Buggy",
  adventure_activity: "Adventure Activities",
  local_guide: "Local Guide",
  multi_day_tour: "Multi-Day Tours",
  excursion: "Excursions",
  water_sports: "Water Sports",
  motorcycle_tour: "Motorcycle Tours",
  motorcycle_rental: "Motorcycle Rental",
  vehicle_rental: "Vehicle & Jeep Rental",
  equipment_rental: "Equipment Rental",
  other: "Other",
};
const steps = [
  "Business type",
  "Details",
  "Website structure",
  "Brand",
  "Bookable content",
  "Theme",
  "Review",
];
const detailFields: Array<[keyof OnboardingInput, string]> = [
  ["country", "Country"],
  ["city", "City"],
  ["region", "Region (optional)"],
  ["timezone", "Timezone"],
  ["currency", "Currency (3 letters)"],
  ["phone", "Phone"],
  ["whatsapp", "WhatsApp"],
  ["email", "Business email"],
  ["address", "Address (optional)"],
  ["googleMapsUrl", "Google Maps URL (optional)"],
];
const input =
  "mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-white/[.06] px-3.5 text-white placeholder:text-white/30 focus:border-[#FFC857] focus:outline-none";
const label = "text-sm font-medium text-white/80";

const defaults: OnboardingInput = {
  businessType: "tour_operator",
  capabilities: ["tour_operator"],
  pageSelections: recommendedPageSelections(["tour_operator"]),
  name: "",
  slug: "",
  shortDescription: "",
  country: "",
  city: "",
  region: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  currency: "USD",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  googleMapsUrl: "",
  logoUrl: "",
  brand: { primary: "#063D2E", secondary: "#087A5A", accent: "#F5A623" },
  experiences: [],
  rentals: [],
  themeId: "horizon",
};

export function OnboardingWizard() {
  const router = useRouter();
  const buildRequestActive = useRef(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [building, setBuilding] = useState(false);
  const [slugState, setSlugState] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });
  const {
    register,
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = form;
  const experienceFields = useFieldArray({ control, name: "experiences" });
  const rentalFields = useFieldArray({ control, name: "rentals" });
  const values = useWatch({ control });
  useEffect(() => {
    const stored = localStorage.getItem("tripone-onboarding");
    if (stored) {
      try {
        const value = JSON.parse(stored) as Partial<OnboardingInput>;
        if (!value.pageSelections?.length) {
          const capabilities = value.capabilities?.length
            ? value.capabilities
            : [value.businessType ?? "tour_operator"];
          value.pageSelections = recommendedPageSelections(capabilities);
        }
        if (!value.rentals) value.rentals = [];
        Object.entries(value).forEach(([key, val]) =>
          setValue(key as keyof OnboardingInput, val as never),
        );
      } catch {
        localStorage.removeItem("tripone-onboarding");
      }
    }
  }, [setValue]);
  useEffect(() => {
    // React Hook Form intentionally exposes an imperative subscription for autosave.
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((value) =>
      localStorage.setItem("tripone-onboarding", JSON.stringify(value)),
    );
    return () => subscription.unsubscribe();
  }, [form]);
  const preset =
    businessPresets[(values.businessType as BusinessType) || "other"];
  async function next() {
    setError("");
    let names: (keyof OnboardingInput)[] = [];
    if (step === 0) names = ["businessType", "capabilities"];
    if (step === 1)
      names = [
        "name",
        "slug",
        "shortDescription",
        "country",
        "city",
        "timezone",
        "currency",
        "email",
      ];
    if (step === 2) names = ["pageSelections"];
    if (step === 3) names = ["brand"];
    if (step === 4) names = ["experiences", "rentals"];
    if (step === 5) names = ["themeId"];
    const valid = await trigger(names);
    if (!valid) return;
    if (step === 1) {
      setSlugState("checking");
      const result = await checkSlug(getValues("slug"));
      setSlugState(result.available ? "available" : "taken");
      if (!result.available) {
        setError(result.error || "That site address is already in use.");
        return;
      }
    }
    setStep((s) => Math.min(6, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function create() {
    if (buildRequestActive.current) return;
    buildRequestActive.current = true;
    setBuilding(true);
    setError("");
    const valid = await trigger();
    if (!valid) {
      setError("Please review the highlighted fields.");
      buildRequestActive.current = false;
      setBuilding(false);
      return;
    }
    const submission = getValues();
    localStorage.setItem("tripone-onboarding", JSON.stringify(submission));
    const result = await buildWebsite(submission);
    if (!result.ok || !result.siteId) {
      setError(result.error || "Could not create your website.");
      buildRequestActive.current = false;
      setBuilding(false);
      return;
    }
    localStorage.removeItem("tripone-onboarding");
    router.push(`/dashboard/sites/${result.siteId}/created`);
    router.refresh();
  }
  async function uploadFile(file?: File) {
    if (!file) return undefined;
    setError("");
    const data = new FormData();
    data.set("file", file);
    data.set("siteId", "pending");
    const response = await fetch("/api/media", { method: "POST", body: data });
    const body = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !body.url) {
      setError(body.error || "Upload failed.");
      return undefined;
    }
    return body.url;
  }
  async function uploadLogo(file?: File) {
    const url = await uploadFile(file);
    if (url) setValue("logoUrl", url, { shouldDirty: true });
  }
  async function uploadExperience(index: number, file?: File) {
    const url = await uploadFile(file);
    if (url)
      setValue(`experiences.${index}.featuredImageUrl`, url, {
        shouldDirty: true,
      });
  }
  async function uploadRental(index: number, file?: File) {
    const url = await uploadFile(file);
    if (url)
      setValue(`rentals.${index}.featuredImageUrl`, url, {
        shouldDirty: true,
      });
  }
  function businessName(value: string) {
    const previousGeneratedSlug = slugify(getValues("name"));
    const currentSlug = getValues("slug");
    setValue("name", value, { shouldValidate: true });
    if (!currentSlug || currentSlug === previousGeneratedSlug)
      setValue("slug", slugify(value), { shouldValidate: true });
    setSlugState("idle");
  }
  function businessSlug(value: string) {
    setValue("slug", slugify(value), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setSlugState("idle");
  }
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-white/45">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <span>{steps[step]}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#F5A623] transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <section className="glass rounded-[1.75rem] p-5 sm:p-8 lg:p-10">
        {step === 0 && (
          <BusinessStep
            value={values.businessType as BusinessType}
            selected={(values.capabilities as BusinessCapability[]) ?? []}
            selectPrimary={(v) => {
              setValue("businessType", v, { shouldValidate: true });
              const current = (getValues("capabilities") ??
                []) as BusinessCapability[];
              if (!current.includes(v))
                setValue("capabilities", [...current, v], {
                  shouldValidate: true,
                });
              if (!current.includes(v))
                setValue(
                  "pageSelections",
                  recommendedPageSelections([...current, v]),
                );
            }}
            toggle={(v) => {
              const current = (getValues("capabilities") ??
                []) as BusinessCapability[];
              const next = current.includes(v)
                ? current.filter((item) => item !== v)
                : [...current, v];
              if (v === getValues("businessType") && !next.includes(v)) return;
              setValue("capabilities", next, { shouldValidate: true });
              setValue("pageSelections", recommendedPageSelections(next));
            }}
          />
        )}{" "}
        {step === 1 && (
          <DetailsStep
            register={register}
            errors={errors}
            name={values.name || ""}
            slug={values.slug || ""}
            onName={businessName}
            onSlug={businessSlug}
            slugState={slugState}
          />
        )}{" "}
        {step === 2 && (
          <StructureStep
            capabilities={(values.capabilities as BusinessCapability[]) ?? []}
            value={(values.pageSelections as WebsitePageSelection[]) ?? []}
            change={(next) =>
              setValue("pageSelections", next, { shouldValidate: true })
            }
          />
        )}{" "}
        {step === 3 && (
          <BrandStep
            register={register}
            logo={values.logoUrl}
            upload={uploadLogo}
          />
        )}{" "}
        {step === 4 && (
          <ExperienceStep
            register={register}
            fields={experienceFields.fields}
            append={experienceFields.append}
            remove={experienceFields.remove}
            currency={values.currency || "USD"}
            preset={preset}
            upload={uploadExperience}
            rentalFields={rentalFields.fields}
            appendRental={rentalFields.append}
            removeRental={rentalFields.remove}
            uploadRental={uploadRental}
          />
        )}{" "}
        {step === 5 && (
          <ThemeStep
            value={values.themeId}
            select={(v) => setValue("themeId", v, { shouldValidate: true })}
          />
        )}{" "}
        {step === 6 && <Review values={getValues()} preset={preset} />}{" "}
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-100"
          >
            {error}
          </p>
        )}
        <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => (step ? setStep(step - 1) : router.push("/"))}
          >
            <ArrowLeft size={17} />
            {step ? "Back" : "Exit"}
          </Button>
          {step < 6 ? (
            <Button type="button" onClick={next}>
              Next <ArrowRight size={17} />
            </Button>
          ) : (
            <Button type="button" onClick={create} disabled={building}>
              {building ? (
                <LoaderCircle className="animate-spin" size={17} />
              ) : (
                <Compass size={17} />
              )}
              Build My Website
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function Title({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#FFC857]">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-white/55">{copy}</p>
    </div>
  );
}
function BusinessStep({
  value,
  selected,
  selectPrimary,
  toggle,
}: {
  value: BusinessType;
  selected: BusinessCapability[];
  selectPrimary: (v: BusinessType) => void;
  toggle: (v: BusinessCapability) => void;
}) {
  return (
    <>
      <Title
        eyebrow="Start with your structure"
        title="What kind of business are you building a website for?"
        copy="Select every service line you offer. Your primary service shapes the initial terminology and recommendations."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {businessCapabilities.map((type) => {
          const Icon = icons[type];
          const active = selected.includes(type);
          const primary = value === type;
          return (
            <div
              key={type}
              className={cn(
                "min-h-40 rounded-2xl border p-5 text-left transition",
                active
                  ? "border-[#FFC857] bg-[#FFC857]/10 shadow-[inset_0_0_0_1px_rgba(255,200,87,.25)]"
                  : "border-white/10 bg-white/[.035] hover:border-white/25 hover:bg-white/[.06]",
              )}
            >
              <button
                type="button"
                aria-pressed={active}
                onClick={() => toggle(type)}
                className="block w-full text-left"
              >
                <div className="flex justify-between">
                  <Icon
                    className={active ? "text-[#FFC857]" : "text-emerald-300"}
                  />
                  {active && <Check size={18} className="text-[#FFC857]" />}
                </div>
                <h2 className="mt-5 font-semibold">{capabilityLabels[type]}</h2>
                <p className="mt-1.5 text-xs leading-5 text-white/45">
                  {descriptions[type]}
                </p>
              </button>
              {businessTypes.includes(type as BusinessType) && (
                <button
                  type="button"
                  onClick={() => selectPrimary(type as BusinessType)}
                  className={`mt-3 text-xs font-medium ${primary ? "text-[#FFC857]" : "text-white/40 hover:text-white"}`}
                >
                  {primary ? "Primary service" : "Make primary"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
type Register = ReturnType<typeof useForm<OnboardingInput>>["register"];
function ErrorText({ children }: { children?: string }) {
  return children ? (
    <span className="mt-1 block text-xs text-red-200">{children}</span>
  ) : null;
}
function DetailsStep({
  register,
  errors,
  name,
  slug,
  onName,
  onSlug,
  slugState,
}: {
  register: Register;
  errors: ReturnType<typeof useForm<OnboardingInput>>["formState"]["errors"];
  name: string;
  slug: string;
  onName: (v: string) => void;
  onSlug: (v: string) => void;
  slugState: string;
}) {
  return (
    <>
      <Title
        eyebrow="Business details"
        title="Give your website the essentials."
        copy="We use these facts to create truthful page copy, contact details, local metadata and your published fallback address."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Business name
          <input
            {...register("name")}
            value={name}
            onChange={(e) => onName(e.target.value)}
            className={input}
          />
          <ErrorText>{errors.name?.message}</ErrorText>
        </label>
        <label className={label}>
          Site slug
          <input
            {...register("slug")}
            value={slug}
            onChange={(event) => onSlug(event.target.value)}
            className={input}
          />
          <span className="mt-1.5 block text-xs text-white/40">
            {slugState === "available"
              ? "Available · "
              : slugState === "checking"
                ? "Checking · "
                : ""}
            tools.neurerohan.com.np/s/{slug || valuesafe(name)}
          </span>
          <ErrorText>{errors.slug?.message}</ErrorText>
        </label>
        <label className={`${label} sm:col-span-2`}>
          Short description
          <textarea
            {...register("shortDescription")}
            rows={3}
            className={`${input} py-3`}
          />
          <ErrorText>{errors.shortDescription?.message}</ErrorText>
        </label>
        {detailFields.map(([key, text]) => (
          <label className={label} key={key}>
            {text}
            <input
              {...register(key as keyof OnboardingInput)}
              type={key === "email" ? "email" : "text"}
              className={input}
            />
            <ErrorText>
              {String(
                (errors as Record<string, { message?: string }>)[key]
                  ?.message || "",
              )}
            </ErrorText>
          </label>
        ))}
      </div>
    </>
  );
}
function valuesafe(name: string) {
  return slugify(name) || "your-business";
}
function StructureStep({
  capabilities,
  value,
  change,
}: {
  capabilities: BusinessCapability[];
  value: WebsitePageSelection[];
  change: (value: WebsitePageSelection[]) => void;
}) {
  const pages = value.length ? value : recommendedPageSelections(capabilities);
  const update = (
    key: WebsitePageSelection["key"],
    patch: Partial<WebsitePageSelection>,
  ) =>
    change(
      pages.map((page) => (page.key === key ? { ...page, ...patch } : page)),
    );
  const sectionOptions = [
    "hero",
    "featuredExperiences",
    "experienceGrid",
    "rentalGrid",
    "features",
    "destinations",
    "gallery",
    "testimonials",
    "faq",
    "contact",
    "finalCta",
  ] as const;
  return (
    <>
      <Title
        eyebrow="Website structure"
        title="Choose the pages your business needs."
        copy="Home is required. Every other recommendation can be removed, renamed, hidden from navigation, or given a different starting section recipe."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {pages.map((page) => (
          <article
            key={page.key}
            className={cn(
              "rounded-2xl border p-5",
              page.selected
                ? "border-[#FFC857]/40 bg-[#FFC857]/[.06]"
                : "border-white/10 bg-white/[.025]",
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-3 font-semibold">
                <input
                  type="checkbox"
                  checked={page.selected}
                  disabled={page.key === "home"}
                  onChange={(event) =>
                    update(page.key, { selected: event.target.checked })
                  }
                  className="size-4 accent-[#F5A623]"
                />
                {page.title}
              </label>
              <span className="text-[11px] uppercase tracking-wider text-white/30">
                {page.key === "home" ? "Required" : "Optional"}
              </span>
            </div>
            {page.selected && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-white/50">
                  Navigation label
                  <input
                    value={page.title}
                    onChange={(event) =>
                      update(page.key, { title: event.target.value })
                    }
                    className={input}
                  />
                </label>
                <label className="text-xs text-white/50">
                  Path
                  <input
                    value={page.slug}
                    disabled={page.key === "home"}
                    onChange={(event) =>
                      update(page.key, { slug: slugify(event.target.value) })
                    }
                    className={input}
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-white/55 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={page.showInNavigation}
                    onChange={(event) =>
                      update(page.key, {
                        showInNavigation: event.target.checked,
                      })
                    }
                  />{" "}
                  Show in navigation
                </label>
                <details className="sm:col-span-2">
                  <summary className="cursor-pointer text-xs text-white/50">
                    Starting sections ({page.sections.length})
                  </summary>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {sectionOptions.map((section) => (
                      <label
                        key={section}
                        className="flex items-center gap-2 text-xs text-white/50"
                      >
                        <input
                          type="checkbox"
                          checked={page.sections.includes(section)}
                          onChange={(event) =>
                            update(page.key, {
                              sections: event.target.checked
                                ? [...page.sections, section]
                                : page.sections.filter(
                                    (item) => item !== section,
                                  ),
                            })
                          }
                        />
                        {section.replace(/([A-Z])/g, " $1")}
                      </label>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}

function BrandStep({
  register,
  logo,
  upload,
}: {
  register: Register;
  logo?: string;
  upload: (file?: File) => void;
}) {
  return (
    <>
      <Title
        eyebrow="Brand direction"
        title="Make it recognizably yours."
        copy="Upload a logo and refine the palette, or keep our balanced emerald and gold defaults."
      />
      <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <label className="grid min-h-64 cursor-pointer place-items-center rounded-3xl border border-dashed border-white/20 bg-white/[.035] p-6 text-center hover:bg-white/[.06]">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => upload(e.target.files?.[0])}
          />
          {logo ? (
            // User-provided remote URLs are rendered directly to avoid widening Next's image proxy allowlist.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt="Uploaded logo preview"
              className="max-h-40 max-w-full object-contain"
            />
          ) : (
            <div>
              <Upload className="mx-auto text-[#FFC857]" />
              <p className="mt-4 font-medium">Upload your logo</p>
              <p className="mt-2 text-xs text-white/45">
                JPG, PNG, WebP or AVIF · 10 MB max
              </p>
            </div>
          )}
        </label>
        <div className="grid content-start gap-5">
          {[
            ["brand.primary", "Primary colour"],
            ["brand.secondary", "Secondary colour"],
            ["brand.accent", "Accent colour"],
          ].map(([key, text]) => (
            <label
              className={`${label} flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-4`}
              key={key}
            >
              <span>{text}</span>
              <input
                {...register(key as "brand.primary")}
                type="color"
                className="size-12 cursor-pointer rounded-lg border-0 bg-transparent"
              />
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
function ExperienceStep({
  register,
  fields,
  append,
  remove,
  currency,
  preset,
  upload,
  rentalFields,
  appendRental,
  removeRental,
  uploadRental,
}: {
  register: Register;
  fields: Array<{ id: string }>;
  append: (v: OnboardingInput["experiences"][number]) => void;
  remove: (i: number) => void;
  currency: string;
  preset: (typeof businessPresets)[BusinessType];
  upload: (index: number, file?: File) => void;
  rentalFields: Array<{ id: string }>;
  appendRental: (v: OnboardingInput["rentals"][number]) => void;
  removeRental: (i: number) => void;
  uploadRental: (index: number, file?: File) => void;
}) {
  return (
    <>
      <Title
        eyebrow={`Add ${preset.plural}`}
        title={`What can guests book with you?`}
        copy={`Add one or more ${preset.plural}, or skip this step and add them later from the dashboard.`}
      />
      <div className="grid gap-4">
        {fields.map((field, index) => (
          <article
            key={field.id}
            className="rounded-2xl border border-white/10 bg-white/[.035] p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold">
                {preset.singular[0]?.toUpperCase()}
                {preset.singular.slice(1)} {index + 1}
              </h2>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove experience"
                className="rounded-lg p-2 text-white/40 hover:bg-red-400/10 hover:text-red-200"
              >
                <Trash2 size={17} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className={`${label} sm:col-span-2`}>
                Name
                <input
                  {...register(`experiences.${index}.name`)}
                  className={input}
                />
              </label>
              <label className={label}>
                Type
                <input
                  {...register(`experiences.${index}.experienceType`)}
                  defaultValue={preset.singular}
                  className={input}
                />
              </label>
              <label className={label}>
                Price from
                <input
                  {...register(`experiences.${index}.priceFrom`, {
                    setValueAs: (value) =>
                      value == null || value === "" ? null : Number(value),
                  })}
                  type="number"
                  min="0"
                  className={input}
                />
              </label>
              <label className={label}>
                Currency
                <input
                  {...register(`experiences.${index}.currency`)}
                  defaultValue={currency}
                  className={input}
                />
              </label>
              <label className={label}>
                Duration
                <input
                  {...register(`experiences.${index}.durationValue`, {
                    setValueAs: (value) =>
                      value == null || value === "" ? null : Number(value),
                  })}
                  type="number"
                  min="0"
                  className={input}
                />
              </label>
              <label className={label}>
                Unit
                <select
                  {...register(`experiences.${index}.durationUnit`)}
                  className={input}
                >
                  <option className="text-black" value="hours">
                    Hours
                  </option>
                  <option className="text-black" value="minutes">
                    Minutes
                  </option>
                  <option className="text-black" value="days">
                    Days
                  </option>
                </select>
              </label>
              <label className={label}>
                Location
                <input
                  {...register(`experiences.${index}.locationName`)}
                  className={input}
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Short description
                <textarea
                  {...register(`experiences.${index}.shortDescription`)}
                  rows={2}
                  className={`${input} py-3`}
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Booking URL
                <input
                  {...register(`experiences.${index}.bookingUrl`)}
                  type="url"
                  className={input}
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Featured image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className={`${input} cursor-pointer py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-[#F5A623] file:px-3 file:py-1.5 file:font-semibold file:text-[#173028]`}
                  onChange={(event) => upload(index, event.target.files?.[0])}
                />
              </label>
              {preset.experienceFields.map((field) => (
                <label className={label} key={field}>
                  {fieldLabel(field)}
                  <input
                    {...register(`experiences.${index}.extraDetails.${field}`)}
                    className={input}
                  />
                </label>
              ))}
            </div>
          </article>
        ))}
        <button
          type="button"
          onClick={() =>
            append({
              name: "",
              experienceType: preset.singular,
              shortDescription: "",
              currency,
              priceFrom: null,
              durationValue: null,
              durationUnit: "hours",
              locationName: "",
              bookingUrl: "",
              featuredImageUrl: "",
              extraDetails: {},
            })
          }
          className="flex min-h-24 items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 text-sm font-medium text-white/65 hover:border-[#FFC857]/60 hover:bg-white/[.04]"
        >
          <Plus size={18} />
          Add {preset.singular}
        </button>
      </div>
      <div className="my-8 border-t border-white/10" />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#FFC857]">
          Rental products
        </p>
        <h2 className="mt-2 text-2xl font-semibold">
          What can guests rent from you?
        </h2>
        <p className="mt-2 text-sm text-white/45">
          Keep physical rentals separate from guided experiences. You can skip
          this and add inventory later.
        </p>
      </div>
      <div className="grid gap-4">
        {rentalFields.map((field, index) => (
          <article
            key={field.id}
            className="rounded-2xl border border-white/10 bg-white/[.035] p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold">Rental {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeRental(index)}
                aria-label="Remove rental"
                className="rounded-lg p-2 text-white/40 hover:bg-red-400/10 hover:text-red-200"
              >
                <Trash2 size={17} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className={`${label} sm:col-span-2`}>
                Name
                <input
                  {...register(`rentals.${index}.name`)}
                  className={input}
                />
              </label>
              <label className={label}>
                Rental type
                <select
                  {...register(`rentals.${index}.rentalType`)}
                  className={input}
                >
                  {rentalProductTypes.map((type) => (
                    <option className="text-black" value={type} key={type}>
                      {fieldLabel(type)}
                    </option>
                  ))}
                </select>
              </label>
              <label className={label}>
                Currency
                <input
                  {...register(`rentals.${index}.currency`)}
                  className={input}
                />
              </label>
              <label className={label}>
                Starting rate
                <input
                  {...register(`rentals.${index}.rateAmount`, {
                    setValueAs: (value) =>
                      value == null || value === "" ? null : Number(value),
                  })}
                  type="number"
                  min="0"
                  step="0.01"
                  className={input}
                />
              </label>
              <label className={label}>
                Rate unit
                <select
                  {...register(`rentals.${index}.rateUnit`)}
                  className={input}
                >
                  {(["hour", "day", "week"] as const).map((unit) => (
                    <option className="text-black" value={unit} key={unit}>
                      Per {unit}
                    </option>
                  ))}
                </select>
              </label>
              <label className={`${label} flex items-end gap-2 pb-3`}>
                <input
                  {...register(`rentals.${index}.quoteOnly`)}
                  type="checkbox"
                  className="size-4 accent-[#F5A623]"
                />
                Request a quote
              </label>
              <label className={label}>
                Location
                <input
                  {...register(`rentals.${index}.locationName`)}
                  className={input}
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Short description
                <textarea
                  {...register(`rentals.${index}.shortDescription`)}
                  rows={2}
                  className={`${input} py-3`}
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Booking URL
                <input
                  {...register(`rentals.${index}.bookingUrl`)}
                  type="url"
                  className={input}
                />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Featured image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className={`${input} cursor-pointer py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-[#F5A623] file:px-3 file:py-1.5 file:font-semibold file:text-[#173028]`}
                  onChange={(event) =>
                    uploadRental(index, event.target.files?.[0])
                  }
                />
              </label>
            </div>
          </article>
        ))}
        <button
          type="button"
          onClick={() =>
            appendRental({
              name: "",
              rentalType: "equipment",
              shortDescription: "",
              currency,
              quoteOnly: true,
              rateAmount: null,
              rateUnit: "day",
              locationName: "",
              bookingUrl: "",
              featuredImageUrl: "",
            })
          }
          className="flex min-h-24 items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 text-sm font-medium text-white/65 hover:border-[#FFC857]/60 hover:bg-white/[.04]"
        >
          <Plus size={18} /> Add rental product
        </button>
      </div>
    </>
  );
}
function fieldLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}
function ThemeStep({
  value,
  select,
}: {
  value?: string;
  select: (v: OnboardingInput["themeId"]) => void;
}) {
  return (
    <>
      <Title
        eyebrow="Choose a theme"
        title="Select the character of your website."
        copy="All eight themes share the same accessible renderer. You can refine design tokens later."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {Object.values(themes).map((theme) => {
          const active = value === theme.id;
          return (
            <button
              type="button"
              aria-pressed={active}
              aria-label={`Choose ${theme.name} theme`}
              onClick={() => select(theme.id)}
              key={theme.id}
              className={cn(
                "overflow-hidden rounded-3xl border text-left transition",
                active
                  ? "border-[#FFC857] shadow-[0_0_0_1px_rgba(255,200,87,.3)]"
                  : "border-white/10 hover:border-white/25",
              )}
            >
              <div className="relative h-52 overflow-hidden p-4">
                <Image
                  src={themeMarketingImages[theme.id]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(0deg,${theme.colors.primary}e8,${theme.colors.primary}25)`,
                  }}
                />
                <div className="relative h-full rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex justify-between">
                    <div className="h-2 w-20 rounded bg-white/80" />
                    {active && (
                      <span className="grid size-7 place-items-center rounded-full bg-[#FFC857] text-[#063D2E]">
                        <Check size={15} />
                      </span>
                    )}
                  </div>
                  <div className="mt-16 h-5 w-3/5 rounded bg-white" />
                  <div className="mt-3 h-2 w-4/5 rounded bg-white/40" />
                  <div
                    className="mt-5 h-8 w-24 rounded-lg"
                    style={{ background: theme.colors.accent }}
                  />
                </div>
              </div>
              <div className="bg-white/[.055] p-5">
                <h2 className="text-lg font-semibold uppercase tracking-wide">
                  {theme.name}
                </h2>
                <p className="mt-1 text-sm text-white/45">
                  {theme.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
function Review({
  values,
  preset,
}: {
  values: OnboardingInput;
  preset: (typeof businessPresets)[BusinessType];
}) {
  return (
    <>
      <Title
        eyebrow="Ready to build"
        title="Review your website foundation."
        copy="TripOne+ will create these records atomically as a draft. You can preview everything before it is published."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <ReviewCard title="Business">
          <p className="text-xl font-semibold">{values.name}</p>
          <p>
            {preset.label} · {values.city}, {values.country}
          </p>
          <p className="mt-3">{values.shortDescription}</p>
        </ReviewCard>
        <ReviewCard title="Design">
          <p className="text-xl font-semibold">{themes[values.themeId].name}</p>
          <div className="mt-4 flex gap-2">
            {Object.values(values.brand).map((c) => (
              <span
                key={c}
                className="size-8 rounded-full border border-white/20"
                style={{ background: c }}
              />
            ))}
          </div>
        </ReviewCard>
        <ReviewCard title={`${values.experiences.length} ${preset.plural}`}>
          <div className="space-y-2">
            {values.experiences.length ? (
              values.experiences.map((e) => (
                <p className="flex items-center gap-2" key={e.name}>
                  <Check size={15} className="text-[#FFC857]" />
                  {e.name}
                </p>
              ))
            ) : (
              <p>Add your first {preset.singular} from the dashboard later.</p>
            )}
          </div>
        </ReviewCard>
        <ReviewCard title={`${values.rentals.length} rental products`}>
          <div className="space-y-2">
            {values.rentals.length ? (
              values.rentals.map((rental) => (
                <p className="flex items-center gap-2" key={rental.name}>
                  <Check size={15} className="text-[#FFC857]" />
                  {rental.name}
                </p>
              ))
            ) : (
              <p>Add rental inventory from the dashboard later.</p>
            )}
          </div>
        </ReviewCard>
        <ReviewCard title="Proposed website">
          <p className="font-medium text-[#FFC857]">
            tools.neurerohan.com.np/s/{values.slug}
          </p>
          <p className="mt-3">
            Pages:{" "}
            {values.pageSelections
              .filter((page) => page.selected)
              .map((page) => page.title)
              .join(", ")}
          </p>
        </ReviewCard>
      </div>
    </>
  );
}
function ReviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[.04] p-6 text-sm leading-6 text-white/55">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.18em] text-white/35">
        {title}
      </h2>
      {children}
    </article>
  );
}
