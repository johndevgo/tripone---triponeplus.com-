import { PackageEditor } from "../package-editor";
export default async function NewPackagePage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { siteId } = await params;
  const feedback = await searchParams;
  return <PackageEditor siteId={siteId} {...feedback} />;
}
