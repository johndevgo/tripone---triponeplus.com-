import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/shell";
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("id,name")
    .eq("id", siteId)
    .single();
  if (!site) notFound();
  return (
    <DashboardShell siteId={site.id} siteName={site.name}>
      {children}
    </DashboardShell>
  );
}
