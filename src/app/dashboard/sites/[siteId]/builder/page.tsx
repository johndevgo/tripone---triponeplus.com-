import { notFound } from "next/navigation";
import { VisualBuilder } from "@/components/builder/visual-builder";
import { createClient } from "@/lib/supabase/server";
import { sectionsSchema } from "@/lib/types";

export default async function Builder({
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
          "id,name,slug,theme_id,theme_settings,navigation,footer_settings,global_settings,businesses(name,city,country,phone,whatsapp,email,logo_url)",
        )
        .eq("id", siteId)
        .single(),
      supabase
        .from("pages")
        .select("id,title,slug,sections")
        .eq("site_id", siteId)
        .neq("page_type", "experience_detail_system")
        .order("sort_order"),
      supabase
        .from("experiences")
        .select(
          "id,name,slug,short_description,price_from,currency,duration_value,duration_unit,location_name,featured_image_url,booking_url",
        )
        .eq("site_id", siteId)
        .neq("status", "archived")
        .order("sort_order"),
    ]);
  if (!site) notFound();
  const business = Array.isArray(site.businesses)
    ? site.businesses[0]
    : site.businesses;
  if (!business) notFound();
  const validPages = (pages ?? []).map((page) => {
    const parsed = sectionsSchema.safeParse(page.sections);
    return { ...page, sections: parsed.success ? parsed.data : [] };
  });
  return (
    <VisualBuilder
      site={site}
      business={business}
      pages={validPages}
      experiences={experiences ?? []}
    />
  );
}
