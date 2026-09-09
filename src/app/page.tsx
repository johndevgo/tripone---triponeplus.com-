import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brush,
  Check,
  ChevronRight,
  Compass,
  Gauge,
  Globe2,
  Inbox,
  Layers3,
  MousePointerClick,
  Search,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { ResourceCard } from "@/components/marketing/resource-card";
import { ButtonLink } from "@/components/ui/button";
import { resources } from "@/content/resources";
import { getAppUrl } from "@/lib/app-url";

export const metadata: Metadata = {
  title: "Tourism website builder for tours, activities and rentals",
  description:
    "Build a polished, SEO-ready website for your tour, activity or rental business with structured services, visual editing, leads and analytics.",
  alternates: { canonical: "/" },
};

const categoryCards = [
  {
    label: "Water sports",
    description: "Jet skis, diving, snorkelling and guided water activities.",
    image: "/images/marketing/ocean-hero.webp",
  },
  {
    label: "Tours & guides",
    description: "Day tours, local guides, excursions and city experiences.",
    image: "/images/marketing/local-guide.webp",
  },
  {
    label: "Trekking",
    description: "Hikes, treks, routes, difficulty and multi-day details.",
    image: "/images/marketing/mountain-trek.webp",
  },
  {
    label: "Safaris",
    description: "Itineraries, wildlife context, guides and pickup details.",
    image: "/images/marketing/safari-dawn.webp",
  },
  {
    label: "Boat rentals",
    description: "Fleet, capacity, rates and quote-led journeys.",
    image: "/images/marketing/coastal-yacht.webp",
  },
  {
    label: "Diving",
    description: "Trip types, requirements, equipment and locations.",
    image: "/images/marketing/reef-diving.webp",
  },
];

const platformFeatures = [
  [
    Brush,
    "Visual builder",
    "Edit content, reorder sections and choose purposeful variants without breaking the design system.",
  ],
  [
    Layers3,
    "Structured tourism CMS",
    "Manage experiences, rentals, rates, destinations and details as reusable records.",
  ],
  [
    Search,
    "Technical SEO system",
    "Create clean metadata, canonical paths, sitemaps, redirects and truthful structured data.",
  ],
  [
    Inbox,
    "Lead workspace",
    "Capture validated enquiries and move each conversation through a focused status workflow.",
  ],
  [
    BarChart3,
    "First-party analytics",
    "Understand real page views, product interest, booking clicks and successful enquiries.",
  ],
  [
    Globe2,
    "Safe publishing",
    "Preview drafts, publish immutable snapshots and connect a verified domain when ready.",
  ],
] as const;

const proofPoints: Array<[LucideIcon, string]> = [
  [ShieldCheck, "Authenticated workspace and tenant-safe data"],
  [Gauge, "Server-rendered, responsive production output"],
  [MousePointerClick, "One renderer from preview to published site"],
];

const themePreviews = [
  ["Horizon", "/images/marketing/ocean-hero.webp", "rounded-[1.8rem]"],
  ["Luxe Voyage", "/images/marketing/coastal-yacht.webp", "rounded-sm"],
  ["Summit", "/images/marketing/mountain-trek.webp", "rounded-lg"],
  ["Nomad", "/images/marketing/local-guide.webp", "rounded-none"],
] as const;

const faqs = [
  {
    question: "Is TripOne+ a general website builder?",
    answer:
      "No. TripOne+ is designed around tourism records such as experiences, rentals, rates, destinations and booking journeys. The visual builder adds flexibility inside those guardrails.",
  },
  {
    question: "Does TripOne+ use an AI API to create websites?",
    answer:
      "No. Website generation is deterministic. Business-category presets, validated sections, safe copy templates and theme tokens create a predictable starting point.",
  },
  {
    question: "Can I use my existing booking system?",
    answer:
      "Yes. Add the booking URL for an experience or rental and TripOne+ will route high-intent visitors to that booking flow while measuring the outbound click.",
  },
  {
    question: "Can I publish before connecting a custom domain?",
    answer:
      "Yes. Every published site has a working hosted path. A verified custom domain can be connected later without maintaining a second renderer.",
  },
];

