import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useLanguage, t } from "./LanguageContext";
import { ArrowRight } from "lucide-react";

// Generates a dash placeholder that roughly matches the word's visual width
function getDash(word: string) {
  const len = word.replace(/[^a-zA-ZÄÖÜäöüÇĞİışğ]/g, "").length;
  if (len <= 2) return "──";
  if (len <= 4) return "────";
  if (len <= 6) return "──────";
  if (len <= 9) return "─────────";
  return "────────────";
}

function TypewriterText({
  text,
  wordDelay = 60,
}: {
  text: string;
  wordDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const words = text.split(" ");
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    setRevealedCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setRevealedCount(i);
      if (i >= words.length) clearInterval(interval);
    }, wordDelay);
    return () => clearInterval(interval);
  }, [isInView, words.length, wordDelay]);

  return (
    <div ref={ref} className="inline">
      {words.map((word, i) => {
        const isRevealed = i < revealedCount;
        const isPunctuation = /^[.,!?:;—–]/.test(word) || /[.,!?:;—–]$/.test(word);
        return (
          <span key={i} className="inline-block mr-[0.28em]">
            {isRevealed ? (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="inline-block text-[#0e0e10]"
              >
                {word}
              </motion.span>
            ) : (
              <span
                className={`inline-block align-middle leading-none text-[#d2d2d7] select-none ${
                  isPunctuation ? "opacity-0 w-0 overflow-hidden" : ""
                }`}
                style={{ fontSize: "0.55em", letterSpacing: "-0.05em", verticalAlign: "middle" }}
                aria-hidden="true"
              >
                {getDash(word)}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function PainPoint({
  index,
  textKey,
  lang,
  wordDelay,
}: {
  index: number;
  textKey: string;
  lang: string;
  wordDelay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-15% 0px -15% 0px" });

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: isInView ? 1 : 0.12 }}
      transition={{ duration: 0.45 }}
      className="py-14 md:py-20 border-b border-[#e5e5ea] last:border-0"
    >
      <div className="flex items-start gap-8 md:gap-12">
        {/* Index label */}
        <motion.span
          animate={{ color: isInView ? "#007aff" : "#d2d2d7" }}
          transition={{ duration: 0.4 }}
          className="shrink-0 mt-2 text-[0.75rem] font-bold tracking-[0.18em] select-none"
        >
          0{index}
        </motion.span>

        {/* Typewriter text */}
        <p className="text-[clamp(1.5rem,3.2vw,2.375rem)] font-semibold leading-[1.35] tracking-tight">
          <TypewriterText text={t(textKey, lang)} wordDelay={wordDelay} />
        </p>
      </div>
    </motion.div>
  );
}

export function Problem() {
  const { lang } = useLanguage();

  const points: Array<{ key: string; delay: number }> = [
    { key: "problem.p1", delay: 55 },
    { key: "problem.p2", delay: 50 },
    { key: "problem.p3", delay: 55 },
  ];

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
              className="text-[1.125rem] md:text-[1.25rem] text-[#86868b] font-medium leading-relaxed"
            >
              {t("problem.subHeader", lang)}
            </motion.p>
          </div>
        </div>

        {/* ── Pain Points ─────────────────────────────── */}
        <div>
          {points.map(({ key, delay }, i) => (
            <PainPoint
              key={key}
              index={i + 1}
              textKey={key}
              lang={lang}
              wordDelay={delay}
            />
          ))}
        </div>

        {/* ── The Turn ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 mb-32 md:mt-24 md:mb-48 rounded-[2.5rem] bg-[#f5f5f7] overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 p-10 md:p-16">
            <h3 className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight text-[#0e0e10] leading-[1.1] max-w-2xl">
              {t("problem.turn", lang)}
            </h3>
            <a
              href="#contact"
              className="shrink-0 group inline-flex items-center gap-3 bg-[#007aff] text-white px-8 py-4 rounded-full text-[1rem] font-bold hover:bg-[#0066d6] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/20"
            >
              {lang === "de" ? "Jetzt starten" : lang === "tr" ? "Hemen başla" : "Get started"}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
