import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function SitesPage() {
  const supabase = await createClient();
  const { data: sites } = await supabase
    .from("sites")
    .select("id,name,slug,status,updated_at")
    .order("updated_at", { ascending: false });
  return (
    <main className="app-bg min-h-screen px-5 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-[#FFC857]">Your workspace</p>
        <h1 className="mt-2 text-4xl font-semibold">Websites</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {sites?.map((site) => (
            <Link
              key={site.id}
              href={`/dashboard/sites/${site.id}`}
              className="glass rounded-3xl p-6 hover:bg-white/[.09]"
            >
              <Globe2 className="text-[#FFC857]" />
              <h2 className="mt-8 text-xl font-semibold">{site.name}</h2>
              <p className="mt-1 text-sm text-white/45">
                {site.slug}.triponeplus.com · {site.status}
              </p>
              <span className="mt-6 flex items-center gap-2 text-sm">
                Manage website <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
