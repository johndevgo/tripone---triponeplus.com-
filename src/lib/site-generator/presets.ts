import type { BusinessType } from "@/lib/types";

export type PageRecipe = {
  title: string;
  slug: string;
  type: string;
  sections: string[];
};
export type BusinessPreset = {
  label: string;
  singular: string;
  plural: string;
  primaryCta: string;
  secondaryCta: string;
  experienceFields: string[];
  optionalFields: string[];
  recommendedComponents: string[];
  seoPhraseTemplates: string[];
  croRecommendations: string[];
  pages: PageRecipe[];
};

const basePages: PageRecipe[] = [
  {
    title: "Home",
    slug: "",
    type: "home",
    sections: [
      "hero",
      "trustBar",
      "featuredExperiences",
      "whyChooseUs",
      "gallery",
      "testimonials",
      "faq",
      "finalCta",
    ],
  },
  {
    title: "Experiences",
    slug: "experiences",
    type: "experiences",
    sections: ["hero", "experienceGrid", "finalCta"],
  },
  {
    title: "About",
    slug: "about",
    type: "about",
    sections: ["hero", "richText", "whyChooseUs", "finalCta"],
  },
  {
    title: "FAQ",
    slug: "faq",
    type: "faq",
    sections: ["hero", "faq", "contact"],
  },
  {
    title: "Contact",
    slug: "contact",
    type: "contact",
    sections: ["hero", "contact", "location"],
  },
];

const base: Omit<BusinessPreset, "label" | "singular" | "plural"> = {
  primaryCta: "View Experiences",
  secondaryCta: "Contact Us",
  experienceFields: ["duration", "location", "price"],
  optionalFields: ["minimumAge", "maxGuests"],
  recommendedComponents: ["hero", "featuredExperiences", "faq", "finalCta"],
  seoPhraseTemplates: [
    "{experience} in {location}",
    "{businessType} in {location}",
  ],
  croRecommendations: [
    "Show price and duration early",
    "Keep booking and contact actions visible",
  ],
  pages: basePages,
};

function pagesWithHome(sections: string[], pages: PageRecipe[] = basePages) {
  return pages.map((page) =>
    page.type === "home" ? { ...page, sections } : page,
  );
}

function preset(
  label: string,
  singular: string,
  plural: string,
  overrides: Partial<BusinessPreset> = {},
): BusinessPreset {
  return { ...base, label, singular, plural, ...overrides };
}

const gallery = {
  title: "Gallery",
  slug: "gallery",
  type: "gallery",
  sections: ["hero", "gallery", "finalCta"],
};
const destinations = {
  title: "Destinations",
  slug: "destinations",
  type: "locations",
  sections: ["hero", "destinations", "finalCta"],
};

