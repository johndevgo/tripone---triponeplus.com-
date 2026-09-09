import { notFound } from "next/navigation";
import { VisualBuilder } from "@/components/builder/visual-builder";
import { createClient } from "@/lib/supabase/server";
import { sectionsSchema } from "@/lib/types";
import { resolveTemplateSections } from "@/lib/templates/bindings";

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
    { data: taxonomyTerms },
    { data: taxonomies },
    { data: locations },
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
        "id,name,slug,experience_type,short_description,description,price_from,currency,duration_value,duration_unit,location_name,featured_image_url,booking_url,itinerary,inclusions,exclusions,sections_override,template_id,template_version,layout_revision",
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
    supabase
      .from("taxonomy_terms")
      .select(
        "id,taxonomy_id,parent_id,name,slug,description,hero_image_url,sections_override,template_id,template_version,layout_revision,status",
      )
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("sort_order"),
    supabase
      .from("taxonomies")
      .select("id,taxonomy_type,name")
      .eq("site_id", siteId),
    supabase
      .from("locations")
      .select(
        "id,name,slug,description,city,region,country,image_url,sections_override,template_id,template_version,layout_revision",
      )
      .eq("site_id", siteId)
      .order("name"),
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
  const linkedSections = savedSections ?? [];
  const templateFor = (
    kind:
      | "experience_detail"
      | "rental_detail"
      | "taxonomy_landing"
      | "location_detail",
    subtype: string,
    assignedId?: string | null,
  ) =>
    (templates ?? []).find(
      (template) =>
        template.id === assignedId && template.template_kind === kind,
    ) ??
    (templates ?? []).find(
      (template) =>
        template.template_kind === kind && template.subtype === subtype,
    ) ??
    (templates ?? []).find(
      (template) =>
        template.template_kind === kind && template.subtype === "default",
    );
  const experienceDocuments = (experiences ?? []).map((experience) => {
    const template = templateFor(
      "experience_detail",
      experience.experience_type,
      experience.template_id,
    );
    const context = { business, experience };
    const inheritedSections = resolveTemplateSections(
      template?.sections,
      null,
      context,
      linkedSections,
    );
    return {
      id: experience.id,
      title: `Experience · ${experience.name}`,
      slug: `experiences/${experience.slug}`,
      revision: experience.layout_revision,
      editorKind: "record" as const,
      recordKind: "experience" as const,
      templateVersion: template?.version ?? null,
      inheritedSections,
      isOverride: experience.sections_override != null,
      activeExperienceId: experience.id,
      sections: resolveTemplateSections(
        template?.sections,
        experience.sections_override,
        context,
        linkedSections,
      ),
    };
  });
  const rentalDocuments = (rentals ?? []).map((rental) => {
    const template = templateFor(
      "rental_detail",
      rental.rental_type,
      rental.template_id,
    );
    const context = { business, rental };
    const inheritedSections = resolveTemplateSections(
      template?.sections,
      null,
      context,
      linkedSections,
    );
    return {
      id: rental.id,
      title: `Rental · ${rental.name}`,
      slug: `rentals/${rental.slug}`,
      revision: rental.layout_revision,
      editorKind: "record" as const,
      recordKind: "rental" as const,
      templateVersion: template?.version ?? null,
      inheritedSections,
      isOverride: rental.sections_override != null,
      activeRentalId: rental.id,
      sections: resolveTemplateSections(
        template?.sections,
        rental.sections_override,
        context,
        linkedSections,
      ),
    };
  });
  const taxonomyDocuments = (taxonomyTerms ?? []).map((term) => {
    const taxonomy = (taxonomies ?? []).find(
      (item) => item.id === term.taxonomy_id,
    );
    const template = templateFor(
      "taxonomy_landing",
      taxonomy?.taxonomy_type ?? "default",
      term.template_id,
    );
    const context = { business, term };
    const inheritedSections = resolveTemplateSections(
      template?.sections,
      null,
      context,
      linkedSections,
    );
    return {
      id: term.id,
      title: `${taxonomy?.name ?? "Category"} · ${term.name}`,
      slug: taxonomyPath(term, taxonomy?.taxonomy_type, taxonomyTerms ?? []),
      revision: term.layout_revision,
      editorKind: "record" as const,
      recordKind: "taxonomy" as const,
      templateVersion: template?.version ?? null,
      inheritedSections,
      isOverride: term.sections_override != null,
      sections: resolveTemplateSections(
        template?.sections,
        term.sections_override,
        context,
        linkedSections,
      ),
    };
  });
  const locationDocuments = (locations ?? []).map((location) => {
    const template = templateFor(
      "location_detail",
      "default",
      location.template_id,
    );
    const context = { business, location };
    const inheritedSections = resolveTemplateSections(
      template?.sections,
      null,
      context,
      linkedSections,
    );
    return {
      id: location.id,
      title: `Location · ${location.name}`,
      slug: `locations/${location.slug}`,
      revision: location.layout_revision,
      editorKind: "record" as const,
      recordKind: "location" as const,
      templateVersion: template?.version ?? null,
      inheritedSections,
      isOverride: location.sections_override != null,
      sections: resolveTemplateSections(
        template?.sections,
        location.sections_override,
        context,
        linkedSections,
      ),
    };
  });
  return (
    <VisualBuilder
      site={site}
      business={business}
      pages={[
        ...validPages,
        ...validTemplates,
        ...experienceDocuments,
        ...rentalDocuments,
        ...taxonomyDocuments,
        ...locationDocuments,
      ]}
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

function taxonomyPath(
  term: { id: string; parent_id: string | null; slug: string },
  taxonomyType: string | undefined,
  terms: Array<{ id: string; parent_id: string | null; slug: string }>,
) {
  const base =
    {
      activity: "activities",
      destination: "destinations",
      travel_style: "travel-styles",
      package_category: "package-categories",
      product_category: "rental-categories",
    }[taxonomyType ?? ""] ?? "categories";
  const segments = [term.slug];
  const visited = new Set([term.id]);
  let parentId = term.parent_id;
  while (parentId) {
    const parent = terms.find((item) => item.id === parentId);
    if (!parent || visited.has(parent.id)) break;
    visited.add(parent.id);
    segments.unshift(parent.slug);
    parentId = parent.parent_id;
  }
  return `${base}/${segments.join("/")}`;
}
