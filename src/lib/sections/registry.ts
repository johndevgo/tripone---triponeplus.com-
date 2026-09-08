import { z } from "zod";
import { sectionTypes, type SiteSection } from "@/lib/types";

export const spacingOptions = [
  "compact",
  "standard",
  "spacious",
  "extra",
] as const;
export const alignmentOptions = ["left", "center"] as const;

const commonSettings = z
  .object({
    eyebrow: z.string().max(100).optional(),
    title: z.string().max(160).optional(),
    description: z.string().max(1000).optional(),
    body: z.string().max(10000).optional(),
    alignment: z.enum(alignmentOptions).optional(),
    spacing: z.enum(spacingOptions).optional(),
    backgroundStyle: z
      .enum(["default", "surface", "primary", "accent"])
      .optional(),
  })
  .catchall(z.unknown());

const heroSettings = commonSettings.extend({
  title: z.string().min(1).max(160),
  primaryCta: z.string().max(60).optional(),
  primaryHref: z.string().max(500).optional(),
  secondaryCta: z.string().max(60).optional(),
  secondaryHref: z.string().max(500).optional(),
  imageUrl: z.union([z.literal(""), z.url()]).optional(),
  overlay: z.number().min(0).max(90).optional(),
  height: z.enum(["compact", "standard", "tall", "screen"]).optional(),
  focalPosition: z
    .enum(["center", "top", "bottom", "left", "right"])
    .optional(),
});

const faqSettings = commonSettings.extend({
  items: z
    .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
    .max(30)
    .optional(),
});

const videoSettings = commonSettings.extend({
  url: z.union([z.literal(""), z.url()]).optional(),
  caption: z.string().max(240).optional(),
});

export type SectionCategory =
  | "Popular"
  | "Tours & Experiences"
  | "Content"
  | "Trust"
  | "Media"
  | "Conversion"
  | "Contact"
  | "Layout";

export type SectionDefinition = {
  label: string;
  description: string;
  category: SectionCategory;
  icon: string;
  variants: readonly string[];
  schema: z.ZodType<Record<string, unknown>>;
  defaultSettings: () => Record<string, unknown>;
  editorFields: readonly string[];
  renderer: string;
};