export const businessPresets: Record<BusinessType, BusinessPreset> = {
  jetski: preset(
    "Jet Ski Rental",
    "jet ski experience",
    "jet ski experiences",
    {
      primaryCta: "Book Now",
      secondaryCta: "WhatsApp Us",
      experienceFields: [
        "maximumRiders",
        "minimumDriverAge",
        "safetyEquipment",
      ],
      recommendedComponents: ["safety", "gallery", "location", "faq"],
      seoPhraseTemplates: [
        "jet ski {experience} in {location}",
        "jet ski rental in {location}",
      ],
      croRecommendations: [
        "Lead with safety and rider requirements",
        "Offer booking and WhatsApp paths",
      ],
      pages: pagesWithHome(
        [
          "hero",
          "trustBar",
          "featuredExperiences",
          "whyChooseUs",
          "safety",
          "gallery",
          "testimonials",
          "location",
          "faq",
          "finalCta",
        ],
        [...basePages.slice(0, 3), gallery, ...basePages.slice(3)],
      ),
    },
  ),
  boat_rental: preset("Boat Rental", "boat", "boats", {
    primaryCta: "Check Availability",
    experienceFields: ["capacity", "duration", "crewIncluded"],
  }),
  day_tour: preset("Day Tours", "day tour", "day tours"),
  tour_operator: preset("Tour Operator", "tour", "tours"),
  travel_agency: preset("Travel Agency", "package", "packages", {
    experienceFields: ["packageDuration", "destinations", "startingPrice"],
    recommendedComponents: [
      "featuredPackages",
      "destinations",
      "specialOffers",
      "testimonials",
    ],
    pages: pagesWithHome(
      [
        "hero",
        "featuredPackages",
        "destinations",
        "whyTravelWithUs",
        "specialOffers",
        "testimonials",
        "finalCta",
      ],
      [
        basePages[0]!,
        { ...basePages[1]!, title: "Packages", slug: "packages" },
        destinations,
        ...basePages.slice(2),
      ],
    ),
  }),
  safari: preset("Safari", "safari", "safaris", {
    experienceFields: ["safariDuration", "pickup", "wildlifeHighlights"],
    recommendedComponents: [
      "wildlifeHighlights",
      "guides",
      "gallery",
      "testimonials",
    ],
    pages: pagesWithHome(
      [
        "hero",
        "featuredExperiences",
        "wildlifeHighlights",
        "whyChooseUs",
        "guides",
        "testimonials",
        "gallery",
        "faq",
        "finalCta",
      ],
      [
        ...basePages.slice(0, 2),
        {
          title: "Guides",
          slug: "guides",
          type: "custom",
          sections: ["hero", "guides", "finalCta"],
        },
        ...basePages.slice(2),
        gallery,
      ],
    ),
  }),
  trekking: preset("Trekking & Hiking", "trek", "treks", {
    experienceFields: [
      "difficulty",
      "maximumAltitude",
      "duration",
      "accommodation",
    ],
    recommendedComponents: [
      "popularDestinations",
      "difficultyOverview",
      "guides",
      "faq",
    ],
    pages: pagesWithHome(
      [
        "hero",
        "featuredExperiences",
        "popularDestinations",
        "whyChooseUs",
        "difficultyOverview",
        "guides",
        "testimonials",
        "faq",
        "finalCta",
      ],
      [
        basePages[0]!,
        { ...basePages[1]!, title: "Treks", slug: "treks" },
        destinations,
        ...basePages.slice(2),
      ],
    ),
  }),
  hiking: preset("Hiking", "hike", "hikes", {
    experienceFields: ["difficulty", "elevationGain", "duration"],
  }),
  diving: preset("Diving", "dive", "dives", {
    experienceFields: ["certification", "depth", "equipment"],
  }),
  snorkelling: preset("Snorkelling", "snorkelling trip", "snorkelling trips", {
    experienceFields: ["equipment", "swimmingLevel", "duration"],
  }),
  rafting: preset("Rafting", "rafting trip", "rafting trips", {
    experienceFields: ["rapidGrade", "minimumAge", "safetyEquipment"],
  }),
  atv_buggy: preset("ATV / Buggy", "ride", "rides", {
    experienceFields: ["vehicleType", "minimumDriverAge", "safetyEquipment"],
  }),
  adventure_activity: preset("Adventure Activities", "activity", "activities", {
    primaryCta: "Find Your Adventure",
  }),
  local_guide: preset(
    "Local Guide",
    "guided experience",
    "guided experiences",
    { primaryCta: "Explore With Me" },
  ),
  multi_day_tour: preset("Multi-Day Tours", "tour", "tours", {
    experienceFields: ["duration", "accommodation", "transport", "meals"],
  }),
  excursion: preset("Excursions", "excursion", "excursions"),
  water_sports: preset("Water Sports", "water activity", "water activities", {
    experienceFields: ["duration", "minimumAge", "equipment"],
  }),
  other: preset("Other Tourism Business", "experience", "experiences"),
};

export function getBusinessPreset(type: BusinessType) {
  return businessPresets[type] ?? businessPresets.other;
}
