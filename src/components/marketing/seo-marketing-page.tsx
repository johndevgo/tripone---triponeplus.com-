import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Compass,
  ExternalLink,
  MessageCircle,
  SearchCheck,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { MarketingPrimaryCta } from "@/components/marketing/primary-cta";
import { SeoPageTypeIntro } from "@/components/marketing/seo-page-type-intro";
import { SeoPageContentLayout } from "@/components/marketing/seo-page-content-layout";
import { SeoPageHeroVisual } from "@/components/marketing/seo-page-hero-visual";
import { SeoToolWorkspace } from "@/components/marketing/seo-tool-workspace";
import {
  getSeoEditorialLinks,
  getSeoNamespace,
  getSeoPageImage,
  getSeoPageImageAlt,
  type SeoPageSpec,
} from "@/content/seo-catalog";
import { buildSeoContent, buildSeoFaqs } from "@/content/seo-content";
import { getServiceProofs } from "@/content/service-proof";
import { tripOneSupport } from "@/content/support";
import { getAppUrl } from "@/lib/app-url";

const namespaceLabels = {
  services: "Growth services",
  for: "Travel industries",
  compare: "Platform comparisons",
  resources: "Templates & resources",
  tools: "Free travel tools",
  blog: "Travel business guides",
} as const;

