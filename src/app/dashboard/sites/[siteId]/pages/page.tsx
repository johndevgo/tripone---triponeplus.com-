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
  const [{ data: pages }, { data: site }] = await Promise.all([
    supabase
      .from("pages")
      .select(
        "id,title,slug,page_type,status,show_in_navigation,navigation_label",
      )
      .eq("site_id", siteId)
      .order("sort_order"),
    supabase
      .from("sites")
      .select("navigation,footer_settings")
      .eq("id", siteId)
      .single(),
  ]);
  return (
    <>
      <PageHead eyebrow="Structure" title="Pages & navigation" />
      <PageManager siteId={siteId} pages={pages ?? []} />
      <StructureEditor
        siteId={siteId}
        initialNavigation={
          Array.isArray(site?.navigation)
            ? (site.navigation as NavigationItem[])
            : []
        }
        initialFooter={(site?.footer_settings ?? {}) as Record<string, unknown>}
      />
    </>
  );
}
