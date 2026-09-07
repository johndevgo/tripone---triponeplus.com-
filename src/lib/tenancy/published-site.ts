import "server-only";
import { cache } from "react";
import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import {
  sectionsSchema,
  themeIds,
  type SiteSection,
  type ThemeId,
} from "@/lib/types";
import { createExperienceSeo, getTheme } from "@/lib/site-generator";
import type {
  PublicExperience,
  PublicRental,
} from "@/components/site/site-renderer";

const pageSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    page_type: z.string().optional(),
    sections: z.unknown(),
    seo_settings: z.record(z.string(), z.unknown()).default({}),
    updated_at: z.string().optional(),
  })
  .passthrough();

const experienceSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    short_description: z.string().default(""),
    description: z.string().default(""),
    price_from: z.coerce.number().nullable().default(null),
    currency: z.string().default("USD"),
    duration_value: z.coerce.number().nullable().default(null),
    duration_unit: z.string().nullable().default(null),
    location_name: z.string().nullable().default(null),
    featured_image_url: z.string().nullable().default(null),
    booking_url: z.string().nullable().default(null),
    seo_settings: z.record(z.string(), z.unknown()).default({}),
    updated_at: z.string().optional(),
  })
  .passthrough();

const rentalSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    rental_type: z.string(),
    short_description: z.string().default(""),
    description: z.string().default(""),
    currency: z.string().default("USD"),
    pricing_label: z.string().nullable().optional(),
    location_name: z.string().nullable().optional(),
    booking_url: z.string().nullable().optional(),
    booking_button_label: z.string().nullable().optional(),
    quote_only: z.boolean().default(false),
    featured_image_url: z.string().nullable().optional(),
    specifications: z.unknown().optional(),
    inclusions: z.unknown().optional(),
    exclusions: z.unknown().optional(),
    rental_terms: z.unknown().optional(),
    seo_settings: z.record(z.string(), z.unknown()).default({}),
    updated_at: z.string().optional(),
  })
  .passthrough();

const rentalRateSchema = z
  .object({
    rental_product_id: z.string(),
    label: z.string(),
    amount: z.coerce.number().nullable().default(null),
    currency: z.string(),
    pricing_unit: z.string(),
    minimum_quantity: z.coerce.number().nullable().optional(),
    maximum_quantity: z.coerce.number().nullable().optional(),
  })
  .passthrough();

export const publishedSnapshotSchema = z.object({
  schemaVersion: z.number().int().positive().default(1),
  site: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    themeId: z.string(),
    theme: z.record(z.string(), z.unknown()).default({}),
    navigation: z.unknown().default([]),
    footer: z.unknown().default({}),
    globalSettings: z.record(z.string(), z.unknown()).default({}),
    seoSettings: z.record(z.string(), z.unknown()).default({}),
    croSettings: z.record(z.string(), z.unknown()).default({}),
    faviconUrl: z.string().nullable().optional(),
    defaultOgImageUrl: z.string().nullable().optional(),
  }),
  business: z
    .object({
      name: z.string(),
      business_type: z.string().default("other"),
      city: z.string().default(""),
      country: z.string().default(""),
      phone: z.string().nullable().default(null),
      whatsapp: z.string().nullable().default(null),
      email: z.string().default(""),
      logo_url: z.string().nullable().default(null),
    })
    .passthrough(),
  pages: z.array(pageSchema).default([]),
  experiences: z.array(experienceSchema).default([]),
  rentals: z.array(rentalSchema).default([]),
  rentalRates: z.array(rentalRateSchema).default([]),
  taxonomies: z.array(z.record(z.string(), z.unknown())).default([]),
  taxonomyTerms: z.array(z.record(z.string(), z.unknown())).default([]),
  experienceTaxonomyTerms: z
    .array(z.record(z.string(), z.unknown()))
    .default([]),
  rentalTaxonomyTerms: z.array(z.record(z.string(), z.unknown())).default([]),
  locations: z.array(z.record(z.string(), z.unknown())).default([]),
  testimonials: z.array(z.record(z.string(), z.unknown())).default([]),
  redirects: z.array(z.record(z.string(), z.unknown())).default([]),
  publishedAt: z.string().optional(),
});

const envelopeSchema = z.object({
  snapshot: publishedSnapshotSchema,
  requestedHostname: z.string(),
  primaryHostname: z.string(),
});

export type PublishedSite = z.infer<typeof envelopeSchema>;

export function decodePublishedSnapshot(value: unknown) {
  const parsed = publishedSnapshotSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export const loadPublishedSite = cache(async (hostname: string) => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_published_site_by_hostname", {
    input_hostname: hostname,
  });
  if (error || !data) return null;
  const parsed = envelopeSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
});

