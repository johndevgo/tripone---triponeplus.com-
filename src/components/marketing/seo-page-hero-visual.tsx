import Image from "next/image";
import {
  Calculator,
  Check,
  ClipboardCheck,
  FileText,
  Scale,
} from "lucide-react";
import type { SeoPageSpec } from "@/content/seo-catalog";

export function SeoPageHeroVisual({
  page,
  image,
  imageAlt,
}: {
  page: SeoPageSpec;
  image: string;
  imageAlt: string;
}) {
  if (page.pageType === "Compare") return <ComparisonVisual page={page} />;
  if (page.pageType === "Tool") return <ToolVisual page={page} />;
  if (page.pageType === "Resource") return <ResourceVisual page={page} />;
  return <ImageVisual page={page} image={image} imageAlt={imageAlt} />;
}

function ImageVisual({
  page,
  image,
  imageAlt,
}: {
  page: SeoPageSpec;
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="relative min-h-[25rem] overflow-hidden rounded-[2rem] border border-white/12 shadow-[0_30px_90px_rgba(0,35,12,.35)]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        preload
        sizes="(max-width: 1024px) 100vw, 48vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#021912]/90 via-[#021912]/5 to-emerald-950/10" />
      <div className="absolute inset-x-0 bottom-0 p-7">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#95ee8e]">
          {page.pageType === "Growth Service"
            ? "Commercial approach"
            : page.pageType === "Industry"
              ? "Built for this operating model"
              : "Practical field guide"}
        </p>
        <p className="mt-3 max-w-xl text-lg font-medium leading-7 text-white/90">
          {page.contentAngle}
        </p>
      </div>
    </div>
  );
}

function ComparisonVisual({ page }: { page: SeoPageSpec }) {
  const alternative = page.title
    .replace(/^TripOne\+ vs\.?\s*/i, "")
    .replace(/ comparison.*$/i, "");
  return (
    <div className="relative min-h-[25rem] overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(149,238,142,.2),rgba(255,255,255,.045))] p-7 shadow-[0_30px_90px_rgba(0,35,12,.3)] sm:p-9">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#95ee8e]">
          Workflow-first evaluation
        </p>
        <span className="grid size-12 place-items-center rounded-2xl border border-white/12 bg-white/[.07] text-[#95ee8e]">
          <Scale size={23} />
        </span>
      </div>
      <div className="mt-9 grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
        <div className="rounded-2xl border border-white/12 bg-black/10 p-5">
          <span className="text-xs font-bold uppercase tracking-[.14em] text-white/38">
            Option A
          </span>
          <p className="mt-3 text-xl font-semibold">TripOne+</p>
        </div>
        <div className="grid place-items-center text-sm font-bold text-[#95ee8e]">
          VS
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/[.06] p-5">
          <span className="text-xs font-bold uppercase tracking-[.14em] text-white/38">
            Option B
          </span>
          <p className="mt-3 text-xl font-semibold">{alternative}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {["Real workflow fit", "Data portability", "Total operating cost"].map(
          (item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.045] px-4 py-3 text-sm font-semibold text-white/68"
            >
              <Check size={16} className="text-[#95ee8e]" /> {item}
            </div>
          ),
        )}
      </div>
      <p className="mt-6 text-sm leading-6 text-white/48">
        Current sources, a representative trial and an explicit migration test
        matter more than a feature-count verdict.
      </p>
    </div>
  );
}

function ToolVisual({ page }: { page: SeoPageSpec }) {
  return (
    <div className="min-h-[25rem] rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,.09),rgba(91,205,87,.13))] p-7 shadow-[0_30px_90px_rgba(0,35,12,.3)] sm:p-9">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#95ee8e]">
            Interactive workspace
          </p>
          <p className="mt-2 text-sm text-white/48">Runs in your browser</p>
        </div>
        <span className="grid size-12 place-items-center rounded-2xl bg-[#5bcd57] text-[#062b16]">
          <Calculator size={24} />
        </span>
      </div>
      <div className="mt-8 rounded-[1.5rem] border border-white/12 bg-[#042b17]/75 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {["Your inputs", "Your assumptions"].map((label, index) => (
            <div key={label}>
              <span className="text-xs font-semibold text-white/45">
                {label}
              </span>
              <div className="mt-2 h-11 rounded-xl border border-white/10 bg-white/[.055] px-4 py-3 text-sm text-white/30">
                {index === 0 ? "Enter current value" : "Review before use"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-[#95ee8e]/20 bg-[#95ee8e]/[.08] p-5">
          <span className="text-xs font-bold uppercase tracking-[.14em] text-[#95ee8e]">
            Transparent result
          </span>
          <p className="mt-2 text-lg font-semibold">{page.title}</p>
        </div>
      </div>
      <p className="mt-6 text-sm leading-6 text-white/48">
        No sign-up wall for the calculation. Validate every input before using
        the result in a commercial decision.
      </p>
    </div>
  );
}

function ResourceVisual({ page }: { page: SeoPageSpec }) {
  return (
    <div className="relative min-h-[25rem] overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,.1),rgba(149,238,142,.1))] p-7 shadow-[0_30px_90px_rgba(0,35,12,.3)] sm:p-9">
      <div className="absolute -right-16 -top-16 size-52 rounded-full bg-[#5bcd57]/15 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#95ee8e]">
          Practical working resource
        </p>
        <span className="grid size-12 place-items-center rounded-2xl border border-white/12 bg-white/[.07] text-[#95ee8e]">
          <ClipboardCheck size={24} />
        </span>
      </div>
      <div className="relative mt-8 rotate-[1.5deg] rounded-[1.5rem] border border-white/15 bg-[#f4fff2] p-6 text-[#102b18] shadow-[0_25px_70px_rgba(0,25,7,.35)]">
        <div className="flex items-center gap-3 border-b border-[#11802a]/15 pb-4">
          <FileText size={20} className="text-[#11802a]" />
          <p className="font-semibold">{page.title}</p>
        </div>
        <div className="mt-5 grid gap-4">
          {[
            "Complete with real business data",
            "Assign an owner",
            "Set a review date",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm">
              <span className="size-5 rounded-md border-2 border-[#11802a]/35" />
              {item}
            </div>
          ))}
        </div>
      </div>
      <p className="relative mt-7 text-sm leading-6 text-white/50">
        A structured template and implementation guide—not an empty download or
        one-size-fits-all business decision.
      </p>
    </div>
  );
}
