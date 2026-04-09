import { ArrowRight, ChevronRight, CheckCircle2, TrendingUp, Search } from "lucide-react";
import { useLanguage, t } from "./LanguageContext";
import { motion } from "motion/react";

export function Hero() {
  const { lang } = useLanguage();

  return (
    <section aria-label="Hero" className="relative pt-32 pb-20 md:pt-52 md:pb-40 px-4 overflow-hidden bg-white">
      {/* Precision Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,122,255,0.03)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
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
            className="text-[1.125rem] md:text-[1.375rem] text-[#86868b] max-w-3xl mb-14 leading-relaxed font-medium"
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
            className="relative w-full max-w-4xl bg-[#f5f5f7] border border-[#d2d2d7] rounded-[2.5rem] p-4 md:p-8 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Visibility */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#d2d2d7]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-blue-50 text-[#007aff] rounded-2xl">
                    <Search size={20} />
                  </div>
                  <span className="text-[0.8125rem] font-bold text-green-500 flex items-center gap-1">
                    <TrendingUp size={14} /> +12%
                  </span>
                </div>
                <div className="text-[0.8125rem] text-[#86868b] font-bold uppercase tracking-wider mb-1">Impact</div>
                <div className="text-2xl font-extrabold tracking-tight">Top 1 Ranking</div>
                <div className="mt-5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full bg-[#007aff]" 
                  />
                </div>
              </div>

               {/* Card 2: Status */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#d2d2d7]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-green-50 text-green-600 rounded-2xl">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                <div className="text-[0.8125rem] text-[#86868b] font-bold uppercase tracking-wider mb-1">Authority</div>
                <div className="text-2xl font-extrabold tracking-tight">Kanzlei Elite</div>
                <div className="flex gap-1.5 mt-5">
                  {[1,2,3,4,5].map(i => (
                    <motion.div 
                      key={i} 
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 1 + (i * 0.1) }}
                      className="h-7 w-2 bg-[#007aff] rounded-full" 
                      style={{ opacity: i * 0.2 }} 
                    />
                  ))}
                </div>
              </div>

              {/* Card 3: Growth */}
              <div className="bg-[#007aff] text-white rounded-3xl p-6 shadow-xl shadow-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-white/20 text-white rounded-2xl">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="text-[0.8125rem] text-white/60 font-bold uppercase tracking-wider mb-1">Growth</div>
                <div className="text-2xl font-extrabold tracking-tight">High Conversion</div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">5.2k</span>
                  <span className="text-white/60 text-sm font-bold tracking-tight">leads/mo</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
