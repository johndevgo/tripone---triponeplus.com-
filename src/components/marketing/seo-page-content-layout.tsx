import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  Layers3,
  ListChecks,
  Route,
  Scale,
  Sparkles,
} from "lucide-react";
import { MarketingPrimaryCta } from "@/components/marketing/primary-cta";
import type { SeoContentSection, SeoFaq } from "@/content/seo-content";
import type { SeoEditorialLink, SeoPageSpec } from "@/content/seo-catalog";

type SeoPageContentLayoutProps = {
  page: SeoPageSpec;
  content: SeoContentSection[];
  faqs: SeoFaq[];
  editorialLinks: SeoEditorialLink[];
};

export function SeoPageContentLayout(props: SeoPageContentLayoutProps) {
  const { page } = props;
  return (
    <>
      {page.pageType === "Growth Service" ? (
        <ServiceLayout {...props} />
      ) : page.pageType === "Industry" ? (
        <IndustryLayout {...props} />
      ) : page.pageType === "Compare" ? (
        <ComparisonLayout {...props} />
      ) : page.pageType === "Tool" ? (
        <ToolLayout {...props} />
      ) : page.pageType === "Resource" ? (
        <ResourceLayout {...props} />
      ) : (
        <EditorialLayout {...props} />
      )}
      <FaqSection faqs={props.faqs} />
    </>
  );
}

