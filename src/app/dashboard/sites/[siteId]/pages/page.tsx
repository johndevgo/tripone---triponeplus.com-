import { createClient } from "@/lib/supabase/server";
import { PageManager } from "@/components/pages/page-manager";
import { PageHead } from "../experiences/page";
import { StructureEditor } from "@/components/pages/structure-editor";
import type { NavigationItem } from "@/lib/types";

export default async function Pages({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();
  const [{ data: pages }, { data: site }, { data: templates }] =
    await Promise.all([
      supabase
        .from("pages")
        .select(
          "id,title,slug,page_type,status,show_in_navigation,navigation_label",
        )
        .eq("site_id", siteId)
        .order("sort_order"),
      supabase
        .from("sites")
        .select("navigation,footer_settings,global_settings")
        .eq("id", siteId)
        .single(),
      supabase
        .from("site_templates")
        .select("id,name,template_kind,subtype,version")
        .eq("site_id", siteId)
        .order("template_kind")
        .order("subtype"),
    ]);
  return (
    <>
      <PageHead eyebrow="Structure" title="Pages & navigation" />
      <PageManager
        siteId={siteId}
        pages={pages ?? []}
        templates={templates ?? []}
      />
      <StructureEditor
        siteId={siteId}
        initialNavigation={
          Array.isArray(site?.navigation)
            ? (site.navigation as NavigationItem[])
            : []
        }
        initialFooter={(site?.footer_settings ?? {}) as Record<string, unknown>}
        initialHeader={headerSettings(site?.global_settings)}
      />
    </>
  );
}

function headerSettings(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const header = (value as Record<string, unknown>).header;
  return header && typeof header === "object" && !Array.isArray(header)
    ? (header as Record<string, unknown>)
    : {};
}
