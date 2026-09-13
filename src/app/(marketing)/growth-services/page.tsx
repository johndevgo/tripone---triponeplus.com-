import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Compass,
  Globe2,
  MapPinned,
  Megaphone,
  Search,
  Workflow,
} from "lucide-react";
import { MarketingPrimaryCta } from "@/components/marketing/primary-cta";
import { ButtonLink } from "@/components/ui/button";
import { getAppUrl } from "@/lib/app-url";

export const metadata: Metadata = {
  title: "Tourism marketing and growth services",
  description:
    "TripOne+ combines a tourism website platform with practical growth services for tour operators, activity businesses, rentals and travel companies.",
  alternates: { canonical: "/growth-services" },
  openGraph: {
    title: "Tourism growth services | TripOne+",
    description:
      "Strategy, website conversion, search content, local discovery and measurement for tourism businesses.",
    url: "/growth-services",
  },
};

const services = [
  {
    icon: Globe2,
    title: "Website and conversion planning",
    description:
      "Shape pages, offers and enquiry paths around how travellers actually compare and choose experiences.",
  },
  {
    icon: Search,
    title: "Search and destination content",
    description:
      "Build a useful topic and landing-page system around real destinations, activities and traveller questions.",
  },
  {
    icon: MapPinned,
    title: "Local discovery foundations",
    description:
      "Create a consistent plan for business details, location pages, reviews and Google Business Profile content.",
  },
  {
    icon: Megaphone,
    title: "Campaign landing systems",
    description:
      "Pair focused campaigns with clear landing pages, truthful offers and trackable calls to action.",
  },
  {
    icon: BarChart3,
    title: "Measurement foundations",
    description:
      "Define the events and reporting views that distinguish attention from genuine booking intent.",
  },
  {
    icon: Workflow,
    title: "Ongoing growth cadence",
    description:
      "Turn insights into an operating rhythm for content, offers, experiments and seasonal updates.",
  },
] as const;

const faqs = [
  {
    question: "Is the growth studio required to use TripOne+?",
    answer:
      "No. TripOne+ is designed for self-service use. Growth services are an optional, human-led engagement for businesses that want hands-on strategy and execution support.",
  },
  {
    question: "Do you guarantee rankings or bookings?",
    answer:
      "No. Search visibility and booking outcomes depend on many factors. We focus on sound technical foundations, useful content, clear measurement and disciplined improvement.",
  },
  {
    question: "Can you work with an existing tourism website?",
    answer:
      "Yes. The first step is to understand the current platform, content, analytics and commercial priorities before recommending a migration or focused improvements.",
  },
];

export default function GrowthServicesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "TripOne+ tourism growth services",
    provider: { "@type": "Organization", name: "TripOne+", url: getAppUrl() },
    serviceType: "Tourism marketing and website growth services",
    areaServed: "Worldwide",
    url: `${getAppUrl().replace(/\/$/, "")}/growth-services`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
        <div>
          <p className="marketing-kicker">
            <Compass size={15} /> TripOne+ growth studio
          </p>
          <h1 className="marketing-title mt-6">
            The platform to run your website. The people to help grow it.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            TripOne+ gives tourism businesses a structured website and
            operations platform. Our optional growth studio adds human strategy
            for search, conversion, local discovery, campaigns and measurement.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href="mailto:neurerohan@gmail.com?subject=TripOne%2B%20growth%20services"
              className="min-h-13 px-7 text-base"
            >
              Discuss growth services <ArrowRight size={18} />
            </ButtonLink>
            <MarketingPrimaryCta
              guestLabel="Build with TripOne+"
              variant="secondary"
              className="min-h-13 px-7 text-base"
            />
          </div>
        </div>
        <div className="relative min-h-[31rem] overflow-hidden rounded-[2rem] border border-white/10">
          <Image
            src="/images/marketing/local-guide.webp"
            alt="A local tourism guide sharing knowledge with travellers"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041c16] via-[#041c16]/15 to-transparent" />
          <div className="glass absolute inset-x-5 bottom-5 rounded-2xl p-5 sm:inset-x-auto sm:bottom-7 sm:left-7 sm:max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#ffc857]">
              One commercial system
            </p>
            <p className="mt-2 text-lg font-semibold">
              Your website, content and measurement should reinforce the same
              customer journey.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-24" aria-labelledby="growth-services-list">
        <div className="max-w-3xl">
          <p className="marketing-kicker">Focused support</p>
          <h2
            id="growth-services-list"
            className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-5xl"
          >
            Tourism marketing connected to the work that happens next.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/55">
            Every engagement starts with the business model, destination and
            traveller—not a generic channel checklist.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, description }) => (
            <article key={title} className="glass rounded-[1.6rem] p-7">
              <span className="grid size-11 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200">
                <Icon size={21} />
              </span>
              <h3 className="mt-7 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/52">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-6 lg:grid-cols-2">
        <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.055] p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[.17em] text-[#ffc857]">
            Self-service platform
          </p>
          <h2 className="mt-5 text-3xl font-semibold">
            Build and operate it yourself.
          </h2>
          <p className="mt-4 leading-7 text-white/55">
            Generate a tourism-aware website, manage offers, publish content,
            handle enquiries and connect a verified custom domain in one
            workspace.
          </p>
          <ul className="mt-7 grid gap-3 text-sm text-white/65">
            {[
              "Three founding years free",
              "Ten professional themes",
              "No card required to start",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check size={17} className="text-[#ffc857]" /> {item}
              </li>
            ))}
          </ul>
          <MarketingPrimaryCta
            guestLabel="Start building free"
            className="mt-8"
          >
            <ArrowRight size={17} />
          </MarketingPrimaryCta>
        </article>
        <article className="relative overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-[linear-gradient(145deg,rgba(8,122,90,.32),rgba(255,200,87,.08))] p-8 sm:p-10">
          <div className="relative h-16 w-full max-w-[21rem] overflow-hidden rounded-xl bg-white">
            <Image
              src="/images/logo annd branding/tripone wide logo.png"
              alt="TripOne+"
              fill
              sizes="336px"
              className="object-contain p-2"
            />
          </div>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[.17em] text-[#ffc857]">
            Human-led growth studio
          </p>
          <h2 className="mt-5 text-3xl font-semibold">
            Work with us on the growth system.
          </h2>
          <p className="mt-4 leading-7 text-white/55">
            Get practical strategic and execution support around the website,
            discoverability, campaigns and measurement—scoped to your
            priorities.
          </p>
          <ButtonLink
            href="mailto:neurerohan@gmail.com?subject=TripOne%2B%20growth%20services"
            variant="secondary"
            className="mt-8"
          >
            Start a conversation <ArrowRight size={17} />
          </ButtonLink>
        </article>
      </section>

      <section className="mx-auto mt-24 max-w-3xl">
        <p className="marketing-kicker mx-auto">Straight answers</p>
        <h2 className="mt-5 text-center text-3xl font-semibold sm:text-4xl">
          Growth services, without impossible promises.
        </h2>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group py-6">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                {question}
              </summary>
              <p className="mt-3 max-w-2xl leading-7 text-white/55">{answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-white/45">
          Prefer to explore first? Visit the{" "}
          <Link href="/resources" className="text-[#ffc857] hover:text-white">
            tourism resource library
          </Link>
          .
        </p>
      </section>
    </>
  );
}
