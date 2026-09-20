import {
  SeoHubPage,
  seoHubMetadata,
} from "@/components/marketing/seo-hub-page";
export const metadata = seoHubMetadata("tools");
export default function Page() {
  return <SeoHubPage namespace="tools" />;
}
