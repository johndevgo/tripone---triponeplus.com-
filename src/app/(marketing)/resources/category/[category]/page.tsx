import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ResourceCard } from "@/components/marketing/resource-card";
import {
  getResourceCategory,
  getResourcesByCategory,
  resourceCategories,
  resourceCategorySlugs,
} from "@/content/resources";

type Props = { params: Promise<{ category: string }> };

const descriptions = {
  Guide:
    "Industry-specific website planning for tours, rentals, transfers, packages, guides and outdoor activity businesses.",
  SEO: "Durable technical and content SEO guidance for useful, discoverable tourism websites without keyword-stuffed shortcuts.",
  Conversion:
    "Practical ways to reduce uncertainty, improve mobile journeys and turn interest into qualified booking requests.",
  Operations:
    "Clear workflows for availability, capacity, resources, customers, booking states, packages and lead follow-up.",
  Growth:
    "Responsible acquisition foundations that connect business identity, customer intent and measurable outcomes.",
  Comparison:
    "Fair, source-linked comparisons to help operators choose between general website platforms, booking systems and TripOne+.",
} as const;

export function generateStaticParams() {
  return resourceCategories.map((category) => ({
    category: resourceCategorySlugs[category],
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getResourceCategory((await params).category);
  if (!category) return {};
  const path = `/resources/category/${resourceCategorySlugs[category]}`;
  return {
    title: `${category} resources for tourism businesses`,
    description: descriptions[category],
    alternates: { canonical: path },
    openGraph: {
      title: `${category} resources | TripOne+`,
      description: descriptions[category],
      url: path,
    },
  };
}

export default async function ResourceCategoryPage({ params }: Props) {
  const category = getResourceCategory((await params).category);
  if (!category) notFound();
  const articles = getResourcesByCategory(category);
  return (
    <>
      <Link
        href="/resources"
        className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
      >
        <ArrowLeft size={16} /> All resources
      </Link>
      <header className="mt-9 max-w-4xl">
        <p className="marketing-kicker">Resource collection</p>
        <h1 className="marketing-title mt-6">{category} for tourism teams</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          {descriptions[category]}
        </p>
        <p className="mt-5 text-sm text-white/40">
          {articles.length} practical resources
        </p>
      </header>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ResourceCard key={article.slug} article={article} />
        ))}
      </div>
    </>
  );
}
