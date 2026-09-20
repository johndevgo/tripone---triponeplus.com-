import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  Gauge,
  LayoutTemplate,
  LockKeyhole,
  Network,
  Route,
  Scale,
  Sparkles,
} from "lucide-react";
import type { SeoPageSpec } from "@/content/seo-catalog";

export function SeoPageTypeIntro({ page }: { page: SeoPageSpec }) {
  if (page.pageType === "Growth Service") return <ServiceIntro page={page} />;
  if (page.pageType === "Compare") return <ComparisonIntro page={page} />;
  if (page.pageType === "Tool") return <ToolIntro page={page} />;
  if (page.pageType === "Resource") return <ResourceIntro page={page} />;
  if (page.pageType === "Industry") return <IndustryIntro page={page} />;
  return <EditorialIntro page={page} />;
}

function ServiceIntro({ page }: { page: SeoPageSpec }) {
  return (
    <section
      className="mt-12 grid gap-4 md:grid-cols-3"
      aria-label="Service model"
    >
      {[
        [
          Gauge,
          "Diagnose",
          `Find the commercial and customer constraint behind ${page.primaryKeyword}.`,
        ],
        [
          LayoutTemplate,
          "Build",
          "Connect the offer, message, conversion path and accountable owner.",
        ],
        [
          BarChart3,
          "Improve",
          "Review qualified actions and commercial evidence, not surface activity alone.",
        ],
      ].map(([Icon, title, description], index) => {
        const ServiceIcon = Icon as typeof Gauge;
        return (
          <article
            key={String(title)}
            className="glass relative overflow-hidden rounded-[1.6rem] p-6"
          >
            <span className="absolute right-5 top-4 text-5xl font-black text-white/[.035]">
              0{index + 1}
            </span>
            <ServiceIcon size={21} className="text-[#8ef18a]" />
            <h2 className="mt-5 text-xl font-semibold">{String(title)}</h2>
            <p className="mt-2 text-sm leading-6 text-white/54">
              {String(description)}
            </p>
          </article>
        );
      })}
    </section>
  );
}

function ComparisonIntro({ page }: { page: SeoPageSpec }) {
  const alternative = page.title
    .replace(/^TripOne\+ vs\.?\s*/i, "")
    .replace(/ comparison.*$/i, "");
  return (
    <section
      className="glass mt-12 overflow-hidden rounded-[2rem] p-6 sm:p-8"
      aria-labelledby="comparison-snapshot"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#65db63] text-[#062b16]">
          <Scale size={22} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.15em] text-[#8ef18a]">
            Decision snapshot
          </p>
          <h2 id="comparison-snapshot" className="mt-2 text-2xl font-semibold">
            Compare fit, not marketing checklists
          </h2>
        </div>
      </div>
      <div className="mt-7 grid overflow-hidden rounded-2xl border border-white/10 md:grid-cols-2">
        <div className="border-b border-white/10 bg-white/[.035] p-6 md:border-b-0 md:border-r">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-white/42">
            Evaluate {alternative} for
          </p>
          <p className="mt-3 leading-7 text-white/70">
            Its documented specialist category, mature workflows and the exact
            capabilities proven in a representative trial.
          </p>
        </div>
        <div className="bg-emerald-300/[.075] p-6">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8ef18a]">
            Evaluate TripOne+ for
          </p>
          <p className="mt-3 leading-7 text-white/70">
            An owned tourism website, structured offers, customer context and a
            connected marketing workspace.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {["Workflow fit", "Data portability", "Total operating cost"].map(
          (item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-4 text-sm font-semibold text-white/70"
            >
              <Check size={16} className="text-[#8ef18a]" />
              {item}
            </div>
          ),
        )}
      </div>
      <p className="mt-6 text-xs leading-5 text-white/42">
        TripOne+ is an interested party. Verify current provider documentation,
        plan terms and real product behaviour before deciding.
      </p>
    </section>
  );
}

