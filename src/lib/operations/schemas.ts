import { z } from "zod";

export const bookingStatuses = [
  "draft",
  "pending",
  "awaiting_confirmation",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
] as const;

export const bookingSources = [
  "website",
  "manual",
  "phone",
  "whatsapp",
  "walk_in",
  "email",
  "ota",
  "partner",
  "other",
] as const;

export const resourceTypes = [
  "vehicle",
  "motorcycle",
  "jet_ski",
  "boat",
  "yacht",
  "atv",
  "buggy",
  "bicycle",
  "jeep",
  "equipment",
  "guide",
  "driver",
  "captain",
  "instructor",
  "capacity_pool",
  "other",
] as const;

export const leadStages = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
  "closed",
] as const;

const optionalUuid = z.union([z.literal(""), z.uuid()]);
const optionalUrl = z.union([z.literal(""), z.url()]);
const optionalMoney = z.union([z.literal(""), z.coerce.number().nonnegative()]);
const optionalPositiveInt = z.union([
  z.literal(""),
  z.coerce.number().int().positive(),
]);

export const packageItemSchema = z
  .object({
    experienceId: optionalUuid.default(""),
    rentalProductId: optionalUuid.default(""),
    dayNumber: optionalPositiveInt.default(""),
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().max(3000).default(""),
    optional: z.boolean().default(false),
    sortOrder: z.number().int().nonnegative(),
  })
  .refine(
    (value) =>
      Number(Boolean(value.experienceId)) +
        Number(Boolean(value.rentalProductId)) <=
      1,
    { message: "A package item can reference one existing service." },
  );

export const packageFormSchema = z.object({
  siteId: z.uuid(),
  id: optionalUuid,
  name: z.string().trim().min(2).max(140),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(140),
  shortDescription: z.string().trim().min(10).max(280),
  description: z.string().trim().max(20_000),
  durationDays: optionalPositiveInt,
  priceFrom: optionalMoney,
  currency: z
    .string()
    .trim()
    .length(3)
    .transform((value) => value.toUpperCase()),
  pricingLabel: z.string().trim().max(100),
  bookingMode: z.enum(["request", "enquiry", "external"]),
  bookingUrl: optionalUrl,
  bookingButtonLabel: z.string().trim().min(1).max(60),
  featuredImageUrl: optionalUrl,
  gallery: z.array(z.url()).max(30),
  details: z.object({
    startPoint: z.string().trim().max(200),
    endPoint: z.string().trim().max(200),
    difficulty: z.string().trim().max(100),
    bestSeason: z.string().trim().max(160),
    groupSize: z.string().trim().max(120),
    maxAltitude: z.string().trim().max(120),
    accommodation: z.string().trim().max(300),
    meals: z.string().trim().max(300),
  }),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
  highlights: z.array(z.string().min(1).max(500)).max(50),
  inclusions: z.array(z.string().min(1).max(500)).max(50),
  exclusions: z.array(z.string().min(1).max(500)).max(50),
  itinerary: z
    .array(
      z.object({
        day: z.number().int().positive(),
        title: z.string().min(1).max(160),
        description: z.string().max(3000),
        accommodation: z.string().max(500).default(""),
        meals: z.string().max(500).default(""),
        distance: z.string().max(120).default(""),
        hours: z.string().max(120).default(""),
      }),
    )
    .max(60),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1).max(300),
        answer: z.string().min(1).max(3000),
      }),
    )
    .max(30),
  policies: z.array(z.string().min(1).max(1000)).max(30),
  seoSettings: z.object({
    title: z.string().max(70),
    description: z.string().max(180),
  }),
  items: z.array(packageItemSchema).max(100),
});

