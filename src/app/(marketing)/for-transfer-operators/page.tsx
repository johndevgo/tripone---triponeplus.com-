import type { Metadata } from "next";
import { SeoMarketingPage } from "@/components/marketing/seo-marketing-page";
import { getSeoPage, getSeoPageImage } from "@/content/seo-catalog";

const path = "/for-transfer-operators";
const page = getSeoPage(path)!;
const image = getSeoPageImage(page);

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  keywords: [page.primaryKeyword, ...page.secondaryKeywords, ...page.entities],
  alternates: { canonical: path },
  openGraph: {
    title: page.metaTitle,
    description: page.metaDescription,
    url: path,
    images: [{ url: image, alt: page.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: page.metaTitle,
    description: page.metaDescription,
    images: [image],
  },
};

export default function TransferOperatorIndustryPage() {
  return <SeoMarketingPage page={page} />;
}
