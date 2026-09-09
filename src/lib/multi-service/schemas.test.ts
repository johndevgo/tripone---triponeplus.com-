import { describe, expect, it } from "vitest";
import { themes } from "@/lib/site-generator/themes";
import {
  capabilitiesFormSchema,
  rentalProductFormSchema,
} from "@/lib/multi-service/schemas";
import { businessCapabilities, themeIds } from "@/lib/types";
import { currentPublicSiteUrl } from "@/lib/tenancy/public-url";

describe("multi-service validation", () => {
  it("accepts several capabilities with a selected primary", () => {
    const parsed = capabilitiesFormSchema.parse({
      businessId: "d7948642-12bc-4cf5-9fe0-7af980680701",
      capabilities: ["trekking", "motorcycle_tour", "equipment_rental"],
      primaryCapability: "trekking",
    });
    expect(parsed.capabilities).toHaveLength(3);
  });

  it("rejects a primary capability that is not selected", () => {
    expect(() =>
      capabilitiesFormSchema.parse({
        businessId: "d7948642-12bc-4cf5-9fe0-7af980680701",
        capabilities: ["trekking"],
        primaryCapability: "safari",
      }),
    ).toThrow(/primary service/i);
  });

  it("accepts a quote-only rental without an invented price", () => {
    const parsed = rentalProductFormSchema.parse({
      siteId: "d7948642-12bc-4cf5-9fe0-7af980680701",
      id: "",
      name: "Himalayan riding jacket",
      slug: "himalayan-riding-jacket",
      rentalType: "equipment",
      status: "draft",
      shortDescription:
        "Protective riding equipment available for confirmed tour dates.",
      description: "",
      brand: "",
      model: "",
      capacity: "",
      minimumAge: "",
      licenseRequired: false,
      securityDeposit: "",
      currency: "npr",
      pricingLabel: "",
      locationName: "Kathmandu",
      bookingUrl: "",
      bookingButtonLabel: "Request rental",
      quoteOnly: true,
      featured: false,
      featuredImageUrl: "",
      gallery: [],
      specifications: [{ label: "Size", value: "Confirm before pickup" }],
      inclusions: [],
      exclusions: [],
      rentalTerms: [],
      seoSettings: { title: "", description: "" },
      rates: [],
    });
    expect(parsed.quoteOnly).toBe(true);
    expect(parsed.currency).toBe("NPR");
  });
});

describe("Part 4 catalogue", () => {
  it("contains the four new service capabilities", () => {
    expect(businessCapabilities).toEqual(
      expect.arrayContaining([
        "motorcycle_tour",
        "motorcycle_rental",
        "vehicle_rental",
        "equipment_rental",
      ]),
    );
  });

  it("ships eight complete theme presets", () => {
    expect(themeIds).toHaveLength(8);
    for (const id of themeIds) {
      expect(themes[id].id).toBe(id);
      expect(themes[id].colors.accent).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it("uses the honest fallback until a domain is verified", () => {
    expect(
      currentPublicSiteUrl(
        "nepal-rides",
        [
          {
            hostname: "nepal-rides.triponeplus.com",
            verification_status: "pending",
            is_primary: true,
          },
        ],
        "https://tools.neurerohan.com.np",
      ),
    ).toBe("https://tools.neurerohan.com.np/s/nepal-rides");
    expect(
      currentPublicSiteUrl(
        "nepal-rides",
        [
          {
            hostname: "nepal-rides.triponeplus.com",
            verification_status: "verified",
            is_primary: true,
          },
        ],
        "https://tools.neurerohan.com.np",
      ),
    ).toBe("https://tools.neurerohan.com.np/s/nepal-rides");
    expect(
      currentPublicSiteUrl(
        "nepal-rides",
        [
          {
            hostname: "nepalrides.example",
            verification_status: "verified",
            is_primary: true,
          },
        ],
        "https://tools.neurerohan.com.np",
      ),
    ).toBe("https://nepalrides.example");
  });
});
