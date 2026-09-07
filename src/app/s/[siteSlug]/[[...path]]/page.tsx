import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SiteRenderer,
  type PublicTestimonial,
} from "@/components/site/site-renderer";
import { getAppUrl } from "@/lib/app-url";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";
import { createPublicClient } from "@/lib/supabase/public";
import {
  decodePublishedSnapshot,
  rendererData,
  resolvePublishedRoute,
  type PublishedSite,
} from "@/lib/tenancy/published-site";

type Props = { params: Promise<{ siteSlug: string; path?: string[] }> };

async function load(siteSlug: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_published_site_snapshot", {
    identifier: siteSlug,
  });
  if (error || !data) return null;
  return decodePublishedSnapshot(data);
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
  const title = typeof seo.title === "string" ? seo.title : resolved.page.title;
  const description =
    typeof seo.description === "string" ? seo.description : undefined;
  const canonical = `${getAppUrl()}/s/${encodeURIComponent(siteSlug)}${routePath(path) || "/"}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: snapshot.site.defaultOgImageUrl
        ? [snapshot.site.defaultOgImageUrl]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: snapshot.site.defaultOgImageUrl
        ? [snapshot.site.defaultOgImageUrl]
        : undefined,
    },
    robots:
      snapshot.site.seoSettings.indexingEnabled === false
        ? { index: false, follow: false }
        : { index: true, follow: true },
  };
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
  const jsonLd = [
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
        testimonials={snapshot.testimonials as unknown as PublicTestimonial[]}
        activeExperience={resolved.experience}
        activeRental={resolved.activeRental}
        basePath={basePath}
      />
    </>
  );
}
