"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  safeInlineScript,
  type AdvancedScript,
} from "@/lib/integrations/advanced-scripts";

export function ConsentGatedTenantScripts({
  scripts,
  consentMode,
  nonce,
}: {
  scripts: AdvancedScript[];
  consentMode: "disabled" | "basic";
  nonce: string;
}) {
  const [accepted, setAccepted] = useState(consentMode === "disabled");
  useEffect(() => {
    const sync = () =>
      setAccepted(
        consentMode === "disabled" ||
          localStorage.getItem("tripone-cookie-consent") === "accepted",
      );
    const timer = window.setTimeout(sync, 0);
    window.addEventListener("tripone:consent", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("tripone:consent", sync);
    };
  }, [consentMode]);
  if (!accepted) return null;
  return scripts.map((script) => (
    <Script
      key={script.id}
      id={`tripone-advanced-${script.id}`}
      src={script.sourceUrl || undefined}
      nonce={nonce}
      strategy={
        script.placement === "body_end" ? "lazyOnload" : "afterInteractive"
      }
    >
      {script.sourceUrl ? undefined : safeInlineScript(script.code)}
    </Script>
  ));
}
