import { ArrowRight, ChevronRight, CheckCircle2, TrendingUp, Search, Globe, Layout, ShieldCheck } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { motion } from "motion/react";
import { ImageComparison } from "./ui/image-comparison-slider";

// @ts-ignore
import dogruOld from "../assets/Dogru kanzlei old.png";
// @ts-ignore
import dogruNew from "../assets/Dogru kanzlei new.png";

export function Hero() {
  const { lang } = useLanguage();

  return (
    <section aria-label="Hero" className="relative pt-32 pb-20 md:pt-52 md:pb-40 px-4 overflow-hidden bg-white">
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
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2f2f7] text-[#007aff] text-[0.875rem] font-bold mb-10 transition-transform hover:scale-[1.02]"
          >
            {t("hero.eyebrow", lang)}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(2.5rem,8vw,5rem)] leading-[1.05] tracking-[-0.04em] font-bold text-[#0e0e10] mb-8"
          >
            <span className="block">{t("hero.line1", lang)}</span>
            <span className="block text-[#86868b] whitespace-nowrap">{t("hero.line2", lang)}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[1.125rem] md:text-[1.375rem] text-[#86868b] max-w-5xl mb-14 leading-relaxed font-medium text-balance"
          >
            {t("hero.description", lang)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row items-center gap-5 mb-24"
          >
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 bg-[#007aff] text-white px-10 py-5 rounded-full text-[1.0625rem] font-bold hover:bg-[#0066d6] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/10"
            >
              {t("hero.cta", lang)} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-1 text-[1.0625rem] font-bold text-[#0e0e10] hover:text-[#007aff] transition-colors group"
            >
              {t("hero.secondary", lang)} <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* Precision Strategy Visual: The Authority Dash */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-4xl bg-[#f5f5f7] border border-[#d2d2d7] rounded-[2.5rem] p-4 md:p-8 overflow-hidden shadow-2xl mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Card 1: Visibility */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#d2d2d7]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-blue-50 text-[#007aff] rounded-2xl">
                    <Globe size={20} />
                  </div>
                  <span className="text-[0.75rem] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">LIVE</span>
                </div>
                <div className="text-[0.8125rem] text-[#86868b] font-bold uppercase tracking-wider mb-1">{t("hero.card1.label", lang)}</div>
                <div className="text-[1.375rem] font-extrabold tracking-tight leading-tight mb-2">{t("hero.card1.value", lang)}</div>
                <div className="text-[0.875rem] text-[#86868b] font-medium leading-normal">{t("hero.card1.sub", lang)}</div>
              </div>

               {/* Card 2: Status */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#d2d2d7]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-slate-50 text-slate-900 rounded-2xl">
                    <Layout size={20} />
                  </div>
                  <span className="text-[0.75rem] font-bold text-[#007aff] bg-blue-50 px-2 py-0.5 rounded-full">v4.0</span>
                </div>
                <div className="text-[0.8125rem] text-[#86868b] font-bold uppercase tracking-wider mb-1">{t("hero.card2.label", lang)}</div>
                <div className="text-[1.375rem] font-extrabold tracking-tight leading-tight mb-2">{t("hero.card2.value", lang)}</div>
                <div className="text-[0.875rem] text-[#86868b] font-medium leading-normal">{t("hero.card2.sub", lang)}</div>
              </div>

              {/* Card 3: Growth */}
              <div className="bg-[#0e0e10] text-white rounded-3xl p-6 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-white/10 text-white rounded-2xl">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <div className="text-[0.8125rem] text-white/40 font-bold uppercase tracking-wider mb-1">{t("hero.card3.label", lang)}</div>
                <div className="text-[1.375rem] font-extrabold tracking-tight leading-tight mb-2">{t("hero.card3.value", lang)}</div>
                <div className="text-[0.875rem] text-white/40 font-medium leading-normal">{t("hero.card3.sub", lang)}</div>
              </div>
            </div>
          </motion.div>

          {/* Trust Bar Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 text-center"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                  <span className="text-[0.625rem] font-bold text-slate-400">⚖️</span>
                </div>
              ))}
            </div>
            <p className="text-[0.9375rem] md:text-[1rem] text-[#86868b] font-medium max-w-2xl px-4">
              {t("hero.trustBar", lang)}
            </p>
          </motion.div>

          {/* Transformation Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-7xl mt-64 mb-32 relative text-left"
          >
            <div className="max-w-full mb-20">
              <p className="text-[0.875rem] tracking-[0.1em] uppercase text-[#007aff] font-bold mb-4">
                {t("hero.comparison.label", lang)}
              </p>
              <h2 className="text-[clamp(1.75rem,5vw,2.75rem)] font-bold tracking-tight mb-6 text-[#0e0e10]">
                {t("hero.comparison.title", lang)}
              </h2>
              <p className="text-[1.125rem] md:text-[1.25rem] text-[#86868b] font-medium leading-relaxed">
                {t("hero.comparison.subtitle", lang)}
              </p>
            </div>
            
            <ImageComparison
                beforeImage={dogruOld}
                afterImage={dogruNew}
                altBefore="Traditional legal office"
                altAfter="Modern authoritative law firm dashboard"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
