import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSeoPageFromSlug,
  getSeoPageImage,
  getSeoPageSlug,
  getSeoPages,
  type SeoNamespace,
} from "@/content/seo-catalog";

export type SeoRouteProps = { params: Promise<{ slug: string }> };

export function seoStaticParams(namespace: SeoNamespace) {
  return getSeoPages(namespace)
    .filter((page) => page.path.startsWith(`/${namespace}/`))
    .map((page) => ({ slug: getSeoPageSlug(page) }));
}

export async function seoPageForRoute(
  namespace: SeoNamespace,
  props: SeoRouteProps,
) {
  const page = getSeoPageFromSlug(namespace, (await props.params).slug);
  if (!page) notFound();
  return page;
}

export async function seoMetadataForRoute(
  namespace: SeoNamespace,
  props: SeoRouteProps,
): Promise<Metadata> {
  const page = await seoPageForRoute(namespace, props);
  const image = getSeoPageImage(page);
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: [
      page.primaryKeyword,
      ...page.secondaryKeywords,
      ...page.entities,
    ],
    alternates: { canonical: page.path },
    openGraph: {
      type: page.pageType === "Blog" ? "article" : "website",
      title: page.metaTitle,
      description: page.metaDescription,
      url: page.path,
      images: [{ url: image, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [image],
    },
  };
}
