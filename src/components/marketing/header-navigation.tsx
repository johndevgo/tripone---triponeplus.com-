"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

const links = [
  ["Features", "/features"],
  ["Growth services", "/growth-services"],
  ["Templates", "/templates"],
  ["Resources", "/resources"],
  ["Pricing", "/pricing"],
] as const;

export function HeaderNavigation({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const primary = authenticated
    ? (["Dashboard", "/admin/dashboard"] as const)
    : (["Build your website", "/signup"] as const);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-40 px-3 sm:px-5">
      <div className="pointer-events-auto mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/15 bg-[#052a11]/78 shadow-[0_18px_60px_rgba(0,30,8,.22)] backdrop-blur-2xl">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-5 px-4 sm:px-5 lg:px-7">
          <Logo light />
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 text-sm text-white/75 md:flex"
          >
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-white">
                {label}
              </Link>
            ))}
            {!authenticated && (
              <Link href="/login" className="hover:text-white">
                Log in
              </Link>
            )}
            <ButtonLink href={primary[1]}>{primary[0]}</ButtonLink>
          </nav>
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-white md:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mx-4 mb-4 grid gap-1 rounded-2xl border border-white/10 bg-black/15 p-3 text-white md:hidden"
          >
            {links.map(([label, href]) => (
              <Link
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3.5 text-sm font-medium hover:bg-white/10"
                key={href}
                href={href}
              >
                {label}
              </Link>
            ))}
            {!authenticated && (
              <Link
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3.5 text-sm font-medium hover:bg-white/10"
                href="/login"
              >
                Log in
              </Link>
            )}
            <Link
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-[#5bcd57] px-4 py-3.5 text-sm font-semibold text-[#173028]"
              href={primary[1]}
            >
              {primary[0]}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
