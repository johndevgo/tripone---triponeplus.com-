import {
  ArrowRight,
  Check,
  Compass,
  Gauge,
  Layers3,
  Search,
  Ship,
  Waves,
  Mountain,
  Binoculars,
  MapPinned,
  BarChart3,
  Brush,
  Globe2,
  Inbox,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { ButtonLink } from "@/components/ui/button";

const categories: Array<[LucideIcon, string]> = [
  [Waves, "Water sports"],
  [Ship, "Boat rentals"],
  [Mountain, "Treks & hikes"],
  [Binoculars, "Safaris"],
  [MapPinned, "Tours & guides"],
];
const benefits: Array<[LucideIcon, string, string]> = [
  [
    Search,
    "Technical SEO",
    "Titles, descriptions and clean URLs generated from real data.",
  ],
  [
    Gauge,
    "Performance-minded",
    "Responsive components and server rendering from the start.",
  ],
  [
    Layers3,
    "Reusable structure",
    "One renderer powers preview and published websites.",
  ],
  [
    Compass,
    "Conversion-aware",
    "Clear journeys, relevant calls to action and useful detail pages.",
  ],
];
const platform: Array<[LucideIcon, string, string]> = [
  [
    Brush,
    "Visual builder",
    "Edit sections, themes and calls to action inside deliberate design guardrails.",
  ],
  [
    Compass,
    "Experience CMS",
    "Keep tours, activities, prices, locations and booking journeys in one structured system.",
  ],
  [
    Search,
    "SEO-ready by structure",
    "Publish canonical metadata, sitemaps, robots rules and defensible structured data.",
  ],
  [
    Inbox,
    "Enquiry pipeline",
    "Receive validated enquiries and move leads through a focused status workflow.",
  ],
  [
    BarChart3,
    "Actionable analytics",
    "See real visits, experience interest, booking clicks and lead submissions.",
  ],
  [
    Globe2,
    "Your domain",
    "Start on a TripOne+ subdomain and connect a verified custom hostname when ready.",
  ],
];
export default function Home() {
  return (
    <main>
      <section className="app-bg relative overflow-hidden px-5 pb-24 pt-36 text-white lg:pb-32 lg:pt-48">
        <MarketingHeader />
        <div className="ambient" />
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.07] px-4 py-2 text-sm text-white/75">
              <Compass size={16} className="text-[#FFC857]" />
              Purpose-built for tourism businesses
            </p>
            <h1 className="text-balance max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-.045em] sm:text-6xl lg:text-7xl">
              Websites built to{" "}
              <span className="text-[#FFC857]">sell experiences.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">
              TripOne+ creates fast, SEO-ready, conversion-focused websites from
              the details that make your tours and activities unique.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/signup" className="px-7">
                Build your website <ArrowRight size={17} />
              </ButtonLink>
              <ButtonLink href="#how" variant="secondary" className="px-7">
                See how it works
              </ButtonLink>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              {[
                "No AI API",
                "Structured for tourism",
                "Edit before publishing",
              ].map((x) => (
                <span className="flex items-center gap-2" key={x}>
                  <Check className="text-[#FFC857]" size={16} />
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div className="glass relative rounded-[1.6rem] p-3">
            <div className="rounded-[1.2rem] bg-[#F7FAF9] p-4 text-[#09271F]">
              <div className="flex items-center justify-between border-b border-[#063D2E]/10 pb-3">
                <span className="font-semibold">Dubai Wave</span>
                <span className="rounded-lg bg-[#063D2E] px-3 py-1.5 text-xs text-white">
                  Book now
                </span>
              </div>
              <div className="mt-3 min-h-72 rounded-xl bg-[linear-gradient(135deg,#0a755a,#063d2e)] p-7 text-white sm:min-h-96">
                <p className="text-xs uppercase tracking-[.2em] text-[#FFC857]">
                  Dubai Marina
                </p>
                <h2 className="mt-16 max-w-md text-4xl font-semibold tracking-tight sm:mt-24 sm:text-5xl">
                  Ride beyond the ordinary.
                </h2>
                <p className="mt-4 max-w-sm text-sm text-white/65">
                  Guided jet ski experiences around Dubai&apos;s iconic
                  coastline.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-5 rounded-2xl border border-white/15 bg-[#0A4938]/90 p-4 shadow-2xl backdrop-blur">
              <p className="text-xs text-white/55">Generated structure</p>
              <p className="mt-1 font-medium">7 pages · 3 experiences</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[.18em] text-[#087A5A]">
            One platform, built around your business
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
            {categories.map(([Icon, label]) => (
              <div
                className="glass-light rounded-2xl p-5 text-center"
                key={String(label)}
              >
                <Icon className="mx-auto text-[#087A5A]" />
                <p className="mt-3 font-medium">{String(label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="how" className="bg-[#ECF3F0] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#087A5A]">
              How it works
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-.035em] sm:text-5xl">
              From business details to a complete website.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Tell us what you offer",
                "Choose your business type and add your essential details.",
              ],
              [
                "02",
                "Pick your direction",
                "Add experiences and select a professionally designed theme.",
              ],
              [
                "03",
                "Build with confidence",
                "TripOne+ creates the pages, SEO and conversion structure for review.",
              ],
            ].map(([n, t, d]) => (
              <article key={n} className="glass-light rounded-3xl p-7">
                <span className="text-sm font-bold text-[#F5A623]">{n}</span>
                <h3 className="mt-10 text-xl font-semibold">{t}</h3>
                <p className="mt-3 leading-7 text-[#647A72]">{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#087A5A]">
              Designed for growth
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-.035em]">
              A stronger foundation for every experience.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map(([Icon, t, d]) => (
              <article
                key={String(t)}
                className="rounded-2xl border border-[#063D2E]/10 p-6"
              >
                <Icon className="text-[#087A5A]" />
                <h3 className="mt-5 font-semibold">{String(t)}</h3>
                <p className="mt-2 text-sm leading-6 text-[#647A72]">
                  {String(d)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="app-bg px-5 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#ffc857]">
                From launch to enquiries
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-.035em] sm:text-5xl">
                One calm workspace for the whole website.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/55">
              Generate the right starting structure, refine it visually, publish
              a coherent snapshot and learn from genuine visitor actions—without
              adding an AI API.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {platform.map(([Icon, title, copy]) => (
              <article key={title} className="glass rounded-3xl p-6">
                <Icon className="text-emerald-300" />
                <h3 className="mt-7 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{copy}</p>
              </article>
            ))}
          </div>
          <div className="glass mt-12 grid gap-6 rounded-3xl p-7 sm:grid-cols-[auto_1fr] sm:items-center">
            <Smartphone className="text-[#ffc857]" size={34} />
            <div>
              <h3 className="text-xl font-semibold">
                Built for the phone in your guest’s hand.
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Responsive navigation, readable tour details, enquiry forms and
                sticky booking actions are part of the shared production
                renderer—not a separate mobile theme.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-5 pb-24">
        <div className="app-bg mx-auto max-w-7xl rounded-[2rem] px-6 py-16 text-center text-white sm:px-12">
          <h2 className="text-balance text-4xl font-semibold tracking-tight">
            Your business deserves more than a generic template.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/65">
            Start with a website structure that already understands tours,
            activities and travel.
          </p>
          <ButtonLink href="/signup" className="mt-8">
            Build your website <ArrowRight size={17} />
          </ButtonLink>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
