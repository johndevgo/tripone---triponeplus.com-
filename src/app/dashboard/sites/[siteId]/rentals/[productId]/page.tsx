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
      <h1 className="mt-5 text-3xl font-semibold">Edit {product.name}</h1>
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
