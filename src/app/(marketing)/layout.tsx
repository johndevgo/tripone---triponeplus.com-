import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { getAppUrl } from "@/lib/app-url";
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const origin = getAppUrl("https://triponeplus.com").replace(/\/$/, "");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: "TripOne+",
        url: origin,
        logo: `${origin}/images/logo%20annd%20branding/tripone%201%20isto%201%20logo%20no%20background.png`,
        description:
          "TripOne+ builds structured websites and operating workflows for tour, activity, rental and travel businesses.",
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: "TripOne+",
        publisher: { "@id": `${origin}/#organization` },
        inLanguage: "en",
      },
    ],
  };
  return (
    <div className="app-bg relative min-h-screen overflow-hidden text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div className="ambient" />
      <MarketingHeader />
      <main className="relative mx-auto max-w-7xl px-5 pb-24 pt-36">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
