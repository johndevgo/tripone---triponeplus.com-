import { z } from "zod";

export const businessTypes = [
  "jetski",
  "boat_rental",
  "day_tour",
  "tour_operator",
  "travel_agency",
  "safari",
  "trekking",
  "hiking",
  "diving",
  "snorkelling",
  "rafting",
  "atv_buggy",
  "adventure_activity",
  "local_guide",
  "multi_day_tour",
  "excursion",
  "water_sports",
  "other",
] as const;
export type BusinessType = (typeof businessTypes)[number];

export const businessCapabilities = [
  ...businessTypes,
  "motorcycle_tour",
  "motorcycle_rental",
  "vehicle_rental",
  "equipment_rental",
] as const;
export type BusinessCapability = (typeof businessCapabilities)[number];

export const rentalProductTypes = [
  "motorcycle",
  "scooter",
  "jet_ski",
  "boat",
  "buggy",
  "jeep",
  "bicycle",
  "equipment",
  "other",
] as const;
export type RentalProductType = (typeof rentalProductTypes)[number];

export const taxonomyTypes = [
  "activity",
  "destination",
  "travel_style",
  "package_category",
  "product_category",
] as const;
export type TaxonomyType = (typeof taxonomyTypes)[number];

export const themeIds = [
  "horizon",
  "luxe-voyage",
  "wild-current",
  "atlas",
  "summit",
  "marina",
  "dune",
  "nomad",
] as const;
export type ThemeId = (typeof themeIds)[number];

export const sectionTypes = [
  "hero",
  "trustBar",
  "featuredExperiences",
  "experienceGrid",
  "rentalGrid",
  "destinations",
  "whyChooseUs",
  "features",
  "safety",
  "gallery",
  "testimonials",
  "stats",
  "guides",
  "richText",
  "location",
  "faq",
  "contact",
  "finalCta",
  "wildlifeHighlights",
  "popularDestinations",
  "difficultyOverview",
  "featuredPackages",
  "specialOffers",
  "whyTravelWithUs",
  "logoRow",
  "video",
  "divider",
] as const;

export const sectionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(sectionTypes),
  variant: z.string().min(1),
  visible: z.boolean(),
  settings: z.record(z.string(), z.unknown()),
  savedSectionId: z.string().optional(),
  savedSectionRevision: z.number().int().positive().optional(),
  bindingMode: z.enum(["copy", "linked"]).optional(),
});
export const sectionsSchema = z.array(sectionSchema);
export type SiteSection = z.infer<typeof sectionSchema>;

export type NavigationItem = {
  id?: string;
  label: string;
  href: string;
  type?: "page" | "external";
};

export type ExperienceInput = {
  name: string;
  experienceType: string;
  priceFrom?: number | null;
  currency: string;
  durationValue?: number | null;
  durationUnit?: string | null;
  locationName?: string | null;
  shortDescription: string;
  featuredImageUrl?: string | null;
  bookingUrl?: string | null;
  extraDetails?: Record<string, unknown>;
};

export type RentalInput = {
  name: string;
  rentalType: RentalProductType;
  shortDescription: string;
  currency: string;
  quoteOnly: boolean;
  rateAmount?: number | null;
  rateUnit: "hour" | "day" | "week";
  locationName?: string | null;
  bookingUrl?: string | null;
  featuredImageUrl?: string | null;
};

export const websitePageKeys = [
  "home",
  "experiences",
  "rentals",
  "destinations",
  "about",
  "gallery",
  "guides",
  "testimonials",
  "faq",
  "contact",
] as const;
export type WebsitePageKey = (typeof websitePageKeys)[number];
export type WebsitePageSelection = {
  key: WebsitePageKey;
  title: string;
  slug: string;
  selected: boolean;
  showInNavigation: boolean;
  sections: SiteSection["type"][];
};

export type OnboardingInput = {
  businessType: BusinessType;
  capabilities: BusinessCapability[];
  pageSelections: WebsitePageSelection[];
  name: string;
  slug: string;
  shortDescription: string;
  country: string;
  city: string;
  region?: string;
  timezone: string;
  currency: string;
  phone?: string;
  whatsapp?: string;
  email: string;
  address?: string;
  googleMapsUrl?: string;
  logoUrl?: string;
  brand: { primary: string; secondary: string; accent: string };
  experiences: ExperienceInput[];
  rentals: RentalInput[];
  themeId: ThemeId;
};
