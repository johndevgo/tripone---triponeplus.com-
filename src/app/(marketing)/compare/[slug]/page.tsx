import { SeoMarketingPage } from "@/components/marketing/seo-marketing-page";
import {
  seoMetadataForRoute,
  seoPageForRoute,
  seoStaticParams,
  type SeoRouteProps,
} from "@/lib/seo/marketing-route";
export const generateStaticParams = () => seoStaticParams("compare");
export const generateMetadata = (props: SeoRouteProps) =>
  seoMetadataForRoute("compare", props);
export default async function Page(props: SeoRouteProps) {
  return <SeoMarketingPage page={await seoPageForRoute("compare", props)} />;
}
