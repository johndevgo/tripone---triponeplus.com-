import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteRenderer } from "@/components/site/site-renderer";
import {
  loadPublishedSite,
  rendererData,
  resolvePublishedRoute,
} from "@/lib/tenancy/published-site";
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
  isAppHostname,
  normalizeRequestHostname,
} from "@/lib/tenancy/hostname";

type Props = { params: Promise<{ hostname: string; path?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const requestHostname = normalizeRequestHostname(await headers());
  if (isAppHostname(requestHostname))
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  const { hostname, path = [] } = await params;
  const published = await loadPublishedSite(hostname);
  if (!published)
    return {
      title: "Website unavailable",
      robots: { index: false, follow: false },
    };
  const resolved = resolvePublishedRoute(published, path);
  if (!resolved)
    return { title: "Page not found", robots: { index: false, follow: false } };
  const seo = resolved.page.seo_settings as Record<string, unknown>;
  const metadata = createPublishedMetadata({
    pageTitle: resolved.page.title,
    seo,
    publicBaseUrl: `https://${published.primaryHostname}`,
    requestedPath: routePath(path),
    siteIndexingEnabled:
      published.snapshot.site.seoSettings.indexingEnabled !== false,
    defaultImage: published.snapshot.site.defaultOgImageUrl,
    resourceImage:
      resolved.experience?.featured_image_url ??
      resolved.activeRental?.featured_image_url,
    favicon: published.snapshot.site.faviconUrl,
  });
  const verification = verificationMetadata(
    published.snapshot.site.globalSettings.verificationMeta,
  );
  return verification ? { ...metadata, verification } : metadata;
}

export default async function TenantPage({ params }: Props) {
  const requestHeaders = await headers();
  const requestHostname = normalizeRequestHostname(requestHeaders);
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  if (isAppHostname(requestHostname)) notFound();
  const { hostname, path = [] } = await params;
  const published = await loadPublishedSite(hostname);
  if (!published) notFound();
  if (published.requestedHostname !== published.primaryHostname)
    permanentRedirect(`https://${published.primaryHostname}${routePath(path)}`);
  const resolved = resolvePublishedRoute(published, path);
  if (!resolved) notFound();
  const data = rendererData(published);
  const seo = resolved.page.seo_settings as Record<string, unknown>;
  const canonical = canonicalUrl(
    typeof seo.canonicalPath === "string" ? seo.canonicalPath : undefined,
    `https://${published.primaryHostname}`,
    routePath(path),
  );
  const jsonLd: unknown[] = [
    websiteJsonLd(
      published.snapshot.site.name,
      `https://${published.primaryHostname}`,
    ),
    organizationJsonLd(
      {
        name: published.snapshot.business.name,
        businessType: published.snapshot.business.business_type,
        email: published.snapshot.business.email,
        phone: published.snapshot.business.phone,
        city: published.snapshot.business.city,
        country: published.snapshot.business.country,
        logoUrl: published.snapshot.business.logo_url,
        socialUrls: socialUrls(published.snapshot.business),
      },
      `https://${published.primaryHostname}`,
    ),
  ];
  if (resolved.experience) {
    jsonLd.push(
      breadcrumbJsonLd([
        { name: "Home", url: `https://${published.primaryHostname}` },
        {
          name: "Experiences",
          url: `https://${published.primaryHostname}/experiences`,
        },
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
        { name: "Home", url: `https://${published.primaryHostname}` },
        {
          name: "Rentals",
          url: `https://${published.primaryHostname}/rentals`,
        },
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
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: safeJson(item) }}
        />
      ))}
      <SiteRenderer
        {...data}
        page={resolved.page}
        experiences={resolved.experiences}
        rentals={resolved.rentals}
        testimonials={
          published.snapshot
            .testimonials as unknown as import("@/components/site/site-renderer").PublicTestimonial[]
        }
        activeExperience={resolved.experience}
        activeRental={resolved.activeRental}
        allowThirdPartyScripts
        scriptNonce={nonce}
        basePath=""
      />
    </>
  );
}

function routePath(parts: string[]) {
  return parts.length ? `/${parts.map(encodeURIComponent).join("/")}` : "/";
}
function safeJson(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
function socialUrls(business: Record<string, unknown>) {
  return [
    business.instagram_url,
    business.facebook_url,
    business.youtube_url,
    business.tripadvisor_url,
  ].filter(
    (item): item is string =>
      typeof item === "string" && /^https?:\/\//.test(item),
  );
}

function verificationMetadata(value: unknown): Metadata["verification"] | null {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const google = token(source.google);
  const bing = token(source.bing);
  const pinterest = token(source.pinterest);
  if (!google && !bing && !pinterest) return null;
  return {
    google: google || undefined,
    other: {
      ...(bing ? { "msvalidate.01": bing } : {}),
      ...(pinterest ? { "p:domain_verify": pinterest } : {}),
    },
  };
}

function token(value: unknown) {
  return typeof value === "string" && /^[A-Za-z0-9._:-]{1,250}$/.test(value)
    ? value
    : "";
}
