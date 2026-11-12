import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Globe } from "lucide-react";
import { openWebsiteCheck } from "./WebsiteCheckModal";

/*
 * Homepage section for the website check: a short pitch and the address bar.
 * Entering an address opens the pop-up with it filled in, so the visitor never leaves the page.
 * Reusable on other pages: <WebsiteCheckTeaserV2 source="blog" />.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

// city: local wording for city pages (one of the checks is whether the page title names your city)
export default function WebsiteCheckTeaserV2({ source = "home", city }: { source?: string; city?: string }) {
  const reduce = useReducedMotion();
  const [url, setUrl] = useState("");
  const up = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.4 }, transition: { duration: 0.8, delay, ease: EASE } });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    openWebsiteCheck({ url: url.trim(), source });
  };

  return (
    <section id="website-check-teaser" className="relative overflow-hidden bg-[#e9f2ff] py-20 text-[#0e0e10] md:py-28">
      <div className="relative mx-auto w-full max-w-[1360px] px-4 text-center md:px-8">
        <motion.p {...up(0)} className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007aff]">
          Kostenloser Website-Check
        </motion.p>
        <motion.h2 {...up(0.05)} className="mx-auto mt-4 max-w-[14ch] text-[clamp(2.3rem,5.6vw,4.6rem)] font-bold leading-[0.93] tracking-[-0.065em]">
          {city ? (
            <>
              <span className="text-[#0e0e10]/35">Findet man dich</span> in {city}<span className="text-[#007aff]">?</span>
            </>
          ) : (
            <>
              <span className="text-[#0e0e10]/35">Wie gut ist</span> deine Website<span className="text-[#007aff]">?</span>
            </>
          )}
        </motion.h2>
        <motion.p {...up(0.1)} className="mx-auto mt-5 max-w-[44ch] text-[1.08rem] font-medium leading-[1.45] tracking-[-0.02em] text-[#424245] md:text-[1.15rem]">
          {city
            ? `Prüf deine Website: Note von 0 bis 100 und was ihr für Anfragen aus ${city} fehlt. In etwa einer Minute, per E-Mail, kostenlos.`
            : "Hol dir eine Note von 0 bis 100 und sieh, was du verbessern kannst. In etwa einer Minute, per E-Mail, kostenlos."}
        </motion.p>

        <motion.form {...up(0.16)} onSubmit={submit} noValidate className="mx-auto mt-9 w-full max-w-[620px]">
          <div className="relative overflow-hidden rounded-full p-[2px] shadow-[0_22px_50px_-22px_rgba(0,64,160,0.35)]">
            <span aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2">
              <span className="block h-full w-full animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,#dfe6f1_0deg,#dfe6f1_250deg,#7fb2ff_300deg,#007aff_335deg,#dfe6f1_360deg)] motion-reduce:animate-none" />
            </span>
            <div className="relative flex h-[62px] items-center gap-3 rounded-full bg-white pl-5 pr-2 sm:h-[68px] sm:pl-7">
              <Globe size={21} strokeWidth={2} className="flex-none text-[#86868b]" aria-hidden />
              <label htmlFor="wc-teaser-url" className="sr-only">Deine Website</label>
              <input
                id="wc-teaser-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="meinbetrieb.de"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="none"
                spellCheck={false}
                className="h-full min-w-0 flex-1 bg-transparent text-[1.08rem] font-semibold tracking-[-0.02em] text-[#0e0e10] outline-none placeholder:font-medium placeholder:text-[#a1a1a6] sm:text-[1.2rem]"
              />
              <button type="submit" className="group inline-flex h-[48px] flex-none items-center gap-2 rounded-full bg-[#007aff] px-5 text-[0.8rem] font-black uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5 sm:h-[54px] sm:px-7">
                <span className="hidden sm:inline">Website prüfen</span>
                <span className="sm:hidden">Prüfen</span>
                <ArrowRight size={17} strokeWidth={2.6} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[0.92rem] font-semibold tracking-[-0.01em] text-[#6b7280]">
            {["Kostenlos", "Ergebnis in etwa einer Minute", "Report per E-Mail"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check size={15} strokeWidth={3} className="text-[#007aff]" aria-hidden />
                {t}
              </span>
            ))}
          </p>
        </motion.form>
      </div>
    </section>
  );
}
