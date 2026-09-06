import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TripOne+",
    short_name: "TripOne+",
    description: "Websites built to sell experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#041c16",
    theme_color: "#063d2e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
