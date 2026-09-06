import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHead, Empty } from "../experiences/page";
import { updateLeadStatus } from "./actions";
export default async function Leads({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select(
      "id,name,email,phone,status,created_at,message,desired_date,guests,source_page",
    )
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });
  return (
    <>
      <PageHead eyebrow="Inbox" title="Leads" />
      {leads?.length ? (
        <div className="mt-8 grid gap-4">
          {leads.map((lead) => (
            <article className="glass rounded-2xl p-5" key={lead.id}>
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h2 className="font-semibold">{lead.name}</h2>
                  <p className="mt-1 text-sm text-white/55">
                    {lead.email}
                    {lead.phone ? ` · ${lead.phone}` : ""}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                    {lead.message || "No message was included."}
                  </p>
                  <p className="mt-2 text-xs text-white/30">
                    {lead.desired_date || "No desired date"}
                    {lead.guests ? ` · ${lead.guests} guests` : ""}
                    {lead.source_page
                      ? ` · from ${lead.source_page}`
                      : ""} · {new Date(lead.created_at).toLocaleString()}
                  </p>
                </div>
                <form
                  action={updateLeadStatus}
                  className="flex items-start gap-2"
                >
                  <input type="hidden" name="siteId" value={siteId} />
                  <input type="hidden" name="leadId" value={lead.id} />
                  <select
                    name="status"
                    defaultValue={lead.status}
                    className="min-h-10 rounded-xl bg-white/10 px-3 text-sm capitalize"
                  >
                    {["new", "contacted", "qualified", "won", "closed"].map(
                      (status) => (
                        <option className="text-black" key={status}>
                          {status}
                        </option>
                      ),
                    )}
                  </select>
                  <button className="min-h-10 rounded-xl border border-white/10 px-3 text-sm">
                    Update
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          icon={Users}
          title="No enquiries yet"
          copy="New enquiries will appear here after visitors submit a published website form."
        />
      )}
    </>
  );
}
