import type { SiteSection } from "@/lib/types";

export type ReadinessCheck = {
  id: string;
  label: string;
  weight: number;
  passed: boolean;
  detail: string;
};

export type ReadinessScore = {
  score: number;
  passed: ReadinessCheck[];
  improvements: ReadinessCheck[];
};

export type SeoScoreInput = {
  title?: string;
  description?: string;
  canonical?: string;
  indexable?: boolean;
  slug: string;
  sections: SiteSection[];
  images: Array<{ alt?: string | null }>;
  hasBreadcrumbs?: boolean;
};

export function scoreSeo(input: SeoScoreInput): ReadinessScore {
  const h1Sections = input.sections.filter(
    (section) => section.visible && section.type === "hero",
  );
  const altComplete =
    input.images.length === 0 ||
    input.images.every((image) => Boolean(image.alt?.trim()));
  const links = input.sections.some((section) =>
    Object.keys(section.settings).some((key) =>
      key.toLowerCase().includes("href"),
    ),
  );
  return total([
    check(
      "title",
      "SEO title configured",
      12,
      Boolean(input.title?.trim()),
      "Add a descriptive SEO title.",
    ),
    check(
      "title-length",
      "Title has a useful length",
      8,
      between(input.title, 30, 60),
      "Aim for roughly 30–60 characters.",
    ),
    check(
      "description",
      "Meta description configured",
      10,
      Boolean(input.description?.trim()),
      "Add a concise page summary.",
    ),
    check(
      "description-length",
      "Description has a useful length",
      8,
      between(input.description, 70, 160),
      "Aim for roughly 70–160 characters.",
    ),
    check(
      "h1",
      "One logical page H1",
      12,
      h1Sections.length === 1,
      "Keep exactly one visible hero heading.",
    ),
    check(
      "canonical",
      "Canonical path configured",
      8,
      Boolean(input.canonical?.trim()),
      "Set the preferred canonical path.",
    ),
    check(
      "index",
      "Indexability is valid",
      5,
      input.indexable !== false,
      "Enable indexing when this page is ready.",
    ),
    check(
      "alt",
      "Images have alternative text",
      10,
      altComplete,
      "Add useful alt text to every content image.",
    ),
    check(
      "links",
      "Useful internal action exists",
      7,
      links,
      "Add a relevant internal call to action.",
    ),
    check(
      "breadcrumbs",
      "Breadcrumbs are available",
      5,
      input.hasBreadcrumbs !== false,
      "Enable breadcrumbs on detail pages.",
    ),
    check(
      "semantic",
      "Semantic section structure is valid",
      8,
      input.sections.length >= 2,
      "Add enough structured content to explain the page.",
    ),
    check(
      "slug",
      "Slug is clean",
      7,
      input.slug === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug),
      "Use a short lowercase, hyphenated slug.",
    ),
  ]);
}

export type CroScoreInput = {
  sections: SiteSection[];
  hasPrice: boolean;
  hasDuration: boolean;
  hasContact: boolean;
  bookingUrl?: string | null;
  stickyMobileCta?: boolean;
  testimonialCount: number;
  galleryCount: number;
  hasCancellation: boolean;
  hasLocation: boolean;
  hasInclusions: boolean;
};

export function scoreCro(input: CroScoreInput): ReadinessScore {
  const visible = input.sections.filter((section) => section.visible);
  const first = visible[0];
  const has = (type: SiteSection["type"]) =>
    visible.some((section) => section.type === type);
  const primaryAboveFold =
    first?.type === "hero" && Boolean(first.settings.primaryCta);
  return total([
    check(
      "cta",
      "Primary CTA above the fold",
      12,
      primaryAboveFold,
      "Add a clear primary action to the hero.",
    ),
    check(
      "price",
      "Pricing is visible",
      8,
      input.hasPrice,
      "Add a starting price or an honest pricing label.",
    ),
    check(
      "duration",
      "Duration is visible",
      7,
      input.hasDuration,
      "Add duration to help guests compare options.",
    ),
    check(
      "contact",
      "A contact method is available",
      8,
      input.hasContact,
      "Add email, phone or WhatsApp contact details.",
    ),
    check(
      "booking",
      "Booking destination is configured",
      10,
      Boolean(input.bookingUrl),
      "Add a valid booking URL or enquiry path.",
    ),
    check(
      "sticky",
      "Mobile sticky CTA enabled",
      8,
      Boolean(input.stickyMobileCta),
      "Enable the mobile booking bar.",
    ),
    check(
      "trust",
      "Trust content is present",
      8,
      has("trustBar") || input.testimonialCount > 0,
      "Add verified trust information.",
    ),
    check(
      "faq",
      "FAQ is available",
      7,
      has("faq"),
      "Answer common booking questions.",
    ),
    check(
      "cancel",
      "Cancellation information exists",
      8,
      input.hasCancellation,
      "Explain the cancellation policy.",
    ),
    check(
      "gallery",
      "Gallery has at least four images",
      8,
      input.galleryCount >= 4,
      "Add at least four useful images.",
    ),
    check(
      "location",
      "Location or meeting point is clear",
      8,
      input.hasLocation,
      "Add location and meeting-point details.",
    ),
    check(
      "included",
      "Inclusions are explained",
      8,
      input.hasInclusions,
      "List what is included in the price.",
    ),
  ]);
}

function check(
  id: string,
  label: string,
  weight: number,
  passed: boolean,
  detail: string,
): ReadinessCheck {
  return { id, label, weight, passed, detail };
}
function total(checks: ReadinessCheck[]): ReadinessScore {
  return {
    score: checks
      .filter((item) => item.passed)
      .reduce((sum, item) => sum + item.weight, 0),
    passed: checks.filter((item) => item.passed),
    improvements: checks.filter((item) => !item.passed),
  };
}
function between(value: string | undefined, min: number, max: number) {
  const length = value?.trim().length ?? 0;
  return length >= min && length <= max;
}
