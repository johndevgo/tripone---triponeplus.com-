"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import {
  ResourceCard,
  type ResourceCardArticle,
} from "@/components/marketing/resource-card";
import type { ResourceCategory } from "@/content/resources";

const batchSize = 18;
const resourceCategories: ResourceCategory[] = [
  "Guide",
  "SEO",
  "Conversion",
  "Operations",
  "Growth",
  "Comparison",
];
const categorySlugs: Record<ResourceCategory, string> = {
  Guide: "industry-guides",
  SEO: "tourism-seo",
  Conversion: "website-conversion",
  Operations: "tour-operations",
  Growth: "tourism-growth",
  Comparison: "platform-comparisons",
};

export function ResourceExplorer({
  articles,
}: {
  articles: ResourceCardArticle[];
}) {
  const [category, setCategory] = useState<ResourceCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter(
      (article) =>
        (category === "All" || article.category === category) &&
        (!needle ||
          article.title.toLowerCase().includes(needle) ||
          article.description.toLowerCase().includes(needle)),
    );
  }, [articles, category, query]);
  const visible = filtered.slice(0, visibleCount);

  function chooseCategory(value: ResourceCategory | "All") {
    setCategory(value);
    setVisibleCount(batchSize);
  }

  return (
    <div className="mt-10">
      <div className="glass rounded-2xl p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search the resource library</span>
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            size={18}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(batchSize);
            }}
            placeholder="Search guides, operations, SEO and comparisons"
            className="min-h-12 w-full rounded-xl border border-white/10 bg-black/15 pl-11 pr-4 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-300/45 focus:ring-2 focus:ring-emerald-300/15"
          />
        </label>
        <div
          className="mt-4 flex flex-wrap gap-2"
          aria-label="Filter resources by category"
        >
          {(["All", ...resourceCategories] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => chooseCategory(item)}
              className={`min-h-10 rounded-full border px-4 text-sm transition ${
                category === item
                  ? "border-[#ffc857]/55 bg-[#ffc857]/15 text-[#ffc857]"
                  : "border-white/10 bg-white/[.04] text-white/55 hover:bg-white/[.08] hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-white/45">
        <p aria-live="polite">
          Showing {visible.length} of {filtered.length} resources
        </p>
        {category !== "All" && (
          <Link
            href={`/resources/category/${categorySlugs[category]}`}
            className="inline-flex items-center gap-2 font-semibold text-[#ffc857]"
          >
            Open the {category.toLowerCase()} collection
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {visible.length ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <ResourceCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
          <p className="font-semibold">No resources match that search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              chooseCategory("All");
            }}
            className="mt-3 text-sm font-semibold text-[#ffc857]"
          >
            Clear filters
          </button>
        </div>
      )}

      {visible.length < filtered.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + batchSize)}
            className="min-h-12 rounded-xl border border-white/15 bg-white/[.06] px-7 text-sm font-semibold transition hover:bg-white/[.1]"
          >
            Show more resources
          </button>
        </div>
      )}
    </div>
  );
}
