import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { SeoDashboard } from "@/components/seo/seo-dashboard";
import { sectionsSchema } from "@/lib/types";
import { PageHead } from "../experiences/page";

export default async function Seo({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();
  const [{ data: site }, { data: pages }, { data: experiences }] =
    await Promise.all([
      supabase
        .from("sites")
        .select(
          "seo_settings,cro_settings,default_og_image_url,businesses(email,phone,whatsapp)",
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
          "price_from,duration_value,booking_url,gallery,cancellation_policy,location_name,meeting_point,inclusions",
        )
        .eq("site_id", siteId)
        .neq("status", "archived"),
    ]);
  const business = Array.isArray(site?.businesses)
    ? site.businesses[0]
    : site?.businesses;
  const first = experiences?.[0];
  const validPages = (pages ?? []).map((page) => {
    const parsed = sectionsSchema.safeParse(page.sections);
    return {
      ...page,
      sections: parsed.success ? parsed.data : [],
      seo_settings: page.seo_settings as Record<string, unknown>,
    };
  });
  return (
    <>
      <PageHead eyebrow="Discovery & conversion" title="SEO readiness" />
      <SeoDashboard
        siteId={siteId}
        pages={validPages}
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
