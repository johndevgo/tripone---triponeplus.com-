import Image from "next/image";
import Link from "next/link";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-xl font-bold tracking-tight ${light ? "text-white" : "text-[#063D2E]"}`}
    >
      <Image
        src="/images/logo annd branding/tripone 1isto1 photo logo .png"
        alt=""
        width={40}
        height={40}
        sizes="40px"
        className="size-10 rounded-[.9rem] object-cover shadow-[0_8px_24px_rgba(8,122,90,.2)]"
      />
      TripOne<span className="text-[#F5A623]">+</span>
    </Link>
  );
}