export function resolvePublishedRoute(site: PublishedSite, rawPath: string[]) {
  const route = rawPath
    .map((part) => decodeURIComponent(part))
    .join("/")
    .replace(/^\/+|\/+$/g, "");
  const { snapshot } = site;
  const experienceSlug = route.startsWith("experiences/")
    ? route.slice(12)
    : null;
  const locationSlug = route.startsWith("locations/") ? route.slice(10) : null;
  const rentalSlug = route.startsWith("rentals/") ? route.slice(8) : null;
  const experience = experienceSlug
    ? snapshot.experiences.find((item) => item.slug === experienceSlug)
    : undefined;
  const location = locationSlug
    ? snapshot.locations.find((item) => item.slug === locationSlug)
    : undefined;
  const rental = rentalSlug
    ? snapshot.rentals.find((item) => item.slug === rentalSlug)
    : undefined;
  const storedPage = snapshot.pages.find(
    (item) => item.slug.replace(/^\/+|\/+$/g, "") === route,
  );
  if (!storedPage && !experience && !location && !rental) return null;

  const page = storedPage
    ? { ...storedPage, sections: validatedSections(storedPage.sections) }
    : experience
      ? experiencePage(
          experience,
          snapshot.business.name,
          snapshot.business.city,
        )
      : rental
        ? rentalPage(rental, snapshot.business.name)
        : locationPage(location!, snapshot.business.name);
  if (!page) return null;
  const experiences = snapshot.experiences as unknown as PublicExperience[];
  return {
    page,
    experience: experience as unknown as PublicExperience | undefined,
    experiences: location
      ? experiences.filter((item) => item.location_name === location.name)
      : experiences,
    location,
    rental,
    activeRental: rental
      ? ({
          ...rental,
          rates: snapshot.rentalRates.filter(
            (rate) => rate.rental_product_id === rental.id,
          ),
        } as PublicRental)
      : undefined,
  };
}

export function rendererData(site: PublishedSite) {
  const { snapshot } = site;
  const themeId = themeIds.includes(snapshot.site.themeId as ThemeId)
    ? (snapshot.site.themeId as ThemeId)
    : "horizon";
  const preset = getTheme(themeId);
  const stored = snapshot.site.theme as Partial<typeof preset>;
  return {
    site: {
      id: snapshot.site.id,
      name: snapshot.site.name,
      slug: snapshot.site.slug,
      navigation: snapshot.site.navigation,
      footer_settings: snapshot.site.footer,
      global_settings: {
        ...snapshot.site.globalSettings,
        cro: snapshot.site.croSettings,
      },
    },
    business: snapshot.business,
    theme: {
      ...preset,
      ...stored,
      colors: { ...preset.colors, ...stored.colors },
    },
  };
}

function validatedSections(value: unknown): SiteSection[] {
  const parsed = sectionsSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}

function experiencePage(
  experience: z.infer<typeof experienceSchema>,
  businessName: string,
  businessCity: string,
) {
  return {
    title: experience.name,
    slug: `experiences/${experience.slug}`,
    sections: [
      {
        id: "detail-hero",
        type: "hero" as const,
        variant: "cinematic",
        visible: true,
        settings: {
          eyebrow: experience.location_name ?? businessName,
          title: experience.name,
          description: experience.short_description,
          imageUrl: experience.featured_image_url,
          primaryCta: experience.booking_url ? "Book now" : "Enquire now",
          primaryHref: experience.booking_url ?? "/contact",
        },
      },
    ],
    seo_settings:
      Object.keys(experience.seo_settings).length > 0
        ? experience.seo_settings
        : createExperienceSeo(
            experience.name,
            businessName,
            experience.location_name ?? businessCity,
          ),
    updated_at: experience.updated_at,
  };
}

function locationPage(location: Record<string, unknown>, businessName: string) {
  const name = typeof location.name === "string" ? location.name : "Location";
  const description =
    typeof location.description === "string" ? location.description : "";
  if (description.trim().length < 120) return null;
  return {
    title: name,
    slug: `locations/${String(location.slug ?? "")}`,
    sections: [
      {
        id: "location-hero",
        type: "hero" as const,
        variant: "destination",
        visible: true,
        settings: {
          eyebrow: businessName,
          title: name,
          description,
          imageUrl: location.image_url,
          primaryCta: "View experiences",
          primaryHref: "/experiences",
        },
      },
      {
        id: "location-experiences",
        type: "experienceGrid" as const,
        variant: "grid",
        visible: true,
        settings: { eyebrow: "Explore", title: `Experiences in ${name}` },
      },
    ],
    seo_settings: location.seo_settings ?? {},
    updated_at:
      typeof location.updated_at === "string" ? location.updated_at : undefined,
  };
}

function rentalPage(
  rental: z.infer<typeof rentalSchema>,
  businessName: string,
) {
  return {
    title: rental.name,
    slug: `rentals/${rental.slug}`,
    sections: [
      {
        id: "rental-detail-hero",
        type: "hero" as const,
        variant: "product",
        visible: true,
        settings: {
          eyebrow:
            rental.location_name ?? rental.rental_type.replaceAll("_", " "),
          title: rental.name,
          description: rental.short_description,
          imageUrl: rental.featured_image_url,
          primaryCta: rental.booking_button_label ?? "Request rental",
          primaryHref: rental.booking_url ?? "/contact",
        },
      },
      ...(rental.description
        ? [
            {
              id: "rental-description",
              type: "richText" as const,
              variant: "editorial",
              visible: true,
              settings: {
                title: "About this rental",
                body: rental.description,
              },
            },
          ]
        : []),
    ],
    seo_settings:
      Object.keys(rental.seo_settings).length > 0
        ? rental.seo_settings
        : {
            title: `${rental.name}${rental.location_name ? ` in ${rental.location_name}` : ""} | ${businessName}`,
            description: rental.short_description,
            canonicalPath: `/rentals/${rental.slug}`,
          },
    updated_at: rental.updated_at,
  };
}
