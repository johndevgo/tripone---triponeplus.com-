import Link from "next/link";
import { CalendarDays, Plus, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { localDateTimeToIso } from "@/lib/operations/datetime";
import { oneRelation } from "@/lib/operations/relations";
import { Empty, PageHead } from "../experiences/page";

export default async function BookingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    from?: string;
    to?: string;
    message?: string;
    error?: string;
  }>;
}) {
  const { siteId } = await params;
  const filters = await searchParams;
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("businesses(timezone)")
    .eq("id", siteId)
    .single();
  const timezone = oneRelation(site?.businesses)?.timezone ?? "UTC";
  let query = supabase
    .from("bookings")
    .select(
      "id,reference,status,source,starts_at,guests,quantity,quoted_total,currency,updated_at,customers(name,email),experiences(name),rental_products(name),packages(name)",
    )
    .eq("site_id", siteId)
    .order("starts_at", { ascending: true });
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.from)
    query = query.gte(
      "starts_at",
      localDateTimeToIso(`${filters.from}T00:00`, timezone),
    );
  if (filters.to)
    query = query.lte(
      "starts_at",
      localDateTimeToIso(`${filters.to}T23:59`, timezone),
    );
  const { data } = await query;
  const rows = (data ?? []).filter(
    (item) =>
      !filters.q ||
      item.reference.toLowerCase().includes(filters.q.toLowerCase()) ||
      oneRelation(item.customers)
        ?.name?.toLowerCase()
        .includes(filters.q.toLowerCase()),
  );
  return (
    <>
      <PageHead
        eyebrow="Sales"
        title="Bookings"
        action={
          <Link
            href="/admin/bookings/new"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#5BCD57] px-4 text-sm font-semibold text-[#173028]"
          >
            <Plus size={16} />
            Add booking
          </Link>
        }
      />
      <p className="mt-3 text-sm text-white/50">
        Manage payment-free booking requests, confirmations and fulfilment.
      </p>
      <Feedback message={filters.message} error={filters.error} />
      <form className="glass mt-7 grid gap-3 rounded-2xl p-4 sm:grid-cols-2 xl:grid-cols-[1fr_180px_160px_160px_auto]">
        <label className="relative">
          <span className="sr-only">Search bookings</span>
          <Search className="absolute left-3 top-3 text-white/30" size={17} />
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Reference or customer"
            className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] pl-10 pr-3"
          />
        </label>
        <select
          name="status"
          defaultValue={filters.status}
          className="min-h-11 rounded-xl border border-white/10 bg-[#0b3027] px-3"
        >
          <option value="">All statuses</option>
          {[
            "pending",
            "awaiting_confirmation",
            "confirmed",
            "completed",
            "cancelled",
            "no_show",
          ].map((x) => (
            <option key={x} value={x}>
              {pretty(x)}
            </option>
          ))}
        </select>
        <input
          aria-label="From date"
          name="from"
          type="date"
          defaultValue={filters.from}
          className="min-h-11 rounded-xl border border-white/10 bg-white/[.05] px-3"
        />
        <input
          aria-label="To date"
          name="to"
          type="date"
          defaultValue={filters.to}
          className="min-h-11 rounded-xl border border-white/10 bg-white/[.05] px-3"
        />
        <button className="rounded-xl border border-white/10 px-4">
          Filter
        </button>
      </form>
      {rows.length ? (
        <div className="mt-6 grid gap-3">
          {rows.map((booking) => {
            const offering =
              oneRelation(booking.experiences)?.name ??
              oneRelation(booking.rental_products)?.name ??
              oneRelation(booking.packages)?.name ??
              "Service";
            return (
              <Link
                href={`/admin/bookings/${booking.id}`}
                key={booking.id}
                className="glass grid gap-3 rounded-2xl p-5 transition hover:border-[#95EE8E]/40 md:grid-cols-[150px_1fr_180px_120px] md:items-center"
              >
                <div>
                  <strong className="text-[#95EE8E]">
                    {booking.reference}
                  </strong>
                  <p className="mt-1 text-xs capitalize text-white/35">
                    {booking.source}
                  </p>
                </div>
                <div>
                  <h2 className="font-semibold">
                    {oneRelation(booking.customers)?.name ?? "Unknown customer"}
                  </h2>
                  <p className="mt-1 text-sm text-white/45">
                    {offering} · {booking.guests} guests
                  </p>
                </div>
                <div className="text-sm">
                  <p>
                    {new Date(booking.starts_at).toLocaleString(undefined, {
                      timeZone: timezone,
                    })}
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    {booking.quoted_total == null
                      ? "No quoted total"
                      : `${booking.currency} ${Number(booking.quoted_total).toLocaleString()}`}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/60">
                  {pretty(booking.status)}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty
          icon={CalendarDays}
          title="No bookings match"
          copy="Create a manual booking or publish a service with native booking requests."
        />
      )}
      <p className="mt-4 text-xs text-white/30">
        Dates and times use {timezone}.
      </p>
    </>
  );
}
export function Feedback({
  message,
  error,
}: {
  message?: string;
  error?: string;
}) {
  return (
    <>
      {message && (
        <p className="mt-5 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-200">
          {message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-400/10 p-3 text-sm text-red-100"
        >
          {error}
        </p>
      )}
    </>
  );
}
export function pretty(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