function ServiceLayout({
  page,
  content,
  editorialLinks,
}: SeoPageContentLayoutProps) {
  return (
    <div className="mt-16">
      <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="glass rounded-[2rem] p-7 sm:p-9">
          <p className="marketing-kicker">
            <Sparkles size={15} /> Commercial mandate
          </p>
          <SectionCopy section={content[0]!} titleSize="large" />
        </div>
        <aside className="rounded-[2rem] border border-[#95ee8e]/25 bg-[linear-gradient(145deg,rgba(91,205,87,.28),rgba(255,255,255,.07))] p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#aaf5a4]">
            What the engagement must change
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-.03em]">
            A measurable path from attention to qualified demand.
          </h2>
          <ul className="mt-7 grid gap-4">
            {[
              "A documented commercial baseline and clear priority",
              "A connected offer, message and conversion journey",
              "Named owners for delivery, response and measurement",
              "Qualified customer and commercial evidence before scale",
            ].map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-white/72">
                <Check className="mt-1 shrink-0 text-[#95ee8e]" size={18} />
                {item}
              </li>
            ))}
          </ul>
          <MarketingPrimaryCta
            guestLabel={page.cta}
            guestHref="/signup"
            className="mt-8"
          >
            <ArrowRight size={16} />
          </MarketingPrimaryCta>
        </aside>
      </section>

      <section className="mt-14" aria-labelledby="service-delivery-system">
        <p className="marketing-kicker">Delivery system</p>
        <h2
          id="service-delivery-system"
          className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-.03em] sm:text-4xl"
        >
          Strategy, execution and measurement stay connected.
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {content.slice(1, 5).map((section, index) => (
            <article
              key={section.heading}
              id={headingId(section.heading)}
              className={`scroll-mt-28 rounded-[1.7rem] border p-6 sm:p-8 ${
                index === 0
                  ? "border-[#95ee8e]/25 bg-[#5bcd57]/15 lg:col-span-2"
                  : "border-white/12 bg-white/[.055]"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#95ee8e]">
                0{index + 1} / Service architecture
              </p>
              <SectionCopy section={section} />
              {index === 0 && (
                <DecisionLinks links={editorialLinks.slice(0, 3)} />
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 overflow-hidden rounded-[2rem] border border-white/12 bg-[#032b14]/60">
        <div className="grid lg:grid-cols-[.62fr_1.38fr]">
          <div className="border-b border-white/10 bg-white/[.06] p-7 lg:border-b-0 lg:border-r lg:p-9">
            <p className="marketing-kicker">
              <Route size={15} /> Operating roadmap
            </p>
            <h2 className="mt-5 text-3xl font-semibold">
              Build the system, then earn the right to scale it.
            </h2>
            <p className="mt-4 leading-7 text-white/56">
              The remaining work turns channel activity into a governed,
              customer-safe growth programme.
            </p>
          </div>
          <div className="divide-y divide-white/10">
            {content.slice(5).map((section, index) => (
              <article
                key={section.heading}
                id={headingId(section.heading)}
                className="scroll-mt-28 p-7 sm:p-9"
              >
                <div className="grid gap-5 sm:grid-cols-[3rem_1fr]">
                  <span className="grid size-10 place-items-center rounded-xl border border-[#95ee8e]/20 bg-[#95ee8e]/10 text-sm font-bold text-[#95ee8e]">
                    {index + 5}
                  </span>
                  <SectionCopy section={section} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function IndustryLayout({
  page,
  content,
  editorialLinks,
}: SeoPageContentLayoutProps) {
  return (
    <div className="mt-16">
      <section className="rounded-[2.2rem] border border-emerald-200/15 bg-[linear-gradient(135deg,rgba(149,238,142,.16),rgba(255,255,255,.045))] p-7 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="marketing-kicker">
              <Layers3 size={15} /> Operator blueprint
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">
              One traveller context across website, sales and delivery.
            </h2>
          </div>
          <p className="max-w-2xl leading-8 text-white/62">
            TripOne+ models the actual records behind {page.primaryKeyword}, so
            a public promise can remain connected to the team responsible for
            delivering it.
          </p>
        </div>
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {page.entities.map((entity, index) => (
            <div
              key={entity}
              className="rounded-2xl border border-white/12 bg-black/10 p-5"
            >
              <span className="text-xs font-bold text-[#95ee8e]">
                0{index + 1}
              </span>
              <p className="mt-2 font-semibold">{entity}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-12">
        {content.slice(0, 4).map((section, index) => (
          <article
            key={section.heading}
            id={headingId(section.heading)}
            className={`scroll-mt-28 rounded-[1.8rem] border border-white/12 p-7 sm:p-8 ${
              index === 0 || index === 3
                ? "bg-white/[.075] lg:col-span-7"
                : "bg-[#95ee8e]/[.07] lg:col-span-5"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
              {index === 0
                ? "Business model"
                : index === 1
                  ? "Customer decision"
                  : index === 2
                    ? "Connected records"
                    : "Implementation"}
            </p>
            <SectionCopy section={section} />
            {index === 1 && (
              <DecisionLinks links={editorialLinks.slice(0, 3)} />
            )}
          </article>
        ))}
      </section>

      <section className="mt-14" aria-labelledby="industry-operating-layers">
        <div className="max-w-3xl">
          <p className="marketing-kicker">Operating layers</p>
          <h2
            id="industry-operating-layers"
            className="mt-5 text-3xl font-semibold tracking-[-.03em] sm:text-4xl"
          >
            Growth that remains deliverable as the catalogue expands.
          </h2>
        </div>
        <div className="mt-8 space-y-5">
          {content.slice(4).map((section, index) => (
            <article
              key={section.heading}
              id={headingId(section.heading)}
              className="glass scroll-mt-28 rounded-[1.8rem] p-7 sm:p-9"
            >
              <div className="grid gap-6 lg:grid-cols-[.55fr_1.45fr]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
                    Layer {index + 1}
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-.02em]">
                    {section.heading}
                  </h2>
                </div>
                <SectionCopy section={section} hideHeading />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ComparisonLayout({
  content,
  editorialLinks,
}: SeoPageContentLayoutProps) {
  return (
    <div className="mt-16 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="glass rounded-[1.7rem] p-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
            <Scale size={15} /> Evaluation route
          </p>
          <ol className="mt-6 grid gap-4">
            {content.map((section, index) => (
              <li key={section.heading}>
                <a
                  href={`#${headingId(section.heading)}`}
                  className="group flex gap-3 text-sm leading-5 text-white/52 transition hover:text-white"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/12 bg-white/[.05] text-[10px] font-bold text-[#95ee8e] group-hover:border-[#95ee8e]/40">
                    {index + 1}
                  </span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </aside>
      <div className="min-w-0 space-y-6">
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ["01", "Requirements", "Define the work before comparing brands."],
            [
              "02",
              "Evidence",
              "Verify current first-party product information.",
            ],
            [
              "03",
              "Trial",
              "Run the same realistic workflow in both products.",
            ],
          ].map(([number, title, copy]) => (
            <article
              key={number}
              className="rounded-2xl border border-[#95ee8e]/20 bg-[#95ee8e]/[.075] p-5"
            >
              <span className="text-xs font-bold text-[#95ee8e]">{number}</span>
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/52">{copy}</p>
            </article>
          ))}
        </section>
        {content.map((section, index) => (
          <article
            key={section.heading}
            id={headingId(section.heading)}
            className={`scroll-mt-28 rounded-[1.8rem] border p-7 sm:p-9 ${
              section.sources
                ? "border-[#95ee8e]/25 bg-[#95ee8e]/[.07]"
                : index % 2 === 0
                  ? "border-white/12 bg-white/[.06]"
                  : "border-white/10 bg-black/10"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[.055] text-xs font-bold text-[#95ee8e]">
                {index + 1}
              </span>
              <SectionCopy section={section} />
            </div>
            {index === 1 && (
              <DecisionLinks links={editorialLinks.slice(0, 3)} />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function ToolLayout({ content }: SeoPageContentLayoutProps) {
  return (
    <div className="mt-14">
      <section className="grid gap-5 lg:grid-cols-3">
        {content.slice(0, 3).map((section, index) => (
          <article
            key={section.heading}
            id={headingId(section.heading)}
            className={`scroll-mt-28 rounded-[1.7rem] border p-6 ${
              index === 0
                ? "border-[#95ee8e]/25 bg-[#95ee8e]/[.09] lg:col-span-2"
                : "border-white/12 bg-white/[.055]"
            }`}
          >
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
              <ListChecks size={15} />{" "}
              {index === 0 ? "Method" : `Check ${index}`}
            </p>
            <SectionCopy section={section} />
          </article>
        ))}
      </section>
      <section className="mt-6 grid gap-5 md:grid-cols-2">
        {content.slice(3).map((section, index) => (
          <article
            key={section.heading}
            id={headingId(section.heading)}
            className={`scroll-mt-28 rounded-[1.7rem] border border-white/10 p-6 sm:p-8 ${
              index % 3 === 0 ? "bg-black/10" : "bg-white/[.05]"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
              {index < 2 ? "Interpret" : index < 4 ? "Validate" : "Act"}
            </span>
            <SectionCopy section={section} />
          </article>
        ))}
      </section>
    </div>
  );
}

function ResourceLayout({ content }: SeoPageContentLayoutProps) {
  return (
    <div className="mt-16 grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[1.8rem] border border-[#95ee8e]/25 bg-[#95ee8e]/[.09] p-7">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
            <ClipboardCheck size={15} /> Working document
          </p>
          <h2 className="mt-5 text-2xl font-semibold">
            Complete this resource in decision order.
          </h2>
          <ol className="mt-6 grid gap-4">
            {content.map((section, index) => (
              <li key={section.heading}>
                <a
                  href={`#${headingId(section.heading)}`}
                  className="flex gap-3 text-sm leading-5 text-white/58 transition hover:text-white"
                >
                  <span className="font-bold text-[#95ee8e]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </aside>
      <section className="space-y-5" aria-label="Resource workbook">
        {content.map((section, index) => (
          <article
            key={section.heading}
            id={headingId(section.heading)}
            className="glass scroll-mt-28 rounded-[1.8rem] p-7 sm:p-9"
          >
            <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-5">
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
                Workbook step {String(index + 1).padStart(2, "0")}
              </p>
              <span className="size-5 rounded-md border border-white/20 bg-white/[.035]" />
            </div>
            <SectionCopy section={section} />
          </article>
        ))}
      </section>
    </div>
  );
}

function EditorialLayout({ content }: SeoPageContentLayoutProps) {
  return (
    <div className="mt-16 grid gap-10 lg:grid-cols-[16rem_minmax(0,48rem)] lg:justify-center">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border-l border-white/15 pl-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
            <BookOpenCheck size={15} /> In this guide
          </p>
          <nav aria-label="Page sections" className="mt-5 grid gap-3">
            {content.map((section) => (
              <a
                key={section.heading}
                href={`#${headingId(section.heading)}`}
                className="text-sm leading-5 text-white/48 transition hover:text-white"
              >
                {section.heading}
              </a>
            ))}
          </nav>
        </div>
      </aside>
      <div className="article-body min-w-0">
        {content.map((section, index) => (
          <section key={section.heading} id={headingId(section.heading)}>
            <p className="not-prose mb-4 text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
              Chapter {String(index + 1).padStart(2, "0")}
            </p>
            <SectionCopy section={section} />
          </section>
        ))}
      </div>
    </div>
  );
}

function SectionCopy({
  section,
  hideHeading = false,
  titleSize = "normal",
}: {
  section: SeoContentSection;
  hideHeading?: boolean;
  titleSize?: "normal" | "large";
}) {
  return (
    <div className="min-w-0">
      {!hideHeading && (
        <h2
          className={`font-semibold tracking-[-.025em] text-white ${
            titleSize === "large"
              ? "mt-5 text-3xl sm:text-4xl"
              : "mt-4 text-2xl sm:text-3xl"
          }`}
        >
          {section.heading}
        </h2>
      )}
      <div className="mt-5 space-y-4 text-[1.02rem] leading-8 text-white/62">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.bullets && (
        <ul className="mt-6 grid gap-3">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 leading-7 text-white/68">
              <Check className="mt-1 shrink-0 text-[#95ee8e]" size={17} />
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {section.sources && (
        <aside className="mt-7 rounded-2xl border border-white/10 bg-black/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#95ee8e]">
            First-party sources checked
          </p>
          <ul className="mt-3 grid gap-2">
            {section.sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/68 transition hover:text-white"
                >
                  {source.label} <ExternalLink size={13} />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}

function DecisionLinks({ links }: { links: SeoEditorialLink[] }) {
  return (
    <aside className="mt-7 border-t border-white/10 pt-6">
      <p className="text-xs font-bold uppercase tracking-[.15em] text-[#95ee8e]">
        Continue the decision
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-white/10 bg-white/[.045] p-4 text-sm font-semibold leading-5 text-white/72 transition hover:border-[#95ee8e]/30 hover:bg-white/[.08] hover:text-white"
          >
            {link.label}
            <ArrowRight size={14} className="mt-3 text-[#95ee8e]" />
          </Link>
        ))}
      </div>
    </aside>
  );
}

function FaqSection({ faqs }: { faqs: SeoFaq[] }) {
  return (
    <section
      className="mt-20 rounded-[2rem] border border-white/12 bg-black/10 p-6 sm:p-9"
      aria-labelledby="page-faqs"
    >
      <p className="marketing-kicker">Direct answers</p>
      <h2 id="page-faqs" className="mt-5 text-3xl font-semibold">
        Frequently asked questions
      </h2>
      <div className="mt-7 grid gap-x-8 lg:grid-cols-2">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group border-b border-white/10 py-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold marker:hidden">
              {faq.question}
              <ChevronRight
                size={18}
                className="shrink-0 text-[#95ee8e] transition group-open:rotate-90"
              />
            </summary>
            <p className="mt-4 leading-7 text-white/58">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