export const bookingFormSchema = z
  .object({
    siteId: z.uuid(),
    customerName: z.string().trim().min(2).max(120),
    email: z.union([z.literal(""), z.email()]),
    phone: z.string().trim().max(40),
    experienceId: optionalUuid.default(""),
    rentalProductId: optionalUuid.default(""),
    packageId: optionalUuid.default(""),
    departureId: optionalUuid.default(""),
    leadId: optionalUuid.default(""),
    status: z.enum(bookingStatuses),
    source: z.enum(bookingSources),
    startsAt: z.iso.datetime({ offset: true }),
    endsAt: z.union([z.literal(""), z.iso.datetime({ offset: true })]),
    adults: z.coerce.number().int().nonnegative().max(1000),
    children: z.coerce.number().int().nonnegative().max(1000),
    quantity: z.coerce.number().int().positive().max(1000),
    quotedTotal: optionalMoney,
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase()),
    customerNotes: z.string().max(5000),
    internalNotes: z.string().max(10_000),
    idempotencyKey: z.string().min(16).max(128),
  })
  .superRefine((value, context) => {
    const targets = [
      value.experienceId,
      value.rentalProductId,
      value.packageId,
    ].filter(Boolean);
    if (targets.length !== 1)
      context.addIssue({
        code: "custom",
        path: ["experienceId"],
        message: "Choose exactly one product or service.",
      });
    if (value.adults + value.children < 1)
      context.addIssue({
        code: "custom",
        path: ["adults"],
        message: "Add at least one guest.",
      });
    if (value.endsAt && new Date(value.endsAt) <= new Date(value.startsAt))
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "End time must be after the start time.",
      });
    if (!value.email && !value.phone)
      context.addIssue({
        code: "custom",
        path: ["email"],
        message: "Add an email address or phone number.",
      });
  });

export const bookingUpdateFormSchema = z
  .object({
    siteId: z.uuid(),
    bookingId: z.uuid(),
    startsAt: z.iso.datetime({ offset: true }),
    endsAt: z.union([z.literal(""), z.iso.datetime({ offset: true })]),
    adults: z.coerce.number().int().nonnegative().max(1000),
    children: z.coerce.number().int().nonnegative().max(1000),
    quantity: z.coerce.number().int().positive().max(1000),
    quotedTotal: optionalMoney,
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase()),
    customerNotes: z.string().max(5000),
    internalNote: z.string().trim().max(3000),
    requirements: z.string().trim().max(3000),
    addOns: z.array(z.string().min(1).max(300)).max(30),
  })
  .superRefine((value, context) => {
    if (value.adults + value.children < 1)
      context.addIssue({
        code: "custom",
        path: ["adults"],
        message: "Add at least one guest.",
      });
    if (value.endsAt && new Date(value.endsAt) <= new Date(value.startsAt))
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "End time must be after the start time.",
      });
  });

export const publicBookingSchema = z
  .object({
    siteId: z.uuid(),
    targetType: z.enum(["experience", "rental", "package"]),
    targetId: z.uuid(),
    departureId: optionalUuid.default(""),
    name: z.string().trim().min(2).max(100),
    email: z.email(),
    phone: z.string().trim().max(40).optional(),
    requestedDate: z.iso.date(),
    requestedEndDate: z
      .union([z.literal(""), z.iso.date()])
      .optional()
      .default(""),
    startTime: z
      .string()
      .regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/)
      .optional()
      .default(""),
    endTime: z
      .string()
      .regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/)
      .optional()
      .default(""),
    pickupLocation: z.string().trim().max(200).optional().default(""),
    dropoffLocation: z.string().trim().max(200).optional().default(""),
    luggage: z.string().trim().max(120).optional().default(""),
    roomPreference: z.string().trim().max(200).optional().default(""),
    adults: z.coerce.number().int().nonnegative().max(1000),
    children: z.coerce.number().int().nonnegative().max(1000),
    quantity: z.coerce.number().int().positive().max(1000),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase()),
    message: z.string().max(3000).optional(),
    sourcePage: z.string().max(300),
    website: z.string().max(0).optional(),
    idempotencyKey: z.string().min(16).max(128),
    siteSlug: z
      .union([z.literal(""), z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)])
      .optional(),
  })
  .refine((value) => value.adults + value.children > 0, {
    message: "Select at least one guest.",
    path: ["adults"],
  })
  .refine(
    (value) => value.requestedDate >= new Date().toISOString().slice(0, 10),
    {
      message: "Choose today or a future date.",
      path: ["requestedDate"],
    },
  )
  .refine(
    (value) =>
      !value.requestedEndDate || value.requestedEndDate >= value.requestedDate,
    {
      message: "The return date must be on or after the start date.",
      path: ["requestedEndDate"],
    },
  );

