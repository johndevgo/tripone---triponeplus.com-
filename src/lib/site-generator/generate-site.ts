import type { OnboardingInput, SiteSection } from "@/lib/types";
import { getBusinessPreset } from "./presets";
import { createPageSeo } from "./seo";
import { getTheme } from "./themes";

export type GeneratedPage = {
  title: string;
  slug: string;
  pageType: string;
  sections: SiteSection[];
  seoSettings: Record<string, unknown>;
  sortOrder: number;
  showInNavigation: boolean;
};
export type GeneratedSite = {
  theme: ReturnType<typeof getTheme>;
  pages: GeneratedPage[];
  navigation: Array<{ label: string; href: string }>;
  footer: Record<string, unknown>;
  globalSettings: Record<string, unknown>;
};

const sectionVariant: Record<string, string> = {
  hero: "immersive",
  gallery: "mosaic",
  faq: "accordion",
  featuredExperiences: "cards",
  experienceGrid: "cards",
  finalCta: "banner",
};

export function generateSite(input: OnboardingInput): GeneratedSite {
  const preset = getBusinessPreset(input.businessType);
  const location = [input.city, input.region].filter(Boolean).join(", ");
  const catalogue = preset.pages.find((page) => page.type === "experiences");
  const catalogueHref = catalogue?.slug ? `/${catalogue.slug}` : "/experiences";
  const pages = preset.pages.map((recipe, sortOrder) => ({
    title: recipe.title,
    slug: recipe.slug,
    pageType: recipe.type,
    sortOrder,
    showInNavigation: recipe.type !== "experience_detail_system",
    seoSettings: createPageSeo(recipe.title, input.name, location),
    sections: recipe.sections.map((type, index) => ({
      id: `${recipe.slug || "home"}-${type}-${index}`,
      type: type as SiteSection["type"],
      variant: sectionVariant[type] ?? "default",
      visible: true,
      settings: sectionSettings(
        type,
        input,
        preset.plural,
        preset.primaryCta,
        catalogueHref,
        recipe.title,
      ),
    })),
  }));
  return {
    theme: getTheme(input.themeId, {
      primary: input.brand.primary,
      secondary: input.brand.secondary,
      accent: input.brand.accent,
    }),
    pages,
    navigation: pages
      .filter((page) => page.showInNavigation)
      .map((page) => ({
        label: page.title,
        href: page.slug ? `/${page.slug}` : "/",
      })),
    footer: {
      businessName: input.name,
      city: input.city,
      country: input.country,
      email: input.email,
      phone: input.phone,
      whatsapp: input.whatsapp,
    },
    globalSettings: {
      terminology: { singular: preset.singular, plural: preset.plural },
      primaryCta: preset.primaryCta,
      secondaryCta: preset.secondaryCta,
      seoPhraseTemplates: preset.seoPhraseTemplates,
      croRecommendations: preset.croRecommendations,
    },
  };
}

function sectionSettings(
  type: string,
  input: OnboardingInput,
  plural: string,
  primaryCta: string,
  catalogueHref: string,
  pageTitle: string,
): Record<string, unknown> {
  const location = [input.city, input.region].filter(Boolean).join(", ");
  if (type === "hero")
    return {
      eyebrow: input.name,
      title:
        pageTitle === "Home"
          ? input.businessType === "travel_agency"
            ? "Travel packages for your next journey"
            : `${plural[0]?.toUpperCase()}${plural.slice(1)} in ${location}`
          : pageTitle,
      description: input.shortDescription,
      primaryCta,
      primaryHref: catalogueHref,
    };
  if (
    type === "featuredExperiences" ||
    type === "experienceGrid" ||
    type === "featuredPackages"
  )
    return {
      title:
        type === "featuredExperiences" || type === "featuredPackages"
          ? `Featured ${plural}`
          : `Explore our ${plural}`,
      description: `Choose the right ${plural} for your trip.`,
    };
  if (type === "whyChooseUs")
    return {
      title: `Plan with ${input.name}`,
      description:
        "Clear details, local knowledge and a simple way to enquire or book.",
    };
  if (type === "gallery")
    return {
      title: "See the experience",
      description: `A closer look at ${plural} and the places we visit.`,
    };
  if (type === "faq")
    return {
      title: "Frequently asked questions",
      items: [
        {
          question: "How do I book?",
          answer:
            "Choose an experience and use the booking or contact option shown.",
        },
        {
          question: "Where do experiences start?",
          answer:
            "Meeting details are shown on each experience page and confirmed after booking.",
        },
      ],
    };
  if (type === "contact")
    return {
      title: "Plan your experience",
      description: `Contact ${input.name} and tell us what you have in mind.`,
      email: input.email,
      phone: input.phone,
    };
  if (type === "location")
    return {
      title: `Find us in ${location}`,
      address: input.address,
      mapsUrl: input.googleMapsUrl,
    };
  if (type === "finalCta")
    return {
      title: `Ready to explore ${location}?`,
      description: `Discover ${plural} from ${input.name}.`,
      label: primaryCta,
      href: catalogueHref,
    };
  if (type === "richText")
    return { title: `About ${input.name}`, body: input.shortDescription };
  const purposeCopy: Record<string, [string, string]> = {
    wildlifeHighlights: [
      "Wildlife and landscapes",
      "Use each safari page to explain the places, habitats and wildlife guests may encounter without promising sightings.",
    ],
    popularDestinations: [
      "Popular destinations",
      "Introduce the regions and trail areas covered by your experiences.",
    ],
    difficultyOverview: [
      "Choose the right difficulty",
      "Help guests compare fitness, terrain and preparation requirements before they enquire.",
    ],
    destinations: [
      "Explore destinations",
      "Browse the places and regions included in available experiences.",
    ],
    guides: [
      "Meet your guides",
      "Add real guide profiles, qualifications and local experience when they are ready to publish.",
    ],
    whyTravelWithUs: [
      `Plan with ${input.name}`,
      "Compare practical trip information and contact the team with questions.",
    ],
    specialOffers: [
      "Current offers",
      "Publish genuine seasonal packages and offers here when available.",
    ],
  };
  const purpose = purposeCopy[type];
  if (purpose) return { title: purpose[0], description: purpose[1] };
  return {
    title:
      type === "trustBar"
        ? "Plan with confidence"
        : type.replace(/([A-Z])/g, " $1").trim(),
    description: input.shortDescription,
  };
}
