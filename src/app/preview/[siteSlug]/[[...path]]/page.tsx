import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sectionsSchema, type ThemeId } from "@/lib/types";
import { createExperienceSeo, getTheme } from "@/lib/site-generator";
import {
  SiteRenderer,
  type PublicExperience,
} from "@/components/site/site-renderer";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";

async function load(siteSlug: string, path: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  let query = supabase
    .from("sites")
    .select(
      "id,name,slug,status,theme_id,theme_settings,navigation,footer_settings,global_settings,default_og_image_url,businesses(name,business_type,city,country,phone,whatsapp,email,logo_url)",
    );
  query = /^[0-9a-f-]{36}$/i.test(siteSlug)
    ? query.eq("id", siteSlug)
    : query.eq("slug", siteSlug);
  const { data: site } = await query.maybeSingle();
  if (!site) return null;
  const route = path.join("/");
  const experienceRoute = route.startsWith("experiences/")
    ? route.slice(12)
    : null;
  const [{ data: pages }, { data: experiences }] = await Promise.all([
    supabase
      .from("pages")
      .select("title,slug,page_type,sections,seo_settings")
      .eq("site_id", site.id),
    supabase
      .from("experiences")
      .select(
        "id,name,slug,short_description,description,price_from,currency,pricing_label,duration_value,duration_unit,location_name,meeting_point,max_guests,min_guests,minimum_age,cancellation_policy,booking_url,booking_button_label,featured_image_url,gallery,highlights,inclusions,exclusions,itinerary,faqs,seo_settings",
      )
      .eq("site_id", site.id)
      .order("sort_order"),
  ]);
  const page =
    pages?.find((p) => p.slug === route) ||
    (experienceRoute
      ? pages?.find((p) => p.page_type === "experience_detail_system")
      : null);
  const experience = experienceRoute
    ? experiences?.find((e) => e.slug === experienceRoute)
    : null;
  if (!page && !experience) return null;
  const business = Array.isArray(site.businesses)
    ? site.businesses[0]
    : site.businesses;
  if (!business) return null;
  return {
    site,
    business,
    page: page ?? {
      title: experience!.name,
      slug: route,
      sections: [
        {
          id: "detail-hero",
          type: "hero",
          variant: "immersive",
          visible: true,
          settings: {
            eyebrow: experience!.location_name ?? business.name,
            title: experience!.name,
            description: experience!.short_description,
            primaryCta: experience!.booking_url ? "Book now" : "Contact us",
            primaryHref: experience!.booking_url ?? "/contact",
          },
        },
      ],
      seo_settings: createExperienceSeo(
        experience!.name,
        business.name,
        experience!.location_name ?? business.city,
      ),
    },
    experiences: experiences ?? [],
    experience,
  };
}

