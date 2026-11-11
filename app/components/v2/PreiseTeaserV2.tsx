import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

/*
 * Pricing teaser on the homepage: just the headline "Ab 99 € im Monat." in a light gray panel (blue only on the full stop and button) that links to /preise,
 * where everything else lives. The one line of small print under it stays on purpose: "ab 99 €" must not read as the
 * full cost (PAngV), so it names VAT and the one-off start. Must match PreiseV2 (Wartung 99 €, one-off start from 1.499 €).
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const PREISE_HREF = "/preise";

export default function PreiseTeaserV2() {
  const reduce = useReducedMotion();
  const rise = reduce ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.8, ease: EASE } };

  return (
    <section id="preise" className="relative bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-8">
        <motion.a
          href={PREISE_HREF}
          {...rise}
          className="group flex flex-col gap-10 rounded-[28px] bg-[#f5f5f7] px-6 py-12 text-[#0e0e10] transition-transform duration-300 hover:-translate-y-1 md:px-14 md:py-20 lg:flex-row lg:items-end lg:justify-between"
        >
          <h2 className="font-bold leading-[0.86] tracking-[-0.075em] text-[#0e0e10]" style={{ fontSize: "clamp(3.6rem, 10vw, 9.5rem)" }}>
            Ab 99 € <br className="hidden sm:block" />im Monat<span className="text-[#007aff]">.</span>
          </h2>
          <span className="inline-flex min-h-14 w-full flex-none items-center justify-center gap-3 rounded-full bg-[#007aff] px-7 text-[0.86rem] font-black uppercase tracking-[0.12em] text-white sm:w-max">
            Alle Preise ansehen
            <ArrowRight size={16} strokeWidth={2.6} className="transition-transform group-hover:translate-x-1" />
          </span>
        </motion.a>
        <p className="mt-4 px-1 text-[0.85rem] font-medium text-[#6b7280]">Netto zzgl. 19 % MwSt., Website einmalig ab 1.499 €.</p>
      </div>
    </section>
  );
}