const definitions: Record<(typeof sectionTypes)[number], SectionDefinition> = {
  hero: define(
    "Hero",
    "Lead with a destination or experience.",
    "Popular",
    "Image",
    ["immersive", "split", "minimal", "cinematic", "destination"],
    heroSettings,
    () => ({
      eyebrow: "Explore",
      title: "A remarkable experience awaits",
      description: "Add a clear, useful introduction for your guests.",
      primaryCta: "View experiences",
      primaryHref: "/experiences",
      alignment: "left",
      spacing: "spacious",
      overlay: 45,
      height: "tall",
    }),
  ),
  trustBar: define(
    "Trust bar",
    "Surface practical reasons to book.",
    "Trust",
    "ShieldCheck",
    ["icons", "social-proof", "compact"],
    commonSettings,
    () => ({ title: "Plan with confidence", spacing: "compact" }),
  ),
  featuredExperiences: experience("Featured experiences", [
    "grid",
    "cards",
    "carousel",
    "featured",
    "compact-list",
  ]),
  experienceGrid: experience("Experience collection", [
    "grid",
    "cards",
    "carousel",
    "featured",
    "compact-list",
  ]),
  rentalGrid: cards(
    "Rental collection",
    "Show rentable vehicles, watercraft or equipment with honest rates.",
    "Tours & Experiences",
    ["product-grid", "rate-cards", "compact-list"],
  ),
  featuredPackages: experience("Featured packages", [
    "grid",
    "cards",
    "carousel",
    "featured",
    "compact-list",
  ]),
  destinations: cards(
    "Destinations",
    "Show the places guests can explore.",
    "Tours & Experiences",
    ["image-cards", "editorial", "horizontal"],
  ),
  popularDestinations: cards(
    "Popular destinations",
    "Feature priority destinations.",
    "Tours & Experiences",
    ["image-cards", "editorial", "horizontal"],
  ),
  whyChooseUs: cards("Why choose us", "Explain real customer value.", "Trust", [
    "cards",
    "icon-grid",
    "split",
  ]),
  whyTravelWithUs: cards(
    "Why travel with us",
    "Explain your planning value.",
    "Trust",
    ["cards", "icon-grid", "split"],
  ),
  features: cards("Features", "Present useful service features.", "Content", [
    "icon-grid",
    "columns",
    "alternating",
  ]),
  safety: cards("Safety", "Share verified safety information.", "Trust", [
    "cards",
    "checklist",
    "split",
  ]),
  gallery: cards("Gallery", "Show real guest-facing imagery.", "Media", [
    "grid",
    "masonry",
    "feature-grid",
    "carousel",
  ]),
  testimonials: cards(
    "Testimonials",
    "Publish genuine customer feedback.",
    "Trust",
    ["cards", "carousel", "featured", "ratings-grid"],
  ),
  stats: cards("Stats", "Show verified business metrics only.", "Trust", [
    "row",
    "cards",
  ]),
  guides: cards("Guides / team", "Introduce real team members.", "Content", [
    "cards",
    "featured",
  ]),
  richText: define(
    "Rich text",
    "Add structured editorial copy.",
    "Content",
    "AlignLeft",
    ["editorial", "narrow", "two-column"],
    commonSettings,
    () => ({
      title: "Your heading",
      body: "Add helpful, accurate content here.",
      spacing: "standard",
    }),
  ),
  location: cards(
    "Location",
    "Explain where guests meet or travel.",
    "Contact",
    ["map-content", "image-content", "meeting-point"],
  ),
  faq: define(
    "FAQ",
    "Answer booking questions clearly.",
    "Content",
    "CircleHelp",
    ["accordion", "two-column", "categorized"],
    faqSettings,
    () => ({
      title: "Frequently asked questions",
      items: [
        {
          question: "How do I book?",
          answer: "Use the booking or enquiry option shown on this website.",
        },
      ],
      spacing: "standard",
    }),
  ),
  contact: cards(
    "Contact",
    "Add contact details and an enquiry form.",
    "Contact",
    ["form", "compact", "split"],
  ),
  finalCta: define(
    "Final CTA",
    "Close the page with a clear next step.",
    "Conversion",
    "MousePointerClick",
    ["banner", "image", "minimal", "high-impact"],
    commonSettings,
    () => ({
      title: "Ready to plan your experience?",
      description: "Choose an experience or get in touch with the team.",
      label: "View experiences",
      href: "/experiences",
      spacing: "spacious",
    }),
  ),
  wildlifeHighlights: cards(
    "Wildlife highlights",
    "Set accurate safari expectations.",
    "Tours & Experiences",
    ["cards", "editorial", "compact"],
  ),
  difficultyOverview: cards(
    "Difficulty overview",
    "Help guests choose suitable activities.",
    "Tours & Experiences",
    ["cards", "scale", "compact"],
  ),
  specialOffers: cards(
    "Special offers",
    "Feature genuine current offers.",
    "Conversion",
    ["cards", "banner", "compact"],
  ),
  logoRow: cards(
    "Logo / trust badges",
    "Display approved affiliations or partners.",
    "Trust",
    ["row", "boxed"],
  ),
  video: define(
    "Video",
    "Embed one YouTube or Vimeo video.",
    "Media",
    "Play",
    ["wide", "contained"],
    videoSettings,
    () => ({ title: "Watch the experience", url: "", spacing: "standard" }),
  ),
  divider: define(
    "Spacer / divider",
    "Create constrained visual breathing room.",
    "Layout",
    "Minus",
    ["space", "line"],
    commonSettings,
    () => ({ spacing: "standard" }),
  ),
};

function define(
  label: string,
  description: string,
  category: SectionCategory,
  icon: string,
  variants: readonly string[],
  schema: z.ZodType<Record<string, unknown>>,
  defaults: () => Record<string, unknown>,
): SectionDefinition {
  return {
    label,
    description,
    category,
    icon,
    variants,
    schema,
    defaultSettings: defaults,
    editorFields: ["content", "design", "layout", "visibility"],
    renderer: label,
  };
}
function cards(
  label: string,
  description: string,
  category: SectionCategory,
  variants: readonly string[],
) {
  return define(
    label,
    description,
    category,
    "LayoutGrid",
    variants,
    commonSettings,
    () => ({ title: label, description, spacing: "standard" }),
  );
}
function experience(label: string, variants: readonly string[]) {
  return cards(
    label,
    "Show bookable tours, activities or packages.",
    "Tours & Experiences",
    variants,
  );
}

export const sectionRegistry = definitions;

export function createDefaultSection(
  type: keyof typeof sectionRegistry,
  variant?: string,
): SiteSection {
  const definition = sectionRegistry[type];
  return {
    id: crypto.randomUUID(),
    type,
    variant: variant ?? definition.variants[0]!,
    visible: true,
    settings: definition.defaultSettings(),
  };
}

export function validateSection(section: SiteSection) {
  const definition = sectionRegistry[section.type];
  return definition.schema.safeParse(section.settings);
}