export function SeoMarketingPage({ page }: { page: SeoPageSpec }) {
  const content = buildSeoContent(page);
  const faqs = buildSeoFaqs(page);
  const editorialLinks = getSeoEditorialLinks(page);
  const proofs = getServiceProofs(page.path);
  const namespace = getSeoNamespace(page);
  const image = getSeoPageImage(page);
  const origin = getAppUrl("https://triponeplus.com").replace(/\/$/, "");
  const canonical = `${origin}${page.path}`;
  const schema = buildStructuredData(
    page,
    faqs,
    canonical,
    `${origin}${image}`,
  );
  const whatsappHref = `${tripOneSupport.whatsappHref.split("?", 1)[0]}?text=${encodeURIComponent(`Hello TripOne+, I would like to discuss ${page.title}.`)}`;

  return (
    <>
      {schema.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <article>
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-white/45"
        >
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link href={`/${namespace}`} className="transition hover:text-white">
            {namespaceLabels[namespace]}
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span
            aria-current="page"
            className="max-w-[18rem] truncate text-white/70"
          >
            {page.title}
          </span>
        </nav>

        <header className="mt-8 grid gap-10 lg:grid-cols-[1fr_.95fr] lg:items-center">
          <div>
            <p className="marketing-kicker">
              <SearchCheck size={15} /> {page.keywordCluster}
            </p>
            <h1 className="marketing-title mt-6 max-w-4xl">{page.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/62">
              {page.metaDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/55">
              {[
                page.vertical,
                page.pageType === "Growth Service"
                  ? "Specialist travel growth service"
                  : "Practical implementation guide",
                "Clear scope and measurement",
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 bg-white/[.055] px-3 py-2"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <MarketingPrimaryCta guestLabel={page.cta} guestHref="/signup">
                <ArrowRight size={17} />
              </MarketingPrimaryCta>
              {page.pageType === "Growth Service" && (
                <ButtonLink
                  href={whatsappHref}
                  variant="secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={17} /> Talk to TripOne+
                </ButtonLink>
              )}
            </div>
          </div>
          <SeoPageHeroVisual
            page={page}
            image={image}
            imageAlt={getSeoPageImageAlt(page)}
          />
        </header>

        <SeoPageTypeIntro page={page} />

        {proofs.length > 0 && (
          <section aria-labelledby="delivery-evidence" className="mt-16">
            <div className="max-w-3xl">
              <p className="marketing-kicker">Selected delivery evidence</p>
              <h2
                id="delivery-evidence"
                className="mt-5 text-3xl font-semibold tracking-[-.03em] sm:text-4xl"
              >
                Real work, shown with honest context
              </h2>
              <p className="mt-4 text-base leading-7 text-white/58">
                These supplied portfolio materials demonstrate delivery
                experience and the evidence used during an engagement. Client
                identifiers are omitted where appropriate. Historical account
                results are not forecasts or guarantees.
              </p>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {proofs.map((item, index) => (
                <figure
                  key={item.src}
                  className={`glass overflow-hidden rounded-[1.6rem] ${index === 0 && proofs.length % 2 === 1 ? "lg:col-span-2" : ""}`}
                >
                  <div
                    className={`relative bg-[#f7faf9] ${index === 0 && proofs.length % 2 === 1 ? "aspect-[2.35/1]" : "aspect-[1.72/1]"}`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes={
                        index === 0 && proofs.length % 2 === 1
                          ? "(max-width: 1024px) 100vw, 80vw"
                          : "(max-width: 1024px) 100vw, 40vw"
                      }
                      className="object-contain"
                    />
                  </div>
                  <figcaption className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-white">
                        {item.title}
                      </p>
                      <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-[#95ee8e]">
                        {item.kind === "performance"
                          ? "Anonymised evidence"
                          : item.kind === "credential"
                            ? "Supplied credential"
                            : "Delivery capability"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/52">
                      {item.caption}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {page.pageType === "Tool" && (
          <SeoToolWorkspace
            slug={page.path.split("/").at(-1)!}
            title={page.title}
          />
        )}
        <SeoPageContentLayout
          page={page}
          content={content}
          faqs={faqs}
          editorialLinks={editorialLinks}
        />
      </article>

      <section
        className="mt-24 border-t border-white/10 pt-16"
        aria-labelledby="related-pages"
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="marketing-kicker">
              <Compass size={15} /> Contextual next steps
            </p>
            <h2 id="related-pages" className="mt-4 text-3xl font-semibold">
              Continue through the topic cluster
            </h2>
          </div>
          <Link
            href={`/${namespace}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#95ee8e]"
          >
            View the complete hub <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {editorialLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass group rounded-2xl p-6 transition hover:-translate-y-1 hover:border-emerald-300/30"
            >
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#95ee8e]">
                Recommended next step
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-snug">
                {item.label}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
                {item.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/70 group-hover:text-white">
                Read next <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="glass mt-20 flex flex-col justify-between gap-7 rounded-[2rem] p-7 sm:p-10 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#95ee8e]">
            TripOne+ website and growth system
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-.03em]">
            Turn structured travel content into a website, enquiry and
            operations workflow.
          </h2>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <MarketingPrimaryCta guestLabel={page.cta} guestHref="/signup">
            <ArrowRight size={17} />
          </MarketingPrimaryCta>
          <ButtonLink
            href={tripOneSupport.whatsappHref}
            variant="secondary"
            target="_blank"
            rel="noreferrer"
          >
            Support <ExternalLink size={15} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

function buildStructuredData(
  page: SeoPageSpec,
  faqs: ReturnType<typeof buildSeoFaqs>,
  canonical: string,
  image: string,
) {
  const mainType =
    page.pageType === "Blog"
      ? "BlogPosting"
      : page.pageType === "Resource"
        ? "Article"
        : page.pageType === "Growth Service"
          ? "Service"
          : page.pageType === "Tool"
            ? "WebApplication"
            : "WebPage";
  const main = {
    "@context": "https://schema.org",
    "@type": mainType,
    name: page.title,
    headline: page.title,
    description: page.metaDescription,
    url: canonical,
    image,
    inLanguage: "en",
    keywords: [page.primaryKeyword, ...page.secondaryKeywords].join(", "),
    about: page.entities.map((name) => ({ "@type": "Thing", name })),
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://triponeplus.com/#website",
      name: "TripOne+",
      url: "https://triponeplus.com",
    },
    mainEntityOfPage: canonical,
    audience: { "@type": "Audience", audienceType: page.vertical },
    provider: {
      "@type": "Organization",
      name: "TripOne+",
      url: "https://triponeplus.com",
    },
    ...(page.pageType === "Tool"
      ? {
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
        }
      : {}),
    ...(page.pageType === "Growth Service"
      ? {
          serviceType: page.keywordCluster,
          areaServed: "Worldwide",
        }
      : {}),
    ...(page.pageType === "Blog"
      ? {
          author: { "@type": "Organization", name: "TripOne+" },
          publisher: {
            "@type": "Organization",
            name: "TripOne+",
            url: "https://triponeplus.com",
          },
        }
      : {}),
  };
  return [
    main,
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
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://triponeplus.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: namespaceLabels[getSeoNamespace(page)],
          item: `https://triponeplus.com/${getSeoNamespace(page)}`,
        },
        { "@type": "ListItem", position: 3, name: page.title, item: canonical },
      ],
    },
  ];
}
