"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

export function ResilientImage({
  src,
  alt,
  className = "",
  hideFallback = false,
}: {
  src: string;
  alt: string;
  className?: string;
  hideFallback?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (failedSource === src) {
    if (hideFallback) return null;
    return (
      <span
        className={`grid place-items-center ${className}`}
        role={alt ? "img" : undefined}
        aria-label={alt ? `${alt} image unavailable` : undefined}
        aria-hidden={alt ? undefined : true}
      >
        <ImageOff aria-hidden="true" size={28} />
      </span>
    );
  }
  return (
    // User media is constrained by the upload route and storage policies. A
    // native image avoids proxying arbitrary customer URLs through the app.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSource(src)}
    />
  );
}
