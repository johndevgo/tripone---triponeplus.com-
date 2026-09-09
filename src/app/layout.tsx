import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { headers } from "next/headers";
import Script from "next/script";
import { getAppUrl } from "@/lib/app-url";
import { ConsentGatedTenantScripts } from "@/components/site/tenant-advanced-scripts";
import {
  parseAdvancedScripts,
  safeInlineScript,
  scriptMatchesPath,
  type AdvancedScript,
} from "@/lib/integrations/advanced-scripts";
import { loadPublishedSite } from "@/lib/tenancy/published-site";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "TripOne+ — Websites built to sell experiences",
    template: "%s | TripOne+",
  },
  description:
    "Build a fast, SEO-ready website structured for your tourism or activity business.",
  metadataBase: new URL(getAppUrl()),
  applicationName: "TripOne+",
  authors: [{ name: "TripOne+" }],
  creator: "TripOne+",
  publisher: "TripOne+",
  category: "business",
  keywords: [
    "tourism website builder",
    "tour operator website builder",
    "activity website builder",
    "travel website builder",
    "rental website builder",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "TripOne+ — Websites built to sell experiences",
    description:
      "A website platform built around tours, activities and experiences.",
    type: "website",
    siteName: "TripOne+",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripOne+ — Websites built to sell experiences",
    description:
      "A website platform built around tours, activities and experiences.",
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const isolated =
    requestHeaders.get("x-tripone-isolated-origin") === "verified";
  const hostname = requestHeaders.get("x-tripone-host") ?? "";
  const pathname = requestHeaders.get("x-tripone-path") ?? "/";
  const nonce = requestHeaders.get("x-nonce") ?? "";
  let scripts: AdvancedScript[] = [];
  let consentMode: "disabled" | "basic" = "disabled";
  if (isolated && hostname && nonce) {
    const published = await loadPublishedSite(hostname);
    const global = published?.snapshot.site.globalSettings;
    const integrations = object(global?.integrations);
    scripts = parseAdvancedScripts(integrations.advancedScripts).filter(
      (script) => scriptMatchesPath(script, pathname),
    );
    consentMode = global?.cookieConsentMode === "basic" ? "basic" : "disabled";
  }
  const essential = scripts.filter(
    (script) => script.consentCategory === "essential",
  );
  const consentGated = scripts.filter(
    (script) => script.consentCategory !== "essential",
  );
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        {essential
          .filter((script) => script.placement === "head")
          .map((script) => (
            <TenantScript key={script.id} script={script} nonce={nonce} />
          ))}
      </head>
      <body>
        {essential
          .filter((script) => script.placement === "body_start")
          .map((script) => (
            <TenantScript key={script.id} script={script} nonce={nonce} />
          ))}
        {children}
        {essential
          .filter((script) => script.placement === "body_end")
          .map((script) => (
            <TenantScript key={script.id} script={script} nonce={nonce} />
          ))}
        {isolated && nonce && (
          <ConsentGatedTenantScripts
            scripts={consentGated}
            consentMode={consentMode}
            nonce={nonce}
          />
        )}
      </body>
    </html>
  );
}

function TenantScript({
  script,
  nonce,
}: {
  script: AdvancedScript;
  nonce: string;
}) {
  if (script.placement === "head") {
    return (
      <Script
        id={`tripone-advanced-${script.id}`}
        src={script.sourceUrl || undefined}
        nonce={nonce}
        strategy="beforeInteractive"
      >
        {script.sourceUrl ? undefined : safeInlineScript(script.code)}
      </Script>
    );
  }
  if (script.sourceUrl)
    return (
      <script
        id={`tripone-advanced-${script.id}`}
        src={script.sourceUrl}
        nonce={nonce}
        async
      />
    );
  return (
    <script
      id={`tripone-advanced-${script.id}`}
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: safeInlineScript(script.code) }}
    />
  );
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
