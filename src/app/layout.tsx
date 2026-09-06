import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { getAppUrl } from "@/lib/app-url";
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
  openGraph: {
    title: "TripOne+ — Websites built to sell experiences",
    description:
      "A website platform built around tours, activities and experiences.",
    type: "website",
    siteName: "TripOne+",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripOne+ — Websites built to sell experiences",
    description:
      "A website platform built around tours, activities and experiences.",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
