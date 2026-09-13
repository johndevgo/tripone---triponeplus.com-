import { describe, expect, it } from "vitest";
import {
  bookingFormSchema,
  canTransitionBooking,
  packageFormSchema,
  publicBookingSchema,
} from "./schemas";

describe("operations schemas", () => {
  it("requires one booking target and one guest", () => {
    const base = {
      siteId: "10000000-0000-4000-8000-000000000001",
      customerName: "Maya Rai",
      email: "maya@example.com",
      phone: "",
      experienceId: "10000000-0000-4000-8000-000000000002",
      rentalProductId: "",
      packageId: "",
      departureId: "",
      status: "pending",
      source: "manual",
      startsAt: "2099-10-01T09:00:00+05:45",
      endsAt: "",
      adults: 1,
      children: 0,
      quantity: 1,
      quotedTotal: "",
      currency: "NPR",
      customerNotes: "",
      internalNotes: "",
      idempotencyKey: "10000000-0000-4000-8000-000000000003",
    };
    expect(bookingFormSchema.safeParse(base).success).toBe(true);
    expect(
      bookingFormSchema.safeParse({
        ...base,
        rentalProductId: "10000000-0000-4000-8000-000000000004",
      }).success,
    ).toBe(false);
    expect(bookingFormSchema.safeParse({ ...base, adults: 0 }).success).toBe(
      false,
    );
  });

  it("enforces the booking state machine", () => {
    expect(canTransitionBooking("pending", "confirmed")).toBe(true);
    expect(canTransitionBooking("confirmed", "pending")).toBe(false);
    expect(canTransitionBooking("cancelled", "confirmed")).toBe(false);
  });

  it("validates public booking idempotency and guests", () => {
    const value = {
      siteId: "10000000-0000-4000-8000-000000000001",
      targetType: "package",
      targetId: "10000000-0000-4000-8000-000000000002",
      name: "Maya Rai",
      email: "maya@example.com",
      requestedDate: "2099-10-01",
      adults: 2,
      children: 0,
      quantity: 1,
      currency: "NPR",
      message: "",
      sourcePage: "/packages/nepal",
      idempotencyKey: "10000000-0000-4000-8000-000000000003",
    };
    expect(publicBookingSchema.safeParse(value).success).toBe(true);
    expect(publicBookingSchema.safeParse({ ...value, adults: 0 }).success).toBe(
      false,
    );
    expect(
      publicBookingSchema.safeParse({ ...value, requestedDate: "2000-01-01" })
        .success,
    ).toBe(false);
    expect(
      publicBookingSchema.safeParse({
        ...value,
        targetType: "rental",
        requestedDate: "2099-10-05",
        requestedEndDate: "2099-10-04",
        startTime: "09:00",
        endTime: "17:00",
      }).success,
    ).toBe(false);
    expect(
      publicBookingSchema.safeParse({
        ...value,
        targetType: "rental",
        requestedEndDate: "2099-10-03",
        pickupLocation: "Lakeside office",
      }).success,
    ).toBe(true);
  });

  it("keeps package composition as references", () => {
    const result = packageFormSchema.safeParse({
      siteId: "10000000-0000-4000-8000-000000000001",
      id: "",
      name: "Seven-day Nepal Adventure",
      slug: "seven-day-nepal-adventure",
      shortDescription: "A clearly described multi-day demo package.",
      description: "",
      durationDays: 7,
      priceFrom: 1200,
      currency: "USD",
      pricingLabel: "From",
      bookingMode: "request",
      bookingUrl: "",
      bookingButtonLabel: "Request this package",
      featuredImageUrl: "",
      gallery: [],
      details: {
        startPoint: "Kathmandu",
        endPoint: "Pokhara",
        difficulty: "Moderate",
        bestSeason: "October to April",
        groupSize: "2 to 12 guests",
        maxAltitude: "1,600 m",
        accommodation: "Locally owned hotels",
        meals: "Breakfast",
      },
      featured: true,
      status: "draft",
      highlights: [],
      inclusions: [],
      exclusions: [],
      itinerary: [],
      faqs: [],
      policies: [],
      seoSettings: { title: "", description: "" },
      items: [
        {
          experienceId: "10000000-0000-4000-8000-000000000002",
          rentalProductId: "",
          dayNumber: 2,
          title: "Kathmandu tour",
          description: "",
          optional: false,
          sortOrder: 0,
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
