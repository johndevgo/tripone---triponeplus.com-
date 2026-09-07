import Link from "next/link";
import { Box, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Empty, PageHead } from "../experiences/page";

export default async function RentalsPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    type?: string;
    message?: string;
    error?: string;
  }>;
}) {
  const { siteId } = await params;
  const filters = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("rental_products")
    .select(
      "id,name,slug,rental_type,currency,pricing_label,quote_only,featured,status,location_name,updated_at,rental_rates(amount,pricing_unit)",
    )
    .eq("site_id", siteId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });
  if (filters.q)
    query = query.ilike("name", `%${filters.q.replaceAll("%", "")}%`);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.type) query = query.eq("rental_type", filters.type);
  const { data: products } = await query;
  return (
    <>
      <PageHead
        eyebrow="Inventory"
        title="Rentals"
        action={
          <Link
            href={`/dashboard/sites/${siteId}/rentals/new`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
          >
            <Plus size={16} /> Add rental
          </Link>
        }
      />
      <p className="mt-2 max-w-2xl text-sm text-white/45">
        Manage rentable products and structured rates separately from tours and
        activities.
      </p>
      <form className="glass mt-7 grid gap-3 rounded-2xl p-4 sm:grid-cols-4">
        <input
          name="q"
          defaultValue={filters.q}
          placeholder="Search rentals"
          className="min-h-10 rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm"
        />
        <select
          name="status"
          defaultValue={filters.status}
          className="min-h-10 rounded-xl bg-white/10 px-3 text-sm"
        >
          <option value="" className="text-black">
            All statuses
          </option>
          <option className="text-black">draft</option>
          <option className="text-black">published</option>
        </select>
        <input
          name="type"
          defaultValue={filters.type}
          placeholder="Rental type"
          className="min-h-10 rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm"
        />
        <button className="min-h-10 rounded-xl border border-white/10 text-sm">
          Apply filters
        </button>
      </form>
      {filters.message && (
        <p className="mt-4 text-sm text-emerald-300">{filters.message}</p>
      )}
      {filters.error && (
        <p role="alert" className="mt-4 text-sm text-red-200">
          {filters.error}
        </p>
      )}
      {products?.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const rates = Array.isArray(product.rental_rates)
              ? product.rental_rates
              : [];
            const firstRate = rates.find((rate) => rate.amount != null);
            return (
              <Link
                href={`/dashboard/sites/${siteId}/rentals/${product.id}`}
                key={product.id}
                className="glass rounded-2xl p-5 transition hover:border-[#FFC857]/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-11 place-items-center rounded-xl bg-[#F5A623]/10 text-[#FFC857]">
                    <Box size={21} />
                  </div>
                  <span className="rounded-full bg-white/[.07] px-2.5 py-1 text-xs capitalize text-white/50">
                    {product.status}
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-semibold">{product.name}</h2>
                <p className="mt-1 text-sm capitalize text-white/40">
                  {product.rental_type.replaceAll("_", " ")}
                  {product.location_name ? ` · ${product.location_name}` : ""}
                </p>
                <p className="mt-5 text-sm">
                  {product.quote_only || !firstRate
                    ? "Price on request"
                    : `${product.currency} ${firstRate.amount} / ${firstRate.pricing_unit}`}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty
          icon={Box}
          title="No rental products yet"
          copy="Add motorcycles, boats, vehicles, equipment, or other rental inventory."
        />
      )}
    </>
  );
}
