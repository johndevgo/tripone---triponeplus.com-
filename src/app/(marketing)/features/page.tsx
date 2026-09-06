import {
  Layers3,
  Search,
  Smartphone,
  ShieldCheck,
  BarChart3,
  BookOpen,
  Globe2,
  Inbox,
  Palette,
  type LucideIcon,
} from "lucide-react";
const items: Array<[LucideIcon, string, string]> = [
  [
    Layers3,
    "Tourism-aware structure",
    "Pages and sections adapt to the kind of experiences you sell.",
  ],
  [
    Search,
    "SEO foundations",
    "Editable metadata and clean URL suggestions without keyword stuffing.",
  ],
  [
    Smartphone,
    "Responsive by default",
    "Professional layouts for phones, tablets and desktops.",
  ],
  [
    ShieldCheck,
    "Secure workspace",
    "Authenticated management backed by row-level data policies.",
  ],
  [
    Palette,
    "Visual website builder",
    "Reorder sections, choose variants and edit content inside professional guardrails.",
  ],
  [
    BookOpen,
    "Tour and activity CMS",
    "Manage pricing, itinerary, inclusions, booking links, locations and category-specific details.",
  ],
  [
    Inbox,
    "Enquiries and leads",
    "Capture validated enquiries and manage their progress from new to won.",
  ],
  [
    BarChart3,
    "First-party analytics",
    "Measure essential page, experience and booking actions without storing full IP addresses.",
  ],
  [
    Globe2,
    "Domains and publishing",
    "Publish to a TripOne+ hostname or connect a verified custom domain with canonical control.",
  ],
];
export default function Features() {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#FFC857]">
        Features
      </p>
      <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight">
        A website system that understands tourism.
      </h1>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map(([Icon, t, d]) => (
          <article className="glass rounded-3xl p-8" key={String(t)}>
            <Icon className="text-[#FFC857]" />
            <h2 className="mt-8 text-2xl font-semibold">{String(t)}</h2>
            <p className="mt-3 text-white/60">{String(d)}</p>
          </article>
        ))}
      </div>
    </>
  );
}
