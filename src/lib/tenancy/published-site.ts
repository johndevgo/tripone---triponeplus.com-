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
import {
  hydrateLinkedSections,
  resolveTemplateSections,
} from "@/lib/templates/bindings";
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

const siteTemplateSchema = z
  .object({
    id: z.string(),
    template_kind: z.enum([
      "experience_detail",
      "rental_detail",
      "taxonomy_landing",
      "location_detail",
    ]),
    subtype: z.string().default("default"),
    sections: z.unknown(),
    version: z.coerce.number().int().positive(),
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
  siteTemplates: z.array(siteTemplateSchema).default([]),
  savedSections: z.array(z.record(z.string(), z.unknown())).default([]),
  publishedAt: z.string().optional(),
});

const envelopeSchema = z.object({
  snapshot: publishedSnapshotSchema,
  requestedHostname: z.string(),
  primaryHostname: z.string(),
});

export type PublishedSite = z.infer<typeof envelopeSchema>;
export type PublishedSnapshot = z.infer<typeof publishedSnapshotSchema>;

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

export const loadPublishedSiteBySlug = cache(async (siteSlug: string) => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_published_site_snapshot", {
    identifier: siteSlug,
  });
  if (error || !data) return null;
  return decodePublishedSnapshot(data);
});

export function publishedSitemapEntries(
  snapshot: PublishedSnapshot,
  prefix = "",
) {
  const normalizedPrefix = prefix.replace(/\/$/, "");
  const entries: Array<{ path: string; updatedAt?: string }> = [];
  const add = (path: string, updatedAt?: string) =>
    entries.push({
      path: `${normalizedPrefix}${path === "/" ? "/" : path}`,
      updatedAt,
    });

  for (const page of snapshot.pages) {
    if (page.seo_settings.indexable === false) continue;
    add(page.slug ? `/${page.slug.replace(/^\/+/, "")}` : "/", page.updated_at);
  }
  for (const experience of snapshot.experiences) {
    if (experience.seo_settings.indexable === false) continue;
    add(`/experiences/${experience.slug}`, experience.updated_at);
  }
  for (const rental of snapshot.rentals) {
    if (rental.seo_settings.indexable === false) continue;
    add(`/rentals/${rental.slug}`, rental.updated_at);
  }
  for (const location of snapshot.locations) {
    if (
      typeof location.slug !== "string" ||
      typeof location.description !== "string" ||
      location.description.trim().length < 120
    )
      continue;
    const seo = objectRecord(location.seo_settings);
    if (seo.indexable === false) continue;
    add(
      `/locations/${location.slug}`,
      typeof location.updated_at === "string" ? location.updated_at : undefined,
    );
  }
  for (const term of snapshot.taxonomyTerms) {
    const path = taxonomyTermPath(snapshot, term);
    if (!path) continue;
    const seo = objectRecord(term.seo_settings);
    if (seo.indexable === false) continue;
    add(
      path,
      typeof term.updated_at === "string" ? term.updated_at : undefined,
    );
  }
  return [...new Map(entries.map((entry) => [entry.path, entry])).values()];
}

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
  const taxonomyMatch = resolveTaxonomyTerm(snapshot, route);
  const storedPage = snapshot.pages.find(
    (item) => item.slug.replace(/^\/+|\/+$/g, "") === route,
  );
  if (!storedPage && !experience && !location && !rental && !taxonomyMatch)
    return null;

  const page = storedPage
    ? {
        ...storedPage,
        sections: validatedSections(
          storedPage.sections,
          snapshot.savedSections,
        ),
      }
    : experience
      ? experiencePage(
          experience,
          snapshot.business.name,
          snapshot.business.city,
          templateFor(
            snapshot,
            "experience_detail",
            stringField(experience, "experience_type"),
            stringField(experience, "template_id"),
          ),
          snapshot.savedSections,
          snapshot.business,
        )
      : rental
        ? rentalPage(
            rental,
            snapshot.business.name,
            templateFor(
              snapshot,
              "rental_detail",
              rental.rental_type,
              stringField(rental, "template_id"),
            ),
            snapshot.savedSections,
            snapshot.business,
          )
        : taxonomyMatch
          ? taxonomyPage(
              taxonomyMatch.term,
              taxonomyMatch.path,
              snapshot.business.name,
              templateFor(
                snapshot,
                "taxonomy_landing",
                String(taxonomyMatch.taxonomy.taxonomy_type ?? "default"),
                stringField(taxonomyMatch.term, "template_id"),
              ),
              snapshot.savedSections,
              snapshot.business,
            )
          : locationPage(
              location!,
              snapshot.business.name,
              templateFor(
                snapshot,
                "location_detail",
                "default",
                stringField(location!, "template_id"),
              ),
              snapshot.savedSections,
              snapshot.business,
            );
  if (!page) return null;
  const allExperiences = snapshot.experiences as unknown as PublicExperience[];
  const rentals = snapshot.rentals.map((item) => ({
    ...item,
    rates: snapshot.rentalRates.filter(
      (rate) => rate.rental_product_id === item.id,
    ),
  })) as PublicRental[];
  const relatedTermIds = taxonomyMatch
    ? descendantTermIds(snapshot.taxonomyTerms, String(taxonomyMatch.term.id))
    : null;
  const matchingExperienceIds = relatedTermIds
    ? new Set(
        snapshot.experienceTaxonomyTerms
          .filter((assignment) =>
            relatedTermIds.has(String(assignment.term_id)),
          )
          .map((assignment) => String(assignment.experience_id)),
      )
    : null;
  const matchingRentalIds = relatedTermIds
    ? new Set(
        snapshot.rentalTaxonomyTerms
          .filter((assignment) =>
            relatedTermIds.has(String(assignment.term_id)),
          )
          .map((assignment) => String(assignment.rental_product_id)),
      )
    : null;
  const experiences = taxonomyMatch
    ? allExperiences.filter((item) => matchingExperienceIds?.has(item.id))
    : location
      ? allExperiences.filter((item) => item.location_name === location.name)
      : allExperiences;
  const visibleRentals = taxonomyMatch
    ? rentals.filter((item) => matchingRentalIds?.has(item.id))
    : rentals;
  return {
    page,
    experience: experience as unknown as PublicExperience | undefined,
    experiences,
    rentals: visibleRentals,
    location,
    rental,
    activeRental: rental
      ? rentals.find((item) => item.id === rental.id)
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

function validatedSections(
  value: unknown,
  savedSections: readonly Record<string, unknown>[] = [],
): SiteSection[] {
  const parsed = sectionsSchema.safeParse(value);
  return parsed.success
    ? hydrateLinkedSections(parsed.data, savedSections)
    : [];
}

function objectRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function experiencePage(
  experience: z.infer<typeof experienceSchema>,
  businessName: string,
  businessCity: string,
  template: z.infer<typeof siteTemplateSchema> | undefined,
  savedSections: readonly Record<string, unknown>[],
  business: Record<string, unknown>,
) {
  const templateSections = template
    ? resolveTemplateSections(
        template.sections,
        experience.sections_override,
        { business, experience },
        savedSections,
      )
    : [];
  return {
    title: experience.name,
    slug: `experiences/${experience.slug}`,
    sections: templateSections.length
      ? templateSections
      : [
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

function locationPage(
  location: Record<string, unknown>,
  businessName: string,
  template: z.infer<typeof siteTemplateSchema> | undefined,
  savedSections: readonly Record<string, unknown>[],
  business: Record<string, unknown>,
) {
  const name = typeof location.name === "string" ? location.name : "Location";
  const description =
    typeof location.description === "string" ? location.description : "";
  if (description.trim().length < 120) return null;
  const templateSections = template
    ? resolveTemplateSections(
        template.sections,
        location.sections_override,
        { business, location },
        savedSections,
      )
    : [];
  return {
    title: name,
    slug: `locations/${String(location.slug ?? "")}`,
    sections: templateSections.length
      ? templateSections
      : [
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
  template: z.infer<typeof siteTemplateSchema> | undefined,
  savedSections: readonly Record<string, unknown>[],
  business: Record<string, unknown>,
) {
  const templateSections = template
    ? resolveTemplateSections(
        template.sections,
        rental.sections_override,
        { business, rental },
        savedSections,
      )
    : [];
  return {
    title: rental.name,
    slug: `rentals/${rental.slug}`,
    sections: templateSections.length
      ? templateSections
      : [
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

function taxonomyPage(
  term: Record<string, unknown>,
  path: string,
  businessName: string,
  template: z.infer<typeof siteTemplateSchema> | undefined,
  savedSections: readonly Record<string, unknown>[],
  business: Record<string, unknown>,
) {
  const name = String(term.name ?? "Collection");
  const description = String(term.description ?? "");
  const templateSections = template
    ? resolveTemplateSections(
        template.sections,
        term.sections_override,
        { business, term },
        savedSections,
      )
    : [];
  return {
    title: name,
    slug: path.replace(/^\//, ""),
    sections: templateSections.length
      ? templateSections
      : [
          {
            id: "taxonomy-hero",
            type: "hero" as const,
            variant: "destination",
            visible: true,
            settings: {
              eyebrow: businessName,
              title: name,
              description,
              imageUrl: term.hero_image_url,
            },
          },
          {
            id: "taxonomy-experiences",
            type: "experienceGrid" as const,
            variant: "cards",
            visible: true,
            settings: { title: `Experiences for ${name}` },
          },
          {
            id: "taxonomy-rentals",
            type: "rentalGrid" as const,
            variant: "product-grid",
            visible: true,
            settings: { title: `Rentals for ${name}` },
          },
        ],
    seo_settings:
      Object.keys(objectRecord(term.seo_settings)).length > 0
        ? objectRecord(term.seo_settings)
        : {
            title: `${name} | ${businessName}`,
            description,
            canonicalPath: path,
          },
    updated_at:
      typeof term.updated_at === "string" ? term.updated_at : undefined,
  };
}

function resolveTaxonomyTerm(snapshot: PublishedSnapshot, route: string) {
  for (const term of snapshot.taxonomyTerms) {
    const path = taxonomyTermPath(snapshot, term);
    if (path?.replace(/^\//, "") === route) {
      const taxonomy = snapshot.taxonomies.find(
        (item) => String(item.id) === String(term.taxonomy_id),
      );
      if (taxonomy) return { term, taxonomy, path };
    }
  }
  return null;
}

function taxonomyTermPath(
  snapshot: PublishedSnapshot,
  term: Record<string, unknown>,
) {
  const taxonomy = snapshot.taxonomies.find(
    (item) => String(item.id) === String(term.taxonomy_id),
  );
  const baseByType: Record<string, string> = {
    activity: "activities",
    destination: "destinations",
    travel_style: "travel-styles",
    package_category: "package-categories",
    product_category: "rental-categories",
  };
  const base = baseByType[String(taxonomy?.taxonomy_type ?? "")];
  if (!base || typeof term.slug !== "string") return null;
  const slugs = [term.slug];
  const visited = new Set([String(term.id)]);
  let parentId = term.parent_id;
  while (parentId) {
    const parent = snapshot.taxonomyTerms.find(
      (candidate) => String(candidate.id) === String(parentId),
    );
    if (
      !parent ||
      typeof parent.slug !== "string" ||
      visited.has(String(parent.id))
    )
      return null;
    visited.add(String(parent.id));
    slugs.unshift(parent.slug);
    parentId = parent.parent_id;
  }
  return `/${base}/${slugs.join("/")}`;
}

function descendantTermIds(
  terms: readonly Record<string, unknown>[],
  rootId: string,
) {
  const found = new Set([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const term of terms) {
      const id = String(term.id);
      if (!found.has(id) && found.has(String(term.parent_id))) {
        found.add(id);
        changed = true;
      }
    }
  }
  return found;
}

function templateFor(
  snapshot: PublishedSnapshot,
  kind: z.infer<typeof siteTemplateSchema>["template_kind"],
  subtype?: string,
  templateId?: string,
) {
  if (templateId) {
    const assigned = snapshot.siteTemplates.find(
      (template) =>
        template.id === templateId && template.template_kind === kind,
    );
    if (assigned) return assigned;
  }
  return (
    snapshot.siteTemplates.find(
      (template) =>
        template.template_kind === kind && template.subtype === subtype,
    ) ??
    snapshot.siteTemplates.find(
      (template) =>
        template.template_kind === kind && template.subtype === "default",
    )
  );
}

function stringField(record: Record<string, unknown>, field: string) {
  const value = record[field];
  return typeof value === "string" ? value : undefined;
}
