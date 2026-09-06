import Link from "next/link";
import { Check, Eye, LayoutDashboard } from "lucide-react";
export default async function Created({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#F5A623] text-[#173028]">
        <Check size={32} />
      </span>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[.18em] text-[#FFC857]">
        Website created
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Your draft is ready to explore.
      </h1>
      <p className="mx-auto mt-4 max-w-lg leading-7 text-white/50">
        TripOne+ created your pages, sections, navigation, theme, SEO defaults
        and first version. Nothing is public until you publish.
      </p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={`/preview/${siteId}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5A623] px-5 text-sm font-semibold text-[#173028]"
        >
          <Eye size={17} />
          Preview website
        </Link>
        <Link
          href={`/dashboard/sites/${siteId}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-5 text-sm font-semibold"
        >
          <LayoutDashboard size={17} />
          Open dashboard
        </Link>
      </div>
    </div>
  );
}
