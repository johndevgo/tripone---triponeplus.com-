import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
} from "lucide-react";
import { ResourceCard } from "@/components/marketing/resource-card";
import { SeoMarketingPage } from "@/components/marketing/seo-marketing-page";
import {
  getRelatedResources,
  getResource,
  resourceCategorySlugs,
  resources,
} from "@/content/resources";
import {
  getSeoPageFromSlug,
  getSeoPageImage,
  getSeoPageSlug,
  getSeoPages,
} from "@/content/seo-catalog";
import { getAppUrl } from "@/lib/app-url";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Array.from(
    new Set([
      ...resources.map(({ slug }) => slug),
      ...getSeoPages("resources").map(getSeoPageSlug),
    ]),
  ).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const article = getResource(slug);
  const seoPage = getSeoPageFromSlug("resources", slug);
  if (seoPage && !article) {
    const image = getSeoPageImage(seoPage);
    return {
      title: seoPage.metaTitle,
      description: seoPage.metaDescription,
      keywords: [
        seoPage.primaryKeyword,
        ...seoPage.secondaryKeywords,
        ...seoPage.entities,
      ],
      alternates: { canonical: seoPage.path },
      openGraph: {
        type: "article",
        title: seoPage.metaTitle,
        description: seoPage.metaDescription,
        url: seoPage.path,
        images: [{ url: image, alt: seoPage.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: seoPage.metaTitle,
        description: seoPage.metaDescription,
        images: [image],
      },
    };
  }
  if (!article) return {};
  const path = `/resources/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: path,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}

export default async function ResourceArticlePage({ params }: Props) {
  const slug = (await params).slug;
  const article = getResource(slug);
  const seoPage = getSeoPageFromSlug("resources", slug);
  if (seoPage) {
    return (
      <SeoMarketingPage
        page={
          article
            ? {
                ...seoPage,
                title: article.title,
                metaTitle: article.title,
                metaDescription: article.description,
              }
            : seoPage
        }
      />
    );
  }
  if (!article) notFound();
  const origin = getAppUrl("https://triponeplus.com").replace(/\/$/, "");
  const canonical = `${origin}/resources/${article.slug}`;
  const related = getRelatedResources(article);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [`${origin}${article.image}`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "TripOne+" },
    publisher: { "@type": "Organization", name: "TripOne+", url: origin },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: origin },
      {
        "@type": "ListItem",
        position: 2,
        name: "Resources",
        item: `${origin}/resources`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonical,
      },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      {[articleSchema, breadcrumbSchema, faqSchema].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <article>
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
        >
          <ArrowLeft size={16} /> All resources
        </Link>
        <header className="mt-8 grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <Link
              href={`/resources/category/${resourceCategorySlugs[article.category]}`}
              className="marketing-kicker transition hover:border-emerald-300/30"
            >
              {article.category}
            </Link>
            <h1 className="marketing-title mt-6">{article.title}</h1>
            <p className="mt-6 text-lg leading-8 text-white/60">
              {article.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-white/45">
              <span className="inline-flex items-center gap-2">
                <Clock3 size={16} /> {article.readTime}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} /> Updated{" "}
                {formatDate(article.updatedAt)}
              </span>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </header>

        <div className="mx-auto mt-16 grid max-w-6xl gap-12 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/[.045] p-5">
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#95ee8e]">
                In this guide
              </p>
              <nav aria-label="Article sections" className="mt-4 grid gap-3">
                {article.sections.map((section) => (
                  <a
                    key={section.heading}
                    href={`#${headingId(section.heading)}`}
                    className="text-sm leading-5 text-white/50 transition hover:text-white"
                  >
                    {section.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <section className="rounded-[1.6rem] border border-emerald-300/15 bg-emerald-300/[.07] p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Key takeaways</h2>
              <ul className="mt-5 grid gap-4">
                {article.takeaways.map((takeaway) => (
                  <li
                    key={takeaway}
                    className="flex gap-3 leading-7 text-white/70"
                  >
                    <Check className="mt-1 shrink-0 text-[#95ee8e]" size={18} />
                    {takeaway}
                  </li>
                ))}
              </ul>
            </section>

            <div className="article-body mt-12">
              {article.sections.map((section) => (
                <section key={section.heading} id={headingId(section.heading)}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <section className="mt-14 border-t border-white/10 pt-10">
              <h2 className="text-2xl font-semibold">
                Frequently asked questions
              </h2>
              <div className="mt-5 divide-y divide-white/10">
                {article.faqs.map((faq) => (
                  <details key={faq.question} className="group py-5">
                    <summary className="cursor-pointer list-none pr-8 font-semibold marker:hidden">
                      {faq.question}
                    </summary>
                    <p className="mt-3 max-w-3xl leading-7 text-white/55">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {article.sources && (
              <section className="mt-12 rounded-2xl border border-white/10 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[.15em] text-white/70">
                  Primary sources reviewed
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/45">
                  Competitor capabilities can change. Review the provider&apos;s
                  own current information before making a purchase decision.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {article.sources.map((source) => (
                    <a
                      key={source.href}
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-white/[.06] px-4 py-2 text-sm text-white/65 transition hover:bg-white/[.1] hover:text-white"
                    >
                      {source.label} <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>

      <section className="mt-24 border-t border-white/10 pt-16">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="marketing-kicker">Continue learning</p>
            <h2 className="mt-4 text-3xl font-semibold">Related resources</h2>
          </div>
          <Link
            href="/resources"
            className="hidden items-center gap-2 text-sm font-semibold text-[#95ee8e] sm:flex"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <ResourceCard key={item.slug} article={item} />
          ))}
        </div>
      </section>
    </>
  );
}

function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}
