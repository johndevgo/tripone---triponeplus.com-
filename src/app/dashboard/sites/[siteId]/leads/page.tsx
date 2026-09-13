import Link from "next/link";
import { LayoutGrid, List, Plus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { oneRelation } from "@/lib/operations/relations";
import { leadStages } from "@/lib/operations/schemas";
import { Empty, PageHead } from "../experiences/page";
import {
  convertLeadToCustomer,
  saveManualLead,
  updateLeadStage,
} from "../operations-actions";
import { Feedback, pretty } from "../bookings/page";

const input = "min-h-11 rounded-xl border border-white/10 bg-[#0b3027] px-3";
type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  message: string | null;
  desired_date: string | null;
  guests: number | null;
  source_page: string | null;
  follow_up_at: string | null;
  estimated_value: number | null;
  currency: string | null;
  customer_id: string | null;
  requested_destination: string | null;
  interests: string[];
  budget_range: string | null;
};

export default async function Leads({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{
    view?: string;
    status?: string;
    q?: string;
    message?: string;
    error?: string;
  }>;
}) {
  const { siteId } = await params;
  const filters = await searchParams;
  const view = filters.view === "table" ? "table" : "pipeline";
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select(
      "id,name,email,phone,status,source,created_at,updated_at,message,desired_date,guests,source_page,follow_up_at,estimated_value,currency,customer_id,requested_destination,interests,budget_range",
    )
    .eq("site_id", siteId)
    .order("updated_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.q)
    query = query.or(
      `name.ilike.%${filters.q.replaceAll("%", "")}%,email.ilike.%${filters.q.replaceAll("%", "")}%`,
    );
  const [{ data }, { data: site }] = await Promise.all([
    query,
    supabase
      .from("sites")
      .select("businesses(timezone)")
      .eq("id", siteId)
      .single(),
  ]);
  const leads = (data ?? []) as Lead[];
  const timezone = oneRelation(site?.businesses)?.timezone ?? "UTC";
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <PageHead eyebrow="Sales" title="Leads & enquiries" />
        <div className="flex gap-2">
          <Link
            href="?view=pipeline"
            aria-label="Pipeline view"
            className={`grid size-11 place-items-center rounded-xl border border-white/10 ${view === "pipeline" ? "bg-white/10" : ""}`}
          >
            <LayoutGrid size={17} />
          </Link>
          <Link
            href="?view=table"
            aria-label="Table view"
            className={`grid size-11 place-items-center rounded-xl border border-white/10 ${view === "table" ? "bg-white/10" : ""}`}
          >
            <List size={17} />
          </Link>
          <a
            href="#add-lead"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
          >
            <Plus size={16} />
            Add lead
          </a>
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
        Track qualified opportunities and follow-up work before they become
        bookings.
      </p>
      <Feedback message={filters.message} error={filters.error} />
      <form className="glass mt-7 grid gap-3 rounded-2xl p-4 sm:grid-cols-[1fr_220px_auto]">
        <input type="hidden" name="view" value={view} />
        <input
          name="q"
          defaultValue={filters.q}
          placeholder="Search name or email"
          className={`${input} w-full`}
        />
        <select name="status" defaultValue={filters.status} className={input}>
          <option value="">All stages</option>
          {leadStages.map((stage) => (
            <option key={stage} value={stage}>
              {pretty(stage)}
            </option>
          ))}
        </select>
        <button className="rounded-xl border border-white/10 px-4">
          Filter
        </button>
      </form>
      {leads.length ? (
        view === "pipeline" ? (
          <Pipeline leads={leads} siteId={siteId} />
        ) : (
          <LeadTable leads={leads} siteId={siteId} />
        )
      ) : (
        <Empty
          icon={Users}
          title="No leads match"
          copy="New website enquiries and manually added opportunities will appear here."
        />
      )}
      <section
        id="add-lead"
        className="glass mt-8 scroll-mt-24 rounded-3xl p-6"
      >
        <h2 className="text-lg font-semibold">Add a lead</h2>
        <form
          action={saveManualLead}
          className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="timezone" value={timezone} />
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone" name="phone" />
          <Field label="Desired date" name="desiredDate" type="date" />
          <Field label="Party size" name="guests" type="number" />
          <Field label="Estimated value" name="estimatedValue" type="number" />
          <Field label="Currency" name="currency" value="USD" required />
          <Field label="Destination or route" name="requestedDestination" />
          <Field label="Interests (comma-separated)" name="interests" />
          <Field label="Budget range" name="budgetRange" />
          <label className="text-sm">
            Stage
            <select name="status" className={`${input} mt-2 w-full`}>
              {leadStages.slice(0, 5).map((stage) => (
                <option key={stage} value={stage}>
                  {pretty(stage)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Follow up ({timezone})
            <input
              name="followUpAt"
              type="datetime-local"
              className={`${input} mt-2 w-full`}
            />
          </label>
          <label className="text-sm sm:col-span-2 lg:col-span-3">
            Notes
            <textarea
              name="message"
              rows={4}
              className={`${input} mt-2 w-full py-3`}
            />
          </label>
          <button className="min-h-11 rounded-xl bg-[#F5A623] px-5 font-semibold text-[#173028] sm:col-span-2 lg:col-span-3">
            Save lead
          </button>
        </form>
      </section>
    </>
  );
}
function Pipeline({ leads, siteId }: { leads: Lead[]; siteId: string }) {
  return (
    <div className="mt-7 grid gap-4 overflow-x-auto pb-3 lg:grid-cols-4 xl:grid-cols-7">
      {leadStages.map((stage) => {
        const items = leads.filter((lead) => lead.status === stage);
        return (
          <section
            key={stage}
            className="min-w-64 rounded-2xl border border-white/10 bg-white/[.03] p-3 lg:min-w-0"
          >
            <header className="flex justify-between px-1 py-2">
              <h2 className="text-xs font-semibold uppercase tracking-[.12em] text-white/55">
                {pretty(stage)}
              </h2>
              <span className="text-xs text-white/30">{items.length}</span>
            </header>
            <div className="mt-2 grid gap-3">
              {items.map((lead) => (
                <LeadCard key={lead.id} lead={lead} siteId={siteId} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
function LeadTable({ leads, siteId }: { leads: Lead[]; siteId: string }) {
  return (
    <div className="mt-7 overflow-hidden rounded-3xl border border-white/10">
      {leads.map((lead) => (
        <article
          key={lead.id}
          className="grid gap-3 border-b border-white/[.07] p-5 last:border-0 xl:grid-cols-[1fr_180px_210px_220px]"
        >
          <LeadSummary lead={lead} />
          <p className="text-sm text-white/45">
            {lead.desired_date || "No travel date"}
            {lead.guests ? ` · ${lead.guests} guests` : ""}
            <br />
            {lead.follow_up_at
              ? `Follow up ${new Date(lead.follow_up_at).toLocaleString()}`
              : "No follow-up set"}
          </p>
          <StageForm lead={lead} siteId={siteId} />
          <LeadActions lead={lead} siteId={siteId} />
        </article>
      ))}
    </div>
  );
}
function LeadCard({ lead, siteId }: { lead: Lead; siteId: string }) {
  return (
    <article className="rounded-xl border border-white/10 bg-[#08261f] p-4">
      <LeadSummary lead={lead} />
      <p className="mt-3 text-xs text-white/35">
        {lead.desired_date || "Date not set"}
        {lead.guests ? ` · ${lead.guests} guests` : ""}
      </p>
      {lead.follow_up_at && (
        <p className="mt-2 text-xs text-[#FFC857]">
          Follow up {new Date(lead.follow_up_at).toLocaleDateString()}
        </p>
      )}
      <div className="mt-3">
        <StageForm lead={lead} siteId={siteId} />
      </div>
      <LeadActions lead={lead} siteId={siteId} />
    </article>
  );
}
function LeadSummary({ lead }: { lead: Lead }) {
  return (
    <div>
      <h3 className="font-semibold">{lead.name}</h3>
      <p className="mt-1 truncate text-xs text-white/40">
        {lead.email}
        {lead.phone ? ` · ${lead.phone}` : ""}
      </p>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/35">
        {lead.message || "No notes recorded."}
      </p>
      {(lead.requested_destination || lead.interests.length > 0) && (
        <p className="mt-2 text-xs text-white/45">
          {lead.requested_destination || "Flexible destination"}
          {lead.interests.length > 0 ? ` · ${lead.interests.join(", ")}` : ""}
        </p>
      )}
      {lead.budget_range && (
        <p className="mt-2 text-xs text-white/45">
          Budget: {lead.budget_range}
        </p>
      )}
      {lead.estimated_value != null && (
        <p className="mt-2 text-xs text-emerald-200">
          {lead.currency} {Number(lead.estimated_value).toLocaleString()}{" "}
          estimated
        </p>
      )}
    </div>
  );
}
function StageForm({ lead, siteId }: { lead: Lead; siteId: string }) {
  return (
    <form action={updateLeadStage} className="flex gap-2">
      <input type="hidden" name="siteId" value={siteId} />
      <input type="hidden" name="leadId" value={lead.id} />
      <select
        aria-label={`Stage for ${lead.name}`}
        name="status"
        defaultValue={lead.status}
        className="min-h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0b3027] px-2 text-xs"
      >
        {leadStages.map((stage) => (
          <option key={stage} value={stage}>
            {pretty(stage)}
          </option>
        ))}
      </select>
      <button className="rounded-lg border border-white/10 px-2 text-xs">
        Save
      </button>
    </form>
  );
}
function LeadActions({ lead, siteId }: { lead: Lead; siteId: string }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs">
      <Link
        href={`/dashboard/sites/${siteId}/leads/${lead.id}`}
        className="rounded-lg border border-white/10 px-2.5 py-2 text-white/60 hover:text-white"
      >
        Open lead
      </Link>
      {lead.customer_id ? (
        <Link
          href={`/dashboard/sites/${siteId}/customers/${lead.customer_id}`}
          className="rounded-lg border border-white/10 px-2.5 py-2 text-white/60 hover:text-white"
        >
          View customer
        </Link>
      ) : (
        <form action={convertLeadToCustomer}>
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="leadId" value={lead.id} />
          <button className="rounded-lg border border-white/10 px-2.5 py-2 text-white/60 hover:text-white">
            Create customer
          </button>
        </form>
      )}
      <Link
        href={`/dashboard/sites/${siteId}/bookings/new?leadId=${lead.id}`}
        className="rounded-lg bg-[#F5A623] px-2.5 py-2 font-semibold text-[#173028]"
      >
        Create booking
      </Link>
    </div>
  );
}
function Field({
  label,
  name,
  type = "text",
  value,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value}
        required={required}
        min={type === "number" ? 0 : undefined}
        className={`${input} mt-2 w-full`}
      />
    </label>
  );
}
