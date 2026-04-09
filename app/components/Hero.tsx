import { ArrowRight, ChevronRight, TrendingUp, Search, ShieldCheck } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { motion } from "motion/react";

export function Hero() {
  const { lang } = useLanguage();

  return (
    <section aria-label="Hero" className="relative pt-24 pb-20 md:pt-52 md:pb-40 px-4 overflow-hidden bg-white">
      {/* Precision Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,122,255,0.03)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f2f7] text-[#007aff] text-[0.8125rem] md:text-[0.875rem] font-bold mb-8 md:mb-10 transition-transform hover:scale-[1.02]"
          >
            {t("hero.eyebrow", lang)}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(1.75rem,10vw,4.5rem)] leading-[1.1] tracking-[-0.04em] font-bold text-[#0e0e10] mb-6 md:mb-8"
          >
            <span className="block">{t("hero.line1", lang)}</span>
            <span className="block text-[#86868b] md:whitespace-nowrap">{t("hero.line2", lang)}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[1.0625rem] md:text-[1.375rem] text-[#86868b] max-w-4xl mb-10 md:mb-14 leading-relaxed font-medium text-balance"
          >
            <span className="md:hidden">{t("hero.descriptionMobile", lang)}</span>
            <span className="hidden md:block">{t("hero.description", lang)}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 mb-16 md:mb-24"
          >
            <a
              href="#contact"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-[#007aff] text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-[1rem] md:text-[1.0625rem] font-bold hover:bg-[#0066d6] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/10"
            >
              {t("hero.cta", lang)} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-1 text-[1rem] md:text-[1.0625rem] font-bold text-[#0e0e10] hover:text-[#007aff] transition-colors group px-4 py-2"
            >
              {t("hero.secondary", lang)} <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* Performance Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden md:block w-full max-w-5xl mb-24 md:mb-32"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Card 1: Conversion */}
              <div className="bg-[#f5f5f7] rounded-3xl p-6 border border-[#d2d2d7]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-white text-[#007aff] rounded-2xl shadow-sm">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="text-[0.75rem] md:text-[0.8125rem] text-[#86868b] font-bold uppercase tracking-wider mb-1 text-left">{t("hero.card1.label", lang)}</div>
                <div className="text-[1.25rem] md:text-[1.5rem] font-extrabold tracking-tight leading-tight mb-2 text-[#0e0e10] text-left">{t("hero.card1.value", lang)}</div>
                <div className="text-[0.8125rem] md:text-[0.875rem] text-[#86868b] font-medium leading-normal text-left">{t("hero.card1.sub", lang)}</div>
              </div>

              {/* Card 2: Speed */}
              <div className="bg-[#f5f5f7] rounded-3xl p-6 border border-[#d2d2d7]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-white text-[#34c759] rounded-2xl shadow-sm">
                    <Search size={20} />
                  </div>
                </div>
                <div className="text-[0.75rem] md:text-[0.8125rem] text-[#86868b] font-bold uppercase tracking-wider mb-1 text-left">{t("hero.card2.label", lang)}</div>
                <div className="text-[1.25rem] md:text-[1.375rem] font-extrabold tracking-tight leading-tight mb-2 text-left">{t("hero.card2.value", lang)}</div>
                <div className="text-[0.8125rem] md:text-[0.875rem] text-[#86868b] font-medium leading-normal text-left">{t("hero.card2.sub", lang)}</div>
              </div>

              {/* Card 3: Growth */}
              <div className="bg-[#0e0e10] text-white rounded-3xl p-6 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-white/10 text-white rounded-2xl">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <div className="text-[0.75rem] md:text-[0.8125rem] text-white/40 font-bold uppercase tracking-wider mb-1 text-left">{t("hero.card3.label", lang)}</div>
                <div className="text-[1.25rem] md:text-[1.375rem] font-extrabold tracking-tight leading-tight mb-2 text-left">{t("hero.card3.value", lang)}</div>
                <div className="text-[0.8125rem] md:text-[0.875rem] text-white/40 font-medium leading-normal text-left">{t("hero.card3.sub", lang)}</div>
              </div>
            </div>
          </motion.div>

          {/* Trust Bar Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="hidden md:flex flex-col md:flex-row items-center justify-center gap-4 text-center"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                  <span className="text-[0.625rem] font-bold text-slate-400">⚖️</span>
                </div>
              ))}
            </div>
            <p className="text-[0.875rem] md:text-[1rem] text-[#86868b] font-medium px-4">
                {t("hero.trustBar", lang)}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
