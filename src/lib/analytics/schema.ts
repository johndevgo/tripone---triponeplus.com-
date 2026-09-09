import { z } from "zod";

export const analyticsEventNames = [
  "page_view",
  "experience_view",
  "rental_view",
  "booking_click",
  "whatsapp_click",
  "phone_click",
  "lead_submit",
  "cta_click",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export const analyticsEventSchema = z.object({
  eventName: z.enum(analyticsEventNames),
  pagePath: z
    .string()
    .min(1)
    .max(500)
    .regex(/^\/(?!\/)/),
  experienceId: z.union([z.literal(""), z.uuid()]).optional(),
  rentalProductId: z.union([z.literal(""), z.uuid()]).optional(),
  siteSlug: z
    .union([z.literal(""), z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)])
    .optional(),
  referrerDomain: z.string().max(253).optional(),
  sessionId: z
    .string()
    .min(16)
    .max(128)
    .regex(/^[a-zA-Z0-9_-]+$/),
  deviceCategory: z.enum(["mobile", "tablet", "desktop"]),
});

export function deviceCategory(width: number) {
  if (width < 768) return "mobile" as const;
  if (width < 1100) return "tablet" as const;
  return "desktop" as const;
}

export function summarizeEvents(
  events: Array<{
    event_name: string;
    page_path: string;
    session_id: string;
    created_at: string;
    experience_id?: string | null;
    rental_product_id?: string | null;
  }>,
) {
  const count = (name: AnalyticsEventName) =>
    events.filter((event) => event.event_name === name).length;
  const pageViews = count("page_view");
  const bookingClicks = count("booking_click");
  const leads = count("lead_submit");
  return {
    sessions: new Set(events.map((event) => event.session_id)).size,
    pageViews,
    experienceViews: count("experience_view"),
    rentalViews: count("rental_view"),
    bookingClicks,
    leads,
    whatsappClicks: count("whatsapp_click"),
    phoneClicks: count("phone_click"),
    bookingCtr: pageViews ? (bookingClicks / pageViews) * 100 : 0,
    leadConversion: pageViews ? (leads / pageViews) * 100 : 0,
  };
}
