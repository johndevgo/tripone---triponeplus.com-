import { z } from "zod";
import { businessTypes, themeIds } from "@/lib/types";

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

export const onboardingSchema = z.object({
  businessType: z.enum(businessTypes),
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
  themeId: z.enum(themeIds),
});
