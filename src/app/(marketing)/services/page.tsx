import {
  SeoHubPage,
  seoHubMetadata,
} from "@/components/marketing/seo-hub-page";
export const metadata = seoHubMetadata("services");
export default function Page() {
  return <SeoHubPage namespace="services" />;
}
