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
  websiteJsonLd,
} from "@/lib/seo/structured-data";
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
  const title = text(seo.title) || resolved.page.title;
  const description = text(seo.description) || text(seo.metaDescription);
  const canonical = `https://${published.primaryHostname}${routePath(path)}`;
  const image =
    text(seo.ogImage) ||
    resolved.experience?.featured_image_url ||
    published.snapshot.site.defaultOgImageUrl ||
    undefined;
  const indexable =
    published.snapshot.site.seoSettings.indexingEnabled !== false &&
    seo.indexable !== false;
  return {
    title,
    description,
    alternates: { canonical },
    icons: published.snapshot.site.faviconUrl
      ? { icon: published.snapshot.site.faviconUrl }
      : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      images: image ? [image] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function TenantPage({ params }: Props) {
  const requestHostname = normalizeRequestHostname(await headers());
  if (isAppHostname(requestHostname)) notFound();
  const { hostname, path = [] } = await params;
  const published = await loadPublishedSite(hostname);
  if (!published) notFound();
  if (published.requestedHostname !== published.primaryHostname)
    permanentRedirect(`https://${published.primaryHostname}${routePath(path)}`);
  const resolved = resolvePublishedRoute(published, path);
  if (!resolved) notFound();
  const data = rendererData(published);
  const canonical = `https://${published.primaryHostname}${routePath(path)}`;
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
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
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
        basePath=""
      />
    </>
  );
}

function routePath(parts: string[]) {
  return parts.length ? `/${parts.map(encodeURIComponent).join("/")}` : "/";
}
function text(value: unknown) {
  return typeof value === "string" ? value : undefined;
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
