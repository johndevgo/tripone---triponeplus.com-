import { themes } from "@/lib/site-generator";
export default function Templates() {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#FFC857]">
        Starter themes
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight">
        Four distinct directions. One flexible system.
      </h1>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {Object.values(themes).map((theme) => (
          <article
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.06]"
            key={theme.id}
          >
            <div
              className="h-52 p-5"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              }}
            >
              <div className="h-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div className="h-2 w-20 rounded bg-white/70" />
                <div className="mt-16 h-5 w-1/2 rounded bg-white" />
                <div className="mt-3 h-2 w-3/4 rounded bg-white/40" />
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">{theme.name}</h2>
              <p className="mt-2 text-white/60">{theme.description}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
