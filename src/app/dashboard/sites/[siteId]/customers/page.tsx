import Link from "next/link";
import { Plus, Search, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { saveCustomer } from "../operations-actions";
import { Empty, PageHead } from "../experiences/page";
import { Feedback, pretty } from "../bookings/page";
const input = "min-h-11 rounded-xl border border-white/10 bg-[#0b3027] px-3";
export default async function CustomersPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ q?: string; message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const filters = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("customers")
    .select(
      "id,name,email,phone,country,source,created_at,bookings(id,status,starts_at),leads(id,status)",
    )
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });
  if (filters.q)
    query = query.or(
      `name.ilike.%${filters.q.replaceAll("%", "")}%,email.ilike.%${filters.q.replaceAll("%", "")}%,phone.ilike.%${filters.q.replaceAll("%", "")}%`,
    );
  const { data } = await query;
  return (
    <>
      <PageHead
        eyebrow="Sales"
        title="Customers"
        action={
          <a
            href="#add-customer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
          >
            <Plus size={16} />
            Add customer
          </a>
        }
      />
      <p className="mt-3 text-sm text-white/50">
        A lightweight customer record built from booking requests, leads and
        manual contacts.
      </p>
      <Feedback message={filters.message} error={filters.error} />
      <form className="glass mt-7 flex gap-3 rounded-2xl p-4">
        <label className="relative flex-1">
          <span className="sr-only">Search customers</span>
          <Search className="absolute left-3 top-3 text-white/30" size={17} />
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Name, email or phone"
            className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] pl-10 pr-3"
          />
        </label>
        <button className="rounded-xl border border-white/10 px-4">
          Search
        </button>
      </form>
      {data?.length ? (
        <div className="mt-6 grid gap-3">
          {data.map((customer) => {
            const upcoming = (customer.bookings ?? []).filter(
              (b) =>
                !["cancelled", "completed", "no_show"].includes(b.status) &&
                new Date(b.starts_at) >= new Date(),
            ).length;
            return (
              <Link
                key={customer.id}
                href={`/admin/customers/${customer.id}`}
                className="glass grid gap-3 rounded-2xl p-5 hover:border-[#FFC857]/40 md:grid-cols-[1fr_180px_160px] md:items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200">
                    <UserRound size={18} />
                  </span>
                  <div>
                    <strong>{customer.name}</strong>
                    <p className="mt-1 text-xs text-white/40">
                      {customer.email || customer.phone || "No contact details"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-white/50">
                  {customer.bookings?.length ?? 0} bookings · {upcoming}{" "}
                  upcoming
                </p>
                <span className="text-xs text-white/35">
                  Source: {pretty(customer.source)}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty
          icon={UserRound}
          title="No customers yet"
          copy="Customers are created from booking requests or can be added manually."
        />
      )}
      <section
        id="add-customer"
        className="glass mt-7 scroll-mt-24 rounded-3xl p-6"
      >
        <h2 className="text-lg font-semibold">Add a customer</h2>
        <form
          action={saveCustomer}
          className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input type="hidden" name="siteId" value={siteId} />
          {[
            ["name", "Name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["whatsapp", "WhatsApp"],
            ["country", "Country"],
          ].map(([name, label]) => (
            <label key={name} className="text-sm">
              {label}
              <input
                required={name === "name"}
                type={name === "email" ? "email" : "text"}
                name={name}
                className={`${input} mt-2 w-full`}
              />
            </label>
          ))}
          <label className="text-sm sm:col-span-2 lg:col-span-3">
            Notes
            <textarea
              name="notes"
              rows={3}
              className={`${input} mt-2 w-full py-3`}
            />
          </label>
          <button className="min-h-11 rounded-xl bg-[#F5A623] px-5 font-semibold text-[#173028] sm:col-span-2 lg:col-span-3">
            Save customer
          </button>
        </form>
      </section>
    </>
  );
}
