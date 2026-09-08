"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  deviceCategory,
  type AnalyticsEventName,
} from "@/lib/analytics/schema";

type Integrations = {
  googleTagManagerId?: string;
  googleAnalyticsId?: string;
  metaPixelId?: string;
  tiktokPixelId?: string;
};

export function PublicAnalytics({
  experienceId,
  consentMode,
  integrations,
  allowThirdPartyScripts = false,
}: {
  experienceId?: string;
  consentMode: "disabled" | "basic";
  integrations: Integrations;
  allowThirdPartyScripts?: boolean;
}) {
  const [consent, setConsent] = useState<"pending" | "accepted" | "declined">(
    consentMode === "disabled" ? "accepted" : "pending",
  );

  useEffect(() => {
    if (consentMode === "basic") {
      const stored = localStorage.getItem("tripone-cookie-consent");
      if (stored === "accepted" || stored === "declined") {
        const timer = window.setTimeout(() => setConsent(stored), 0);
        return () => window.clearTimeout(timer);
      }
    }
  }, [consentMode]);

  useEffect(() => {
    if (consent !== "accepted") return;
    void trackPublicEvent("page_view", experienceId);
    if (experienceId) void trackPublicEvent("experience_view", experienceId);
    const click = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const name: AnalyticsEventName = href.startsWith("tel:")
        ? "phone_click"
        : href.includes("wa.me") || href.includes("whatsapp")
          ? "whatsapp_click"
          : link.hasAttribute("data-booking-link")
            ? "booking_click"
            : link.hasAttribute("data-cta")
              ? "cta_click"
              : "page_view";
      if (name !== "page_view") void trackPublicEvent(name, experienceId);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [consent, experienceId]);

  function choose(value: "accepted" | "declined") {
    localStorage.setItem("tripone-cookie-consent", value);
    setConsent(value);
  }

  const canLoad = consent === "accepted" && allowThirdPartyScripts;
  return (
    <>
      {canLoad && integrations.googleTagManagerId && (
        <Script id="tripone-gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${integrations.googleTagManagerId}');`}
        </Script>
      )}
      {canLoad && integrations.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${integrations.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="tripone-ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${integrations.googleAnalyticsId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {canLoad && integrations.metaPixelId && (
        <Script id="tripone-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${integrations.metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}
      {canLoad && integrations.tiktokPixelId && (
        <Script id="tripone-tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page'];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n=d.createElement('script');n.async=!0;n.src='https://analytics.tiktok.com/i18n/pixel/events.js?sdkid='+e;var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(n,a)};ttq.load('${integrations.tiktokPixelId}');ttq.page()}(window,document,'ttq');`}
        </Script>
      )}
      {consentMode === "basic" && consent === "pending" && (
        <aside
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-black/10 bg-[var(--site-surface)] p-5 shadow-2xl"
          aria-label="Cookie preferences"
        >
          <p className="font-semibold">Your privacy choices</p>
          <p className="mt-2 text-sm text-[var(--site-muted)]">
            This site uses optional analytics to understand visits and booking
            clicks. The site owner is responsible for its privacy obligations.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              className="rounded-xl border border-current px-4 py-2 text-sm"
              onClick={() => choose("declined")}
            >
              Decline
            </button>
            <button
              className="site-primary-action rounded-xl bg-[var(--site-accent)] px-4 py-2 text-sm font-semibold"
              onClick={() => choose("accepted")}
            >
              Accept analytics
            </button>
          </div>
        </aside>
      )}
      {consentMode === "basic" && consent !== "pending" && (
        <button
          type="button"
          onClick={() => setConsent("pending")}
          className="fixed bottom-3 left-3 z-40 rounded-lg border border-black/10 bg-[var(--site-surface)] px-3 py-2 text-xs text-[var(--site-muted)] shadow-lg"
        >
          Cookie preferences
        </button>
      )}
    </>
  );
}

export async function trackPublicEvent(
  eventName: AnalyticsEventName,
  experienceId?: string,
) {
  try {
    if (localStorage.getItem("tripone-cookie-consent") === "declined") return;
    const sessionId = getSessionId();
    const referrerDomain = document.referrer
      ? new URL(document.referrer).hostname
      : "";
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        pagePath: window.location.pathname,
        experienceId: experienceId ?? "",
        referrerDomain,
        sessionId,
        deviceCategory: deviceCategory(window.innerWidth),
      }),
    });
  } catch {
    // Analytics must never interrupt the visitor's journey.
  }
}

function getSessionId() {
  const key = "tripone-session";
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID().replaceAll("-", "");
    sessionStorage.setItem(key, value);
  }
  return value;
}
