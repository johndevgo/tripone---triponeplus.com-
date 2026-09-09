import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
export function MarketingFooter() {
  return (
    <footer className="bg-[#021912] px-5 pb-10 pt-16 text-white/60">
      <div className="mx-auto grid max-w-7xl gap-12 border-t border-white/10 pt-10 lg:grid-cols-[1.35fr_.65fr_.65fr_.65fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-6">
            The website platform structured for tours, activities, rentals and
            travel businesses.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#ffc857] hover:text-white"
          >
            Build your website <ArrowUpRight size={15} />
          </Link>
        </div>
        <FooterGroup
          title="Product"
          links={[
            ["Features", "/features"],
            ["Templates", "/templates"],
            ["Pricing", "/pricing"],
            ["Log in", "/login"],
          ]}
        />
        <FooterGroup
          title="Learn"
          links={[
            ["Resources", "/resources"],
            ["SEO guide", "/resources/tourism-website-seo-guide"],
            ["Launch checklist", "/resources/tour-operator-website-checklist"],
            ["Comparisons", "/resources/triponeplus-vs-wix-tour-operators"],
          ]}
        />
        <FooterGroup
          title="Company"
          links={[
            ["Privacy", "/privacy"],
            ["Terms", "/terms"],
          ]}
        />
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
        <p>© {new Date().getFullYear()} TripOne+</p>
        <p>Built for the people who make places memorable.</p>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: Array<[string, string]>;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-white/35">
        {title}
      </p>
      <div className="mt-4 grid gap-3 text-sm">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="transition hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