export function fromSnapshot(
  snapshot: Record<string, unknown>,
  path: string[],
) {
  const rawSite = snapshot.site as Record<string, unknown> | undefined;
  const rawBusiness = snapshot.business as Record<string, unknown> | undefined;
  const pages = Array.isArray(snapshot.pages)
    ? (snapshot.pages as Array<Record<string, unknown>>)
    : [];
  const experiences = Array.isArray(snapshot.experiences)
    ? (snapshot.experiences as Array<Record<string, unknown>>)
    : [];
  if (!rawSite || !rawBusiness) return null;
  const business = {
    name: String(rawBusiness.name ?? ""),
    business_type: String(rawBusiness.business_type ?? "other"),
    city: String(rawBusiness.city ?? ""),
    country: String(rawBusiness.country ?? ""),
    phone: typeof rawBusiness.phone === "string" ? rawBusiness.phone : null,
    whatsapp:
      typeof rawBusiness.whatsapp === "string" ? rawBusiness.whatsapp : null,
    email: String(rawBusiness.email ?? ""),
    logo_url:
      typeof rawBusiness.logo_url === "string" ? rawBusiness.logo_url : null,
  };
  const site = {
    id: String(rawSite.id),
    name: String(rawSite.name),
    slug: String(rawSite.slug),
    status: "published",
    theme_id: String(rawSite.themeId),
    theme_settings: rawSite.theme,
    navigation: rawSite.navigation,
    footer_settings: rawSite.footer,
    global_settings: rawSite.globalSettings,
    default_og_image_url: rawSite.defaultOgImageUrl,
  };
  const route = path.join("/");
  const experienceSlug = route.startsWith("experiences/")
    ? route.slice(12)
    : null;
  const experience = experienceSlug
    ? experiences.find((item) => item.slug === experienceSlug)
    : null;
  const rawPage = pages.find((item) => item.slug === route);
  const found = rawPage
    ? {
        title: String(rawPage.title ?? ""),
        slug: String(rawPage.slug ?? ""),
        sections: rawPage.sections ?? [],
        seo_settings: rawPage.seo_settings ?? {},
      }
    : null;
  const page =
    found ??
    (experience
      ? {
          title: String(experience.name),
          slug: route,
          sections: [
            {
              id: "detail-hero",
              type: "hero",
              variant: "cinematic",
              visible: true,
              settings: {
                eyebrow: experience.location_name ?? business.name,
                title: experience.name,
                description: experience.short_description,
                imageUrl: experience.featured_image_url,
                primaryCta: experience.booking_url ? "Book now" : "Enquire now",
                primaryHref: experience.booking_url ?? "/contact",
              },
            },
          ],
          seo_settings:
            experience.seo_settings ??
            createExperienceSeo(
              String(experience.name),
              String(business.name),
              String(experience.location_name ?? business.city),
            ),
        }
      : null);
  if (!page) return null;
  return { site, business, page, experiences, experience };
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ siteSlug: string; path?: string[] }>;
}): Promise<Metadata> {
  const p = await params;
  const data = await load(p.siteSlug, p.path ?? []);
  if (!data) return {};
  const seo = data.page.seo_settings as {
    title?: string;
    description?: string;
    canonicalPath?: string;
    indexable?: boolean;
  };
  return {
    title: seo.title ?? data.page.title,
    description: seo.description,
    alternates: seo.canonicalPath
      ? { canonical: seo.canonicalPath }
      : undefined,
    openGraph: {
      title: seo.title ?? data.page.title,
      description: seo.description,
      images: data.site.default_og_image_url
        ? [data.site.default_og_image_url]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title ?? data.page.title,
      description: seo.description,
      images: data.site.default_og_image_url
        ? [data.site.default_og_image_url]
        : undefined,
    },
    robots: { index: false, follow: false, noarchive: true },
  };
}
export default async function Preview({
  params,
}: {
  params: Promise<{ siteSlug: string; path?: string[] }>;
}) {
  const p = await params;
  const data = await load(p.siteSlug, p.path ?? []);
  if (!data) notFound();
  const parsed = sectionsSchema.safeParse(data.page.sections);
  if (!parsed.success)
    throw new Error("This page contains invalid section data.");
  const stored = data.site.theme_settings as Partial<
    ReturnType<typeof getTheme>
  >;
  const theme = {
    ...getTheme(data.site.theme_id as ThemeId),
    ...stored,
    colors: {
      ...getTheme(data.site.theme_id as ThemeId).colors,
      ...stored.colors,
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJson(
            websiteJsonLd(
              data.site.name,
              `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/preview/${data.site.slug}`,
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJson(
            organizationJsonLd(
              {
                name: data.business.name,
                businessType: data.business.business_type,
                email: data.business.email,
                phone: data.business.phone,
                city: data.business.city,
                country: data.business.country,
                logoUrl: data.business.logo_url,
              },
              `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/preview/${data.site.slug}`,
            ),
          ),
        }}
      />
      <SiteRenderer
        site={data.site}
        business={data.business}
        page={{ ...data.page, sections: parsed.data }}
        theme={theme}
        experiences={data.experiences as PublicExperience[]}
        activeExperience={
          data.experience ? (data.experience as PublicExperience) : undefined
        }
        basePath={`/preview/${data.site.slug}`}
        preview={data.site.status !== "published"}
      />
    </>
  );
}

function safeJson(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
