import Link from "next/link";
import {
  ArrowRight,
  Box,
  Check,
  Clock3,
  Compass,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { SiteSection } from "@/lib/types";
import type { ThemeTokens } from "@/lib/site-generator";
import { LeadForm } from "@/components/site/lead-form";
import { PublicAnalytics } from "@/components/site/public-analytics";

export type PublicExperience = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price_from: number | null;
  currency: string;
  duration_value: number | null;
  duration_unit: string | null;
  location_name: string | null;
  featured_image_url: string | null;
  booking_url: string | null;
  description?: string;
  pricing_label?: string | null;
  meeting_point?: string | null;
  max_guests?: number | null;
  min_guests?: number | null;
  minimum_age?: number | null;
  cancellation_policy?: string | null;
  booking_button_label?: string | null;
  gallery?: unknown;
  highlights?: unknown;
  inclusions?: unknown;
  exclusions?: unknown;
  itinerary?: unknown;
  faqs?: unknown;
};
export type PublicTestimonial = {
  id: string;
  author_name: string;
  author_location?: string | null;
  rating?: number | null;
  quote: string;
  source?: string | null;
};
export type PublicRental = {
  id: string;
  name: string;
  slug: string;
  rental_type: string;
  short_description: string;
  description: string;
  currency: string;
  pricing_label?: string | null;
  location_name?: string | null;
  booking_url?: string | null;
  booking_button_label?: string | null;
  quote_only: boolean;
  featured_image_url?: string | null;
  specifications?: unknown;
  inclusions?: unknown;
  exclusions?: unknown;
  rental_terms?: unknown;
  rates: Array<{
    label: string;
    amount: number | null;
    currency: string;
    pricing_unit: string;
    minimum_quantity?: number | null;
    maximum_quantity?: number | null;
  }>;
};
export type SiteRendererProps = {
  site: {
    id: string;
    name: string;
    slug: string;
    navigation: unknown;
    footer_settings: unknown;
    global_settings: unknown;
  };
  business: {
    name: string;
    city: string;
    country: string;
    phone: string | null;
    whatsapp: string | null;
    email: string;
    logo_url: string | null;
  };
  page: { title: string; slug: string; sections: SiteSection[] };
  theme: ThemeTokens;
  experiences: PublicExperience[];
  rentals?: PublicRental[];
  testimonials?: PublicTestimonial[];
  basePath: string;
  preview?: boolean;
  editor?: {
    selectedSectionId?: string | null;
    onSelectSection: (id: string) => void;
  };
  activeExperience?: PublicExperience;
  activeRental?: PublicRental;
};

