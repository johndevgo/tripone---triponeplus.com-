"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  Compass,
  FileText,
  Globe2,
  LayoutDashboard,
  Menu,
  Images,
  MapPin,
  Palette,
  PanelLeftClose,
  Search,
  Settings,
  Quote,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";
const nav = [
  [LayoutDashboard, "Overview", ""],
  [Compass, "Website", "builder"],
  [Compass, "Experiences", "experiences"],
  [FileText, "Pages", "pages"],
  [Images, "Media", "media"],
  [MapPin, "Locations", "locations"],
  [Quote, "Testimonials", "testimonials"],
  [Palette, "Design", "design"],
  [Search, "SEO", "seo"],
  [Users, "Leads", "leads"],
  [BarChart3, "Analytics", "analytics"],
  [Globe2, "Domains", "domains"],
  [Settings, "Settings", "settings"],
] as const;
export function DashboardShell({
  siteId,
  siteName,
  children,
}: {
  siteId: string;
  siteName: string;
  children: React.ReactNode;
}) {
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const base = `/dashboard/sites/${siteId}`;
  return (
    <div className="app-bg min-h-screen text-white">
      <div className="ambient" />
      <header className="glass sticky top-0 z-40 flex h-16 items-center justify-between border-x-0 border-t-0 px-4 lg:hidden">
        <Logo light />
        <button
          onClick={() => setMobile(true)}
          aria-label="Open navigation"
          className="grid size-10 place-items-center rounded-xl bg-white/10"
        >
          <Menu />
        </button>
      </header>
      {mobile && (
        <button
          aria-label="Close navigation backdrop"
          onClick={() => setMobile(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}
      <aside
        className={cn(
          "glass fixed inset-y-0 left-0 z-50 flex flex-col rounded-none border-y-0 border-l-0 transition-[width,transform] duration-200",
          collapsed ? "w-20" : "w-64",
          mobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <span className={collapsed ? "hidden" : "block"}>
            <Logo light />
          </span>
          <button
            onClick={() =>
              mobile ? setMobile(false) : setCollapsed(!collapsed)
            }
            aria-label={mobile ? "Close navigation" : "Collapse navigation"}
            className="grid size-9 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
          >
            {mobile ? (
              <X />
            ) : (
              <PanelLeftClose className={collapsed ? "rotate-180" : ""} />
            )}
          </button>
        </div>
        <div
          className={cn(
            "mx-3 mb-4 rounded-xl bg-white/[.06] p-3",
            collapsed && "hidden",
          )}
        >
          <p className="truncate text-sm font-medium">{siteName}</p>
          <p className="text-xs text-white/40">Draft workspace</p>
        </div>
        <nav
          aria-label="Dashboard"
          className="flex-1 space-y-1 overflow-y-auto px-3"
        >
          {nav.map(([Icon, label, segment]) => {
            const href = segment === "" ? base : `${base}/${segment}`;
            const active =
              segment === ""
                ? pathname === base
                : pathname.includes(`/${segment}`);
            return (
              <Link
                onClick={() => setMobile(false)}
                key={label}
                href={href}
                title={label}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition",
                  active
                    ? "bg-[#F5A623] font-semibold text-[#173028]"
                    : "text-white/60 hover:bg-white/[.07] hover:text-white",
                  collapsed && "justify-center",
                )}
              >
                <Icon size={19} />
                {!collapsed && label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link
            href="/dashboard/account"
            className={cn(
              "mb-1 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-white/55 hover:bg-white/[.07] hover:text-white",
              collapsed && "justify-center",
            )}
          >
            <UserCircle size={19} />
            {!collapsed && "Account"}
          </Link>
          <form action={logout}>
            <button
              className={cn(
                "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-white/55 hover:bg-white/[.07] hover:text-white",
                collapsed && "justify-center",
              )}
            >
              <ChevronLeft size={19} />
              {!collapsed && "Sign out"}
            </button>
          </form>
        </div>
      </aside>
      <div
        className={cn(
          "transition-[padding] duration-200",
          collapsed ? "lg:pl-20" : "lg:pl-64",
        )}
      >
        <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
