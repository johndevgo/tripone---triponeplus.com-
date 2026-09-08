import type {
  BusinessCapability,
  BusinessType,
  WebsitePageKey,
  WebsitePageSelection,
} from "@/lib/types";

const tourCapabilities = new Set<BusinessCapability>([
  "jetski",
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
  "motorcycle_tour",
  "other",
]);
const rentalCapabilities = new Set<BusinessCapability>([
  "boat_rental",
  "jetski",
  "atv_buggy",
  "water_sports",
  "motorcycle_rental",
  "vehicle_rental",
  "equipment_rental",
]);
const destinationCapabilities = new Set<BusinessCapability>([
  "tour_operator",
  "travel_agency",
  "safari",
  "trekking",
  "hiking",
  "multi_day_tour",
  "excursion",
  "local_guide",
  "motorcycle_tour",
]);

const catalogue: Record<
  WebsitePageKey,
  Omit<WebsitePageSelection, "selected">
> = {
  home: {
    key: "home",
    title: "Home",
    slug: "",
    showInNavigation: true,
    sections: [
      "hero",
      "trustBar",
      "featuredExperiences",
      "whyChooseUs",
      "finalCta",
    ],
  },
  experiences: {
    key: "experiences",
    title: "Experiences",
    slug: "experiences",
    showInNavigation: true,
    sections: ["hero", "experienceGrid", "finalCta"],
  },
  rentals: {
    key: "rentals",
    title: "Rentals",
    slug: "rentals",
    showInNavigation: true,
    sections: ["hero", "rentalGrid", "contact", "finalCta"],
  },
  destinations: {
    key: "destinations",
    title: "Destinations",
    slug: "destinations",
    showInNavigation: true,
    sections: ["hero", "destinations", "finalCta"],
  },
  about: {
    key: "about",
    title: "About",
    slug: "about",
    showInNavigation: true,
    sections: ["hero", "richText", "whyChooseUs", "finalCta"],
  },
  gallery: {
    key: "gallery",
    title: "Gallery",
    slug: "gallery",
    showInNavigation: true,
    sections: ["hero", "gallery", "finalCta"],
  },
  guides: {
    key: "guides",
    title: "Guides",
    slug: "guides",
    showInNavigation: true,
    sections: ["hero", "guides", "finalCta"],
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    slug: "testimonials",
    showInNavigation: true,
    sections: ["hero", "testimonials", "finalCta"],
  },
  faq: {
    key: "faq",
    title: "FAQ",
    slug: "faq",
    showInNavigation: true,
    sections: ["hero", "faq", "contact"],
  },
  contact: {
    key: "contact",
    title: "Contact",
    slug: "contact",
    showInNavigation: true,
    sections: ["hero", "contact", "location"],
  },
};
const order: WebsitePageKey[] = [
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
];

export function recommendedPageSelections(
  capabilities: readonly BusinessCapability[],
): WebsitePageSelection[] {
  const normalized = [...new Set(capabilities)].sort();
  const recommended = new Set<WebsitePageKey>(["home", "about", "contact"]);
  if (normalized.some((item) => tourCapabilities.has(item)))
    recommended.add("experiences");
  if (normalized.some((item) => rentalCapabilities.has(item)))
    recommended.add("rentals");
  if (normalized.some((item) => destinationCapabilities.has(item)))
    recommended.add("destinations");
  if (normalized.some((item) => item !== "travel_agency"))
    recommended.add("faq");
  if (
    normalized.some((item) =>
      ["safari", "trekking", "hiking", "local_guide"].includes(item),
    )
  )
    recommended.add("guides");
  if (
    normalized.some((item) =>
      ["jetski", "boat_rental", "safari", "diving", "snorkelling"].includes(
        item,
      ),
    )
  )
    recommended.add("gallery");
  const hasTours = normalized.some((item) => tourCapabilities.has(item));
  const hasRentals = normalized.some((item) => rentalCapabilities.has(item));
  const homeSections = normalized.includes("safari")
    ? ([
        "hero",
        "featuredExperiences",
        "wildlifeHighlights",
        "whyChooseUs",
        "guides",
        "testimonials",
        "gallery",
        "faq",
        "finalCta",
      ] as const)
    : normalized.some((item) => item === "trekking" || item === "hiking")
      ? ([
          "hero",
          "featuredExperiences",
          "popularDestinations",
          "whyChooseUs",
          "difficultyOverview",
          "guides",
          "testimonials",
          "faq",
          "finalCta",
        ] as const)
      : normalized.includes("travel_agency")
        ? ([
            "hero",
            "featuredPackages",
            "destinations",
            "whyTravelWithUs",
            "specialOffers",
            "testimonials",
            "finalCta",
          ] as const)
        : ([
            "hero",
            "trustBar",
            ...(hasTours ? (["featuredExperiences"] as const) : []),
            ...(hasRentals ? (["rentalGrid"] as const) : []),
            "whyChooseUs",
            "finalCta",
          ] as const);
  return order.map((key) => ({
    ...catalogue[key],
    ...(key === "experiences" && normalized.includes("travel_agency")
      ? { title: "Packages", slug: "packages" }
      : key === "experiences" &&
          normalized.some((item) => item === "trekking" || item === "hiking")
        ? { title: "Treks", slug: "treks" }
        : {}),
    ...(key === "home" ? { sections: [...homeSections] } : {}),
    selected: recommended.has(key),
  }));
}

export function normalizePageSelections(
  capabilities: readonly BusinessCapability[],
  selections?: readonly WebsitePageSelection[],
) {
  const defaults = recommendedPageSelections(capabilities);
  if (!selections?.length) return defaults.filter((item) => item.selected);
  const selectedByKey = new Map(selections.map((item) => [item.key, item]));
  return defaults
    .map((fallback) => {
      const selected = selectedByKey.get(fallback.key);
      if (!selected) return fallback;
      return {
        ...fallback,
        ...selected,
        slug: selected.key === "home" ? "" : selected.slug,
        selected: selected.key === "home" ? true : selected.selected,
      };
    })
    .filter((item) => item.selected);
}

export function pageTypeFor(key: WebsitePageKey): string {
  const known: Partial<Record<WebsitePageKey, string>> = {
    home: "home",
    experiences: "experiences",
    destinations: "locations",
    about: "about",
    gallery: "gallery",
    faq: "faq",
    contact: "contact",
  };
  return known[key] ?? "custom";
}

export function primaryLegacyType(value: BusinessType) {
  return value;
}
