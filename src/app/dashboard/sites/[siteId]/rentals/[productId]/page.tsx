import Link from "next/link";
import { notFound } from "next/navigation";
import { RentalForm } from "@/components/rentals/rental-form";
import { createClient } from "@/lib/supabase/server";

export default async function EditRentalPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string; productId: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { siteId, productId } = await params;
  const feedback = await searchParams;
  const supabase = await createClient();
  const [{ data: product }, { data: rates }] = await Promise.all([
    supabase
      .from("rental_products")
      .select("*")
      .eq("id", productId)
      .eq("site_id", siteId)
      .single(),
    supabase
      .from("rental_rates")
      .select("*")
      .eq("rental_product_id", productId)
      .eq("site_id", siteId)
      .order("sort_order"),
  ]);
  if (!product) notFound();
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href={`/dashboard/sites/${siteId}/rentals`}
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to rentals
      </Link>
      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-semibold">Edit {product.name}</h1>
        <Link
          href={`/dashboard/sites/${siteId}/builder?target=${product.id}`}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#FFC857]/25 bg-[#FFC857]/[.06] px-4 text-sm font-medium text-[#FFC857]"
        >
          Customize page layout
        </Link>
      </div>
      <p className="mt-2 text-white/45">
        Changes remain in the working draft until the site is published.
      </p>
      <RentalForm
        siteId={siteId}
        product={product}
        rates={rates ?? []}
        error={feedback.error}
        message={feedback.message}
      />
    </div>
  );
}
