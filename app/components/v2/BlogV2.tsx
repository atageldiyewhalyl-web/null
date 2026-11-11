import { ArrowUpRight } from "lucide-react";
import { blogPosts } from "../blogData";
import { BLOG } from "./links";
import { cover, postHref } from "./blogShared";

/*
 * "Aus dem Blog." The three newest German posts, read straight from blogData, so new articles show up here
 * automatically. Posts that share a cover image are skipped so the row never shows the same picture twice.
 */

const fmtDate = (d: string) => new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
const fmtRead = (r?: string) => (r ? r.replace(/min read/i, "Min. Lesezeit") : "");

function latest(n: number) {
  const seen = new Set<string>();
  return blogPosts
    .filter((p) => p.lang === "de")
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .filter((p) => {
      if (seen.has(cover(p))) return false;
      seen.add(cover(p));
      return true;
    })
    .slice(0, n);
}

export default function BlogV2() {
  const posts = latest(3);
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative bg-white py-20 text-[#0e0e10] md:py-28">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.92] tracking-[-0.065em]">
              Aus dem Blog<span className="text-[#007aff]">.</span>
            </h2>
            <p className="mt-5 max-w-[46ch] text-[1.08rem] font-medium leading-[1.42] tracking-[-0.02em] text-[#424245]">
              Was wir über Websites, Google und Werbung wissen. Ehrlich erklärt.
            </p>
          </div>
          <a href={BLOG} className="w-max border-b-2 border-[#111111] pb-0.5 text-[1.05rem] font-black tracking-[-0.04em] text-[#111111] transition-opacity hover:opacity-55">
            Alle Artikel
          </a>
        </div>

        {/* phones: bento. The newest post as a big picture tile with its title on it, the next two as compact rows. */}
        <div className="mt-10 grid gap-2.5 md:hidden">
          {posts.map((p, i) =>
            i === 0 ? (
              <a key={p.slug} href={postHref(p.slug)} className="relative block aspect-[4/4.4] overflow-hidden rounded-[22px] bg-[#f5f5f7]">
                <img src={cover(p)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-[70%] bg-[linear-gradient(180deg,rgba(14,14,16,0)_0%,rgba(14,14,16,0.78)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[0.78rem] font-semibold text-white/75">
                    {p.category}
                    {p.readTime && <span> · {fmtRead(p.readTime)}</span>}
                  </p>
                  <h3 className="mt-1.5 text-[1.35rem] font-bold leading-[1.12] tracking-[-0.035em] text-white">{p.title}</h3>
                </div>
              </a>
            ) : (
              <a key={p.slug} href={postHref(p.slug)} className="flex items-center gap-3.5 rounded-[22px] bg-[#f5f5f7] p-2.5 pr-4">
                <span className="relative block h-[84px] w-[96px] flex-none overflow-hidden rounded-[14px] bg-white">
                  <img src={cover(p)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.74rem] font-semibold text-[#6b7280]">{p.category}</span>
                  <span className="mt-1 line-clamp-3 block text-[0.98rem] font-bold leading-[1.2] tracking-[-0.025em] text-[#0e0e10]">{p.title}</span>
                </span>
                <ArrowUpRight size={18} strokeWidth={2.2} className="flex-none text-[#0e0e10]" aria-hidden />
              </a>
            ),
          )}
        </div>

        {/* md+: three columns */}
        <div className="mt-16 hidden md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-12">
          {posts.map((p) => (
            <a key={p.slug} href={postHref(p.slug)} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-[#f5f5f7]">
                <img
                  src={cover(p)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-5 text-[0.85rem] font-semibold tracking-[-0.01em] text-[#6b7280]">
                {p.category}
                {p.readTime && <span> · {fmtRead(p.readTime)}</span>}
              </p>
              <div className="mt-2 flex items-start justify-between gap-4">
                <h3 className="text-[1.12rem] font-bold md:text-[1.25rem] leading-[1.18] tracking-[-0.035em] text-[#0e0e10] transition-colors group-hover:text-[#007aff]">
                  {p.title}
                </h3>
                <ArrowUpRight size={20} strokeWidth={2.2} className="mt-1 flex-none text-[#0e0e10] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </div>
              <p className="mt-3 text-[0.88rem] font-medium text-[#86868b]">{fmtDate(p.date)}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
