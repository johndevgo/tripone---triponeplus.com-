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
    ["Pricing", "/pricing"],
    ["Log in", "/login"],
    ["Build your website", "/signup"],
  ];
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
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
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-white md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="glass mx-4 grid gap-2 rounded-2xl p-3 text-white md:hidden">
          {mobileLinks.map(([label, href]) => (
            <Link
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 hover:bg-white/10"
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
