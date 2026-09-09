import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { SeoDashboard } from "@/components/seo/seo-dashboard";
import { sectionsSchema } from "@/lib/types";
import { currentPublicSiteUrl } from "@/lib/tenancy/public-url";
import { PageHead } from "../experiences/page";

export default async function Seo({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();
  const [
    { data: site },
    { data: pages },
    { data: experiences },
    { data: rentals },
    { data: taxonomyTerms },
    { data: taxonomies },
    { data: locations },
  ] = await Promise.all([
    supabase
      .from("sites")
      .select(
        "slug,seo_settings,cro_settings,default_og_image_url,businesses(email,phone,whatsapp),domains(hostname,verification_status,is_primary)",
      )
      .eq("id", siteId)
      .single(),
    supabase
      .from("pages")
      .select("id,title,slug,sections,seo_settings")
      .eq("site_id", siteId)
      .neq("page_type", "experience_detail_system")
      .order("sort_order"),
    supabase
      .from("experiences")
      .select(
        "id,name,slug,seo_settings,price_from,duration_value,booking_url,gallery,cancellation_policy,location_name,meeting_point,inclusions",
      )
      .eq("site_id", siteId)
      .neq("status", "archived"),
    supabase
      .from("rental_products")
      .select("id,name,slug,seo_settings")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("taxonomy_terms")
      .select("id,taxonomy_id,parent_id,name,slug,seo_settings,status")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("taxonomies")
      .select("id,taxonomy_type")
      .eq("site_id", siteId),
    supabase
      .from("locations")
      .select("id,name,slug,seo_settings")
      .eq("site_id", siteId)
      .order("name"),
  ]);
  const business = Array.isArray(site?.businesses)
    ? site.businesses[0]
    : site?.businesses;
  const first = experiences?.[0];
  const validPages = (pages ?? []).map((page) => {
    const parsed = sectionsSchema.safeParse(page.sections);
    return {
      ...page,
      resourceKind: "page" as const,
      sections: parsed.success ? parsed.data : [],
      seo_settings: page.seo_settings as Record<string, unknown>,
    };
  });
  const resources = [
    ...validPages,
    ...(experiences ?? []).map((item) => ({
      id: item.id,
      title: item.name,
      slug: `experiences/${item.slug}`,
      sections: [],
      seo_settings: item.seo_settings as Record<string, unknown>,
      resourceKind: "experience" as const,
    })),
    ...(rentals ?? []).map((item) => ({
      id: item.id,
      title: item.name,
      slug: `rentals/${item.slug}`,
      sections: [],
      seo_settings: item.seo_settings as Record<string, unknown>,
      resourceKind: "rental" as const,
    })),
    ...(taxonomyTerms ?? []).map((item) => ({
      id: item.id,
      title: item.name,
      slug: taxonomyPath(item, taxonomies ?? [], taxonomyTerms ?? []),
      sections: [],
      seo_settings: item.seo_settings as Record<string, unknown>,
      resourceKind: "taxonomy" as const,
    })),
    ...(locations ?? []).map((item) => ({
      id: item.id,
      title: item.name,
      slug: `locations/${item.slug}`,
      sections: [],
      seo_settings: item.seo_settings as Record<string, unknown>,
      resourceKind: "location" as const,
    })),
  ];
  return (
    <>
      <PageHead eyebrow="Discovery & conversion" title="SEO readiness" />
      <SeoDashboard
        siteId={siteId}
        pages={resources}
        siteSeo={(site?.seo_settings ?? {}) as Record<string, unknown>}
        ogImage={site?.default_og_image_url ?? ""}
        cro={(site?.cro_settings ?? {}) as Record<string, unknown>}
        experienceStats={{
          hasPrice:
            experiences?.some((item) => item.price_from != null) ?? false,
          hasDuration:
            experiences?.some((item) => item.duration_value != null) ?? false,
          bookingUrl: first?.booking_url ?? null,
          galleryCount: Array.isArray(first?.gallery)
            ? first.gallery.length
            : 0,
          hasCancellation: Boolean(first?.cancellation_policy),
          hasLocation: Boolean(first?.location_name || first?.meeting_point),
          hasInclusions:
            Array.isArray(first?.inclusions) && first.inclusions.length > 0,
        }}
        hasContact={Boolean(
          business?.email || business?.phone || business?.whatsapp,
        )}
        publicBaseUrl={currentPublicSiteUrl(
          site?.slug ?? "site",
          site?.domains ?? [],
        )}
      />
      <Link
        href={`/dashboard/sites/${siteId}/seo/redirects`}
        className="glass mt-5 flex min-h-16 items-center justify-between rounded-2xl px-5 text-sm font-semibold"
      >
        Manage URL redirects <span aria-hidden="true">→</span>
      </Link>
    </>
  );
}

function taxonomyPath(
  term: {
    id: string;
    taxonomy_id: string;
    parent_id: string | null;
    slug: string;
  },
  taxonomies: Array<{ id: string; taxonomy_type: string }>,
  terms: Array<{ id: string; parent_id: string | null; slug: string }>,
) {
  const taxonomyType = taxonomies.find(
    (taxonomy) => taxonomy.id === term.taxonomy_id,
  )?.taxonomy_type;
  const base =
    {
      activity: "activities",
      destination: "destinations",
      travel_style: "travel-styles",
      package_category: "package-categories",
      product_category: "rental-categories",
    }[taxonomyType ?? ""] ?? "categories";
  const segments = [term.slug];
  const seen = new Set([term.id]);
  let parentId = term.parent_id;
  while (parentId) {
    const parent = terms.find((item) => item.id === parentId);
    if (!parent || seen.has(parent.id)) break;
    seen.add(parent.id);
    segments.unshift(parent.slug);
    parentId = parent.parent_id;
  }
  return `${base}/${segments.join("/")}`;
}
