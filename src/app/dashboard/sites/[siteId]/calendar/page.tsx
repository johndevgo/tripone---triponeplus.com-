import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  addDaysToDateKey,
  dateKeyInTimeZone,
  localDateTimeToIso,
} from "@/lib/operations/datetime";
import { oneRelation } from "@/lib/operations/relations";
import { Empty, PageHead } from "../experiences/page";
import { pretty } from "../bookings/page";
export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { siteId } = await params;
  const query = await searchParams;
  const days = query.range === "30" ? 30 : query.range === "7" ? 7 : 14;
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("businesses(timezone)")
    .eq("id", siteId)
    .single();
  const timezone = oneRelation(site?.businesses)?.timezone ?? "UTC";
  const fromDate = dateKeyInTimeZone(new Date(), timezone);
  const toDate = addDaysToDateKey(fromDate, days);
  const { data } = await supabase
    .from("bookings")
    .select(
      "id,reference,status,starts_at,guests,customers(name),experiences(name),rental_products(name),packages(name)",
    )
    .eq("site_id", siteId)
    .gte("starts_at", localDateTimeToIso(`${fromDate}T00:00`, timezone))
    .lt("starts_at", localDateTimeToIso(`${toDate}T00:00`, timezone))
    .order("starts_at");
  const groups = new Map<string, typeof data>();
  for (const booking of data ?? []) {
    const day = dateKeyInTimeZone(booking.starts_at, timezone);
    groups.set(day, [...(groups.get(day) ?? []), booking]);
  }
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <PageHead eyebrow="Sales" title="Calendar" />
        <nav className="flex w-fit rounded-xl border border-white/10 p-1">
          {[7, 14, 30].map((range) => (
            <Link
              key={range}
              href={`?range=${range}`}
              className={`rounded-lg px-3 py-2 text-xs ${days === range ? "bg-white/10" : "text-white/40"}`}
            >
              {range === 7 ? "Week" : range === 14 ? "2 weeks" : "Month"}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-3 text-sm text-white/50">
        Confirmed work and active requests, grouped by operating date.
      </p>
      {groups.size ? (
        <div className="mt-7 grid gap-5">
          {[...groups].map(([date, bookings]) => (
            <section key={date} className="glass overflow-hidden rounded-3xl">
              <header className="border-b border-white/10 px-5 py-4">
                <h2 className="font-semibold">
                  {new Date(`${date}T12:00:00Z`).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
              </header>
              {bookings?.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="grid gap-3 border-b border-white/[.07] px-5 py-4 last:border-0 hover:bg-white/[.04] sm:grid-cols-[100px_1fr_160px_auto] sm:items-center"
                >
                  <time className="text-[#FFC857]">
                    {new Date(booking.starts_at).toLocaleTimeString([], {
                      timeZone: timezone,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                  <div>
                    <strong>
                      {oneRelation(booking.experiences)?.name ??
                        oneRelation(booking.rental_products)?.name ??
                        oneRelation(booking.packages)?.name ??
                        "Service"}
                    </strong>
                    <p className="mt-1 text-xs text-white/40">
                      {oneRelation(booking.customers)?.name ??
                        "Unknown customer"}{" "}
                      · {booking.guests} guests · {booking.reference}
                    </p>
                  </div>
                  <span className="text-xs text-white/45">
                    {pretty(booking.status)}
                  </span>
                  <ChevronRight size={17} className="text-white/25" />
                </Link>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <Empty
          icon={CalendarDays}
          title="Nothing scheduled"
          copy={`No bookings are scheduled in the next ${days} days.`}
        />
      )}
      <p className="mt-4 text-xs text-white/30">Times shown in {timezone}.</p>
    </>
  );
}
