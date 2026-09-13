import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PackageEditor } from "../package-editor";
export default async function EditPackagePage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string; packageId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId, packageId } = await params;
  const feedback = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("*,package_items(*)")
    .eq("id", packageId)
    .eq("site_id", siteId)
    .single();
  if (!data) notFound();
  return <PackageEditor siteId={siteId} value={data} {...feedback} />;
}
