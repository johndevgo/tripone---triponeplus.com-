import { Logo } from "@/components/logo";
export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="app-bg grid min-h-screen place-items-center px-5 py-16 text-white">
      <div className="ambient" />
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo light />
        </div>
        <section className="glass rounded-3xl p-6 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
          {children}
        </section>
      </div>
    </main>
  );
}
export function AuthMessage({
  message,
  error,
}: {
  message?: string;
  error?: string;
}) {
  return (
    <>
      {message && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100"
        >
          {message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100"
        >
          {error === "setup"
            ? "Connect Supabase in .env.local before signing in."
            : error}
        </p>
      )}
    </>
  );
}
export const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-white/[.07] px-4 text-white placeholder:text-white/30 focus:border-[#FFC857] focus:outline-none";
