import {
  SeoHubPage,
  seoHubMetadata,
} from "@/components/marketing/seo-hub-page";
export const metadata = seoHubMetadata("for");
export default function Page() {
  return <SeoHubPage namespace="for" />;
}
