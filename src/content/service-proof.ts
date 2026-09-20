export type ServiceProof = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  kind: "performance" | "credential" | "capability";
};

const proof = {
  seoGrowthOne: {
    src: "/images/proof/seo-growth-01.webp",
    alt: "Anonymised Google Search Console performance chart showing organic search growth",
    title: "Organic search performance",
    caption:
      "An anonymised Search Console view supplied from completed client work. It shows the type of evidence reviewed during an SEO engagement; results and timeframes vary by site and market.",
    kind: "performance",
  },
  seoGrowthTwo: {
    src: "/images/proof/seo-growth-02.webp",
    alt: "Anonymised Search Console chart used to review clicks and impressions",
    title: "Search visibility evidence",
    caption:
      "A second anonymised search-performance view. TripOne+ reports observed clicks, impressions and qualified actions without turning one account result into a promise for another business.",
    kind: "performance",
  },
  seoGrowthThree: {
    src: "/images/proof/seo-growth-03.webp",
    alt: "Google Search Console growth trend from an anonymised client account",
    title: "Measured search growth",
    caption:
      "Search Console evidence helps separate real discovery growth from unsupported ranking claims. Commercial reporting still needs enquiries and confirmed bookings where available.",
    kind: "performance",
  },
  seoGrowthFour: {
    src: "/images/proof/seo-growth-04.webp",
    alt: "Anonymised Google Search Console report with clicks and impressions",
    title: "Search demand over time",
    caption:
      "A supplied client-work screenshot used to demonstrate accountable measurement. Account names are intentionally omitted and no universal outcome is implied.",
    kind: "performance",
  },
  googleAdsSaas: {
    src: "/images/proof/google-ads-saas.webp",
    alt: "Anonymised Google Ads campaign dashboard with spend, conversions and conversion rate",
    title: "Google Ads account evidence",
    caption:
      "An anonymised campaign view from client work. Spend, attributed conversions and conversion rate are interpreted alongside lead quality and the account's attribution setup.",
    kind: "performance",
  },
  googleAdsHome: {
    src: "/images/proof/google-ads-home-services.webp",
    alt: "Anonymised Google Ads performance dashboard from a managed account",
    title: "Paid-search delivery evidence",
    caption:
      "A supplied account screenshot illustrating hands-on campaign management. It is evidence of delivery experience, not a forecast for a travel advertiser.",
    kind: "performance",
  },
  googleAdsMedical: {
    src: "/images/proof/google-ads-medical.webp",
    alt: "Anonymised Google Ads account showing tracked campaign results",
    title: "Conversion-tracked campaigns",
    caption:
      "An anonymised performance view showing why conversion definitions, attribution and commercial qualification must be agreed before media is scaled.",
    kind: "performance",
  },
  googlePartner: {
    src: "/images/proof/google-partner.webp",
    alt: "Google Ads partner credential supplied with the agency portfolio",
    title: "Google Ads delivery credential",
    caption:
      "A partner credential supplied with the agency evidence set. Platform credentials support delivery capability but do not guarantee campaign performance.",
    kind: "credential",
  },
  metaPartner: {
    src: "/images/proof/meta-partner.webp",
    alt: "Meta Business Partner credential supplied with the agency portfolio",
    title: "Meta delivery credential",
    caption:
      "A supplied Meta partner credential, presented as professional evidence rather than a claim that every campaign will achieve the same outcome.",
    kind: "credential",
  },
  semrushPartner: {
    src: "/images/proof/semrush-partner.webp",
    alt: "Semrush agency partner credential supplied with the agency portfolio",
    title: "Search workflow credential",
    caption:
      "A supplied Semrush partner credential supporting the research and audit workflow used in search engagements.",
    kind: "credential",
  },
  hubspotPartner: {
    src: "/images/proof/hubspot-partner.webp",
    alt: "HubSpot agency partner credential supplied with the agency portfolio",
    title: "CRM and growth credential",
    caption:
      "A supplied HubSpot agency credential relevant to connected content, CRM and lifecycle measurement work.",
    kind: "credential",
  },
  metaAds: {
    src: "/images/proof/meta-ads.webp",
    alt: "Meta advertising planning visual",
    title: "Meta campaign capability",
    caption:
      "Creative, audience, placement and measurement are planned as one campaign system rather than isolated boosts.",
    kind: "capability",
  },
  tiktok: {
    src: "/images/proof/tiktok-advertising.webp",
    alt: "TikTok advertising creative and campaign planning visual",
    title: "Short-form campaign capability",
    caption:
      "A visual from the supplied agency portfolio representing short-form creative, Spark Ads and performance measurement work.",
    kind: "capability",
  },
  content: {
    src: "/images/proof/content-strategy.webp",
    alt: "Content strategy planning visual for a connected publishing programme",
    title: "Content strategy capability",
    caption:
      "Content is planned around traveller questions, destination expertise, commercial pages and a maintainable publishing workflow.",
    kind: "capability",
  },
  brand: {
    src: "/images/proof/brand-strategy.webp",
    alt: "Brand strategy visual from the supplied agency portfolio",
    title: "Brand and creative systems",
    caption:
      "A supplied portfolio visual representing positioning, messaging, campaign creative and consistent visual direction.",
    kind: "capability",
  },
  cro: {
    src: "/images/proof/conversion-optimisation.webp",
    alt: "Conversion rate optimisation planning visual",
    title: "Conversion optimisation capability",
    caption:
      "Research, journey review, analytics and controlled changes are connected before a conversion conclusion is made.",
    kind: "capability",
  },
  ux: {
    src: "/images/proof/user-experience.webp",
    alt: "User experience design visual for website and booking journeys",
    title: "Traveller-centred UX",
    caption:
      "Mobile usability, information clarity, accessibility and the path to an enquiry or booking are reviewed together.",
    kind: "capability",
  },
  analytics: {
    src: "/images/proof/analytics-reporting.webp",
    alt: "Analytics and reporting dashboard visual",
    title: "Analytics and reporting",
    caption:
      "Measurement plans connect acquisition channels to meaningful traveller and commercial actions, with attribution limits stated clearly.",
    kind: "capability",
  },
  agencyPortfolio: {
    src: "/images/proof/agency-portfolio.webp",
    alt: "Anonymised agency performance evidence from the supplied portfolio",
    title: "Cross-channel delivery evidence",
    caption:
      "An anonymised result view supplied as evidence of agency work across markets. It demonstrates process experience, not a guaranteed outcome.",
    kind: "performance",
  },
  seoAudit: {
    src: "/images/proof/seo-audit.webp",
    alt: "SEO audit capability visual",
    title: "Technical and content audit",
    caption:
      "The audit joins crawlability, page quality, internal linking, local visibility and conversion paths into one prioritised plan.",
    kind: "capability",
  },
} as const satisfies Record<string, ServiceProof>;

