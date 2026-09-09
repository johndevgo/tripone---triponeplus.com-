import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Compass } from "lucide-react";
import { ResourceCard } from "@/components/marketing/resource-card";
import { resources } from "@/content/resources";

export const metadata: Metadata = {
  title: "Tourism website guides and comparisons",
  description:
    "Practical guides for tour operators and activity businesses covering website structure, SEO, conversion, content and platform selection.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Tourism website resources | TripOne+",
    description:
      "Clear, practical guidance for building better tour and activity websites.",
    url: "/resources",
  },
};

export default function ResourcesPage() {
  const featured = resources[0];
  if (!featured) return null;

  return (
    <>
      <section className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="marketing-kicker">
            <BookOpen size={15} /> TripOne+ field notes
          </p>
          <h1 className="marketing-title mt-6 max-w-4xl">
            Useful answers for tourism businesses building online.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Practical, no-hype guidance on structuring experiences, improving
            discovery and creating a clearer path from interest to enquiry.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/60">
            {["Website strategy", "SEO", "Conversion", "Comparisons"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 bg-white/[.05] px-4 py-2"
                >
                  {label}
                </span>
              ),
            )}
          </div>
        </div>
        <Link
          href={`/resources/${featured.slug}`}
          className="group relative min-h-[25rem] overflow-hidden rounded-[2rem] border border-white/10"
        >
          <Image
            src={featured.image}
            alt={featured.imageAlt}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition duration-700 group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041c16] via-[#041c16]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#ffc857]">
              Start here · {featured.readTime}
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">
              {featured.title}
            </h2>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
              Read the guide <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </section>

      <section className="mt-24" aria-labelledby="resource-library">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="marketing-kicker">Resource library</p>
            <h2 id="resource-library" className="mt-4 text-3xl font-semibold">
              Build with better information.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/50">
            Written for operators, not search-engine word counts. Every article
            is reviewed for clear claims and actionable detail.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((article) => (
            <ResourceCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="glass mt-24 grid gap-8 rounded-[2rem] p-7 sm:p-10 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
        <div className="grid aspect-square max-w-52 place-items-center rounded-[1.6rem] border border-white/10 bg-[linear-gradient(145deg,rgba(8,122,90,.45),rgba(245,166,35,.14))]">
          <Compass size={58} className="text-[#ffc857]" />
        </div>
        <div>
          <p className="marketing-kicker">
            <CheckCircle2 size={15} /> Put the guidance to work
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">
            Build the structured foundation inside TripOne+.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-white/55">
            Add your real services, choose a design direction and let the
            platform generate a complete draft you can inspect before it goes
            live.
          </p>
          <Link
            href="/signup"
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#f5a623] px-6 text-sm font-semibold text-[#173028] transition hover:bg-[#ffc857]"
          >
            Build your website <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
