import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SiteRenderer,
  type PublicTestimonial,
} from "@/components/site/site-renderer";
import { getAppUrl } from "@/lib/app-url";
import {
  breadcrumbJsonLd,
  experienceJsonLd,
  organizationJsonLd,
  rentalJsonLd,
  websiteJsonLd,
} from "@/lib/seo/structured-data";
import {
  canonicalUrl,
  createPublishedMetadata,
} from "@/lib/seo/published-metadata";
import {
  loadPublishedSiteBySlug,
  rendererData,
  resolvePublishedRoute,
  type PublishedSite,
} from "@/lib/tenancy/published-site";

type Props = { params: Promise<{ siteSlug: string; path?: string[] }> };

async function load(siteSlug: string) {
  return loadPublishedSiteBySlug(siteSlug);
}

function envelope(
  snapshot: NonNullable<Awaited<ReturnType<typeof load>>>,
): PublishedSite {
  const hostname = new URL(getAppUrl()).hostname;
  return { snapshot, requestedHostname: hostname, primaryHostname: hostname };
}

function routePath(parts: string[]) {
  return parts.length ? `/${parts.map(encodeURIComponent).join("/")}` : "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteSlug, path = [] } = await params;
  const snapshot = await load(siteSlug);
  if (!snapshot)
    return {
      title: "Website unavailable",
      robots: { index: false, follow: false },
    };
  const resolved = resolvePublishedRoute(envelope(snapshot), path);
  if (!resolved)
    return { title: "Page not found", robots: { index: false, follow: false } };
  const seo = resolved.page.seo_settings as Record<string, unknown>;
  return createPublishedMetadata({
    pageTitle: resolved.page.title,
    seo,
    publicBaseUrl: `${getAppUrl()}/s/${encodeURIComponent(siteSlug)}`,
    requestedPath: routePath(path) || "/",
    siteIndexingEnabled: snapshot.site.seoSettings.indexingEnabled !== false,
    defaultImage: snapshot.site.defaultOgImageUrl,
    resourceImage:
      resolved.experience?.featured_image_url ??
      resolved.activeRental?.featured_image_url,
    favicon: snapshot.site.faviconUrl,
  });
}

export default async function PublishedFallbackPage({ params }: Props) {
  const { siteSlug, path = [] } = await params;
  const snapshot = await load(siteSlug);
  if (!snapshot) notFound();
  const published = envelope(snapshot);
  const resolved = resolvePublishedRoute(published, path);
  if (!resolved) notFound();
  const data = rendererData(published);
  const basePath = `/s/${siteSlug}`;
  const publicUrl = `${getAppUrl()}${basePath}`;
  const seo = resolved.page.seo_settings as Record<string, unknown>;
  const canonical = canonicalUrl(
    typeof seo.canonicalPath === "string" ? seo.canonicalPath : undefined,
    publicUrl,
    routePath(path) || "/",
  );
  const jsonLd: unknown[] = [
    websiteJsonLd(snapshot.site.name, publicUrl),
    organizationJsonLd(
      {
        name: snapshot.business.name,
        businessType: snapshot.business.business_type,
        email: snapshot.business.email,
        phone: snapshot.business.phone,
        city: snapshot.business.city,
        country: snapshot.business.country,
        logoUrl: snapshot.business.logo_url,
      },
      publicUrl,
    ),
  ];
  if (resolved.experience) {
    jsonLd.push(
      breadcrumbJsonLd([
        { name: "Home", url: publicUrl },
        { name: "Experiences", url: `${publicUrl}/experiences` },
        { name: resolved.experience.name, url: canonical },
      ]),
      experienceJsonLd(
        {
          name: resolved.experience.name,
          description:
            resolved.experience.description ||
            resolved.experience.short_description,
          image: resolved.experience.featured_image_url,
          price: resolved.experience.price_from,
          currency: resolved.experience.currency,
          bookingUrl: resolved.experience.booking_url,
          location: resolved.experience.location_name,
        },
        canonical,
      ),
    );
  }
  if (resolved.activeRental) {
    const rental = resolved.activeRental;
    const rate = rental.rates.find((item) => item.amount != null);
    jsonLd.push(
      breadcrumbJsonLd([
        { name: "Home", url: publicUrl },
        { name: "Rentals", url: `${publicUrl}/rentals` },
        { name: rental.name, url: canonical },
      ]),
      rentalJsonLd(
        {
          name: rental.name,
          description: rental.description || rental.short_description,
          image: rental.featured_image_url,
          bookingUrl: rental.booking_url,
          rate: rate
            ? {
                amount: rate.amount,
                currency: rate.currency,
                pricingUnit: rate.pricing_unit,
              }
            : undefined,
        },
        canonical,
      ),
    );
  }
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replaceAll("<", "\\u003c"),
          }}
        />
      ))}
      <SiteRenderer
        {...data}
        page={resolved.page}
        experiences={resolved.experiences}
        rentals={resolved.rentals}
        testimonials={snapshot.testimonials as unknown as PublicTestimonial[]}
        activeExperience={resolved.experience}
        activeRental={resolved.activeRental}
        basePath={basePath}
      />
    </>
  );
}
