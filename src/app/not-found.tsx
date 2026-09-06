import Link from "next/link";
export default function NotFound() {
  return (
    <main className="app-bg grid min-h-screen place-items-center p-6 text-center text-white">
      <div>
        <p className="text-[#FFC857]">404</p>
        <h1 className="mt-3 text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-white/45">
          The page may have moved or may not be available to you.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-[#F5A623] px-5 py-3 text-sm font-semibold text-[#173028]"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