function href(base: string, path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return path === "/"
    ? base
    : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
export function SiteRenderer({
  site,
  business,
  page,
  theme,
  experiences,
  rentals = [],
  testimonials = [],
  basePath,
  preview,
  editor,
  activeExperience,
  activeRental,
}: SiteRendererProps) {
  const nav = Array.isArray(site.navigation)
    ? (site.navigation as Array<{ label: string; href: string }>)
    : [];
  const footer = (site.footer_settings ?? {}) as Record<string, unknown>;
  const global = (site.global_settings ?? {}) as Record<string, unknown>;
  const integrations = object(global.integrations);
  const cro = object(global.cro);
  const header = object(global.header);
  const headerVariant = text(header, "variant", "standard");
  const footerVariant = text(footer, "variant", "columns");
  const logoSize = text(header, "logoSize", "medium");
  const headerInnerClass =
    headerVariant === "centered"
      ? "md:grid md:grid-cols-[1fr_auto_1fr]"
      : "flex";
  const css = {
    "--site-primary": theme.colors.primary,
    "--site-secondary": theme.colors.secondary,
    "--site-accent": theme.colors.accent,
    "--site-bg": theme.colors.background,
    "--site-surface": theme.colors.surface,
    "--site-text": theme.colors.text,
    "--site-muted": theme.colors.muted,
    "--site-radius": theme.radius,
    "--site-font": theme.font,
    "--site-heading": theme.headingFont,
    "--site-heading-weight": theme.headingWeight,
  } as React.CSSProperties;
  return (
    <div
      style={css}
      data-button-style={theme.buttonStyle}
      data-header-style={theme.headerStyle}
      data-image-treatment={theme.imageTreatment}
      data-section-style={theme.sectionStyle}
      data-text-scale={theme.baseTextScale}
      data-card-border={theme.cardBorder}
      data-shadow={theme.shadowStrength}
      data-content-width={theme.contentWidth}
      data-header-height={theme.headerHeight}
      data-spacing={theme.spacingCharacter}
      className="generated-site min-h-screen bg-[var(--site-bg)] font-[family-name:var(--site-font)] text-[var(--site-text)]"
    >
      {preview && (
        <div className="bg-[#022C22] px-4 py-2 text-center text-xs text-white/60">
          Draft preview · Only you can see unpublished content
        </div>
      )}
      <header
        data-layout={headerVariant}
        className={`${header.sticky === false ? "relative" : "sticky top-0"} z-30 border-b border-black/5 ${header.transparentOverHero === true ? "bg-[color:var(--site-bg)]/65" : "bg-[color:var(--site-bg)]/90"} backdrop-blur-xl`}
      >
        {header.showContactBar === true &&
          (business.phone || business.whatsapp) && (
            <div className="border-b border-black/5 bg-[var(--site-primary)] px-5 py-2 text-right text-xs text-white/75">
              {business.phone && (
                <a href={`tel:${business.phone}`}>{business.phone}</a>
              )}
              {business.phone && business.whatsapp && <span> · </span>}
              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                >
                  WhatsApp
                </a>
              )}
            </div>
          )}
        <div
          className={`mx-auto ${headerInnerClass} ${headerVariant === "compact" ? "min-h-14" : "min-h-18"} max-w-7xl items-center justify-between gap-5 px-5`}
        >
          <Link href={basePath} className="flex items-center gap-2 font-bold">
            {business.logo_url ? (
              // Site logos may use a user-provided remote URL; do not widen the image proxy allowlist.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logo_url}
                alt=""
                className={`${logoSize === "small" ? "h-7 max-w-24" : logoSize === "large" ? "h-12 max-w-40" : "h-9 max-w-32"} object-contain`}
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-[calc(var(--site-radius)*.65)] bg-[var(--site-primary)] text-white">
                <Compass size={19} />
              </span>
            )}
            {business.name}
          </Link>
          <nav
            className={`hidden items-center gap-6 text-sm md:flex ${headerVariant === "centered" ? "justify-self-center" : ""}`}
            aria-label="Website navigation"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={href(basePath, item.href)}
                className="text-[var(--site-muted)] hover:text-[var(--site-text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href={href(basePath, text(header, "ctaHref", "/contact"))}
            data-cta
            className="site-primary-action hidden min-h-10 items-center rounded-[calc(var(--site-radius)*.65)] bg-[var(--site-accent)] px-4 text-sm font-semibold sm:inline-flex"
          >
            {text(
              header,
              "ctaLabel",
              text(cro, "defaultBookingCta", "Contact us"),
            )}
          </Link>
          <details className="relative md:hidden">
            <summary
              aria-label="Open website menu"
              className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-black/10"
            >
              <Menu />
            </summary>
            <nav className="absolute right-0 top-12 grid min-w-52 gap-1 rounded-2xl border border-black/10 bg-[var(--site-surface)] p-2 shadow-xl">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={href(basePath, item.href)}
                  className="rounded-xl px-4 py-3 text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </header>
      <main>
        {page.sections
          .filter((s) => s.visible)
          .map((section) => {
            const rendered = (
              <Section
                section={section}
                experiences={experiences}
                rentals={rentals}
                basePath={basePath}
                business={business}
                siteId={site.id}
                sourcePage={page.slug ? `/${page.slug}` : "/"}
                testimonials={testimonials}
              />
            );
            return editor ? (
              <div
                key={section.id}
                data-section-type={section.type}
                data-section-variant={section.variant}
                role="button"
                tabIndex={0}
                aria-label={`Edit ${section.type} section`}
                onClickCapture={(event) => {
                  event.preventDefault();
                  editor.onSelectSection(section.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    editor.onSelectSection(section.id);
                  }
                }}
                className={`relative cursor-pointer outline-offset-[-3px] transition ${editor.selectedSectionId === section.id ? "z-10 outline-3 outline-[#F5A623]" : "hover:outline-2 hover:outline-[#F5A623]/60"}`}
              >
                {rendered}
                {editor.selectedSectionId === section.id && (
                  <span className="pointer-events-none absolute left-2 top-2 z-30 rounded-md bg-[#F5A623] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#173028]">
                    {section.type.replace(/([A-Z])/g, " $1")}
                  </span>
                )}
              </div>
            ) : (
              <div
                key={section.id}
                data-section-type={section.type}
                data-section-variant={section.variant}
              >
                {rendered}
              </div>
            );
          })}
      </main>
      {activeExperience && (
        <ExperienceDetail
          experience={activeExperience}
          related={experiences
            .filter((item) => item.id !== activeExperience.id)
            .slice(0, 3)}
          basePath={basePath}
          siteId={site.id}
          globalSettings={global}
          croSettings={cro}
        />
      )}
      {activeRental && (
        <RentalDetail
          rental={activeRental}
          siteId={site.id}
          basePath={basePath}
        />
      )}
      <footer
        data-layout={footerVariant}
        className={`${footerVariant === "editorial" ? "border-t border-black/10 bg-[var(--site-surface)] text-[var(--site-text)]" : "bg-[var(--site-primary)] text-white"} px-5 ${footerVariant === "compact" ? "py-8" : "py-14"}`}
      >
        <div
          className={`mx-auto grid max-w-7xl gap-9 ${footerVariant === "compact" ? "items-center sm:grid-cols-[1fr_auto]" : "sm:grid-cols-3"}`}
        >
          <div>
            <p className="text-xl font-bold">{business.name}</p>
            <p className="mt-3 text-sm opacity-60">
              {text(
                footer,
                "description",
                `${business.city}, ${business.country}`,
              )}
            </p>
          </div>
          <div className={footerVariant === "compact" ? "hidden" : "block"}>
            <p className="text-xs uppercase tracking-widest opacity-40">
              Explore
            </p>
            <div className="mt-3 grid gap-2 text-sm">
              {nav.slice(0, 5).map((item) => (
                <Link key={item.href} href={href(basePath, item.href)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className={footerVariant === "compact" ? "hidden" : "block"}>
            <p className="text-xs uppercase tracking-widest opacity-40">
              Contact
            </p>
            <a className="mt-3 block text-sm" href={`mailto:${business.email}`}>
              {business.email}
            </a>
            {business.phone && (
              <a className="mt-2 block text-sm" href={`tel:${business.phone}`}>
                {business.phone}
              </a>
            )}
          </div>
          {text(footer, "bookingCta") && (
            <Link
              href={href(basePath, text(footer, "bookingHref", "/experiences"))}
              data-cta
              className="site-primary-action inline-flex min-h-11 items-center justify-center self-start rounded-xl bg-[var(--site-accent)] px-4 font-semibold text-[var(--site-text)]"
            >
              {text(footer, "bookingCta")}
            </Link>
          )}
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-current/10 pt-5 text-xs opacity-40">
          {text(
            footer,
            "copyright",
            `© ${new Date().getFullYear()} ${business.name}`,
          )}{" "}
          · Website powered by TripOne+
        </div>
      </footer>
      {!preview && !editor && (
        <PublicAnalytics
          experienceId={activeExperience?.id}
          consentMode={
            global.cookieConsentMode === "basic" ? "basic" : "disabled"
          }
          integrations={{
            googleTagManagerId:
              text(integrations, "googleTagManagerId") || undefined,
            googleAnalyticsId:
              text(integrations, "googleAnalyticsId") || undefined,
            metaPixelId: text(integrations, "metaPixelId") || undefined,
            tiktokPixelId: text(integrations, "tiktokPixelId") || undefined,
          }}
        />
      )}
    </div>
  );
}

function RentalDetail({
  rental,
  siteId,
  basePath,
}: {
  rental: PublicRental;
  siteId: string;
  basePath: string;
}) {
  const specifications = Array.isArray(rental.specifications)
    ? rental.specifications.filter(
        (item): item is { label: string; value: string } =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as { label?: unknown }).label === "string" &&
          typeof (item as { value?: unknown }).value === "string",
      )
    : [];
  const bookingHref = rental.booking_url || href(basePath, "/contact");
  return (
    <div data-rental-detail>
      {(rental.rates.length > 0 || rental.quote_only) && (
        <section className="bg-[var(--site-surface)] px-5 py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[var(--site-secondary)]">
              Rental rates
            </p>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {rental.quote_only ? (
                <article className="rounded-[var(--site-radius)] bg-[var(--site-bg)] p-6">
                  <Box className="text-[var(--site-secondary)]" />
                  <h2 className="mt-4 text-xl font-semibold">
                    Request a quote
                  </h2>
                  <p className="mt-2 text-[var(--site-muted)]">
                    Tell us your dates and requirements for current pricing.
                  </p>
                </article>
              ) : (
                rental.rates.map((rate) => (
                  <article
                    key={`${rate.label}-${rate.pricing_unit}`}
                    className="rounded-[var(--site-radius)] border border-black/5 bg-[var(--site-bg)] p-6"
                  >
                    <p className="text-sm text-[var(--site-muted)]">
                      {rate.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold">
                      {rate.amount == null
                        ? "Quote"
                        : `${rate.currency} ${rate.amount}`}
                    </p>
                    <p className="mt-1 text-sm text-[var(--site-muted)]">
                      per {rate.pricing_unit}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      )}
      {specifications.length > 0 && (
        <section className="px-5 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-semibold">Specifications</h2>
            <dl className="mt-7 divide-y divide-black/10">
              {specifications.map((item) => (
                <div className="grid grid-cols-2 gap-4 py-4" key={item.label}>
                  <dt className="text-[var(--site-muted)]">{item.label}</dt>
                  <dd className="font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}
      <section className="bg-[var(--site-primary)] px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">Ask about {rental.name}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/65">
            Confirm availability, dates, pickup details, and any requirements
            before booking.
          </p>
          <a
            href={bookingHref}
            target={rental.booking_url ? "_blank" : undefined}
            rel={rental.booking_url ? "noopener noreferrer" : undefined}
            className="mt-7 inline-flex min-h-12 items-center rounded-[calc(var(--site-radius)*.65)] bg-[var(--site-accent)] px-6 font-semibold text-[var(--site-text)]"
          >
            {rental.booking_button_label || "Request rental"}
          </a>
          <div className="mx-auto mt-8 max-w-xl text-left">
            <LeadForm siteId={siteId} sourcePage={`/rentals/${rental.slug}`} />
          </div>
        </div>
      </section>
    </div>
  );
}

function ExperienceDetail({
  experience,
  related,
  basePath,
  siteId,
  globalSettings,
  croSettings,
}: {
  experience: PublicExperience;
  related: PublicExperience[];
  basePath: string;
  siteId: string;
  globalSettings: Record<string, unknown>;
  croSettings: Record<string, unknown>;
}) {
  const highlights = stringList(experience.highlights);
  const inclusions = stringList(experience.inclusions);
  const exclusions = stringList(experience.exclusions);
  const gallery = Array.isArray(experience.gallery)
    ? (experience.gallery as Array<string | { url?: string; alt?: string }>)
    : [];
  const itinerary = Array.isArray(experience.itinerary)
    ? (experience.itinerary as Array<{
        title?: string;
        description?: string;
        duration?: string;
      }>)
    : [];
  const faqs = Array.isArray(experience.faqs)
    ? (experience.faqs as Array<{ question?: string; answer?: string }>)
    : [];
  const bookingHref =
    experience.booking_url ||
    text(globalSettings, "bookingUrl") ||
    `${basePath}/contact`;
  const externalBooking = /^https?:\/\//i.test(bookingHref);
  const bookingTarget =
    externalBooking && globalSettings.openBookingInNewTab === true
      ? "_blank"
      : undefined;
  return (
    <div className="border-t border-black/5">
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="text-3xl font-semibold">What to expect</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--site-muted)]">
              {experience.description || experience.short_description}
            </p>
            {highlights.length > 0 && (
              <ListBlock title="Highlights" items={highlights} />
            )}
          </div>
          <aside className="h-fit rounded-[var(--site-radius)] border border-black/5 bg-[var(--site-surface)] p-6 shadow-lg">
            <p className="text-2xl font-semibold">
              {experience.price_from != null
                ? `From ${experience.currency} ${experience.price_from}`
                : experience.pricing_label || "Enquire for price"}
            </p>
            <div className="mt-5 grid gap-3 text-sm text-[var(--site-muted)]">
              {experience.duration_value && (
                <p>
                  <Clock3 className="mr-2 inline" size={16} />
                  {experience.duration_value} {experience.duration_unit}
                </p>
              )}
              {experience.location_name && (
                <p>
                  <MapPin className="mr-2 inline" size={16} />
                  {experience.location_name}
                </p>
              )}
              {experience.max_guests && (
                <p>Up to {experience.max_guests} guests</p>
              )}
              {experience.minimum_age != null && (
                <p>Minimum age {experience.minimum_age}</p>
              )}
            </div>
            <a
              href={bookingHref}
              data-booking-link
              target={bookingTarget}
              rel={bookingTarget ? "noopener noreferrer" : undefined}
              className="site-primary-action mt-6 flex min-h-12 items-center justify-center rounded-xl bg-[var(--site-accent)] font-semibold"
            >
              {experience.booking_button_label || "Book now"}
            </a>
          </aside>
        </div>
      </section>
      {(inclusions.length > 0 || exclusions.length > 0) && (
        <section className="bg-[var(--site-surface)] px-5 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
            {inclusions.length > 0 && (
              <ListBlock title="What's included" items={inclusions} />
            )}
            {exclusions.length > 0 && (
              <ListBlock title="What's not included" items={exclusions} />
            )}
          </div>
        </section>
      )}
      {itinerary.length > 0 && (
        <section className="px-5 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-semibold">Itinerary</h2>
            <ol className="mt-8 space-y-4">
              {itinerary.map((step, index) => (
                <li
                  className="rounded-[var(--site-radius)] bg-[var(--site-surface)] p-6"
                  key={`${step.title}-${index}`}
                >
                  <p className="text-xs text-[var(--site-secondary)]">
                    Step {index + 1}
                    {step.duration ? ` · ${step.duration}` : ""}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-[var(--site-muted)]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
      {gallery.length > 0 && (
        <section className="px-5 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-semibold">Gallery</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image, index) => {
                const url = typeof image === "string" ? image : image.url;
                if (!url) return null;
                return (
                  <div
                    className="aspect-[4/3] overflow-hidden rounded-[var(--site-radius)]"
                    key={`${url}-${index}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={
                        typeof image === "string"
                          ? experience.name
                          : image.alt || experience.name
                      }
                      className="site-media h-full w-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {(experience.meeting_point || experience.cancellation_policy) && (
        <section className="bg-[var(--site-surface)] px-5 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
            {experience.meeting_point && (
              <div>
                <h2 className="text-2xl font-semibold">Meeting point</h2>
                <p className="mt-3 leading-7 text-[var(--site-muted)]">
                  {experience.meeting_point}
                </p>
              </div>
            )}
            {experience.cancellation_policy && (
              <div>
                <h2 className="text-2xl font-semibold">Cancellation</h2>
                <p className="mt-3 leading-7 text-[var(--site-muted)]">
                  {experience.cancellation_policy}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
      {faqs.length > 0 && (
        <section className="px-5 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold">
              Questions about this experience
            </h2>
            <div className="mt-7 divide-y divide-black/10">
              {faqs.map((item, index) => (
                <details className="py-5" key={`${item.question}-${index}`}>
                  <summary className="cursor-pointer font-semibold">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-[var(--site-muted)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold">
            Enquire about this experience
          </h2>
          <div className="mt-7">
            <LeadForm
              siteId={siteId}
              experienceId={experience.id}
              sourcePage={`/experiences/${experience.slug}`}
            />
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="bg-[var(--site-surface)] px-5 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-semibold">Related experiences</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <ExperienceCard item={item} basePath={basePath} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      )}
      {croSettings.stickyMobileCta !== false && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-black/10 bg-[var(--site-surface)]/95 px-4 py-3 shadow-2xl backdrop-blur md:hidden">
          <span className="font-semibold">
            {experience.price_from != null
              ? `From ${experience.currency} ${experience.price_from}`
              : "Plan your trip"}
          </span>
          <a
            href={bookingHref}
            data-booking-link
            target={bookingTarget}
            rel={bookingTarget ? "noopener noreferrer" : undefined}
            className="site-primary-action rounded-xl bg-[var(--site-accent)] px-5 py-3 font-semibold"
          >
            {experience.booking_button_label || "Book now"}
          </a>
        </div>
      )}
    </div>
  );
}
function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold">{title}</h3>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li className="flex gap-2 text-[var(--site-muted)]" key={item}>
            <Check
              className="mt-0.5 shrink-0 text-[var(--site-secondary)]"
              size={17}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function text(settings: Record<string, unknown>, key: string, fallback = "") {
  const value = settings[key];
  return typeof value === "string" ? value : fallback;
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function Section({
  section,
  experiences,
  rentals,
  basePath,
  business,
  siteId,
  sourcePage,
  testimonials,
}: {
  section: SiteSection;
  experiences: PublicExperience[];
  rentals: PublicRental[];
  basePath: string;
  business: SiteRendererProps["business"];
  siteId: string;
  sourcePage: string;
  testimonials: PublicTestimonial[];
}) {
  const s = section.settings;
  switch (section.type) {
    case "hero":
      const imageUrl = text(s, "imageUrl");
      const centered =
        text(s, "alignment") === "center" || section.variant === "minimal";
      return (
        <section
          className={`relative overflow-hidden bg-[var(--site-primary)] px-5 text-white ${text(s, "height") === "screen" || section.variant === "cinematic" ? "grid min-h-[85vh] place-items-center py-24" : text(s, "height") === "compact" ? "py-16" : "py-24 sm:py-32"}`}
        >
          {imageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,${Number(s.overlay ?? 45) / 100}),rgba(0,0,0,${Number(s.overlay ?? 45) / 100})),url(${JSON.stringify(imageUrl).slice(1, -1)})`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,.14),transparent_35rem)]" />
          <div
            className={`relative mx-auto max-w-7xl ${centered ? "text-center" : ""}`}
          >
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-[var(--site-accent)]">
              {text(s, "eyebrow", business.name)}
            </p>
            <h1 className="mt-5 max-w-4xl font-[family-name:var(--site-heading)] text-5xl font-semibold leading-[1.04] tracking-[-.04em] sm:text-7xl">
              {text(s, "title")}
            </h1>
            <p
              className={`mt-6 max-w-2xl text-lg leading-8 text-white/75 ${centered ? "mx-auto" : ""}`}
            >
              {text(s, "description")}
            </p>
            <Link
              href={href(basePath, text(s, "primaryHref", "/experiences"))}
              data-cta
              className="site-primary-action mt-9 inline-flex min-h-12 items-center gap-2 rounded-[calc(var(--site-radius)*.65)] bg-[var(--site-accent)] px-6 font-semibold text-[var(--site-text)]"
            >
              {text(s, "primaryCta", "Explore")}
              <ArrowRight size={17} />
            </Link>
            {text(s, "secondaryCta") && (
              <Link
                href={href(basePath, text(s, "secondaryHref", "/contact"))}
                className="ml-3 mt-9 inline-flex min-h-12 items-center rounded-[calc(var(--site-radius)*.65)] border border-white/35 px-6 font-semibold"
              >
                {text(s, "secondaryCta")}
              </Link>
            )}
          </div>
        </section>
      );
    case "featuredExperiences":
    case "experienceGrid":
    case "featuredPackages":
      return (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <Heading settings={s} />
            {experiences.length ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {experiences.map((item) => (
                  <ExperienceCard
                    key={item.id}
                    item={item}
                    basePath={basePath}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-[var(--site-radius)] bg-[var(--site-surface)] p-8 text-[var(--site-muted)]">
                Experiences are being prepared. Contact us for current options.
              </p>
            )}
          </div>
        </section>
      );
    case "rentalGrid":
      return (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <Heading settings={s} />
            {rentals.length ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {rentals.map((rental) => (
                  <RentalCard
                    key={rental.id}
                    rental={rental}
                    basePath={basePath}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-[var(--site-radius)] bg-[var(--site-surface)] p-6 text-[var(--site-muted)]">
                Rental inventory will appear here when it is ready.
              </p>
            )}
          </div>
        </section>
      );
    case "trustBar": {
      const trustItems: Array<[LucideIcon, string]> = [
        [ShieldCheck, "Clear booking details"],
        [MapPin, `Local to ${business.city}`],
        [Sparkles, "Experiences for real travellers"],
      ];
      return (
        <section className="border-b border-black/5 bg-[var(--site-surface)] px-5 py-5">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-[var(--site-muted)]">
            {trustItems.map(([Icon, label]) => (
              <span className="flex items-center gap-2" key={String(label)}>
                <Icon size={17} className="text-[var(--site-secondary)]" />
                {String(label)}
              </span>
            ))}
          </div>
        </section>
      );
    }
    case "whyChooseUs":
    case "features":
    case "safety":
    case "whyTravelWithUs":
      return (
        <section className="bg-[var(--site-surface)] px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <Heading settings={s} />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                "Useful information",
                "Straightforward planning",
                "Local contact",
              ].map((title, i) => (
                <article
                  key={title}
                  className="rounded-[var(--site-radius)] border border-black/5 bg-[var(--site-bg)] p-6"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-[var(--site-primary)] text-sm text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-7 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--site-muted)]">
                    Everything you need to choose and plan the right experience.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    case "destinations":
    case "popularDestinations":
    case "wildlifeHighlights":
    case "difficultyOverview":
    case "guides":
    case "specialOffers":
    case "stats":
      return (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <Heading settings={s} />
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                "Clear details",
                "Built around your trip",
                "Ask before you book",
              ].map((title) => (
                <article
                  className="min-h-40 rounded-[var(--site-radius)] border border-black/5 bg-[var(--site-surface)] p-6 shadow-sm"
                  key={title}
                >
                  <Check className="text-[var(--site-secondary)]" size={19} />
                  <h3 className="mt-8 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--site-muted)]">
                    Add verified information in your workspace as it becomes
                    available.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    case "gallery":
      return (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <Heading settings={s} />
            <div className="mt-10 grid min-h-72 grid-cols-2 gap-3 sm:grid-cols-4">
              {experiences.slice(0, 4).map((item, i) => (
                <div
                  key={item.id}
                  className={`${i === 0 ? "col-span-2 row-span-2" : ""} overflow-hidden rounded-[var(--site-radius)] bg-[var(--site-primary)]`}
                >
                  {item.featured_image_url ? (
                    // User media is already constrained by the upload route and storage bucket.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.featured_image_url}
                      alt={item.name}
                      className="site-media h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full min-h-36 place-items-center text-white/35">
                      <Compass />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "faq": {
      const items = Array.isArray(s.items)
        ? (s.items as Array<{ question: string; answer: string }>)
        : [];
      return (
        <section className="bg-[var(--site-surface)] px-5 py-20">
          <div className="mx-auto max-w-3xl">
            <Heading settings={s} />
            <div className="mt-8 divide-y divide-black/10">
              {items.map((item) => (
                <details className="py-5" key={item.question}>
                  <summary className="cursor-pointer font-semibold">
                    {item.question}
                  </summary>
                  <p className="mt-3 leading-7 text-[var(--site-muted)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "testimonials":
      if (testimonials.length === 0) return null;
      return (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <Heading
              settings={{ ...s, title: text(s, "title", "Guest stories") }}
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <blockquote
                  key={item.id}
                  className="rounded-[var(--site-radius)] border border-black/5 bg-[var(--site-surface)] p-7"
                >
                  <Quote className="text-[var(--site-secondary)]" />
                  <p className="mt-4 leading-7 text-[var(--site-muted)]">
                    “{item.quote}”
                  </p>
                  <footer className="mt-5 text-sm font-semibold">
                    {item.author_name}
                    {item.author_location ? ` · ${item.author_location}` : ""}
                    {item.rating ? ` · ${item.rating}/5` : ""}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      );
    case "contact":
      return (
        <section className="px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
            <Heading settings={s} />
            <div>
              <div className="rounded-[var(--site-radius)] bg-[var(--site-primary)] p-7 text-white">
                <p className="text-sm text-white/50">Contact directly</p>
                <a
                  href={`mailto:${business.email}`}
                  className="mt-5 flex items-center gap-3"
                >
                  <Mail size={18} />
                  {business.email}
                </a>
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="mt-4 flex items-center gap-3"
                  >
                    <Phone size={18} />
                    {business.phone}
                  </a>
                )}
              </div>
              <div className="mt-5">
                <LeadForm siteId={siteId} sourcePage={sourcePage} />
              </div>
            </div>
          </div>
        </section>
      );
    case "location":
      return (
        <section className="bg-[var(--site-surface)] px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <MapPin className="text-[var(--site-secondary)]" />
            <Heading settings={s} />
            <p className="mt-4 text-[var(--site-muted)]">
              {business.city}, {business.country}
            </p>
          </div>
        </section>
      );
    case "finalCta":
      return (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl rounded-[var(--site-radius)] bg-[var(--site-primary)] p-8 text-center text-white sm:p-14">
            <h2 className="font-[family-name:var(--site-heading)] text-4xl font-semibold">
              {text(s, "title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              {text(s, "description")}
            </p>
            <Link
              href={href(basePath, text(s, "href", "/experiences"))}
              data-cta
              className="site-primary-action mt-7 inline-flex min-h-11 items-center rounded-[calc(var(--site-radius)*.65)] bg-[var(--site-accent)] px-5 font-semibold text-[var(--site-text)]"
            >
              {text(s, "label", "Explore")}
            </Link>
          </div>
        </section>
      );
    case "richText":
      return (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-3xl">
            <Heading settings={s} />
            <p className="mt-6 text-lg leading-8 text-[var(--site-muted)]">
              {text(s, "body", text(s, "description"))}
            </p>
          </div>
        </section>
      );
    case "video": {
      const embed = videoEmbed(text(s, "url"));
      return (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-5xl">
            <Heading settings={s} />
            {embed ? (
              <iframe
                className="mt-8 aspect-video w-full rounded-[var(--site-radius)]"
                src={embed}
                title={text(s, "title", "Video")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <p className="mt-6 rounded-[var(--site-radius)] bg-[var(--site-surface)] p-6 text-[var(--site-muted)]">
                Add a YouTube or Vimeo URL to display a video.
              </p>
            )}
          </div>
        </section>
      );
    }
    case "divider":
      return (
        <div
          aria-hidden="true"
          className={
            section.variant === "line"
              ? "mx-auto my-10 h-px max-w-7xl bg-black/10"
              : "h-16"
          }
        />
      );
    case "logoRow":
      return (
        <section className="px-5 py-12">
          <div className="mx-auto max-w-7xl text-center">
            <Heading settings={s} />
            <p className="mt-6 text-sm text-[var(--site-muted)]">
              Add only approved partner, certification or affiliation logos.
            </p>
          </div>
        </section>
      );
    default:
      return (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <Heading settings={s} />
          </div>
        </section>
      );
  }
}
function videoEmbed(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be")
      return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.endsWith("youtube.com"))
      return parsed.searchParams.get("v")
        ? `https://www.youtube-nocookie.com/embed/${parsed.searchParams.get("v")}`
        : "";
    if (parsed.hostname.endsWith("vimeo.com"))
      return `https://player.vimeo.com/video/${parsed.pathname.split("/").filter(Boolean).at(-1)}`;
  } catch {}
  return "";
}
function Heading({ settings }: { settings: Record<string, unknown> }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--site-heading)] text-3xl font-semibold tracking-tight sm:text-4xl">
        {text(settings, "title")}
      </h2>
      {text(settings, "description") && (
        <p className="mt-3 max-w-2xl leading-7 text-[var(--site-muted)]">
          {text(settings, "description")}
        </p>
      )}
    </div>
  );
}
function ExperienceCard({
  item,
  basePath,
}: {
  item: PublicExperience;
  basePath: string;
}) {
  return (
    <Link
      href={href(basePath, `/experiences/${item.slug}`)}
      className="group overflow-hidden rounded-[var(--site-radius)] border border-black/5 bg-[var(--site-surface)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-[var(--site-primary)] text-white/30">
        {item.featured_image_url ? (
          // User media is already constrained by the upload route and storage bucket.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.featured_image_url}
            alt={item.name}
            className="site-media h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <Compass size={32} />
        )}
      </div>
      <div className="p-5">
        <div className="flex gap-4 text-xs text-[var(--site-muted)]">
          {item.duration_value && (
            <span className="flex items-center gap-1">
              <Clock3 size={14} />
              {item.duration_value} {item.duration_unit}
            </span>
          )}
          {item.location_name && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {item.location_name}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-xl font-semibold">{item.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--site-muted)]">
          {item.short_description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-semibold">
            {item.price_from
              ? `From ${item.currency} ${item.price_from}`
              : "Enquire for price"}
          </span>
          <ArrowRight size={17} />
        </div>
      </div>
    </Link>
  );
}

function RentalCard({
  rental,
  basePath,
}: {
  rental: PublicRental;
  basePath: string;
}) {
  const rate = rental.rates.find((item) => item.amount != null);
  return (
    <Link
      href={href(basePath, `/rentals/${rental.slug}`)}
      className="group overflow-hidden rounded-[var(--site-radius)] border border-black/5 bg-[var(--site-surface)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-[var(--site-primary)] text-white/30">
        {rental.featured_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={rental.featured_image_url}
            alt={rental.name}
            className="site-media h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <Box size={32} />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs capitalize text-[var(--site-muted)]">
          {rental.rental_type.replaceAll("_", " ")}
          {rental.location_name ? ` · ${rental.location_name}` : ""}
        </p>
        <h3 className="mt-3 text-xl font-semibold">{rental.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--site-muted)]">
          {rental.short_description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-semibold">
            {rental.quote_only || !rate
              ? "Request a quote"
              : `From ${rate.currency} ${rate.amount} / ${rate.pricing_unit}`}
          </span>
          <ArrowRight size={17} />
        </div>
      </div>
    </Link>
  );
}
