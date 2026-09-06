"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
export async function updateLeadStatus(formData: FormData) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      leadId: z.uuid(),
      status: z.enum(["new", "contacted", "qualified", "won", "closed"]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.leadId)
    .eq("site_id", parsed.data.siteId);
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/leads`);
}
