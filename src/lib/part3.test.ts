import { describe, expect, it } from "vitest";
import { analyticsEventSchema, summarizeEvents } from "./analytics/schema";
import {
  hostnameSchema,
  isSafeRedirectDestination,
  normalizeHostname,
  wouldCreateRedirectLoop,
} from "./domains/validation";
import { buildRobots, buildSitemap } from "./seo/site-files";
import { experienceJsonLd, organizationJsonLd } from "./seo/structured-data";
import {
  isAppHostname,
  isTenantHostname,
  normalizeHost,
  safeTenantPath,
} from "./tenancy/hostname";

describe("production hostname rules", () => {
  it("normalizes customer domains and rejects reserved hosts", () => {
    expect(normalizeHostname("https://WWW.DubaiWaveJetski.com/offer")).toBe(
      "dubaiwavejetski.com",
    );
    expect(hostnameSchema.parse("www.dubaiwavejetski.com")).toBe(
      "dubaiwavejetski.com",
    );
    expect(hostnameSchema.safeParse("app.triponeplus.com").success).toBe(false);
    expect(hostnameSchema.safeParse("127.0.0.1").success).toBe(false);
  });

  it("separates application aliases from tenant hosts", () => {
    expect(normalizeHost("Dubai-Wave-Jetski.TripOnePlus.com:443")).toBe(
      "dubai-wave-jetski.triponeplus.com",
    );
    expect(isTenantHostname("dubai-wave-jetski.triponeplus.com")).toBe(true);
    expect(isAppHostname("tools.neurerohan.com.np")).toBe(true);
    expect(safeTenantPath("//evil.example")).toBeNull();
  });
});

describe("redirect safety", () => {
  it("allows only local paths and http(s) destinations", () => {
    expect(isSafeRedirectDestination("/new-tour")).toBe(true);
    expect(isSafeRedirectDestination("https://booking.example.com/tour")).toBe(
      true,
    );
    expect(isSafeRedirectDestination("javascript:alert(1)")).toBe(false);
    expect(isSafeRedirectDestination("//evil.example")).toBe(false);
  });

  it("detects direct and chained redirect loops", () => {
    expect(wouldCreateRedirectLoop("/a", "/a", [])).toBe(true);
    expect(
      wouldCreateRedirectLoop("/a", "/b", [
        { source_path: "/b", destination_path: "/c" },
        { source_path: "/c", destination_path: "/a" },
      ]),
    ).toBe(true);
  });
});

describe("privacy-first analytics", () => {
  it("validates bounded event payloads", () => {
    expect(
      analyticsEventSchema.safeParse({
        eventName: "booking_click",
        pagePath: "/experiences/marina-tour",
        sessionId: "1234567890abcdef",
        deviceCategory: "mobile",
      }).success,
    ).toBe(true);
    expect(
      analyticsEventSchema.safeParse({
        eventName: "password_capture",
        pagePath: "//bad",
        sessionId: "short",
        deviceCategory: "watch",
      }).success,
    ).toBe(false);
  });

  it("derives truthful conversion metrics from events", () => {
    const events = (
      [
        ["page_view", "s1"],
        ["page_view", "s2"],
        ["booking_click", "s2"],
        ["lead_submit", "s2"],
      ] as const
    ).map(([event_name, session_id]) => ({
      event_name,
      session_id,
      page_path: "/",
      created_at: "2026-09-06T00:00:00Z",
    }));
    expect(summarizeEvents(events)).toMatchObject({
      sessions: 2,
      pageViews: 2,
      bookingClicks: 1,
      leads: 1,
      bookingCtr: 50,
      leadConversion: 50,
    });
  });
});

describe("tenant SEO output", () => {
  it("escapes sitemap URLs and blocks indexing when disabled", () => {
    expect(buildSitemap("https://example.com", [{ path: "/a&b" }])).toContain(
      "/a&amp;b",
    );
    expect(buildRobots("https://example.com", false)).toContain("Disallow: /");
  });

  it("omits invented offers and empty organization values", () => {
    const trip = experienceJsonLd(
      { name: "Marina tour", description: "A guided route.", price: null },
      "https://example.com/tour",
    );
    const business = organizationJsonLd(
      { name: "Example Tours", phone: null },
      "https://example.com",
    );
    expect(trip).not.toHaveProperty("offers");
    expect(business).not.toHaveProperty("telephone");
  });
});
