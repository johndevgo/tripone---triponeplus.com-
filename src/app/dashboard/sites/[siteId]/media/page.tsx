import { createClient } from "@/lib/supabase/server";
import { MediaManager } from "@/components/media/media-manager";
import { PageHead } from "../experiences/page";

export default async function MediaPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select(
      "id,public_url,storage_path,mime_type,file_size,width,height,alt_text,created_at",
    )
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });
  return (
    <>
      <PageHead eyebrow="Assets" title="Media library" />
      <MediaManager siteId={siteId} initialMedia={data ?? []} />
    </>
  );
}
