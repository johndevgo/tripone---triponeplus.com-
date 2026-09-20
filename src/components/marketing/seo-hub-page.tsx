import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Blocks,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Layers3,
  Search,
  Sparkles,
} from "lucide-react";
import { MarketingPrimaryCta } from "@/components/marketing/primary-cta";
import {
  getSeoPageImage,
  getSeoPageImageAlt,
  getSeoPages,
  type SeoNamespace,
  type SeoPageSpec,
} from "@/content/seo-catalog";

const hubCopy = {
  services: [
    "Travel growth services",
    "A connected acquisition, conversion and retention system for tour operators and travel teams—not a disconnected menu of marketing tasks.",
  ],
  for: [
    "TripOne+ for travel businesses",
    "Explore website, booking, customer and operating workflows shaped around different tourism business models.",
  ],
  compare: [
    "Compare travel software on the work that matters",
    "Independent, workflow-first comparisons for website, booking, CRM and operations decisions. Every verdict depends on your requirements—not a sponsored feature count.",
  ],
  resources: [
    "Travel business resources",
    "Practical plans, checklists, templates and operating frameworks designed to be used by tour and travel teams.",
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

const serviceGroups = [
  {
    title: "Build discoverable demand",
    description:
      "Search, paid media and content that connect real traveller intent to an accurate offer.",
    paths: [
      "/services/seo",
      "/services/google-ads",
      "/services/meta-ads",
      "/services/tiktok-ads",
      "/services/social-media-marketing",
      "/services/content-marketing",
    ],
  },
  {
    title: "Turn attention into enquiries",
    description:
      "Creative, websites and conversion journeys that reduce uncertainty and preserve context.",
    paths: [
      "/services/creative-design",
      "/services/conversion-rate-optimisation",
      "/services/website-growth",
      "/services/landing-pages-funnels",
    ],
  },
  {
    title: "Operate and retain growth",
    description:
      "Measurement, CRM, automation and reputation systems that help the team act on demand.",
    paths: [
      "/services/analytics-tracking",
      "/services/email-marketing-crm",
      "/services/reputation-review-growth",
      "/services/marketing-automation",
    ],
  },
  {
    title: "Set the commercial direction",
    description:
      "Strategy and positioning before channel activity, so effort supports one credible market choice.",
    paths: ["/services/strategy-consulting", "/services/brand-positioning"],
  },
] as const;

export function SeoHubPage({ namespace }: { namespace: SeoNamespace }) {
  const pages = getSeoPages(namespace);
  const [title, description] = hubCopy[namespace];

  return (
    <>
      <HubHero
        namespace={namespace}
        pages={pages}
        title={title}
        description={description}
      />
      {namespace === "services" ? (
        <ServicesHub pages={pages} />
      ) : namespace === "compare" ? (
        <ComparisonHub pages={pages} />
      ) : namespace === "tools" ? (
        <ToolHub pages={pages} />
      ) : namespace === "resources" ? (
        <ResourceHub pages={pages} />
      ) : (
        <PageGrid pages={pages} />
      )}
    </>
  );
}

function HubHero({
  namespace,
  pages,
  title,
  description,
}: {
  namespace: SeoNamespace;
  pages: SeoPageSpec[];
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.4rem] border border-emerald-200/15 bg-[linear-gradient(135deg,rgba(56,189,89,.22),rgba(255,255,255,.06)_48%,rgba(4,49,28,.5))] px-6 py-12 shadow-[0_30px_100px_rgba(0,24,11,.28)] sm:px-10 lg:px-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(117,255,133,.18),transparent_28%)]" />
      <div className="relative grid gap-10 lg:grid-cols-[1fr_.82fr] lg:items-center">
        <div>
          <p className="marketing-kicker">
            <Layers3 size={15} /> {pages.length} specialist pages
          </p>
          <h1 className="marketing-title mt-6 max-w-4xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MarketingPrimaryCta
              guestLabel="Start with TripOne+"
              guestHref="/signup"
            >
              <ArrowRight size={17} />
            </MarketingPrimaryCta>
            <Link
              href="#explore"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/14 bg-white/[.07] px-5 text-sm font-semibold text-white transition hover:bg-white/[.12]"
            >
              Explore the library <Compass size={16} />
            </Link>
          </div>
        </div>
        <div
          className="grid grid-cols-2 gap-3"
          aria-label={`${namespace} preview`}
        >
          {pages.slice(0, 3).map((page, index) => (
            <Link
              href={page.path}
              key={page.path}
              className={`group relative min-h-40 overflow-hidden rounded-[1.5rem] border border-white/12 ${index === 0 ? "col-span-2 aspect-[2.25/1]" : "aspect-square"}`}
            >
              <Image
                src={getSeoPageImage(page)}
                alt=""
                fill
                preload={index === 0}
                sizes="(max-width: 1024px) 45vw, 22vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021b0d]/95 via-[#021b0d]/25 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold leading-snug text-white">
                {page.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesHub({ pages }: { pages: SeoPageSpec[] }) {
  const byPath = new Map(pages.map((page) => [page.path, page]));
  return (
    <div id="explore" className="mt-16 scroll-mt-28">
      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="How the growth system works"
      >
        {[
          [
            Search,
            "Find demand",
            "Understand how travellers search, compare and discover an offer.",
          ],
          [
            Sparkles,
            "Earn attention",
            "Use relevant creative and content without unsupported promises.",
          ],
          [
            CheckCircle2,
            "Convert responsibly",
            "Reduce friction from landing page to enquiry or booking handoff.",
          ],
          [
            BarChart3,
            "Learn and improve",
            "Connect channel evidence to qualified leads and commercial outcomes.",
          ],
        ].map(([Icon, title, copy]) => {
          const FeatureIcon = Icon as typeof Search;
          return (
            <article key={String(title)} className="glass rounded-[1.5rem] p-5">
              <FeatureIcon size={20} className="text-[#8ef18a]" />
              <h2 className="mt-4 text-lg font-semibold">{String(title)}</h2>
              <p className="mt-2 text-sm leading-6 text-white/52">
                {String(copy)}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-14 space-y-10" aria-labelledby="service-catalogue">
        <div className="max-w-3xl">
          <p className="marketing-kicker">Connected services</p>
          <h2
            id="service-catalogue"
            className="mt-5 text-3xl font-semibold tracking-[-.03em] sm:text-4xl"
          >
            Choose the commercial problem first. Then choose the channel.
          </h2>
        </div>
        {serviceGroups.map((group) => (
          <div
            key={group.title}
            className="grid gap-5 border-t border-white/10 pt-7 lg:grid-cols-[.7fr_1.3fr]"
          >
            <div>
              <h3 className="text-2xl font-semibold">{group.title}</h3>
              <p className="mt-3 max-w-md leading-7 text-white/52">
                {group.description}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.paths.map((path) => {
                const page = byPath.get(path);
                return page ? (
                  <VisualCard key={page.path} page={page} compact />
                ) : null;
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="glass mt-16 overflow-hidden rounded-[2rem] p-6 sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="marketing-kicker">
              <BadgeCheck size={15} /> Evidence before claims
            </p>
            <h2 className="mt-5 text-3xl font-semibold">
              Experienced across search, paid media, CRM and conversion.
            </h2>
            <p className="mt-4 leading-7 text-white/58">
              Supplied partner credentials and anonymised delivery evidence are
              shown with context. They demonstrate capability, not a guaranteed
              result for a new account.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              "google-partner.webp",
              "meta-partner.webp",
              "hubspot-partner.webp",
            ].map((name) => (
              <div
                key={name}
                className="relative aspect-[1.35/1] overflow-hidden rounded-2xl bg-white p-3"
              >
                <Image
                  src={`/images/proof/${name}`}
                  alt="Supplied marketing delivery credential"
                  fill
                  sizes="20vw"
                  className="object-contain p-3"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ComparisonHub({ pages }: { pages: SeoPageSpec[] }) {
  return (
    <div id="explore" className="mt-16 scroll-mt-28">
      <section className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
        <div className="glass rounded-[2rem] p-7 lg:sticky lg:top-28 lg:self-start">
          <p className="marketing-kicker">
            <ClipboardCheck size={15} /> Decision method
          </p>
          <h2 className="mt-5 text-3xl font-semibold">
            A fair comparison starts with your workflow.
          </h2>
          <ol className="mt-6 space-y-5">
            {[
              "Write weighted requirements",
              "Run the same real scenario",
              "Verify the current plan and contract",
              "Test export and migration",
              "Score total operating cost",
            ].map((step, index) => (
              <li
                key={step}
                className="flex gap-4 text-sm leading-6 text-white/62"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#65db63] font-semibold text-[#062b16]">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-5 text-white/42">
            TripOne+ is an interested party. Every comparison links to
            first-party provider sources and recommends an independent trial.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {pages.map((page, index) => (
            <VisualCard key={page.path} page={page} compact={index > 3} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ToolHub({ pages }: { pages: SeoPageSpec[] }) {
  return (
    <div id="explore" className="mt-16 scroll-mt-28">
      <section className="grid gap-5 md:grid-cols-2">
        {pages.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            className="glass group rounded-[1.8rem] p-7 transition hover:-translate-y-1 hover:border-emerald-300/30"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-[#65db63] text-[#062b16]">
              <Blocks size={22} />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[.14em] text-[#8ef18a]">
              Runs in your browser
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{page.title}</h2>
            <p className="mt-3 leading-7 text-white/52">
              {page.metaDescription}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold">
              Open tool <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function ResourceHub({ pages }: { pages: SeoPageSpec[] }) {
  return (
    <div id="explore" className="mt-16 scroll-mt-28">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            className="glass group flex min-h-72 flex-col rounded-[1.8rem] p-7 transition hover:-translate-y-1 hover:border-emerald-300/30"
          >
            <span className="grid size-12 place-items-center rounded-2xl border border-emerald-200/15 bg-emerald-200/[.08] text-[#8ef18a]">
              <ClipboardCheck size={22} />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[.14em] text-[#8ef18a]">
              Working resource
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{page.title}</h2>
            <p className="mt-3 line-clamp-3 leading-7 text-white/52">
              {page.metaDescription}
            </p>
            <span className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold">
              Use this resource <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function PageGrid({ pages }: { pages: SeoPageSpec[] }) {
  return (
    <section
      id="explore"
      className="mt-14 grid scroll-mt-28 gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {pages.map((page) => (
        <VisualCard key={page.path} page={page} />
      ))}
    </section>
  );
}

function VisualCard({
  page,
  compact = false,
}: {
  page: SeoPageSpec;
  compact?: boolean;
}) {
  return (
    <Link
      href={page.path}
      className="glass group overflow-hidden rounded-[1.7rem] transition hover:-translate-y-1 hover:border-emerald-300/30"
    >
      <div
        className={`relative overflow-hidden ${compact ? "aspect-[2.2/1]" : "aspect-[16/9]"}`}
      >
        <Image
          src={getSeoPageImage(page)}
          alt={getSeoPageImageAlt(page)}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031c10] via-[#031c10]/20 to-transparent" />
      </div>
      <div className="p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#8ef18a]">
          <Search size={14} /> {page.keywordCluster}
        </p>
        <h2 className="mt-3 text-xl font-semibold leading-snug">
          {page.title}
        </h2>
        {!compact && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
            {page.metaDescription}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/72 group-hover:text-white">
          Explore page <ArrowRight size={15} />
        </span>
      </div>
    </Link>
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
