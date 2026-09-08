import { notFound } from "next/navigation";
import { VisualBuilder } from "@/components/builder/visual-builder";
import { createClient } from "@/lib/supabase/server";
import { sectionsSchema } from "@/lib/types";

export default async function Builder({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ target?: string }>;
}) {
  const { siteId } = await params;
  const { target } = await searchParams;
  const supabase = await createClient();
  const [
    { data: site },
    { data: pages },
    { data: savedSections },
    { data: templates },
    { data: experiences },
    { data: rentals },
  ] = await Promise.all([
    supabase
      .from("sites")
      .select(
        "id,name,slug,theme_id,theme_settings,navigation,footer_settings,global_settings,businesses(name,city,country,phone,whatsapp,email,logo_url)",
      )
      .eq("id", siteId)
      .single(),
    supabase
      .from("pages")
      .select("id,title,slug,sections,revision")
      .eq("site_id", siteId)
      .neq("page_type", "experience_detail_system")
      .order("sort_order"),
    supabase
      .from("saved_sections")
      .select("id,name,section_type,variant,settings,save_mode,revision")
      .eq("site_id", siteId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("site_templates")
      .select("id,name,template_kind,subtype,sections,version")
      .eq("site_id", siteId)
      .order("template_kind")
      .order("subtype"),
    supabase
      .from("experiences")
      .select(
        "id,name,slug,short_description,price_from,currency,duration_value,duration_unit,location_name,featured_image_url,booking_url",
      )
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("sort_order"),
    supabase
      .from("rental_products")
      .select(
        "*,rental_rates(label,amount,currency,pricing_unit,minimum_quantity,maximum_quantity)",
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
    return {
      ...page,
      editorKind: "page" as const,
      sections: parsed.success ? parsed.data : [],
    };
  });
  const validTemplates = (templates ?? []).map((template) => {
    const parsed = sectionsSchema.safeParse(template.sections);
    return {
      id: template.id,
      title: `${template.name} · ${template.subtype}`,
      slug: "",
      revision: template.version,
      editorKind: "template" as const,
      templateKind: template.template_kind,
      sections: parsed.success ? parsed.data : [],
    };
  });
  return (
    <VisualBuilder
      site={site}
      business={business}
      pages={[...validPages, ...validTemplates]}
      experiences={experiences ?? []}
      rentals={(rentals ?? []).map((rental) => ({
        ...rental,
        rates: rental.rental_rates ?? [],
      }))}
      savedSections={savedSections ?? []}
      initialTargetId={target}
    />
  );
}