export const resourceFormSchema = z.object({
  siteId: z.uuid(),
  resourceId: optionalUuid.default(""),
  name: z.string().trim().min(2).max(120),
  resourceType: z.enum(resourceTypes),
  identifier: z.string().trim().max(120),
  capacity: z.coerce.number().int().positive().max(100_000),
  status: z.enum(["available", "unavailable", "maintenance", "archived"]),
  notes: z.string().max(10_000),
  imageUrl: optionalUrl.default(""),
  specifications: z.record(z.string().max(80), z.string().max(300)).default({}),
});

export const departureFormSchema = z
  .object({
    siteId: z.uuid(),
    experienceId: optionalUuid.default(""),
    rentalProductId: optionalUuid.default(""),
    packageId: optionalUuid.default(""),
    startsAt: z.iso.datetime({ offset: true }),
    endsAt: z.union([z.literal(""), z.iso.datetime({ offset: true })]),
    capacity: optionalPositiveInt,
    minimumParticipants: optionalPositiveInt,
    status: z.enum(["open", "closed", "cancelled"]),
    notes: z.string().max(5000),
  })
  .refine(
    (value) =>
      [value.experienceId, value.rentalProductId, value.packageId].filter(
        Boolean,
      ).length === 1,
    { message: "Choose exactly one product or service." },
  );

export const availabilityRuleFormSchema = z
  .object({
    siteId: z.uuid(),
    experienceId: optionalUuid.default(""),
    rentalProductId: optionalUuid.default(""),
    packageId: optionalUuid.default(""),
    name: z.string().trim().min(2).max(120),
    scheduleType: z.enum([
      "recurring",
      "fixed_departures",
      "date_range",
      "on_request",
    ]),
    startsOn: z.union([z.literal(""), z.iso.date()]),
    endsOn: z.union([z.literal(""), z.iso.date()]),
    daysOfWeek: z.array(z.coerce.number().int().min(0).max(6)).max(7),
    startTime: z.string().regex(/^$|^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^$|^\d{2}:\d{2}$/),
    slotIntervalMinutes: optionalPositiveInt.default(""),
    blackoutDates: z.array(z.iso.date()).max(365).default([]),
    capacity: optionalPositiveInt,
    minimumParticipants: optionalPositiveInt,
    minimumNoticeHours: z.coerce.number().int().nonnegative().max(8760),
    cutoffHours: z.coerce.number().int().nonnegative().max(8760),
    active: z.boolean(),
  })
  .superRefine((value, context) => {
    if (
      [value.experienceId, value.rentalProductId, value.packageId].filter(
        Boolean,
      ).length !== 1
    )
      context.addIssue({
        code: "custom",
        path: ["experienceId"],
        message: "Choose exactly one product or service.",
      });
    if (value.startsOn && value.endsOn && value.endsOn < value.startsOn)
      context.addIssue({
        code: "custom",
        path: ["endsOn"],
        message: "The end date must be on or after the start date.",
      });
    if (value.scheduleType === "recurring" && !value.daysOfWeek.length)
      context.addIssue({
        code: "custom",
        path: ["daysOfWeek"],
        message: "Choose at least one operating day.",
      });
    if (value.startTime && value.endTime && value.endTime <= value.startTime)
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "The end time must be after the start time.",
      });
  });

export function parseLines(value: FormDataEntryValue | null, max = 50) {
  return z
    .array(z.string().trim().min(1).max(1000))
    .max(max)
    .parse(
      String(value ?? "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    );
}

export function canTransitionBooking(
  from: (typeof bookingStatuses)[number],
  to: (typeof bookingStatuses)[number],
) {
  if (from === to) return true;
  const transitions: Record<
    (typeof bookingStatuses)[number],
    readonly string[]
  > = {
    draft: ["pending", "cancelled"],
    pending: ["awaiting_confirmation", "confirmed", "cancelled"],
    awaiting_confirmation: ["confirmed", "cancelled"],
    confirmed: ["completed", "no_show", "cancelled"],
    cancelled: [],
    completed: [],
    no_show: [],
  };
  return transitions[from].includes(to);
}
