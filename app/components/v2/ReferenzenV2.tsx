import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import CaseTile from "./CaseTile";
import { NavBar } from "./HeroV2";
import ContactV2 from "./ContactV2";
import FooterV2 from "./FooterV2";
import { REFS } from "./links";
import { CASE_LIST, type CaseEntry } from "./caseList";

/*
 * The Referenzen page (/referenzen), built like the homepage's "… werden" rows (ExplainerV2): one wide card per client
 * in a soft tint of its colour, picture and text side by side, alternating left and right.
 * Clients with their own reference page come first and get the blue button; the rest say "Referenz folgt".
 * Data: caseList.ts (set `page` there when a new reference page goes live).
 */

const EASE = [0.22, 1, 0.36, 1] as const;

function CaseRow({ c, i }: { c: CaseEntry; i: number }) {
  const reduce = useReducedMotion();
  const pictureRight = i % 2 === 1;
  const n = String(i + 1).padStart(2, "0");
  return (
    <motion.article
      id={c.slug}
      initial={reduce ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE }}
      // below desktop: a card in the client's tint, text on top, the picture under it; desktop: side by side
      className="grid scroll-mt-28 overflow-hidden rounded-[24px] bg-[var(--tint)] lg:min-h-[600px] lg:grid-cols-2 lg:bg-[linear-gradient(var(--dir),var(--tint)_0%,#ffffff_85%)]"
      style={{ "--tint": c.tint, "--dir": pictureRight ? "270deg" : "90deg" } as React.CSSProperties}
    >
      <div className={`relative order-2 h-[300px] overflow-hidden sm:h-[420px] lg:h-auto lg:rounded-[24px] ${pictureRight ? "lg:order-2" : "lg:order-1"}`}>
        <img src={c.img} alt={c.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className={`order-1 flex flex-col justify-center px-6 pb-7 pt-7 sm:px-10 sm:pt-10 lg:px-16 lg:py-16 ${pictureRight ? "lg:order-1" : "lg:order-2"}`}>
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">
          {n} · {c.client}
        </p>
        <p className="mt-1.5 text-[0.88rem] font-semibold text-[#6b7280]">{c.place}</p>
        <h3 className="mt-4 max-w-[18ch] text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.06em] text-[#0e0e10]">
          {c.headline.replace(/\.$/, "")}
          <span className="text-[#007aff]">.</span>
        </h3>
        {c.stat ? (
          <p className="mt-5 flex items-baseline gap-3 lg:mt-7">
            <span className="text-[clamp(2.2rem,3.6vw,3.2rem)] font-bold leading-none tracking-[-0.06em] text-[#0e0e10] tabular-nums">{c.stat}</span>
            <span className="max-w-[22ch] text-[0.95rem] font-semibold leading-snug text-[#424245]">{c.statRest}</span>
          </p>
        ) : c.facts?.[0] ? (
          <p className="mt-4 max-w-[38ch] text-[0.98rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245] lg:mt-6 lg:text-[1.08rem]">{c.facts.join(". ")}.</p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-1.5 lg:mt-6">
          {c.services.map((s) => (
            <span key={s} className="rounded-full bg-white/80 px-3 py-1.5 text-[0.78rem] font-semibold text-[#424245] ring-1 ring-black/5">{s}</span>
          ))}
        </div>
        {c.page ? (
          <>
            {/* phones: a quiet text link; desktop: the blue button */}
            <a href={c.page} className="mt-5 inline-flex w-max items-center gap-1.5 text-[0.95rem] font-bold tracking-[-0.02em] text-[#007aff] lg:hidden">
              Referenz lesen
              <ArrowUpRight size={16} strokeWidth={2.4} />
            </a>
            <a
              href={c.page}
              className="group mt-8 hidden min-h-12 w-max items-center gap-3 rounded-full bg-[#007aff] px-6 text-[0.8rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(0,122,255,0.22)] transition-transform hover:-translate-y-0.5 lg:inline-flex"
            >
              Referenz lesen
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </>
        ) : (
          <p className="mt-5 w-max rounded-full border border-dashed border-black/15 px-3.5 py-1.5 text-[0.8rem] font-semibold text-[#86868b] lg:mt-8">Ausführliche Referenz folgt</p>
        )}
      </div>
    </motion.article>
  );
}

export default function ReferenzenV2() {
  const reduce = useReducedMotion();
  // reference pages first, then the rest, each in list order
  const list = [...CASE_LIST.filter((c) => c.page), ...CASE_LIST.filter((c) => !c.page)];

  return (
    <>
      <div className="bg-white">
        <NavBar onHome={false} current={REFS} />
      </div>
      <main className="bg-white text-[#0e0e10]">
        <section className="pb-24 pt-12 md:pb-32 md:pt-20">
          <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
            {/* intro, centred like the homepage section */}
            <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="mx-auto max-w-[900px] text-center">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">Referenzen</p>
              <h1 className="mx-auto mt-4 max-w-[16ch] text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.92] tracking-[-0.065em]">
                Betriebe, die jetzt gefunden werden<span className="text-[#007aff]">.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-[46ch] text-[1.08rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245]">
                Handwerk, Praxis, Kanzlei, Laden: echte Betriebe aus der Region. Die Zahlen stammen aus unseren Monatsberichten.
              </p>
            </motion.div>

            {/* one wide row per client, picture left, right, left … */}
            {/* phones and tablets: bento, one wide tile then two half tiles, repeating */}
            <div className="mt-10 grid grid-cols-2 gap-2.5 lg:hidden">
              {list.map((c, i) => (
                <CaseTile key={c.slug} c={c} wide={i % 3 === 0 || (i === list.length - 1 && i % 3 === 1)} />
              ))}
            </div>
            <div className="mt-20 hidden flex-col gap-12 lg:flex">
              {list.map((c, i) => (
                <CaseRow key={c.slug} c={c} i={i} />
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