export default function Home() {
  const origin = getAppUrl("https://tools.neurerohan.com.np");
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "TripOne+",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: origin,
      description:
        "A tourism website builder for tour, activity and rental businesses.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free during early access",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <main className="overflow-hidden bg-[#f7faf9]">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <section className="app-bg relative isolate min-h-[52rem] overflow-hidden px-5 pb-24 pt-36 text-white lg:min-h-[58rem] lg:pb-28 lg:pt-44">
        <MarketingHeader />
        <Image
          src="/images/marketing/ocean-hero.webp"
          alt="A jet ski crossing clear coastal water at golden hour"
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#031b15_0%,rgba(3,27,21,.93)_35%,rgba(3,27,21,.56)_68%,rgba(3,27,21,.24)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,#041c16_0%,transparent_35%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
          <div>
            <p className="marketing-kicker border-white/15 bg-black/15 text-white/80">
              <Compass size={16} className="text-[#ffc857]" /> Built for
              tourism, not everything
            </p>
            <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[.98] tracking-[-.052em] sm:text-6xl lg:text-[5.25rem]">
              Websites built to{" "}
              <span className="text-[#ffc857]">sell experiences.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
              Turn your tours, activities and rentals into a fast, polished
              website—with the pages, SEO and booking journey already
              structured.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/signup" className="min-h-13 px-7 text-base">
                Build your website <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink
                href="#how-it-works"
                variant="secondary"
                className="min-h-13 px-7 text-base"
              >
                See how it works
              </ButtonLink>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/65">
              {[
                "Free during early access",
                "No AI API",
                "Preview before publishing",
              ].map((label) => (
                <span className="flex items-center gap-2" key={label}>
                  <Check className="text-[#ffc857]" size={16} /> {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-xl lg:block">
            <div className="glass rotate-[1.5deg] rounded-[1.8rem] p-3 shadow-[0_35px_100px_rgba(0,0,0,.38)]">
              <div className="overflow-hidden rounded-[1.35rem] bg-[#f8faf9] text-[#09271f]">
                <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-[#063d2e] text-white">
                      <Compass size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Dubai Wave</p>
                      <p className="text-[11px] text-[#647a72]">
                        Website preview
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#f5a623] px-3 py-2 text-xs font-semibold">
                    Book now
                  </span>
                </div>
                <div className="relative m-3 min-h-[23rem] overflow-hidden rounded-2xl">
                  <Image
                    src="/images/marketing/ocean-hero.webp"
                    alt=""
                    fill
                    sizes="36rem"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/95 via-[#022c22]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#ffc857]">
                      Dubai Marina
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                      Jet ski experiences made clear.
                    </h2>
                    <p className="mt-3 text-sm text-white/65">
                      Compare durations, routes and booking details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass absolute -bottom-8 -left-10 flex items-center gap-3 rounded-2xl p-4">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-300/15 text-emerald-200">
                <Search size={19} />
              </span>
              <div>
                <p className="text-xs text-white/45">SEO foundation</p>
                <p className="mt-0.5 text-sm font-semibold">
                  Metadata · sitemap · schema
                </p>
              </div>
            </div>
            <div className="glass absolute -right-7 -top-8 rounded-2xl p-4">
              <p className="text-xs text-white/45">Generated from your data</p>
              <p className="mt-1 text-sm font-semibold">
                Pages + services + navigation
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#063d2e]/8 bg-white px-5 py-7">
        <div className="mx-auto grid max-w-7xl gap-5 text-sm text-[#50675f] sm:grid-cols-3">
          {proofPoints.map(([Icon, label]) => (
            <div
              key={String(label)}
              className="flex items-center justify-center gap-3"
            >
              <Icon size={18} className="text-[#087a5a]" /> {String(label)}
            </div>
          ))}
        </div>
      </section>

      <section
        className="px-5 py-24 sm:py-28"
        aria-labelledby="built-for-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <p className="marketing-kicker marketing-kicker-light">
                Purpose-built
              </p>
              <h2 id="built-for-heading" className="marketing-title-light mt-5">
                Your business already has structure. Your website should too.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#60746d] lg:justify-self-end">
              TripOne+ adapts the starting pages, terminology, sections and
              information fields to what you actually sell.
            </p>
          </div>
          <div className="mt-12 grid auto-rows-[13rem] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryCards.map((category, index) => (
              <article
                key={category.label}
                className={`group relative overflow-hidden rounded-[1.6rem] ${index === 0 || index === 5 ? "sm:row-span-2" : ""}`}
              >
                <Image
                  src={category.image}
                  alt={category.description}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031b15]/95 via-[#031b15]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="text-xl font-semibold">{category.label}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/65">
                    {category.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#eaf2ef] px-5 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="marketing-kicker marketing-kicker-light">
              From data to live
            </p>
            <h2 className="marketing-title-light mt-5">
              A considered first draft in one guided workflow.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#60746d]">
              No blank canvas and no mystery generation. Every output comes from
              typed information and visible rules you can edit.
            </p>
          </div>
          <ol className="mt-12 grid gap-5 lg:grid-cols-4">
            {[
              [
                "01",
                "Describe the business",
                "Choose capabilities, location and the practical details visitors need.",
              ],
              [
                "02",
                "Add what you sell",
                "Create experiences, rentals and starting rates with category-specific fields.",
              ],
              [
                "03",
                "Choose a direction",
                "Select one of eight themes, then apply your logo and brand colors.",
              ],
              [
                "04",
                "Build and refine",
                "Generate pages, preview the draft, edit visually and publish a versioned snapshot.",
              ],
            ].map(([number, title, copy]) => (
              <li
                key={number}
                className="rounded-[1.5rem] border border-[#063d2e]/10 bg-white p-6 shadow-[0_16px_45px_rgba(2,44,34,.06)]"
              >
                <span className="grid size-10 place-items-center rounded-full bg-[#063d2e] text-xs font-bold text-[#ffc857]">
                  {number}
                </span>
                <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#647a72]">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="app-bg px-5 py-24 text-white sm:py-28" id="platform">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <p className="marketing-kicker">Complete workspace</p>
              <h2 className="marketing-title mt-5">
                Built for the work after launch, too.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/55 lg:justify-self-end">
              Keep the website, inventory, content, leads, publishing history
              and essential performance signals in one calm operating system.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {platformFeatures.map(([Icon, title, copy], index) => (
              <article
                key={title}
                className={`glass group rounded-[1.6rem] p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/25 ${index === 0 ? "lg:col-span-2" : ""}`}
              >
                <span className="grid size-11 place-items-center rounded-2xl border border-emerald-300/15 bg-emerald-300/10 text-emerald-200">
                  <Icon size={21} />
                </span>
                <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/52">
                  {copy}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <ButtonLink href="/features" variant="secondary">
              Explore every feature <ArrowRight size={17} />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="marketing-kicker marketing-kicker-light">
                Design with range
              </p>
              <h2 className="marketing-title-light mt-5">
                Eight directions. One coherent system.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#60746d]">
                Move from immersive coastal energy to restrained editorial
                travel without maintaining separate codebases.
              </p>
              <ButtonLink href="/templates" variant="dark" className="mt-8">
                Explore the themes <ArrowRight size={17} />
              </ButtonLink>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {themePreviews.map(([name, image, radius], index) => (
                <div
                  key={name}
                  className={`relative aspect-[4/5] overflow-hidden ${radius} ${index % 2 ? "translate-y-6" : ""}`}
                >
                  <Image
                    src={image}
                    alt={`${name} theme inspiration`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <p className="absolute bottom-5 left-5 text-sm font-semibold text-white">
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="app-bg px-5 py-24 text-white sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="marketing-kicker">
                <BookOpen size={15} /> Practical resources
              </p>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-.035em] sm:text-5xl">
                Make better website decisions.
              </h2>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffc857]"
            >
              Browse all resources <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {resources.slice(0, 3).map((article) => (
              <ResourceCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:py-28" aria-labelledby="faq-heading">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="marketing-kicker marketing-kicker-light">
              Straight answers
            </p>
            <h2 id="faq-heading" className="marketing-title-light mt-5">
              Before you build.
            </h2>
            <p className="mt-5 leading-7 text-[#647a72]">
              TripOne+ makes a specific tradeoff: less blank-canvas work, more
              useful tourism structure.
            </p>
          </div>
          <div className="divide-y divide-[#063d2e]/10 border-y border-[#063d2e]/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold marker:hidden">
                  {faq.question}
                  <ChevronRight
                    className="shrink-0 text-[#087a5a] transition group-open:rotate-90"
                    size={20}
                  />
                </summary>
                <p className="mt-4 max-w-3xl leading-7 text-[#647a72]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="app-bg relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,179,127,.25),transparent_32rem)]" />
          <div className="relative">
            <Sparkles className="mx-auto text-[#ffc857]" />
            <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
              Turn what you sell into a website people can understand.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
              Start with your real business details. Build the complete draft,
              inspect every page and publish when it is ready.
            </p>
            <ButtonLink href="/signup" className="mt-8 min-h-13 px-7 text-base">
              Build your website <ArrowRight size={18} />
            </ButtonLink>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
