import Link from "next/link";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Logo } from "@/components/logo";
import { tripOneSupport } from "@/content/support";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function MarketingFooter() {
  const user = await getCurrentUser();
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
            href={user ? "/admin/dashboard" : "/signup"}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#95ee8e] hover:text-white"
          >
            {user ? "Open your dashboard" : "Build your website"}{" "}
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <FooterGroup
          title="Product"
          links={[
            ["Features", "/features"],
            ["Growth services", "/services"],
            ["Templates", "/templates"],
            ["Pricing", "/pricing"],
            ["Log in", "/login"],
          ]}
        />
        <FooterGroup
          title="Learn"
          links={[
            ["Resources", "/resources"],
            ["Free tools", "/tools"],
            ["Travel business guides", "/blog"],
            ["Platform comparisons", "/compare"],
            ["SEO guide", "/resources/tourism-website-seo-guide"],
            ["Launch checklist", "/resources/tour-operator-website-checklist"],
          ]}
        />
        <SupportLinks />
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
        <p>© {new Date().getFullYear()} TripOne+</p>
        <p>Built for the people who make places memorable.</p>
      </div>
    </footer>
  );
}

function SupportLinks() {
  const links = [
    [MessageCircle, "WhatsApp us", tripOneSupport.whatsappHref],
    [Phone, tripOneSupport.phoneDisplay, tripOneSupport.phoneHref],
    [InstagramIcon, "Instagram", tripOneSupport.instagramHref],
    [FacebookIcon, "Facebook", tripOneSupport.facebookHref],
  ] as const;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-white/35">
        Support
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm lg:grid-cols-1">
        {links.map(([Icon, label, href]) => (
          <Link
            key={href}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={`${label} support`}
            className="group flex min-h-12 items-center gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[.045] px-3 text-white/75 transition hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-emerald-300/[.1] hover:text-white"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#95ee8e]/25 bg-[#5bcd57]/15 text-[#b8ffb0] shadow-[0_8px_24px_rgba(91,205,87,.1)] transition group-hover:border-[#95ee8e]/45 group-hover:bg-[#5bcd57]/25">
              <Icon width={18} height={18} aria-hidden="true" />
            </span>
            {label}
          </Link>
        ))}
        <div className="col-span-2 mt-2 flex gap-4 px-2 text-xs lg:col-span-1">
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}

const InstagramIcon: ComponentType<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon: ComponentType<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14.4 8.2V6.7c0-.8.5-1 1-1h2.5V2.1L14.5 2C11.1 2 10 4 10 6.4v1.8H7.8v4H10V22h4.4v-9.8h3.1l.5-4h-3.6Z" />
  </svg>
);

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
