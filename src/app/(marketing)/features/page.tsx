import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  Brush,
  CalendarCheck2,
  Check,
  Globe2,
  Inbox,
  Layers3,
  PackageOpen,
  Search,
  ShieldCheck,
  Smartphone,
  UsersRound,
} from "lucide-react";
import { MarketingPrimaryCta } from "@/components/marketing/primary-cta";

export const metadata: Metadata = {
  title: "Tourism website builder and operations features",
  description:
    "Explore TripOne+ website generation, packages, payment-free bookings, availability, resources, CRM, SEO, analytics, publishing and domains.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Tourism website builder and operations features | TripOne+",
    description:
      "Website generation, structured tourism content, visual editing, SEO, leads, analytics and versioned publishing.",
    url: "/features",
  },
};

const features = [
  [
    Layers3,
    "Tourism-aware generation",
    "Business presets create relevant pages, navigation, terminology and section recipes from validated data.",
  ],
  [
    Brush,
    "Guardrailed visual builder",
    "Reorder sections, edit copy, switch variants and preview responsive output without fragmenting the renderer.",
  ],
  [
    Boxes,
    "Multi-service inventory",
    "Manage experiences, rentals, rates, destinations and category relationships from one structured workspace.",
  ],
  [
    Search,
    "SEO foundations",
    "Control titles, descriptions, canonical paths and social images while the platform maintains sitemaps and safe schema.",
  ],
  [
    Inbox,
    "Qualified enquiries",
    "Capture validated leads with dates, guest counts and context, then manage their progress in the dashboard.",
  ],
  [
    BarChart3,
    "First-party analytics",
    "Measure actual visits, experience views, rental views, booking clicks and enquiries without inventing performance.",
  ],
  [
    ShieldCheck,
    "Versioned publishing",
    "Preview private drafts and publish immutable snapshots with ownership checks and protected management data.",
  ],
  [
    Globe2,
    "Hosted paths and domains",
    "Launch immediately on a hosted customer path, then attach and verify a custom hostname when ready.",
  ],
  [
    Smartphone,
    "One responsive renderer",
    "Builder previews and public websites share semantic components designed for phones, tablets and desktops.",
  ],
  [
    PackageOpen,
    "Composable packages",
    "Build multi-day packages from reusable tours, rentals and custom itinerary items, with one public detail renderer.",
  ],
  [
    CalendarCheck2,
    "Payment-free booking operations",
    "Capture website or manual requests, manage status, edit schedules and participants, and protect fixed-departure capacity.",
  ],
  [
    UsersRound,
    "Tourism CRM and customers",
    "Track sources, destinations, interests, follow-ups and value; convert qualified leads into customers and bookings.",
  ],
] as const;

export default function Features() {
  return (
    <>
      <section className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="marketing-kicker">Product system</p>
          <h1 className="marketing-title mt-6">
            The website builder and operating workspace belong together.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            TripOne+ combines a structured tourism CMS with visual design,
            packages, bookings, availability, resources, CRM, publishing and
            useful performance signals.
          </p>
          <MarketingPrimaryCta
            guestLabel="Start building free"
            className="mt-8"
          >
            <ArrowRight size={17} />
          </MarketingPrimaryCta>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10">
          <Image
            src="/images/marketing/travel-planning.webp"
            alt="A travel specialist planning an itinerary with two travellers"
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041c16]/90 via-transparent to-transparent" />
          <div className="glass absolute inset-x-5 bottom-5 rounded-2xl p-5 sm:inset-x-auto sm:bottom-7 sm:left-7 sm:max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#95ee8e]">
              Structured from the start
            </p>
            <p className="mt-2 text-lg font-semibold">
              The website understands what the business sells.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([Icon, title, description], index) => (
          <article
            key={title}
            className={`glass rounded-[1.6rem] p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/25 ${index === 0 ? "lg:col-span-2" : ""}`}
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200">
              <Icon size={21} />
            </span>
            <h2 className="mt-8 text-xl font-semibold">{title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/52">
              {description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-24 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem]">
            <Image
              src="/images/marketing/mountain-trek.webp"
              alt="Mountain trekking website inspiration"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-[1.6rem]">
            <Image
              src="/images/marketing/reef-diving.webp"
              alt="Diving website inspiration"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <p className="marketing-kicker">
            <BookOpen size={15} /> One source of truth
          </p>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-.035em] sm:text-5xl">
            Update the record. Keep every surface coherent.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/55">
            Reusable structured content reduces mismatched prices, locations and
            booking links while still allowing record-specific layouts.
          </p>
          <ul className="mt-7 grid gap-4 text-sm text-white/65">
            {[
              "Typed and validated section data",
              "Reusable page and record templates",
              "Revision-aware autosave and conflict handling",
              "Draft preview before immutable publishing",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check size={17} className="text-[#95ee8e]" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
