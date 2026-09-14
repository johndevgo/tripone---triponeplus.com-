import { CalendarClock, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { oneRelation } from "@/lib/operations/relations";
import {
  saveAvailabilityRule,
  saveDeparture,
  setAvailabilityRuleActive,
} from "../operations-actions";
import { Empty, PageHead } from "../experiences/page";
import { Feedback, pretty } from "../bookings/page";
const input = "min-h-11 rounded-xl border border-white/10 bg-[#0b3027] px-3";
export default async function AvailabilityPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const feedback = await searchParams;
  const supabase = await createClient();
  const now = new Date().toISOString();
  const [
    { data: departures },
    { data: experiences },
    { data: rentals },
    { data: packages },
    { data: rules },
    { data: site },
  ] = await Promise.all([
    supabase
      .from("departures")
      .select(
        "id,starts_at,ends_at,capacity,minimum_participants,status,notes,experiences(name),rental_products(name),packages(name),bookings(guests,status)",
      )
      .eq("site_id", siteId)
      .gte("starts_at", now)
      .order("starts_at")
      .limit(250),
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
      .from("availability_rules")
      .select(
        "id,name,schedule_type,starts_on,ends_on,days_of_week,start_time,end_time,slot_interval_minutes,blackout_dates,capacity,minimum_notice_hours,cutoff_hours,active,experiences(name),rental_products(name),packages(name)",
      )
      .eq("site_id", siteId)
      .order("created_at", { ascending: false }),
    supabase
      .from("sites")
      .select("businesses(timezone)")
      .eq("id", siteId)
      .single(),
  ]);
  const timezone = oneRelation(site?.businesses)?.timezone ?? "UTC";
  return (
    <>
      <PageHead
        eyebrow="Operations"
        title="Availability & departures"
        action={
          <a
            href="#new-departure"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#5BCD57] px-4 text-sm font-semibold text-[#173028]"
          >
            <Plus size={16} />
            Add departure
          </a>
        }
      />
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
        Combine recurring operating rules, on-request services and fixed
        departures without forcing every service into the same schedule model.
      </p>
      <Feedback {...feedback} />
      <section className="mt-7">
        <h2 className="text-lg font-semibold">Operating rules</h2>
        {rules?.length ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {rules.map((rule) => {
              const service =
                oneRelation(rule.experiences)?.name ??
                oneRelation(rule.rental_products)?.name ??
                oneRelation(rule.packages)?.name ??
                "Service";
              const days = (rule.days_of_week ?? [])
                .map((day: number) => dayLabels[day])
                .filter(Boolean)
                .join(", ");
              return (
                <article key={rule.id} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[.12em] text-[#95EE8E]">
                        {pretty(rule.schedule_type)}
                      </p>
                      <h3 className="mt-2 font-semibold">{rule.name}</h3>
                      <p className="mt-1 text-sm text-white/45">{service}</p>
                    </div>
                    <form action={setAvailabilityRuleActive}>
                      <input type="hidden" name="siteId" value={siteId} />
                      <input type="hidden" name="ruleId" value={rule.id} />
                      <input
                        type="hidden"
                        name="active"
                        value={String(!rule.active)}
                      />
                      <button className="rounded-full border border-white/10 px-2.5 py-1 text-xs">
                        {rule.active ? "Pause" : "Enable"}
                      </button>
                    </form>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/50">
                    {days || "Dates by request"}
                    {rule.start_time ? ` · ${rule.start_time.slice(0, 5)}` : ""}
                    {rule.end_time ? `–${rule.end_time.slice(0, 5)}` : ""}
                    {rule.capacity ? ` · capacity ${rule.capacity}` : ""}
                    {rule.slot_interval_minutes
                      ? ` · every ${rule.slot_interval_minutes} minutes`
                      : ""}
                  </p>
                  <p className="mt-2 text-xs text-white/30">
                    {rule.starts_on || "No start limit"} –{" "}
                    {rule.ends_on || "No end limit"}
                    {` · ${rule.minimum_notice_hours}h notice · ${rule.cutoff_hours}h cutoff`}
                    {rule.blackout_dates?.length
                      ? ` · ${rule.blackout_dates.length} blackout date${rule.blackout_dates.length === 1 ? "" : "s"}`
                      : ""}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/40">
            No operating rules yet. Fixed departures can still be managed below.
          </p>
        )}
      </section>
      {departures?.length ? (
        <div className="mt-7 overflow-hidden rounded-3xl border border-white/10 bg-white/[.035]">
          {departures.map((item) => {
            const allocated = (item.bookings ?? [])
              .filter((b) =>
                ["pending", "awaiting_confirmation", "confirmed"].includes(
                  b.status,
                ),
              )
              .reduce((sum, b) => sum + b.guests, 0);
            const name =
              oneRelation(item.experiences)?.name ??
              oneRelation(item.rental_products)?.name ??
              oneRelation(item.packages)?.name ??
              "Service";
            return (
              <article
                key={item.id}
                className="grid gap-4 border-b border-white/[.07] p-5 last:border-0 md:grid-cols-[1fr_220px_180px] md:items-center"
              >
                <div>
                  <h2 className="font-semibold">{name}</h2>
                  <p className="mt-1 text-sm text-white/40">
                    {new Date(item.starts_at).toLocaleString(undefined, {
                      timeZone: timezone,
                    })}
                    {item.ends_at
                      ? ` – ${new Date(item.ends_at).toLocaleString(undefined, { timeZone: timezone })}`
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    {item.capacity
                      ? `${allocated} of ${item.capacity} guests allocated`
                      : `${allocated} guests · no capacity limit`}
                  </p>
                  {item.capacity && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-[#95EE8E]"
                        style={{
                          width: `${Math.min(100, (allocated / item.capacity) * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <span className="w-fit rounded-full border border-white/10 px-2.5 py-1 text-xs">
                  {pretty(item.status)}
                </span>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty
          icon={CalendarClock}
          title="No upcoming departures"
          copy="Add a fixed date for a tour, rental or package to manage capacity."
        />
      )}
      <section
        id="new-departure"
        className="glass mt-7 scroll-mt-24 rounded-3xl p-6"
      >
        <h2 className="text-lg font-semibold">Create a fixed departure</h2>
        <form
          action={saveDeparture}
          className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="timezone" value={timezone} />
          <label className="text-sm lg:col-span-2">
            Product or service
            <select
              required
              name="targetSelection"
              className={`${input} mt-2 w-full`}
            >
              <option value="">Choose one</option>
              <optgroup label="Tours & activities">
                {experiences?.map((x) => (
                  <option key={x.id} value={`experience:${x.id}`}>
                    {x.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Rentals">
                {rentals?.map((x) => (
                  <option key={x.id} value={`rental:${x.id}`}>
                    {x.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Packages">
                {packages?.map((x) => (
                  <option key={x.id} value={`package:${x.id}`}>
                    {x.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
          <label className="text-sm">
            Status
            <select name="status" className={`${input} mt-2 w-full`}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <label className="text-sm">
            Starts ({timezone})
            <input
              required
              name="startsAt"
              type="datetime-local"
              className={`${input} mt-2 w-full`}
            />
          </label>
          <label className="text-sm">
            Ends ({timezone})
            <input
              name="endsAt"
              type="datetime-local"
              className={`${input} mt-2 w-full`}
            />
          </label>
          <label className="text-sm">
            Capacity
            <input
              name="capacity"
              type="number"
              min="1"
              className={`${input} mt-2 w-full`}
            />
          </label>
          <label className="text-sm">
            Minimum participants
            <input
              name="minimumParticipants"
              type="number"
              min="1"
              className={`${input} mt-2 w-full`}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            Internal notes
            <textarea
              name="notes"
              rows={3}
              className={`${input} mt-2 w-full py-3`}
            />
          </label>
          <button className="min-h-11 rounded-xl bg-[#5BCD57] px-5 font-semibold text-[#173028] sm:col-span-2 lg:col-span-3">
            Create departure
          </button>
        </form>
      </section>
      <section className="glass mt-7 rounded-3xl p-6">
        <h2 className="text-lg font-semibold">Create an operating rule</h2>
        <p className="mt-2 text-sm text-white/40">
          Use recurring for time slots, date range for rentals, or on request
          for services confirmed manually.
        </p>
        <form
          action={saveAvailabilityRule}
          className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input type="hidden" name="siteId" value={siteId} />
          <label className="text-sm lg:col-span-2">
            Product or service
            <select
              required
              name="targetSelection"
              className={`${input} mt-2 w-full`}
            >
              <option value="">Choose one</option>
              <optgroup label="Tours & activities">
                {experiences?.map((x) => (
                  <option key={x.id} value={`experience:${x.id}`}>
                    {x.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Rentals">
                {rentals?.map((x) => (
                  <option key={x.id} value={`rental:${x.id}`}>
                    {x.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Packages">
                {packages?.map((x) => (
                  <option key={x.id} value={`package:${x.id}`}>
                    {x.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
          <label className="text-sm">
            Schedule model
            <select name="scheduleType" className={`${input} mt-2 w-full`}>
              <option value="recurring">Recurring schedule</option>
              <option value="date_range">Date range</option>
              <option value="fixed_departures">Fixed departures</option>
              <option value="on_request">On request</option>
            </select>
          </label>
          <label className="text-sm lg:col-span-2">
            Rule name
            <input
              required
              name="name"
              placeholder="Daily morning departure"
              className={`${input} mt-2 w-full`}
            />
          </label>
          <label className="flex items-end gap-2 pb-3 text-sm">
            <input type="checkbox" name="active" defaultChecked /> Active
          </label>
          <div className="sm:col-span-2 lg:col-span-3">
            <span className="text-sm">Operating days</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {dayLabels.map((day, index) => (
                <label
                  key={day}
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs"
                >
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="daysOfWeek"
                    value={index}
                  />
                  {day.slice(0, 3)}
                </label>
              ))}
            </div>
          </div>
          <RuleField label="Starts on" name="startsOn" type="date" />
          <RuleField label="Ends on" name="endsOn" type="date" />
          <RuleField label="Capacity" name="capacity" type="number" />
          <RuleField label="Start time" name="startTime" type="time" />
          <RuleField label="End time" name="endTime" type="time" />
          <RuleField
            label="Slot interval (minutes)"
            name="slotIntervalMinutes"
            type="number"
          />
          <RuleField
            label="Minimum participants"
            name="minimumParticipants"
            type="number"
          />
          <RuleField
            label="Minimum notice (hours)"
            name="minimumNoticeHours"
            type="number"
            value="0"
          />
          <RuleField
            label="Booking cutoff (hours)"
            name="cutoffHours"
            type="number"
            value="0"
          />
          <label className="text-sm sm:col-span-2 lg:col-span-3">
            Blackout dates
            <textarea
              name="blackoutDates"
              rows={3}
              placeholder="One date per line: 2026-12-25"
              className={`${input} mt-2 w-full py-3`}
            />
          </label>
          <button className="min-h-11 rounded-xl bg-[#5BCD57] px-5 font-semibold text-[#173028] sm:col-span-2 lg:col-span-3">
            Save operating rule
          </button>
        </form>
      </section>
      <p className="mt-4 text-xs text-white/30">
        Departure times use {timezone}.
      </p>
    </>
  );
}

const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function RuleField({
  label,
  name,
  type,
  value,
}: {
  label: string;
  name: string;
  type: string;
  value?: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        min={type === "number" ? 0 : undefined}
        defaultValue={value}
        className={`${input} mt-2 w-full`}
      />
    </label>
  );
}
