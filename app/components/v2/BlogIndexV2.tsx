import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { BlogPost } from "../../types";
import { NavBar } from "./HeroV2";
import ContactV2 from "./ContactV2";
import FooterV2 from "./FooterV2";
import { BLOG } from "./links";
import { cover, dePosts, fmtDate, fmtRead, postHref, postTag } from "./blogShared";

/*
 * The blog overview (/blog). Centred intro like the Fälle page, the newest article as one wide card,
 * then every other German article in a three-column grid. Reads blogData.tsx, so new posts appear on their own.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

// One article as a card: picture, service and audience, title, excerpt, date. Also used under each article.
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <a href={postHref(post.slug)} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-[#f5f5f7]">
        <img src={cover(post)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" />
      </div>
      <p className="mt-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#007aff]">{postTag(post)}</p>
      <div className="mt-2.5 flex items-start justify-between gap-4">
        <h3 className="text-[1.2rem] font-bold leading-[1.18] tracking-[-0.035em] text-[#0e0e10] transition-colors group-hover:text-[#007aff] md:text-[1.3rem]">{post.title}</h3>
        <ArrowUpRight size={20} strokeWidth={2.2} aria-hidden className="mt-1 flex-none text-[#0e0e10] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <p className="mt-3 line-clamp-3 text-[0.98rem] font-medium leading-[1.5] tracking-[-0.01em] text-[#6b7280]">{post.excerpt}</p>
      <p className="mt-4 text-[0.86rem] font-semibold text-[#86868b]">
        {fmtDate(post.date)} · {fmtRead(post.readTime)}
      </p>
    </a>
  );
}

function Featured({ post }: { post: BlogPost }) {
  return (
    <a href={postHref(post.slug)} className="group grid overflow-hidden rounded-[24px] bg-[#f5f5f7] lg:grid-cols-[1.15fr_1fr]">
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[460px]">
        <img src={cover(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Neu · {postTag(post)}</p>
        <h2 className="mt-4 text-[clamp(1.75rem,3.2vw,2.9rem)] font-bold leading-[1.02] tracking-[-0.05em] text-[#0e0e10]">{post.title}</h2>
        <p className="mt-5 line-clamp-4 max-w-[46ch] text-[1.04rem] font-medium leading-[1.5] tracking-[-0.015em] text-[#424245]">{post.excerpt}</p>
        <p className="mt-5 text-[0.9rem] font-semibold text-[#86868b]">
          {fmtDate(post.date)} · {fmtRead(post.readTime)}
        </p>
        <span className="mt-7 inline-flex w-max items-center gap-2.5 rounded-full bg-[#007aff] px-6 py-3.5 text-[0.78rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(0,122,255,0.22)] transition-transform group-hover:-translate-y-0.5">
          Artikel lesen <ArrowRight size={16} />
        </span>
      </div>
    </a>
  );
}

export default function BlogIndexV2() {
  const reduce = useReducedMotion();
  const [first, ...rest] = dePosts();

  return (
    <>
      <div className="bg-white">
        <NavBar onHome={false} current={BLOG} />
      </div>
      <main className="bg-white text-[#0e0e10]">
        <section className="pb-24 pt-12 md:pb-32 md:pt-20">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mx-auto max-w-[900px] text-center"
            >
              <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Blog</p>
              <h1 className="mx-auto mt-4 max-w-[14ch] text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.92] tracking-[-0.065em]">
                Wissen, das Anfragen bringt<span className="text-[#007aff]">.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-[46ch] text-[1.08rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245]">
                Was wir über Websites, Google und Werbung wissen. Für Handwerk, Kanzleien, Praxen und Dienstleister, ehrlich erklärt.
              </p>
            </motion.div>

            {first && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: reduce ? 0 : 0.1, ease: EASE }}
                className="mt-12 lg:mt-20"
              >
                <Featured post={first} />
              </motion.div>
            )}

            <div className="mt-14 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-y-16">
              {rest.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: reduce ? 0 : (i % 3) * 0.06, ease: EASE }}
                >
                  <PostCard post={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <ContactV2 />
      </main>
      <FooterV2 onHome={false} />
    </>
  );
}
