import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  BookOpen,
  Brush,
  Check,
  CalendarCheck2,
  ChevronRight,
  Compass,
  Gauge,
  Globe2,
  Inbox,
  Layers3,
  MousePointerClick,
  PackageOpen,
  Search,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingPrimaryCta } from "@/components/marketing/primary-cta";
import { ResourceCard } from "@/components/marketing/resource-card";
import { ButtonLink } from "@/components/ui/button";
import { marketingImages } from "@/content/marketing-assets";
import { resources } from "@/content/resources";
import { getAppUrl } from "@/lib/app-url";
import { formatFreePeriod, formatPlanPrice } from "@/lib/platform/config";
import { getPublicPlatformSettings } from "@/lib/platform/public-settings";

export const metadata: Metadata = {
  title: "Tourism website builder and booking operations platform",
  description:
    "Build an SEO-ready tourism website and manage tours, rentals, packages, booking requests, availability, resources, leads and customers in one platform.",
  alternates: { canonical: "/" },
};

const categoryCards = [
  {
    label: "Guided tours & activities",
    description:
      "City walks, day tours, local guides and bookable experiences.",
    image: marketingImages.city,
  },
  {
    label: "Travel packages",
    description: "Multi-day itineraries, departures, inclusions and enquiries.",
    image: marketingImages.rail,
  },
  {
    label: "Adventure & nature",
    description: "Hikes, waterfalls, outdoor activities and guided routes.",
    image: marketingImages.jungle,
  },
  {
    label: "Safaris",
    description: "Itineraries, wildlife context, guides and pickup details.",
    image: marketingImages.jungleSafari,
  },
  {
    label: "Rentals",
    description:
      "Vehicles, boats, equipment, capacity, rates and availability.",
    image: marketingImages.luxuryYacht,
  },
  {
    label: "Wellness retreats",
    description: "Retreat schedules, stays, teachers and package details.",
    image: marketingImages.wellness,
  },
  {
    label: "Culture & food",
    description: "Markets, heritage, local stories and small-group tours.",
    image: marketingImages.market,
  },
  {
    label: "Desert & plains",
    description: "Camps, camel journeys, cultural stops and transfers.",
    image: marketingImages.desert,
  },
  {
    label: "Stays & escapes",
    description: "Distinctive accommodation, seasonal packages and add-ons.",
    image: marketingImages.arctic,
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
  [
    PackageOpen,
    "Packages & offerings",
    "Compose multi-day packages from existing tours and rentals without duplicating source content.",
  ],
  [
    CalendarCheck2,
    "Bookings & availability",
    "Capture payment-free requests, protect departure capacity and manage schedules in the business timezone.",
  ],
  [
    Boxes,
    "Resources & fulfilment",
    "Assign guides, vehicles and equipment with transactional overlap protection.",
  ],
] as const;

const proofPoints: Array<[LucideIcon, string]> = [
  [ShieldCheck, "Authenticated workspace and tenant-safe data"],
  [Gauge, "Server-rendered, responsive production output"],
  [MousePointerClick, "One renderer from preview to published site"],
];

const themePreviews = [
  ["Horizon", marketingImages.city, "rounded-[1.8rem]"],
  ["Luxe Voyage", marketingImages.luxuryYacht, "rounded-sm"],
  ["Summit", marketingImages.jungle, "rounded-lg"],
  ["Nomad", marketingImages.wellness, "rounded-none"],
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
      "Yes. Use TripOne+'s payment-free request workflow or link an external booking URL. TripOne+ does not collect payments in this release.",
  },
  {
    question: "Can I publish before connecting a custom domain?",
    answer:
      "Yes. Every published site has a working hosted path. A verified custom domain can be connected later without maintaining a second renderer.",
  },
];

