import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers3, Search } from "lucide-react";
import {
  getSeoPageImage,
  getSeoPageImageAlt,
  getSeoPages,
  type SeoNamespace,
} from "@/content/seo-catalog";

const hubCopy = {
  services: [
    "Travel growth services",
    "Specialist strategy for visibility, demand, conversion and measurable direct-booking growth.",
  ],
  for: [
    "TripOne+ for travel businesses",
    "Explore website, booking, customer and operating workflows shaped around different tourism business models.",
  ],
  compare: [
    "Travel software comparisons",
    "Use a transparent workflow-first framework to compare TripOne+ with website, booking, CRM and operations platforms.",
  ],
  resources: [
    "Travel business resources",
    "Practical plans, checklists, templates and operating frameworks for tour and travel teams.",
  ],
  tools: [
    "Free travel business tools",
    "Run transparent calculations and create useful first drafts without submitting data or using an AI API.",
  ],
  blog: [
    "Tour and travel business guides",
    "In-depth guidance across startup, marketing, websites, operations, pricing, bookings and customer growth.",
  ],
} as const;

export function SeoHubPage({ namespace }: { namespace: SeoNamespace }) {
  const pages = getSeoPages(namespace);
  const [title, description] = hubCopy[namespace];
  return (
    <>
      <section className="mx-auto max-w-4xl text-center">
        <p className="marketing-kicker mx-auto">
          <Layers3 size={15} /> {pages.length} expert pages
        </p>
        <h1 className="marketing-title mt-6">{title}</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/60">
          {description}
        </p>
      </section>
      <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((page, index) => (
          <Link
            key={page.path}
            href={page.path}
            className="glass group overflow-hidden rounded-[1.7rem] transition hover:-translate-y-1 hover:border-emerald-300/30"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={getSeoPageImage(page)}
                alt={getSeoPageImageAlt(page)}
                fill
                preload={index < 3}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#031c10] via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#95ee8e]">
                <Search size={14} /> {page.keywordCluster}
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-snug">
                {page.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
                {page.metaDescription}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/72 group-hover:text-white">
                Explore page <ArrowRight size={15} />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}

export function seoHubMetadata(namespace: SeoNamespace) {
  const [title, description] = hubCopy[namespace];
  return {
    title,
    description,
    alternates: { canonical: `/${namespace}` },
    openGraph: {
      title: `${title} | TripOne+`,
      description,
      url: `/${namespace}`,
    },
  };
}
