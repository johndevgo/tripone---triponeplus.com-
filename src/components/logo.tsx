import Image from "next/image";
import Link from "next/link";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="TripOne+ home"
      className={`group inline-flex items-center gap-2.5 text-xl font-bold tracking-[-.035em] ${light ? "text-white" : "text-[#075718]"}`}
    >
      <Image
        src="/images/logo annd branding/tripone 1 isto 1 logo no background.png"
        alt="TripOne+"
        width={44}
        height={44}
        sizes="44px"
        className="size-11 object-contain drop-shadow-[0_8px_18px_rgba(91,205,87,.24)] transition duration-200 group-hover:scale-[1.04]"
      />
      <span>
        TripOne<span className="ml-1 text-[#5BCD57]">+</span>
      </span>
    </Link>
  );
}
