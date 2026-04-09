import { ArrowRight } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { motion } from "motion/react";

export function Hero() {
  const { lang } = useLanguage();

  return (
    <section aria-label="Hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden bg-white">
      {/* Subtle background element for an elite feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-slate-50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[0.8125rem] mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0071e3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0071e3]"></span>
            </span>
            {t("hero.badge", lang)}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[clamp(2.25rem,8vw,4.5rem)] leading-[1.1] tracking-[-0.04em] mb-8 font-semibold text-slate-900"
          >
            <span className="block">{t("hero.line1", lang)}</span>
            <span className="block text-slate-400">{t("hero.line2", lang)}</span>
            <span className="block text-[#0071e3]">{t("hero.line3", lang)}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[1rem] md:text-[1.25rem] text-slate-500 max-w-2xl mb-12 leading-relaxed"
          >
            {t("hero.description", lang)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-[#0071e3] text-white px-8 py-4 rounded-full text-[1rem] font-medium hover:bg-[#0077ed] transition-all hover:scale-[1.02] shadow-xl shadow-blue-500/20 w-full sm:w-auto"
            >
              {t("hero.cta", lang)} <ArrowRight size={18} />
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 text-[1rem] text-slate-600 hover:text-slate-900 font-medium transition-colors w-full sm:w-auto group"
            >
              {t("hero.secondary", lang)}
              <span className="block w-0 h-px bg-slate-400 transition-all group-hover:w-full" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
