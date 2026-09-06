import Link from "next/link";
import { Logo } from "@/components/logo";
export function MarketingFooter() {
  return (
    <footer className="bg-[#022C22] px-5 py-12 text-white/60">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-t border-white/10 pt-8 sm:flex-row">
        <div>
          <Logo light />
          <p className="mt-3 max-w-xs text-sm">
            The website platform structured for tours, activities, rentals and
            travel businesses.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link href="/features">Features</Link>
          <Link href="/templates">Templates</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} TripOne+</p>
      </div>
    </footer>
  );
}
