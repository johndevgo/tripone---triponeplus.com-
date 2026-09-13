import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  UserRound,
  Wrench,
} from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isoToLocalDateTime } from "@/lib/operations/datetime";
import { oneRelation } from "@/lib/operations/relations";
import {
  bookingStatuses,
  canTransitionBooking,
} from "@/lib/operations/schemas";
import {
  assignBookingResource,
  transitionBooking,
  unassignBookingResource,
  updateBooking,
} from "../../operations-actions";
import { Feedback, pretty } from "../page";
type Status = (typeof bookingStatuses)[number];
type AssignedResource = {
  id: string;
  quantity: number;
  resources: { id: string; name: string; resource_type: string };
};
export default async function BookingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string; bookingId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId, bookingId } = await params;
  const feedback = await searchParams;
  const supabase = await createClient();
  const [{ data: booking }, { data: resources }, { data: site }] =
    await Promise.all([
      supabase
        .from("bookings")
        .select(
          "*,customers(*),experiences(name),rental_products(name),packages(name),booking_resources(id,quantity,resources(id,name,resource_type)),booking_activities(*)",
        )
        .eq("id", bookingId)
        .eq("site_id", siteId)
        .single(),
      supabase
        .from("resources")
        .select("id,name,resource_type,capacity")
        .eq("site_id", siteId)
        .eq("status", "available")
        .order("name"),
      supabase
        .from("sites")
        .select("businesses(timezone)")
        .eq("id", siteId)
        .single(),
    ]);
  if (!booking) notFound();
  const name =
    booking.experiences?.name ??
    booking.rental_products?.name ??
    booking.packages?.name ??
    "Service";
  const next = [
    "pending",
    "awaiting_confirmation",
    "confirmed",
    "cancelled",
    "completed",
    "no_show",
  ].filter((x) => canTransitionBooking(booking.status as Status, x as Status));
  const timezone = oneRelation(site?.businesses)?.timezone ?? "UTC";
  const details =
    booking.details && typeof booking.details === "object"
      ? (booking.details as Record<string, unknown>)
      : {};
  const addOns = Array.isArray(details.addOns)
    ? details.addOns.filter(
        (value): value is string => typeof value === "string",
      )
    : [];
  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-2 text-sm text-white/45"
      >
        <ArrowLeft size={16} />
        Bookings
      </Link>
      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#FFC857]">
            {booking.reference}
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{name}</h1>
          <p className="mt-2 text-sm text-white/45">
            {pretty(booking.status)} · {pretty(booking.source)}
          </p>
        </div>
        <form
          action={transitionBooking}
          className="grid gap-2 sm:grid-cols-[1fr_auto]"
        >
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="bookingId" value={bookingId} />
          <select
            name="status"
            defaultValue={booking.status}
            className="min-h-11 rounded-xl border border-white/10 bg-[#0b3027] px-3"
          >
            {next.map((x) => (
              <option key={x} value={x}>
                {pretty(x)}
              </option>
            ))}
          </select>
          <button className="rounded-xl bg-[#F5A623] px-4 font-semibold text-[#173028]">
            Update status
          </button>
          <input
            name="note"
            maxLength={2000}
            placeholder="Optional status note"
            className="min-h-10 rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm outline-none sm:col-span-2"
          />
        </form>
      </div>
      <Feedback {...feedback} />
      <div className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="grid gap-5">
          <Panel icon={<Clock3 />} title="Schedule & booking details">
            <form action={updateBooking} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="siteId" value={siteId} />
              <input type="hidden" name="bookingId" value={bookingId} />
              <input type="hidden" name="timezone" value={timezone} />
              <EditField
                label={`Starts (${timezone})`}
                name="startsAt"
                type="datetime-local"
                required
                value={isoToLocalDateTime(booking.starts_at, timezone)}
              />
              <EditField
                label={`Ends (${timezone}, optional)`}
                name="endsAt"
                type="datetime-local"
                value={
                  booking.ends_at
                    ? isoToLocalDateTime(booking.ends_at, timezone)
                    : ""
                }
              />
              <EditField
                label="Adults"
                name="adults"
                type="number"
                min="0"
                required
                value={String(booking.adults)}
              />
              <EditField
                label="Children"
                name="children"
                type="number"
                min="0"
                required
                value={String(booking.children)}
              />
              <EditField
                label="Units / quantity"
                name="quantity"
                type="number"
                min="1"
                required
                value={String(booking.quantity)}
              />
              <EditField
                label="Quoted total"
                name="quotedTotal"
                type="number"
                min="0"
                step="0.01"
                value={
                  booking.quoted_total == null
                    ? ""
                    : String(booking.quoted_total)
                }
              />
              <EditField
                label="Currency"
                name="currency"
                maxLength={3}
                required
                value={booking.currency}
              />
              <label className="text-sm sm:col-span-2">
                Add-ons
                <textarea
                  name="addOns"
                  rows={3}
                  defaultValue={addOns.join("\n")}
                  placeholder="One add-on per line"
                  className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] px-3 py-3 outline-none focus:border-[#FFC857]/70"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                Requirements
                <textarea
                  name="requirements"
                  rows={3}
                  maxLength={3000}
                  defaultValue={
                    typeof details.requirements === "string"
                      ? details.requirements
                      : ""
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] px-3 py-3 outline-none focus:border-[#FFC857]/70"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                Customer notes
                <textarea
                  name="customerNotes"
                  rows={3}
                  maxLength={5000}
                  defaultValue={booking.customer_notes}
                  className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] px-3 py-3 outline-none focus:border-[#FFC857]/70"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                Add internal note
                <textarea
                  name="internalNote"
                  rows={3}
                  maxLength={3000}
                  placeholder="Appended to the private booking notes"
                  className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] px-3 py-3 outline-none focus:border-[#FFC857]/70"
                />
              </label>
              <button className="min-h-11 rounded-xl border border-[#FFC857]/35 px-4 text-sm font-semibold text-[#FFC857] transition hover:bg-[#FFC857]/10 sm:col-span-2">
                Save booking details
              </button>
            </form>
          </Panel>
          <Panel icon={<UserRound />} title="Customer">
            <h3 className="font-semibold">{booking.customers.name}</h3>
            <p className="mt-2 text-sm text-white/50">
              {booking.customers.email || "No email"} ·{" "}
              {booking.customers.phone || "No phone"}
            </p>
            {booking.customer_notes && (
              <p className="mt-4 rounded-xl bg-white/[.04] p-4 text-sm leading-6 text-white/55">
                {booking.customer_notes}
              </p>
            )}
          </Panel>
          <Panel icon={<Wrench />} title="Assigned resources">
            {booking.booking_resources?.length ? (
              <div className="grid gap-2">
                {booking.booking_resources.map((entry: AssignedResource) => (
                  <div
                    key={String(entry.id)}
                    className="flex justify-between rounded-xl border border-white/10 p-3 text-sm"
                  >
                    <span>
                      {entry.resources.name}{" "}
                      <span className="text-white/35">
                        · {pretty(entry.resources.resource_type)}
                      </span>
                    </span>
                    <div className="flex items-center gap-3">
                      <strong>× {entry.quantity}</strong>
                      <form action={unassignBookingResource}>
                        <input type="hidden" name="siteId" value={siteId} />
                        <input
                          type="hidden"
                          name="bookingId"
                          value={bookingId}
                        />
                        <input
                          type="hidden"
                          name="resourceId"
                          value={entry.resources.id}
                        />
                        <button className="text-xs text-white/40 hover:text-red-200">
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">No resources assigned.</p>
            )}
            <form
              action={assignBookingResource}
              className="mt-4 grid gap-2 sm:grid-cols-[1fr_100px_auto]"
            >
              <input type="hidden" name="siteId" value={siteId} />
              <input type="hidden" name="bookingId" value={bookingId} />
              <select
                required
                name="resourceId"
                className="min-h-11 rounded-xl border border-white/10 bg-[#0b3027] px-3"
              >
                <option value="">Choose resource</option>
                {resources?.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} · capacity {x.capacity}
                  </option>
                ))}
              </select>
              <input
                aria-label="Resource quantity"
                name="quantity"
                type="number"
                min="1"
                defaultValue="1"
                className="min-h-11 rounded-xl border border-white/10 bg-white/[.05] px-3"
              />
              <button className="rounded-xl border border-white/15 px-4 text-sm">
                Assign
              </button>
            </form>
          </Panel>
        </div>
        <Panel icon={<CheckCircle2 />} title="Activity timeline">
          <ol className="grid gap-4">
            {[...(booking.booking_activities ?? [])]
              .sort((a, b) => b.created_at.localeCompare(a.created_at))
              .map((item) => (
                <li key={item.id} className="border-l border-[#FFC857]/40 pl-4">
                  <p className="text-sm font-medium">{pretty(item.action)}</p>
                  <p className="mt-1 text-xs text-white/35">
                    {new Date(item.created_at).toLocaleString()}
                    {item.from_status
                      ? ` · ${pretty(item.from_status)} → ${pretty(item.to_status)}`
                      : ""}
                  </p>
                </li>
              ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}
function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-3xl p-6">
      <div className="flex items-center gap-3 text-[#FFC857]">
        {icon}
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
function EditField({
  label,
  name,
  value,
  type = "text",
  required,
  min,
  step,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  min?: string;
  step?: string;
  maxLength?: number;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        step={step}
        maxLength={maxLength}
        defaultValue={value}
        className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] px-3 outline-none focus:border-[#FFC857]/70"
      />
    </label>
  );
}
