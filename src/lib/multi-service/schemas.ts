import { z } from "zod";
import {
  businessCapabilities,
  rentalProductTypes,
  taxonomyTypes,
} from "@/lib/types";

const nullableNumber = z.union([
  z.literal(""),
  z.coerce.number().nonnegative(),
]);
const optionalUrl = z.union([z.literal(""), z.url()]);

export const capabilitiesFormSchema = z
  .object({
    businessId: z.uuid(),
    capabilities: z.array(z.enum(businessCapabilities)).min(1).max(12),
    primaryCapability: z.enum(businessCapabilities),
  })
  .refine((value) => value.capabilities.includes(value.primaryCapability), {
    message: "The primary service must also be selected.",
    path: ["primaryCapability"],
  });

export const rentalRateSchema = z.object({
  label: z.string().trim().min(1).max(100),
  amount: nullableNumber,
  currency: z
    .string()
    .trim()
    .length(3)
    .transform((value) => value.toUpperCase()),
  pricingUnit: z.enum(["hour", "day", "week", "person", "group", "fixed"]),
  minimumQuantity: nullableNumber,
  maximumQuantity: nullableNumber,
  sortOrder: z.number().int().nonnegative(),
});

export const rentalProductFormSchema = z.object({
  siteId: z.uuid(),
  id: z.union([z.literal(""), z.uuid()]),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(140),
  rentalType: z.enum(rentalProductTypes),
  status: z.enum(["draft", "published", "archived"]),
  shortDescription: z.string().trim().min(10).max(240),
  description: z.string().max(12_000),
  brand: z.string().trim().max(100),
  model: z.string().trim().max(100),
  capacity: nullableNumber,
  minimumAge: nullableNumber,
  licenseRequired: z.boolean(),
  securityDeposit: nullableNumber,
  currency: z
    .string()
    .trim()
    .length(3)
    .transform((value) => value.toUpperCase()),
  pricingLabel: z.string().trim().max(100),
  locationName: z.string().trim().max(140),
  bookingUrl: optionalUrl,
  bookingButtonLabel: z.string().trim().min(1).max(60),
  quoteOnly: z.boolean(),
  featured: z.boolean(),
  featuredImageUrl: optionalUrl,
  gallery: z
    .array(z.object({ url: z.url(), alt: z.string().max(160) }))
    .max(30),
  specifications: z
    .array(
      z.object({
        label: z.string().min(1).max(80),
        value: z.string().min(1).max(200),
      }),
    )
    .max(30),
  inclusions: z.array(z.string().min(1).max(500)).max(50),
  exclusions: z.array(z.string().min(1).max(500)).max(50),
  rentalTerms: z.array(z.string().min(1).max(500)).max(50),
  seoSettings: z.object({
    title: z.string().max(70),
    description: z.string().max(180),
  }),
  rates: z.array(rentalRateSchema).max(12),
});

export const taxonomyTermFormSchema = z.object({
  siteId: z.uuid(),
  taxonomyId: z.uuid(),
  taxonomyType: z.enum(taxonomyTypes),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().max(140),
  parentId: z.union([z.literal(""), z.uuid()]),
  description: z.string().trim().max(4000),
  listingMode: z.enum(["automatic", "manual"]),
  status: z.enum(["draft", "published", "archived"]),
});

export function parseLineList(value: FormDataEntryValue | null, max = 50) {
  return z
    .array(z.string().trim().min(1).max(500))
    .max(max)
    .parse(
      String(value ?? "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    );
}

export function parseSpecifications(
  labels: FormDataEntryValue[],
  values: FormDataEntryValue[],
) {
  return labels
    .map((label, index) => ({
      label: String(label).trim(),
      value: String(values[index] ?? "").trim(),
    }))
    .filter((item) => item.label && item.value);
}