export default async function Home() {
  const plan = await getPublicPlatformSettings();
  const freePeriod = formatFreePeriod(plan.foundingFreeYears);
  const renewal = formatPlanPrice(plan.annualPrice, plan.currency);
  const origin = getAppUrl("https://triponeplus.com");
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "TripOne+",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: origin,
      description:
        "A tourism website builder and booking operations platform for tours, activities, rentals, transfers and travel packages.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: plan.currency,
        description: `Free for the first ${freePeriod}, then ${renewal} per year`,
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
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${origin.replace(/\/$/, "")}/#organization`,
      name: "TripOne+",
      url: origin,
      logo: `${origin.replace(/\/$/, "")}/images/logo%20annd%20branding/tripone%201%20isto%201%20logo%20no%20background.png`,
      description:
        "A tourism website and operations platform for tour, activity, rental and travel businesses.",
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
          src={marketingImages.city}
          alt="Travellers exploring a historic city with a local guide"
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
              <Compass size={16} className="text-[#95ee8e]" /> Built for
              tourism, not everything
            </p>
            <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[.98] tracking-[-.052em] sm:text-6xl lg:text-[5.25rem]">
              The SEO-first website builder.{" "}
              <span className="text-[#95ee8e]">Built for travel sales.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
              Build a fast, polished website—then manage packages, booking
              requests, customers, availability and marketing from the same
              tourism-native workspace.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MarketingPrimaryCta
                guestLabel="Start building free"
                className="min-h-13 px-7 text-base"
              >
                <ArrowRight size={18} />
              </MarketingPrimaryCta>
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
                `Free for your first ${freePeriod}`,
                "No AI API",
                "Preview before publishing",
              ].map((label) => (
                <span className="flex items-center gap-2" key={label}>
                  <Check className="text-[#95ee8e]" size={16} /> {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-xl lg:block">
            <div className="glass rotate-[1.5deg] rounded-[1.8rem] p-3 shadow-[0_35px_100px_rgba(0,0,0,.38)]">
              <div className="overflow-hidden rounded-[1.35rem] bg-[#f8faf9] text-[#09271f]">
                <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-[#075718] text-white">
                      <Compass size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Atlas Journeys</p>
                      <p className="text-[11px] text-[#647a72]">
                        Website preview
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#5bcd57] px-3 py-2 text-xs font-semibold">
                    Book now
                  </span>
                </div>
                <div className="relative m-3 min-h-[23rem] overflow-hidden rounded-2xl">
                  <Image
                    src={marketingImages.rail}
                    alt=""
                    fill
                    sizes="36rem"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022f0e]/95 via-[#022f0e]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#95ee8e]">
                      Alpine rail journey
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                      A complete journey, ready to compare.
                    </h2>
                    <p className="mt-3 text-sm text-white/65">
                      Explore the itinerary, inclusions and departure options.
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

      <section className="border-b border-[#075718]/8 bg-white px-5 py-7">
        <div className="mx-auto grid max-w-7xl gap-5 text-sm text-[#50675f] sm:grid-cols-3">
          {proofPoints.map(([Icon, label]) => (
            <div
              key={String(label)}
              className="flex items-center justify-center gap-3"
            >
              <Icon size={18} className="text-[#11802a]" /> {String(label)}
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
                "Select one of ten themes, then apply your logo and brand colors.",
              ],
              [
                "04",
                "Build and refine",
                "Generate pages, preview the draft, edit visually and publish a versioned snapshot.",
              ],
            ].map(([number, title, copy]) => (
              <li
                key={number}
                className="rounded-[1.5rem] border border-[#075718]/10 bg-white p-6 shadow-[0_16px_45px_rgba(2,44,34,.06)]"
              >
                <span className="grid size-10 place-items-center rounded-full bg-[#075718] text-xs font-bold text-[#95ee8e]">
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
                Ten directions. One coherent system.
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

      <section className="px-5 py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch">
          <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem]">
            <Image
              src="/images/marketing/mountain-yoga-retreat.webp"
              alt="A guided wellness and yoga experience in a mountain destination"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041c16] via-[#041c16]/15 to-transparent" />
            <div className="absolute inset-x-7 bottom-7 text-white sm:inset-x-9 sm:bottom-9">
              <p className="text-xs font-semibold uppercase tracking-[.17em] text-[#95ee8e]">
                TripOne+ growth studio
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-.03em] sm:text-4xl">
                Technology when you want control. People when you want support.
              </h2>
            </div>
          </div>
          <div className="app-bg flex flex-col justify-center rounded-[2rem] border border-white/10 p-8 text-white sm:p-10">
            <p className="marketing-kicker">Platform + services</p>
            <p className="mt-6 text-lg leading-8 text-white/60">
              Use TripOne+ as a self-service tourism website and operations
              platform, or work with our growth studio on search, conversion,
              local discovery, campaigns and measurement.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white/65 sm:grid-cols-2">
              {[
                "Tourism-native website system",
                "Search and destination content",
                "Campaign landing journeys",
                "Honest measurement foundations",
              ].map((item) => (
                <span key={item} className="flex items-center gap-3">
                  <Check size={17} className="shrink-0 text-[#95ee8e]" />
                  {item}
                </span>
              ))}
            </div>
            <ButtonLink
              href="/growth-services"
              variant="secondary"
              className="mt-9 w-fit"
            >
              Explore growth services <ArrowRight size={17} />
            </ButtonLink>
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
              <p className="mt-4 max-w-xl leading-7 text-white/50">
                Explore {resources.length} practical guides, operating playbooks
                and source-linked platform comparisons written for tourism
                teams.
              </p>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#95ee8e]"
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
          <div className="divide-y divide-[#075718]/10 border-y border-[#075718]/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold marker:hidden">
                  {faq.question}
                  <ChevronRight
                    className="shrink-0 text-[#11802a] transition group-open:rotate-90"
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
            <Sparkles className="mx-auto text-[#95ee8e]" />
            <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
              Turn what you sell into a website people can understand.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
              Start with your real business details. Build the complete draft,
              inspect every page and publish when it is ready.
            </p>
            <MarketingPrimaryCta
              guestLabel="Build your website"
              className="mt-8 min-h-13 px-7 text-base"
            >
              <ArrowRight size={18} />
            </MarketingPrimaryCta>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
