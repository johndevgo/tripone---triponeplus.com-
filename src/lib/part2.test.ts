import { describe, expect, it } from "vitest";
import {
  sectionRegistry,
  createDefaultSection,
  validateSection,
} from "@/lib/sections/registry";
import { businessTypes, sectionTypes } from "@/lib/types";
import {
  experienceDetailsSchema,
  itinerarySchema,
} from "@/lib/experiences/schemas";
import { scoreCro, scoreSeo } from "@/lib/readiness/scores";
import {
  breadcrumbJsonLd,
  experienceJsonLd,
  organizationJsonLd,
} from "@/lib/seo/structured-data";
import { buildRobots, buildSitemap } from "@/lib/seo/site-files";

describe("Part 2 section registry", () => {
  it("registers every allowed section with valid defaults and variants", () => {
    expect(Object.keys(sectionRegistry).sort()).toEqual(
      [...sectionTypes].sort(),
    );
    for (const type of sectionTypes) {
      const section = createDefaultSection(type);
      expect(sectionRegistry[type].variants).toContain(section.variant);
      expect(validateSection(section).success).toBe(true);
    }
  });
});

describe("experience category schemas", () => {
  it("supports every category and rejects invalid constrained data", () => {
    for (const type of businessTypes)
      expect(experienceDetailsSchema(type).safeParse({}).success).toBe(true);
    expect(
      experienceDetailsSchema("jetski").safeParse({ maximumRiders: -1 })
        .success,
    ).toBe(false);
    expect(
      itinerarySchema.safeParse([
        { title: "Marina briefing", description: "Meet the guide." },
      ]).success,
    ).toBe(true);
  });
});

describe("deterministic readiness scores", () => {
  const sections = [createDefaultSection("hero"), createDefaultSection("faq")];
  it("explains a reproducible SEO score", () => {
    const score = scoreSeo({
      title: "Jet Ski Experiences in Dubai Marina | Dubai Wave",
      description:
        "Compare clear prices, durations and meeting information for jet ski experiences from Dubai Wave Jetski in Dubai Marina.",
      canonical: "/experiences",
      indexable: true,
      slug: "experiences",
      sections,
      images: [],
      hasBreadcrumbs: true,
    });
    expect(score.score).toBeGreaterThan(80);
    expect(score.passed.every((item) => item.passed)).toBe(true);
    expect(score.improvements.every((item) => !item.passed)).toBe(true);
  });
  it("does not award CRO points for missing business facts", () => {
    const score = scoreCro({
      sections,
      hasPrice: false,
      hasDuration: false,
      hasContact: false,
      bookingUrl: null,
      stickyMobileCta: false,
      testimonialCount: 0,
      galleryCount: 0,
      hasCancellation: false,
      hasLocation: false,
      hasInclusions: false,
    });
    expect(score.improvements.map((item) => item.id)).toContain("price");
    expect(score.score).toBeLessThan(40);
  });
});

describe("structured discovery outputs", () => {
  it("emits defensible JSON-LD without invented ratings", () => {
    const organization = organizationJsonLd(
      {
        name: "Dubai Wave Jetski",
        businessType: "jetski",
        city: "Dubai",
        country: "AE",
      },
      "https://example.com",
    );
    const trip = experienceJsonLd(
      {
        name: "60 Minute Jet Ski",
        description: "A demo experience.",
        price: 400,
        currency: "AED",
      },
      "https://example.com/experiences/60-minute",
    );
    expect(JSON.stringify([organization, trip])).not.toContain(
      "aggregateRating",
    );
    expect(
      breadcrumbJsonLd([{ name: "Home", url: "https://example.com" }])
        .itemListElement[0]?.position,
    ).toBe(1);
  });
  it("builds tenant sitemap and robots text", () => {
    expect(
      buildSitemap("https://example.com/", [{ path: "/experiences" }]),
    ).toContain("https://example.com/experiences");
    expect(buildRobots("https://example.com", false)).toContain("Disallow: /");
    expect(buildRobots("https://example.com", true)).toContain(
      "Sitemap: https://example.com/sitemap.xml",
    );
  });
});
