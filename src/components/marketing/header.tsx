"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const mobileLinks: Array<[string, string]> = [
    ["Features", "/features"],
    ["Templates", "/templates"],
    ["Resources", "/resources"],
    ["Pricing", "/pricing"],
    ["Log in", "/login"],
    ["Build your website", "/signup"],
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[.07] bg-[#041c16]/80 backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo light />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 text-sm text-white/75 md:flex"
        >
          <Link href="/features" className="hover:text-white">
            Features
          </Link>
          <Link href="/templates" className="hover:text-white">
            Templates
          </Link>
          <Link href="/resources" className="hover:text-white">
            Resources
          </Link>
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-white">
            Log in
          </Link>
          <ButtonLink href="/signup">Build your website</ButtonLink>
        </nav>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
          className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-white md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="glass mx-4 mb-4 grid gap-1 rounded-2xl p-3 text-white md:hidden"
        >
          {mobileLinks.map(([label, href]) => (
            <Link
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3.5 text-sm font-medium hover:bg-white/10"
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
