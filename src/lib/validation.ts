import { z } from "zod";
import {
  businessCapabilities,
  businessTypes,
  rentalProductTypes,
  sectionTypes,
  themeIds,
  websitePageKeys,
} from "@/lib/types";

const optionalUrl = z.union([z.literal(""), z.url()]).optional();
export const experienceInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  experienceType: z.string().trim().min(2).max(60),
  priceFrom: z.number().nonnegative().nullable().optional(),
  currency: z.string().length(3),
  durationValue: z.number().positive().nullable().optional(),
  durationUnit: z.string().max(20).nullable().optional(),
  locationName: z.string().max(120).nullable().optional(),
  shortDescription: z.string().trim().min(10).max(240),
  featuredImageUrl: optionalUrl.nullable(),
  bookingUrl: optionalUrl.nullable(),
  extraDetails: z.record(z.string(), z.unknown()).optional(),
});

export const rentalInputSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    rentalType: z.enum(rentalProductTypes),
    shortDescription: z.string().trim().min(10).max(240),
    currency: z.string().length(3),
    quoteOnly: z.boolean(),
    rateAmount: z.number().nonnegative().nullable().optional(),
    rateUnit: z.enum(["hour", "day", "week"]),
    locationName: z.string().max(120).nullable().optional(),
    bookingUrl: optionalUrl.nullable(),
    featuredImageUrl: optionalUrl.nullable(),
  })
  .refine((value) => value.quoteOnly || value.rateAmount != null, {
    path: ["rateAmount"],
    message: "Add a starting rate or choose Request a quote.",
  });

export const onboardingSchema = z.object({
  businessType: z.enum(businessTypes),
  capabilities: z.array(z.enum(businessCapabilities)).min(1).max(12),
  pageSelections: z
    .array(
      z.object({
        key: z.enum(websitePageKeys),
        title: z.string().trim().min(1).max(80),
        slug: z
          .string()
          .regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .max(80),
        selected: z.boolean(),
        showInNavigation: z.boolean(),
        sections: z.array(z.enum(sectionTypes)).min(1).max(20),
      }),
    )
    .min(1)
    .max(10)
    .refine(
      (pages) => pages.some((page) => page.key === "home" && page.selected),
      "Home is required.",
    )
    .superRefine((pages, context) => {
      const keys = new Set<string>();
      const slugs = new Set<string>();
      pages.forEach((page, index) => {
        if (keys.has(page.key)) {
          context.addIssue({
            code: "custom",
            path: [index, "key"],
            message: "Each page type can only be included once.",
          });
        }
        keys.add(page.key);
        if (!page.selected) return;
        if (slugs.has(page.slug)) {
          context.addIssue({
            code: "custom",
            path: [index, "slug"],
            message: "Selected page paths must be unique.",
          });
        }
        slugs.add(page.slug);
      });
    }),
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(63),
  shortDescription: z.string().trim().min(10).max(240),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  region: z.string().max(80).optional(),
  timezone: z.string().min(1).max(80),
  currency: z.string().length(3),
  phone: z.string().max(40).optional(),
  whatsapp: z.string().max(40).optional(),
  email: z.email(),
  address: z.string().max(200).optional(),
  googleMapsUrl: optionalUrl,
  logoUrl: optionalUrl,
  brand: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
  experiences: z.array(experienceInputSchema).max(20),
  rentals: z.array(rentalInputSchema).max(20),
  themeId: z.enum(themeIds),
});
