import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { oneRelation } from "@/lib/operations/relations";
import { updateCustomer } from "../../operations-actions";
import { Feedback } from "../../bookings/page";
import { pretty } from "../../bookings/page";
type NamedRelation = { name: string } | { name: string }[] | null;
type CustomerBooking = {
  id: string;
  reference: string;
  status: string;
  starts_at: string;
  guests: number;
  experiences: NamedRelation;
  rental_products: NamedRelation;
  packages: NamedRelation;
};
type CustomerLead = {
  id: string;
  status: string;
  created_at: string;
  message: string | null;
};
export default async function CustomerDetail({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string; customerId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId, customerId } = await params;
  const feedback = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select(
      "*,bookings(id,reference,status,starts_at,guests,experiences(name),rental_products(name),packages(name)),leads(id,status,created_at,message)",
    )
    .eq("id", customerId)
    .eq("site_id", siteId)
    .single();
  if (!data) notFound();
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href={`/dashboard/sites/${siteId}/customers`}
        className="inline-flex items-center gap-2 text-sm text-white/45"
      >
        <ArrowLeft size={16} />
        Customers
      </Link>
      <div className="mt-6 flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200">
          <UserRound />
        </span>
        <div>
          <h1 className="text-3xl font-semibold">{data.name}</h1>
          <p className="mt-1 text-sm text-white/45">
            {data.email || "No email"} · {data.phone || "No phone"}
          </p>
        </div>
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <Panel icon={<CalendarDays />} title="Booking history">
          {data.bookings?.length ? (
            <div className="grid gap-3">
              {(data.bookings as CustomerBooking[])
                .sort((a, b) => b.starts_at.localeCompare(a.starts_at))
                .map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/dashboard/sites/${siteId}/bookings/${booking.id}`}
                    className="rounded-xl border border-white/10 p-4 hover:bg-white/[.04]"
                  >
                    <div className="flex justify-between gap-3">
                      <strong>
                        {oneRelation(booking.experiences)?.name ??
                          oneRelation(booking.rental_products)?.name ??
                          oneRelation(booking.packages)?.name ??
                          "Service"}
                      </strong>
                      <span className="text-xs">{pretty(booking.status)}</span>
                    </div>
                    <p className="mt-2 text-xs text-white/40">
                      {new Date(booking.starts_at).toLocaleString()} ·{" "}
                      {booking.guests} guests · {booking.reference}
                    </p>
                  </Link>
                ))}
            </div>
          ) : (
            <p className="text-sm text-white/40">No bookings yet.</p>
          )}
        </Panel>
        <Panel icon={<MessageSquareText />} title="Lead history">
          {data.leads?.length ? (
            <div className="grid gap-3">
              {(data.leads as CustomerLead[]).map((lead) => (
                <article
                  key={lead.id}
                  className="rounded-xl border border-white/10 p-4"
                >
                  <div className="flex justify-between">
                    <strong>{pretty(lead.status)}</strong>
                    <span className="text-xs text-white/35">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-white/45">
                    {lead.message || "No message recorded."}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/40">No linked leads yet.</p>
          )}
        </Panel>
      </div>
      <Feedback {...feedback} />
      <section className="glass mt-5 rounded-3xl p-6">
        <h2 className="font-semibold">Customer details</h2>
        <form
          action={updateCustomer}
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="customerId" value={customerId} />
          <CustomerField label="Name" name="name" value={data.name} required />
          <CustomerField
            label="Email"
            name="email"
            type="email"
            value={data.email ?? ""}
          />
          <CustomerField label="Phone" name="phone" value={data.phone ?? ""} />
          <CustomerField
            label="WhatsApp"
            name="whatsapp"
            value={data.whatsapp ?? ""}
          />
          <CustomerField
            label="Country"
            name="country"
            value={data.country ?? ""}
          />
          <label className="text-sm sm:col-span-2">
            Internal notes
            <textarea
              name="notes"
              rows={5}
              defaultValue={data.notes}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.05] p-3"
            />
          </label>
          <button className="min-h-11 rounded-xl bg-[#F5A623] px-5 font-semibold text-[#173028] sm:col-span-2">
            Save customer
          </button>
        </form>
      </section>
    </div>
  );
}
function CustomerField({
  label,
  name,
  value,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={value}
        className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] px-3"
      />
    </label>
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
