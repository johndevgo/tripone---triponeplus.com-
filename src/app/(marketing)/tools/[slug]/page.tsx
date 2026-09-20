import { SeoMarketingPage } from "@/components/marketing/seo-marketing-page";
import {
  seoMetadataForRoute,
  seoPageForRoute,
  seoStaticParams,
  type SeoRouteProps,
} from "@/lib/seo/marketing-route";
export const generateStaticParams = () => seoStaticParams("tools");
export const generateMetadata = (props: SeoRouteProps) =>
  seoMetadataForRoute("tools", props);
export default async function Page(props: SeoRouteProps) {
  return <SeoMarketingPage page={await seoPageForRoute("tools", props)} />;
}
