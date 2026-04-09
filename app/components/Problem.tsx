import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useLanguage, t } from "./LanguageContext";
import { ArrowRight } from "lucide-react";

function PainPoint({
  index,
  textKey,
  lang,
}: {
  index: number;
  textKey: string;
  lang: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });

  return (
    <motion.div
      ref={ref}
      animate={{
        opacity: isInView ? 1 : 0.18,
        y: isInView ? 0 : 12,
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-14 md:py-20 border-b border-[#e5e5ea] last:border-0"
    >
      <div className="flex items-start gap-8 md:gap-10">
        {/* Number marker */}
        <div
          className="shrink-0 mt-1 text-[0.75rem] font-bold tracking-[0.15em] text-[#007aff]"
          aria-hidden="true"
        >
          0{index}
        </div>
        {/* Text */}
        <p className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-semibold leading-[1.3] tracking-tight text-[#0e0e10]">
          {t(textKey, lang)}
        </p>
      </div>
    </motion.div>
  );
}

export function Problem() {
  const { lang } = useLanguage();

  const points = ["problem.p1", "problem.p2", "problem.p3"];

  return (
    <section className="relative bg-white px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ─────────────────────────── */}
        <div className="pt-32 md:pt-48 pb-16 md:pb-24 border-b border-[#e5e5ea]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[0.8125rem] tracking-[0.18em] uppercase text-[#007aff] font-bold mb-7"
          >
            {lang === "de" ? "Die Realität" : lang === "tr" ? "Gerçek" : "The Reality"}
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold tracking-tight leading-[1.08] text-[#0e0e10]"
            >
              {t("problem.header", lang)}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="text-[1.125rem] md:text-[1.25rem] text-[#86868b] font-medium leading-relaxed lg:max-w-xl"
            >
              {t("problem.subHeader", lang)}
            </motion.p>
          </div>
        </div>

        {/* ── Scrolling Pain Points ───────────────────── */}
        <div>
          {points.map((key, i) => (
            <PainPoint key={key} index={i + 1} textKey={key} lang={lang} />
          ))}
        </div>

        {/* ── The Turn ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 mb-32 md:mt-24 md:mb-48 rounded-[2.5rem] bg-[#f5f5f7] overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 p-10 md:p-16">
            {/* Left: The Turn text */}
            <h3 className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight text-[#0e0e10] leading-[1.1] max-w-2xl">
              {t("problem.turn", lang)}
            </h3>

            {/* Right: CTA button */}
            <a
              href="#contact"
              className="shrink-0 group inline-flex items-center gap-3 bg-[#007aff] text-white px-8 py-4 rounded-full text-[1rem] font-bold hover:bg-[#0066d6] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/20"
            >
              {lang === "de"
                ? "Jetzt starten"
                : lang === "tr"
                ? "Hemen başla"
                : "Get started"}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
