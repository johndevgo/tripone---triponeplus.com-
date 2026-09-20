import {
  SeoHubPage,
  seoHubMetadata,
} from "@/components/marketing/seo-hub-page";
export const metadata = seoHubMetadata("compare");
export default function Page() {
  return <SeoHubPage namespace="compare" />;
}
