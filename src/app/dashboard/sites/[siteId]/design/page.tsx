import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTheme, type ThemeTokens } from "@/lib/site-generator";
import { sectionsSchema, type ThemeId } from "@/lib/types";
import { ThemeEditor } from "@/components/design/theme-editor";
import { PageHead } from "../experiences/page";

export default async function Design({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();
  const [{ data: site }, { data: page }, { data: experiences }] =
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
        .select("title,slug,sections")
        .eq("site_id", siteId)
        .eq("page_type", "home")
        .single(),
      supabase
        .from("experiences")
        .select(
          "id,name,slug,short_description,price_from,currency,duration_value,duration_unit,location_name,featured_image_url,booking_url",
        )
        .eq("site_id", siteId)
        .neq("status", "archived")
        .order("sort_order"),
    ]);
  if (!site || !page) notFound();
  const business = Array.isArray(site.businesses)
    ? site.businesses[0]
    : site.businesses;
  if (!business) notFound();
  const base = getTheme(site.theme_id as ThemeId);
  const stored = site.theme_settings as Partial<ThemeTokens>;
  const initial = {
    ...base,
    ...stored,
    colors: { ...base.colors, ...stored.colors },
  };
  const parsed = sectionsSchema.safeParse(page.sections);
  return (
    <>
      <PageHead eyebrow="Appearance" title="Design system" />
      <ThemeEditor
        site={site}
        business={business}
        page={{ ...page, sections: parsed.success ? parsed.data : [] }}
        experiences={experiences ?? []}
        initial={initial}
      />
    </>
  );
}
