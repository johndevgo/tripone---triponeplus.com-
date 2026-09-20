import { SeoMarketingPage } from "@/components/marketing/seo-marketing-page";
import {
  seoMetadataForRoute,
  seoPageForRoute,
  seoStaticParams,
  type SeoRouteProps,
} from "@/lib/seo/marketing-route";
export const generateStaticParams = () => seoStaticParams("services");
export const generateMetadata = (props: SeoRouteProps) =>
  seoMetadataForRoute("services", props);
export default async function Page(props: SeoRouteProps) {
  return <SeoMarketingPage page={await seoPageForRoute("services", props)} />;
}
