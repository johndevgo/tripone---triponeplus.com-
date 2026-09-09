import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-bg relative min-h-screen overflow-hidden text-white">
      <div className="ambient" />
      <MarketingHeader />
      <main className="relative mx-auto max-w-7xl px-5 pb-24 pt-36">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
