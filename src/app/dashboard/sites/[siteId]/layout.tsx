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
  const [{ data: site }, { data: isSuperAdmin }] = await Promise.all([
    supabase.from("sites").select("id,name").eq("id", siteId).single(),
    supabase.rpc("has_platform_role", { required_roles: ["super_admin"] }),
  ]);
  if (!site) notFound();
  return (
    <DashboardShell siteName={site.name} isSuperAdmin={Boolean(isSuperAdmin)}>
      {children}
    </DashboardShell>
  );
}
