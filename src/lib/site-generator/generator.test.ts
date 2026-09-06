import { describe, expect, it } from "vitest";
import {
  businessTypes,
  sectionsSchema,
  type OnboardingInput,
} from "@/lib/types";
import { slugify } from "@/lib/utils";
import {
  generateSite,
  getBusinessPreset,
  getTheme,
  createExperienceSeo,
} from ".";

const input: OnboardingInput = {
  businessType: "jetski",
  name: "Dubai Wave Jetski",
  slug: "dubai-wave-jetski",
  shortDescription: "Guided jet ski experiences around Dubai Marina.",
  country: "United Arab Emirates",
  city: "Dubai Marina",
  timezone: "Asia/Dubai",
  currency: "AED",
  email: "demo@example.com",
  brand: { primary: "#063D2E", secondary: "#087A5A", accent: "#F5A623" },
  experiences: [],
  themeId: "horizon",
};

describe("deterministic generation", () => {
  it("creates safe slugs", () =>
    expect(slugify("  Côte & Wave!  ")).toBe("cote-and-wave"));
  it("selects category terminology", () =>
    expect(getBusinessPreset("safari").plural).toBe("safaris"));
  it("generates pages with valid sections", () => {
    const site = generateSite(input);
    expect(site.pages[0]?.slug).toBe("");
    expect(site.pages.length).toBeGreaterThan(4);
    site.pages.forEach((page) =>
      expect(sectionsSchema.safeParse(page.sections).success).toBe(true),
    );
  });
  it("provides valid page recipes for every supported business type", () => {
    for (const businessType of businessTypes) {
      const site = generateSite({ ...input, businessType });
      expect(site.pages[0]?.pageType).toBe("home");
      expect(site.navigation[0]).toEqual({ label: "Home", href: "/" });
      site.pages.forEach((page) =>
        expect(sectionsSchema.safeParse(page.sections).success).toBe(true),
      );
    }
  });
  it("uses category-specific homepage recipes and catalogue links", () => {
    const safari = generateSite({ ...input, businessType: "safari" });
    expect(
      safari.pages[0]?.sections.some(
        (section) => section.type === "wildlifeHighlights",
      ),
    ).toBe(true);
    const agency = generateSite({ ...input, businessType: "travel_agency" });
    expect(
      agency.pages[0]?.sections.find((section) => section.type === "hero")
        ?.settings.primaryHref,
    ).toBe("/packages");
  });
  it("does not generate unsupported performance claims", () => {
    const snapshot = JSON.stringify(generateSite(input)).toLowerCase();
    expect(snapshot).not.toMatch(/#1|award-winning|happy customers|best in/);
  });
  it("merges brand tokens", () =>
    expect(getTheme("atlas", { primary: "#000000" }).colors.primary).toBe(
      "#000000",
    ));
  it("limits SEO titles", () =>
    expect(
      createExperienceSeo(
        "A very long and descriptive ninety minute jet ski experience around the coastline",
        input.name,
        input.city,
      ).title.length,
    ).toBeLessThanOrEqual(60));
});
