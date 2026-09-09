import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResourceArticle } from "@/content/resources";

export function ResourceCard({ article }: { article: ResourceArticle }) {
  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[.055] shadow-[0_20px_70px_rgba(0,0,0,.16)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/25 hover:bg-white/[.075]">
      <Link href={`/resources/${article.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0b3a2e]">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041c16]/70 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-[#041c16]/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
            {article.category}
          </span>
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4 text-xs text-white/45">
            <span>{article.readTime}</span>
            <ArrowUpRight
              size={18}
              className="text-[#ffc857] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold leading-snug tracking-[-.02em] text-white">
            {article.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">
            {article.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
