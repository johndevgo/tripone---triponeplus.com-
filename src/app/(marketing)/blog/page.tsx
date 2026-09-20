import {
  SeoHubPage,
  seoHubMetadata,
} from "@/components/marketing/seo-hub-page";
export const metadata = seoHubMetadata("blog");
export default function Page() {
  return <SeoHubPage namespace="blog" />;
}