function ToolIntro({ page }: { page: SeoPageSpec }) {
  return (
    <section
      className="mt-12 grid gap-4 sm:grid-cols-3"
      aria-label="Tool commitments"
    >
      {[
        [
          LockKeyhole,
          "Private by default",
          "Inputs remain in the browser unless the tool clearly says otherwise.",
        ],
        [
          Gauge,
          "Visible method",
          "Assumptions and calculations stay readable so results can be checked.",
        ],
        [
          Route,
          "Useful next step",
          `Turn the ${page.primaryKeyword} result into a practical action plan.`,
        ],
      ].map(([Icon, title, description]) => {
        const ToolIcon = Icon as typeof Gauge;
        return (
          <article
            key={String(title)}
            className="rounded-[1.5rem] border border-emerald-200/15 bg-emerald-200/[.06] p-5"
          >
            <ToolIcon size={20} className="text-[#8ef18a]" />
            <h2 className="mt-4 font-semibold">{String(title)}</h2>
            <p className="mt-2 text-sm leading-6 text-white/52">
              {String(description)}
            </p>
          </article>
        );
      })}
    </section>
  );
}

function ResourceIntro({ page }: { page: SeoPageSpec }) {
  return (
    <section
      className="glass mt-12 rounded-[2rem] p-6 sm:p-8"
      aria-labelledby="resource-workflow"
    >
      <p className="marketing-kicker">
        <ClipboardCheck size={15} /> Working resource
      </p>
      <h2 id="resource-workflow" className="mt-5 text-2xl font-semibold">
        Use this page with your real business data
      </h2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {["Complete", "Assign", "Review"].map((title, index) => (
          <article
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[.04] p-5"
          >
            <span className="text-xs font-bold text-[#8ef18a]">
              0{index + 1}
            </span>
            <h3 className="mt-3 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/52">
              {index === 0
                ? `Adapt the ${page.primaryKeyword} framework to real offers and constraints.`
                : index === 1
                  ? "Name the person responsible for every decision and follow-up."
                  : "Set a date and evidence source for checking whether the work is complete."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function IndustryIntro({ page }: { page: SeoPageSpec }) {
  return (
    <section
      className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_.8fr]"
      aria-labelledby="operator-system"
    >
      <div className="glass rounded-[2rem] p-7">
        <p className="marketing-kicker">
          <Network size={15} /> Connected operating system
        </p>
        <h2 id="operator-system" className="mt-5 text-3xl font-semibold">
          From discovery to delivery, without losing the traveller context.
        </h2>
        <div className="mt-7 flex flex-wrap gap-2">
          {page.entities.map((entity) => (
            <span
              key={entity}
              className="rounded-full border border-emerald-200/15 bg-emerald-200/[.065] px-3 py-2 text-sm text-white/68"
            >
              {entity}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] border border-emerald-200/15 bg-[linear-gradient(145deg,rgba(103,219,99,.2),rgba(255,255,255,.045))] p-7">
        <Sparkles size={22} className="text-[#8ef18a]" />
        <h2 className="mt-5 text-xl font-semibold">
          Built around the operator
        </h2>
        <p className="mt-3 leading-7 text-white/56">
          Website content, enquiries, packages and customer records should
          reflect how this travel business actually sells and delivers.
        </p>
        <Link
          href="/features"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8ef18a]"
        >
          Explore the platform <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function EditorialIntro({ page }: { page: SeoPageSpec }) {
  return (
    <section className="glass mt-12 rounded-[2rem] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-emerald-300/10 text-[#8ef18a]">
          <BookOpenCheck size={21} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.15em] text-white/38">
            Practical field guide
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            What this guide helps you decide
          </h2>
        </div>
      </div>
      <p className="mt-5 max-w-4xl leading-7 text-white/58">
        Understand {page.primaryKeyword}, connect it to the wider
        travel-business system, and leave with an implementation sequence rather
        than generic inspiration.
      </p>
    </section>
  );
}
