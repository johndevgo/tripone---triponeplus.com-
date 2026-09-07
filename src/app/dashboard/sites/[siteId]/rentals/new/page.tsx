import Link from "next/link";
import { RentalForm } from "@/components/rentals/rental-form";

export default async function NewRentalPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { siteId } = await params;
  const feedback = await searchParams;
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href={`/dashboard/sites/${siteId}/rentals`}
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to rentals
      </Link>
      <h1 className="mt-5 text-3xl font-semibold">Add a rental product</h1>
      <p className="mt-2 text-white/45">
        Create structured inventory, rate options, requirements, and booking
        details.
      </p>
      <RentalForm siteId={siteId} error={feedback.error} />
    </div>
  );
}