const serviceProofs: Record<string, readonly ServiceProof[]> = {
  "/services/seo": [
    proof.seoGrowthOne,
    proof.seoGrowthTwo,
    proof.semrushPartner,
    proof.seoAudit,
  ],
  "/services/google-ads": [
    proof.googleAdsSaas,
    proof.googleAdsHome,
    proof.googlePartner,
  ],
  "/services/meta-ads": [
    proof.metaPartner,
    proof.metaAds,
    proof.agencyPortfolio,
  ],
  "/services/tiktok-ads": [
    proof.tiktok,
    proof.metaPartner,
    proof.agencyPortfolio,
  ],
  "/services/social-media-marketing": [
    proof.metaAds,
    proof.tiktok,
    proof.brand,
  ],
  "/services/content-marketing": [
    proof.content,
    proof.seoGrowthThree,
    proof.semrushPartner,
  ],
  "/services/creative-design": [
    proof.brand,
    proof.agencyPortfolio,
    proof.metaAds,
  ],
  "/services/conversion-rate-optimisation": [
    proof.cro,
    proof.ux,
    proof.googleAdsMedical,
  ],
  "/services/website-growth": [
    proof.ux,
    proof.seoGrowthFour,
    proof.hubspotPartner,
  ],
  "/services/analytics-tracking": [
    proof.analytics,
    proof.googleAdsSaas,
    proof.seoGrowthOne,
  ],
  "/services/strategy-consulting": [
    proof.agencyPortfolio,
    proof.analytics,
    proof.brand,
  ],
  "/services/email-marketing-crm": [
    proof.hubspotPartner,
    proof.content,
    proof.analytics,
  ],
  "/services/landing-pages-funnels": [proof.ux, proof.cro, proof.googleAdsSaas],
  "/services/reputation-review-growth": [
    proof.hubspotPartner,
    proof.content,
    proof.agencyPortfolio,
  ],
  "/services/marketing-automation": [
    proof.hubspotPartner,
    proof.analytics,
    proof.content,
  ],
  "/services/brand-positioning": [proof.brand, proof.ux, proof.agencyPortfolio],
};

export function getServiceProofs(path: string) {
  return serviceProofs[path] ?? [];
}
