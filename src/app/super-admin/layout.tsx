import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { logout } from "@/app/auth/actions";
import { requirePlatformMember } from "@/lib/platform/admin";

export const metadata: Metadata = {
  title: "Platform administration",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requirePlatformMember(["super_admin"]);
  return (
    <div className="app-bg min-h-screen text-white">
      <div className="ambient" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#041c16]/85 px-4 backdrop-blur-2xl sm:px-7">
        <div className="mx-auto flex min-h-17 max-w-[1500px] items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <Logo light />
            <span className="hidden items-center gap-2 rounded-full border border-[#95ee8e]/20 bg-[#95ee8e]/10 px-3 py-1.5 text-xs font-semibold text-[#95ee8e] sm:inline-flex">
              <ShieldCheck size={14} /> Super admin
            </span>
          </div>
          <nav
            className="flex items-center gap-2 text-sm"
            aria-label="Platform"
          >
            <Link
              href="/super-admin"
              className="hidden min-h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-white/80 sm:inline-flex"
            >
              <BarChart3 size={16} /> Platform
            </Link>
            <Link
              href="/admin/dashboard"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-white/55 hover:bg-white/10 hover:text-white"
            >
              <LayoutDashboard size={16} /> Workspace
            </Link>
            <form action={logout}>
              <button className="min-h-10 rounded-xl px-3 text-white/55 hover:bg-white/10 hover:text-white">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
        <p className="mb-6 text-xs text-white/35">Signed in as {user.email}</p>
        {children}
      </main>
    </div>
  );
}
