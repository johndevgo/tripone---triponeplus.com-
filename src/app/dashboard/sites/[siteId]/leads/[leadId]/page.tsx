import Link from "next/link";
import { ArrowLeft, CalendarPlus, CheckCircle2, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { isoToLocalDateTime } from "@/lib/operations/datetime";
import { oneRelation } from "@/lib/operations/relations";
import { leadStages } from "@/lib/operations/schemas";
import { createClient } from "@/lib/supabase/server";
import {
  convertLeadToCustomer,
  updateLeadDetails,
  updateLeadStage,
} from "../../operations-actions";
import { Feedback, pretty } from "../../bookings/page";

const input =
  "mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] px-3 outline-none focus:border-[#FFC857]/70";

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string; leadId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId, leadId } = await params;
  const feedback = await searchParams;
  const supabase = await createClient();
  const [
    { data: lead },
    { data: activities },
    { data: experiences },
    { data: rentals },
    { data: packages },
    { data: site },
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .eq("site_id", siteId)
      .single(),
    supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .eq("site_id", siteId)
      .order("created_at", { ascending: false }),
    supabase
      .from("experiences")
      .select("id,name")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("rental_products")
      .select("id,name")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("packages")
      .select("id,name")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("sites")
      .select("businesses(timezone,currency)")
      .eq("id", siteId)
      .single(),
  ]);
  if (!lead) notFound();
  const business = oneRelation(site?.businesses);
  const timezone = business?.timezone ?? "UTC";
  const target = lead.experience_id
    ? `experience:${lead.experience_id}`
    : lead.rental_product_id
      ? `rental:${lead.rental_product_id}`
      : lead.package_id
        ? `package:${lead.package_id}`
        : "";
  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href={`/dashboard/sites/${siteId}/leads`}
        className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"
      >
        <ArrowLeft size={16} /> Leads
      </Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#FFC857]">
            {pretty(lead.source)}
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{lead.name}</h1>
          <p className="mt-2 text-sm text-white/45">
            Created {new Date(lead.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!lead.customer_id && (
            <form action={convertLeadToCustomer}>
              <input type="hidden" name="siteId" value={siteId} />
              <input type="hidden" name="leadId" value={leadId} />
              <button className="min-h-11 rounded-xl border border-white/10 px-4 text-sm">
                Create customer
              </button>
            </form>
          )}
          <Link
            href={`/dashboard/sites/${siteId}/bookings/new?leadId=${leadId}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
          >
            <CalendarPlus size={16} /> Create booking
          </Link>
        </div>
      </div>
      <Feedback {...feedback} />
      <div className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <section className="glass rounded-3xl p-6">
          <div className="flex items-center gap-3 text-[#FFC857]">
            <UserRound />
            <h2 className="font-semibold text-white">Opportunity details</h2>
          </div>
          <form
            action={updateLeadDetails}
            className="mt-5 grid gap-4 sm:grid-cols-2"
          >
            <input type="hidden" name="siteId" value={siteId} />
            <input type="hidden" name="leadId" value={leadId} />
            <input type="hidden" name="timezone" value={timezone} />
            <Field label="Name" name="name" value={lead.name} required />
            <Field
              label="Email"
              name="email"
              type="email"
              value={lead.email}
              required
            />
            <Field label="Phone" name="phone" value={lead.phone ?? ""} />
            <Field
              label="Travel date"
              name="desiredDate"
              type="date"
              value={lead.desired_date ?? ""}
            />
            <Field
              label="Party size"
              name="guests"
              type="number"
              min="1"
              value={lead.guests == null ? "" : String(lead.guests)}
            />
            <Field
              label={`Follow up (${timezone})`}
              name="followUpAt"
              type="datetime-local"
              value={
                lead.follow_up_at
                  ? isoToLocalDateTime(lead.follow_up_at, timezone)
                  : ""
              }
            />
            <label className="text-sm sm:col-span-2">
              Interested product or service
              <select
                name="targetSelection"
                defaultValue={target}
                className={input}
              >
                <option value="">Custom trip / not selected</option>
                <optgroup label="Tours, activities & transfers">
                  {experiences?.map((item) => (
                    <option key={item.id} value={`experience:${item.id}`}>
                      {item.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Rentals">
                  {rentals?.map((item) => (
                    <option key={item.id} value={`rental:${item.id}`}>
                      {item.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Packages">
                  {packages?.map((item) => (
                    <option key={item.id} value={`package:${item.id}`}>
                      {item.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            <Field
              label="Destination or route"
              name="requestedDestination"
              value={lead.requested_destination ?? ""}
            />
            <Field
              label="Interests"
              name="interests"
              value={(lead.interests ?? []).join(", ")}
            />
            <Field
              label="Estimated value"
              name="estimatedValue"
              type="number"
              min="0"
              value={
                lead.estimated_value == null ? "" : String(lead.estimated_value)
              }
            />
            <Field
              label="Currency"
              name="currency"
              maxLength={3}
              value={lead.currency ?? business?.currency ?? "USD"}
              required
            />
            <Field
              label="Budget range"
              name="budgetRange"
              value={lead.budget_range ?? ""}
            />
            <Field
              label="Lost reason"
              name="lostReason"
              value={lead.lost_reason ?? ""}
            />
            <label className="text-sm sm:col-span-2">
              Customer request
              <textarea
                name="message"
                rows={4}
                maxLength={3000}
                defaultValue={lead.message ?? ""}
                className={`${input} py-3`}
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Add internal note
              <textarea
                name="internalNote"
                rows={3}
                maxLength={3000}
                className={`${input} py-3`}
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-sm sm:col-span-2">
              <input
                type="checkbox"
                name="assignToMe"
                defaultChecked={Boolean(lead.assigned_to)}
                className="size-4 accent-[#F5A623]"
              />{" "}
              Assign this lead to me
            </label>
            <button className="min-h-11 rounded-xl bg-[#F5A623] px-5 font-semibold text-[#173028] sm:col-span-2">
              Save lead details
            </button>
          </form>
        </section>
        <div className="grid content-start gap-5">
          <section className="glass rounded-3xl p-6">
            <h2 className="font-semibold">Pipeline stage</h2>
            <form action={updateLeadStage} className="mt-4 flex gap-2">
              <input type="hidden" name="siteId" value={siteId} />
              <input type="hidden" name="leadId" value={leadId} />
              <select
                name="status"
                defaultValue={lead.status}
                className={`${input} mt-0`}
              >
                {leadStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {pretty(stage)}
                  </option>
                ))}
              </select>
              <button className="rounded-xl border border-white/10 px-4 text-sm">
                Update
              </button>
            </form>
          </section>
          <section className="glass rounded-3xl p-6">
            <div className="flex items-center gap-3 text-[#FFC857]">
              <CheckCircle2 />
              <h2 className="font-semibold text-white">Activity timeline</h2>
            </div>
            {activities?.length ? (
              <ol className="mt-5 grid gap-4">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="border-l border-[#FFC857]/35 pl-4"
                  >
                    <p className="text-sm font-medium">
                      {pretty(activity.activity_type)}
                    </p>
                    {activity.body && (
                      <p className="mt-1 text-sm leading-6 text-white/50">
                        {activity.body}
                      </p>
                    )}
                    <time className="mt-1 block text-xs text-white/30">
                      {new Date(activity.created_at).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-white/40">
                No activity recorded yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  required,
  min,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  min?: string;
  maxLength?: number;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value}
        required={required}
        min={min}
        maxLength={maxLength}
        className={input}
      />
    </label>
  );
}
